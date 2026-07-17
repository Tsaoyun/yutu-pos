# Sprint 2B Implementation Plan

Status: Plan only. Do not treat this document as implemented behavior.

## Principles

- Small steps.
- Keep existing flat Product Schema.
- Avoid large Product Schema migration.
- Keep old backups restorable.
- Keep historical orders as snapshots.
- Do not add Firestore Category Master Data.
- Do not add Product service modes.
- Do not add `defaultTemperature`.
- Do not add Inventory, Recipe, Bean Domain, Material, Supplier, or ERP fields.

## Current Category And Product Distribution

Current category IDs from `src/data/menu.js`:

| Category ID | Current Label | Product Count | Type Distribution |
|---|---:|---:|---|
| `espresso` | 義式 | 4 | 4 drink |
| `pourover` | 手沖 | 6 | 6 drink |
| `tea` | 茶飲 | 2 | 2 drink |
| `dessert` | 甜品 | 7 | 7 dessert |
| `beans` | 熟豆 | 7 | 7 retail |

Sprint 2B should not全面改 Category ID. Keep `beans` for compatibility and Analytics stability.

`signature` can be added as a new category only if Product decides it is needed in the first implementation. If added, it should be additive and not rewrite old product/category ids.

## Recommended CATEGORY_METADATA

Keep category metadata as an in-code constant in Sprint 2B.

Do not create Firestore Category Master Data or a category management UI.

Proposed shape:

```js
const CATEGORY_METADATA = {
  espresso: {
    temperatureOptions: ["hot", "iced"],
    iceExtraPrice: 0
  },
  pourover: {
    temperatureOptions: ["hot", "iced"],
    iceExtraPrice: 10
  },
  tea: {
    temperatureOptions: ["hot", "iced"],
    iceExtraPrice: 0
  },
  signature: {
    temperatureOptions: ["hot", "iced"],
    iceExtraPrice: 0
  },
  dessert: {
    temperatureOptions: [],
    iceExtraPrice: 0
  },
  beans: {
    temperatureOptions: [],
    iceExtraPrice: 0
  }
};
```

Notes:

- `pourover` cold surcharge remains a business rule: cold +10.
- The rule should be resolved through Product/Category metadata, not hard-coded in `orderModel.js`.
- Product explicit values override category defaults.
- Service Mode remains Order-level and is not part of this metadata.

## Product Schema For Sprint 2B

Keep flat Product Schema.

Recommended runtime shape:

```js
{
  id,
  name,
  category,
  type,
  price,
  cost, // number | null
  active,
  sort,
  note,
  variants,
  options,
  supportsHot,
  supportsIce,
  iceExtraPrice,
  requiresTemperature
}
```

Compatibility fields may remain:

```js
{
  supportsTakeout,
  requiresServiceType
}
```

But Sprint 2B should stop exposing Product-level takeout settings in Product Editor and should not add new Product service-mode fields.

Product schema/migration version should be tracked in backup metadata or settings metadata later, not per product in Sprint 2B.

## Product Normalize Rules

Normalize should run on app load and restore.

Rules:

```js
category = product.category || "espresso"
type = product.type || inferTypeFromCategory(category)
price = Number(product.price) || 0
cost = product.cost === "" || product.cost == null ? null : Number(product.cost)
active = product.active !== false
sort = Number(product.sort) || nextCategorySort(category)
supportsHot = product.supportsHot ?? categoryDefaultHas("hot")
supportsIce = product.supportsIce ?? categoryDefaultHas("iced")
iceExtraPrice = Number(product.iceExtraPrice ?? categoryDefault.iceExtraPrice ?? 0)
requiresTemperature = supportsHot || supportsIce
```

Cost rules:

- `null` means unknown or not estimated.
- `0` means confirmed zero cost.
- old missing cost should normalize to `null`, not `0`.
- old numeric cost remains numeric.
- invalid numeric cost should normalize to `null`.

Type inference fallback:

- `dessert` category -> `dessert`
- `beans` category -> `retail`
- otherwise -> `drink`

Keep this as a fallback only. Do not use type as the primary temperature rule.

## Cost Null Handling

### Input

Product Editor cost field may be blank.

- blank input -> `null`
- `0` input -> `0`
- positive number -> number

### Storage

Store `cost` as either:

```js
number | null
```

### Backup

Full backup should preserve `null` as JSON `null`.

Do not convert `null` to `0` during export.

### Restore

Restore normalize should preserve:

- missing cost -> `null`
- `null` -> `null`
- `0` -> `0`
- numeric string -> number

### Analytics

Analytics must not treat `null` as `0`.

Minimum Sprint 2B approach:

- known-cost revenue/profit can still be calculated for items with numeric cost.
- unknown-cost item revenue can still count toward sales revenue.
- unknown-cost items should not be counted into known gross profit.
- UI should avoid showing over-optimistic total gross profit when unknown costs exist.

Recommended minimal UI option:

- show revenue as usual.
- show gross profit only for known-cost items.
- show an additional small note/count such as `未知成本商品 N 筆` in analytics or report areas.

If this requires too much Analytics UI work, defer expanded UI and at minimum prevent `null` from silently becoming `0` in calculations.

Future analytics work:

- separate known gross profit from estimated/unknown gross profit.
- add unknown-cost warning in Dashboard and daily closing report.

## Product Editor Changes

Fields to show:

- Product Name
- Category
- Price
- Cost
- Enabled / Disabled
- Temperature Options
  - 可做熱飲
  - 可做冰飲
- Cold Drink Surcharge
- Sort Order within category

Fields to remove/hide:

- 可外帶

Do not expose technical labels such as "Capability".

New product flow:

```text
New Product
-> select Category
-> enter Product Name
-> system loads category temperature defaults
-> user may override hot/cold
-> enter Price
-> optionally enter Cost
-> Save
```

Rules:

- New products are enabled by default.
- New products appear at the end of their category.
- Cost may be blank.
- Cost is only shown in Product Editor and management views, not ordering.
- Disabled products are hidden from POS ordering but visible in Product Management.
- No normal delete button.

## Category + Sort Rules

Sprint 2B first version should use category + sort, not drag-and-drop.

Sorting rules:

```text
Product Management:
category order from categories array
then product.sort
then product.name

POS product grid:
current selected category only
then product.sort
then product.name
```

New product sort:

```js
sort = max(sort of products in selected category) + 1
```

Do not use global `state.products.length + 1` for category sort.

Drag-and-drop can be a later UX improvement.

## orderModel.js Price Resolution Flow

Sprint 2B should remove:

```js
const POUROVER_ICE_EXTRA = 10;
category === "pourover" || category === "手沖";
```

Recommended flow:

```text
Product selected
-> product metadata normalized/resolved
-> operator selects hot/cold if product supports temperature
-> orderModel.addOrderItem snapshots product fields
-> priceFieldsForItem uses item snapshot, not category hard-code
```

For new items:

```js
basePrice = product.price
iceExtra = selectedTemperature === "冰" ? product.iceExtraPrice : 0
effectivePrice = basePrice + iceExtra
cost = product.cost // number | null
```

For existing order items:

- keep existing `basePrice`, `effectivePrice`, `iceExtra`, and `cost`.
- update quantity and selected temperature using item snapshot values.
- do not recalculate from current Product after the item is already in the order, except when the current open order line is explicitly edited.

## Old Backup Compatibility

Restore should accept:

- old `products`
- legacy `menuItems`
- products missing `supportsHot`
- products missing `supportsIce`
- products missing `iceExtraPrice`
- products missing `cost`
- products with `cost: 0`
- products with old `supportsTakeout`

Normalize fills Product fields using category metadata.

Do not require a migration step before restore.

Full backup after Sprint 2B should preserve the normalized Product shape.

## Historical Orders And Analytics Impact

Historical orders:

- must not be rewritten.
- retain order item product name snapshot.
- retain category/type snapshot.
- retain price/cost snapshot.
- retain ice extra snapshot.

Analytics:

- sales revenue continues from order item price snapshots.
- category/type summaries continue from order item snapshots.
- cost/profit must respect `null` cost.
- known-cost profit should not include unknown-cost items as if they cost 0.

Risk:

- Existing historical order items normalized today may have `cost: 0` because previous code converted missing cost to 0. This cannot always distinguish true zero from old unknown.
- For new Product cost after Sprint 2B, `null` must be preserved so future data is cleaner.

## Expected File Changes

Likely files:

- `src/main.js`
  - `CATEGORY_METADATA`
  - Product normalize
  - Product Editor form
  - Product sorting
  - Product save
  - cost null display/parse
- `src/services/orderModel.js`
  - remove pourover hard-code
  - use product/item metadata for price resolution
  - support null cost in profit calculations
- `src/services/analytics.js`
  - avoid treating null cost as zero
  - optionally expose unknown cost counts
- `src/data/menu.js`
  - optionally add `signature` category
  - no broad category id migration
- docs
  - update Product Schema, Migration Plan, Rule Audit, Data Model, Backup Format if implementation changes behavior.

## Implementation Sequence

### Phase 1: Product Metadata Resolver

Add a resolver or helper functions without changing UI first.

Acceptance:

- Existing products resolve hot/cold and ice extra correctly.
- Pour Over resolves ice extra 10 through metadata.
- Dessert/beans resolve no temperature options.
- Build passes.

Regression tests:

- Existing espresso drink remains hot/cold.
- Existing pourover drink remains hot/cold and iced +10.
- Existing dessert has no temperature.
- Existing beans has no temperature.

### Phase 2: Normalize Cost As Number Or Null

Update normalize and Product Editor parsing.

Acceptance:

- blank cost saves as `null`.
- `0` cost saves as `0`.
- old numeric costs remain numeric.
- backup preserves `null`.
- restore preserves `null`.

Regression tests:

- existing products with numeric cost still show cost.
- product with blank cost can be saved.
- order item snapshots cost as `null` when product cost unknown.

### Phase 3: Product Editor Simplification

Remove Product-level takeout UI. Keep fields product-only.

Acceptance:

- no "可外帶" checkbox in Product Editor.
- new product uses category defaults for hot/cold and ice extra.
- new product is enabled by default.
- new product is appended to selected category.
- Product Management still shows disabled products.

Regression tests:

- disabled product hidden from POS ordering.
- disabled product visible in Product Management and can be re-enabled.
- existing enabled products still orderable.

### Phase 4: orderModel.js Price Rule Cleanup

Remove hard-coded pourover ice extra from `orderModel.js`.

Acceptance:

- no `POUROVER_ICE_EXTRA`.
- no `category === "pourover"` pricing branch.
- iced pourover still adds 10 through product/category metadata.
- product-specific ice surcharge override works.
- order item snapshots base price, ice extra, effective price, and cost.

Regression tests:

- hot pourover has no +10.
- iced pourover has +10.
- espresso iced has no +10 unless product says so.
- historical paid order totals do not change.

### Phase 5: Category + Sort

Use category + sort consistently.

Acceptance:

- POS selected category sorts by `sort`, then name.
- Product Management groups or sorts by category, then `sort`, then name.
- new product gets max category sort + 1.
- no drag-and-drop required.

Regression tests:

- existing product ordering remains reasonable.
- adding product to tea does not append using global product count.
- changing sort affects only display order.

### Phase 6: Analytics Minimal Unknown Cost Handling

Prevent `null` cost from becoming zero in new calculations.

Acceptance:

- revenue still includes unknown-cost items.
- known gross profit excludes unknown-cost items.
- UI does not imply unknown-cost items have zero cost.
- if UI update is too large, document remaining analytics UI gap and avoid expanding Sprint 2B.

Regression tests:

- known-cost product profit still calculates.
- unknown-cost product does not inflate profit.
- Dashboard still renders.

### Phase 7: Backup / Restore Verification

Acceptance:

- old full backup restores.
- new full backup includes normalized Product fields.
- Product with null cost survives export/import.
- Product hot/cold metadata survives export/import.
- Historical orders remain unchanged.

Regression tests:

- restore old backup without `iceExtraPrice`.
- restore old backup without `supportsHot`.
- restore product with `cost: null`.
- restore product with `cost: 0`.

## Final Product Decisions Applied

- Add `signature` category in Sprint 2B as a normal additive category.
- Keep existing `beans` category id for compatibility.
- Unknown-cost Analytics UI shows unknown-cost counts and labels profit as known gross profit.
- Product Editor does not expose `sort` number editing in Sprint 2B.
- Product Editor does not expose Product-level takeout settings.

## Non-Goals

- Drag-and-drop sorting.
- Firestore Category Master Data.
- Product service mode.
- `defaultTemperature`.
- Inventory / Recipe / Bean Domain.
- Material / Supplier fields.
- Full category id migration.
- Rewriting historical orders.
