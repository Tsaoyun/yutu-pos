# Product Schema v2 Proposal

Sprint 2 Phase 2A is an audit and proposal only. Do not treat this document as implemented behavior.

## Current State

Current product records are stored in `state.products`, seeded from `src/data/menu.js`, normalized in `src/main.js`, exported in full backup, and restored through `normalizeState`.

Current product fields observed in code:

```js
{
  id,
  name,
  category,
  type,
  price,
  cost,
  active,
  sort,
  note,
  variants,
  options,
  supportsHot,
  supportsIce,
  supportsTakeout,
  iceExtraPrice,
  requiresTemperature,
  requiresServiceType
}
```

Current category source:

```js
categories = [
  { id: "espresso", name },
  { id: "pourover", name },
  { id: "tea", name },
  { id: "dessert", name },
  { id: "beans", name }
]
```

`categories` are static code data, not editable master data.

## Confirmed Principle

- Product is master data.
- Order item is a transaction snapshot.
- Service Mode belongs to Order, not Product.
- Analytics should use order item snapshots for historical truth.
- Product changes should affect new orders only.
- Sprint 2 should improve product metadata without adding inventory, recipe, material consumption, or ERP behavior.

## Current Product Rule Flow

```text
Product
-> POS product selection
-> variant / temperature / service option selection
-> orderModel.addOrderItem
-> order item snapshot
-> order total / checkout
-> paid order
-> Analytics
```

Important current behavior:

- Product Editor writes `supportsHot`, `supportsIce`, `supportsTakeout`, `iceExtraPrice`.
- `main.js` normalize fills missing fields using `product.type` and `CATEGORY_METADATA`.
- `orderModel.js` still has hard-coded pourover ice extra logic.
- Order items snapshot price, cost, category, type, temperature, service type, and product id.

## Proposed Schema Option A: Flat Schema

```js
{
  id,
  name,
  type,
  categoryId,
  price,
  cost,
  enabled,
  displayOrder,

  temperatureOptions, // ["hot", "iced"]
  iceExtraPrice,

  variants,
  options,
  note,
  createdAt,
  updatedAt
}
```

Benefits:

- Easy to migrate from the current model.
- Easy to read in Product Editor.
- Minimal nesting keeps localStorage JSON simple.

Risks:

- More top-level fields.
- Future options may become crowded if product behavior expands.

## Proposed Schema Option B: Structured Schema

```js
{
  id,
  name,
  type,
  categoryId,
  enabled,
  displayOrder,

  pricing: {
    basePrice,
    cost
  },

  capabilities: {
    temperatureOptions
  },

  options: {
    iceExtraPrice,
    variants
  },

  note,
  createdAt,
  updatedAt
}
```

Benefits:

- Clear boundaries between pricing, capability, and options.
- Easier to grow without adding too many top-level fields.

Risks:

- Larger migration.
- Product Editor and restore normalization become more complex.

## Recommendation

Use **Option A: Flat Schema** for Sprint 2B.

Reason:

- YUTU POS is for a small coffee shop, not ERP.
- Existing code already uses flat product fields.
- It reduces migration risk.
- It keeps Product Editor simpler.

Schema version should not be stored on each Product. Track product schema/migration version in backup metadata or system settings instead.

## Field Decisions

### Temperature

Recommended v2 fields:

```js
temperatureOptions: ["hot", "iced"]
```

Mapping from current fields:

- `supportsHot: true` -> includes `"hot"`
- `supportsIce: true` -> includes `"iced"`
- both false -> `[]`
Current `product.type === "drink"` should become a fallback only, not the primary rule.

Deferred:

- `defaultTemperature` is not needed in the current workflow. The operator selects hot/iced when adding the item.

### Service Mode

Service Mode belongs to Order, not Product.

Current confirmed flow:

```text
Create order
-> choose dine-in or takeout at the order level
-> add products into that order
```

Sprint 2B should not add:

- `serviceModes`
- `defaultServiceMode`
- `takeawayOnly`
- `dineInOnly`

If a future real product limitation appears, add a product-level service restriction then.

### Ice Extra Price

Recommended field:

```js
iceExtraPrice: number
```

Resolution order:

1. product explicit `iceExtraPrice`
2. category default `iceExtraPrice`
3. system default `0`

Order item should snapshot the resolved value as `iceExtra`.

### Type And Category

Recommended distinction:

- `type`: operational product class for broad behavior and analytics (`drink`, `dessert`, `retail`).
- `categoryId`: menu grouping and reporting group (`espresso`, `pourover`, `tea`, `dessert`, `beans`).

Rules:

- `type` should not be the only source of temperature rules.
- `categoryId` should not directly control pricing except through explicit category defaults resolved into product metadata.

### Analytics Tags

Do not add `analyticsTags` in Sprint 2B unless a real reporting need exists.

Current category/type summaries are enough. Add tags later only when existing category/type cannot answer a real question.

### Inventory Metadata

Out of Sprint 2 Product scope:

- `tracked`
- `inventoryType`
- `recipe`
- `materialId`

Do not add these to Product Schema v2 now.

## Category Metadata Proposal

Current categories are code constants. Sprint 2B can keep them static but should treat them as category master data.

Recommended Sprint 2B approach:

- Keep `CATEGORY_METADATA` as a code constant.
- Do not create Firestore Category master data.
- Do not add a Category management UI.

Reason:

- Categories are not frequently edited.
- The shop does not currently need category admin.
- This keeps schema and migration smaller.

Possible future category shape:

```js
{
  id,
  name,
  enabled,
  displayOrder,
  defaults: {
    temperatureOptions,
    iceExtraPrice
  }
}
```

Rules:

- Category defaults are only fallback rules.
- Product explicit metadata wins over category defaults.
- Order and analytics should not depend directly on category string checks.

## Out Of Scope

- Recipe / BOM.
- Material consumption.
- Automatic stock deduction.
- Inventory workflow.
- Business Event redesign.
- Daily Closing redesign.
- Firestore migration.
