# Product Specification v1 Review

Source file: `C:\Users\USER\Downloads\PRODUCT_SPECIFICATION_V1.txt`

Status: Sprint 2A product decision review. This document does not describe implemented behavior.

## 1. Current Product Model Fit

The current Product model is partially aligned with Product Specification v1.

Current implemented product fields include:

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

Aligned with spec:

- Products already have category, type, price, cost, active state, and display order.
- Product Editor already supports hot/ice/takeout capability fields.
- Order item already snapshots product id, name, category, type, price, cost, temperature, service mode, and variant.
- Product changes do not rewrite paid historical order items.

Not fully aligned:

- Product category list does not yet match the spec categories exactly.
- `Signature` category does not exist.
- `Retail` currently appears as category `beans` and type `retail`.
- Category metadata/defaults are not formalized.
- Ordering rules are still partly in `orderModel.js` hard-code.
- Product schema version is not yet tracked in backup/settings metadata.

## 2. Gap Analysis

| Area | Spec Direction | Current State | Gap | Risk |
|---|---|---|---|---|
| Category taxonomy | Espresso, Pour Over, Tea, Signature, Dessert, Retail | espresso, pourover, tea, dessert, beans | Missing Signature; Retail is represented by beans category | New signature products may be forced into the wrong category |
| Capability matrix | Category/product capability should define hot/ice behavior | `supportsHot`, `supportsIce`, plus type fallbacks | Capability exists but is not the only source of truth | New products can behave differently between Product Editor and orderModel |
| Pour Over ice extra | Pour Over iced has +10 | `POUROVER_ICE_EXTRA = 10` and `CATEGORY_METADATA.pourover.iceExtraPrice = 10` | Duplicate rule | Price logic can drift |
| Signature drinks | Category for drinks with special rules | Not represented | Needs category and capability defaults | Signature products need manual workaround |
| Service Mode | Belongs to order context | Order and order items snapshot serviceType | Product should not own service mode in Sprint 2B | Avoid adding product fields that are not needed |
| Product Editor | Should edit core product fields and behavior | Supports most fields | Does not show category defaults or resolved capability preview | User may not understand inherited/default behavior |
| Master Data boundary | Product domain excludes Bean/Inventory/Recipe/Material | Current Product does not include recipe/material | Aligned | Keep this boundary in Sprint 2B |
| Backup / Restore | Schema, normalize, migration needed | Full backup exports products and restore normalizes | No Product v2 schemaVersion | Need careful compatibility plan |

## 3. Recommended Category Model

Product Specification v1 introduces a clearer category taxonomy:

```js
[
  { id: "espresso", name: "Espresso" },
  { id: "pourover", name: "Pour Over" },
  { id: "tea", name: "Tea" },
  { id: "signature", name: "Signature" },
  { id: "dessert", name: "Dessert" },
  { id: "retail", name: "Retail" }
]
```

Recommendation:

- Add `signature` as a category in Sprint 2B.
- Decide whether current `beans` category should become `retail` or remain `beans` with display label Retail.
- Use stable category ids, not display names, in products and order item snapshots.

## 4. Recommended Capability Matrix

Proposed category defaults:

| Category | Temperature Options | Ice Extra Default | Notes |
|---|---|---:|---|
| espresso | hot, iced | 0 | Standard espresso drinks |
| pourover | hot, iced | 10 | Ice extra is a category default unless product overrides |
| tea | hot, iced | 0 | Can support iced tea products |
| signature | product-defined | product-defined | Affogato or tonic may need special defaults |
| dessert | none | 0 | No temperature selection |
| retail | none | 0 | Retail can be added to the same order; service mode remains order-level |

Product explicit temperature and ice-extra settings should override category defaults.

Service Mode is intentionally excluded from Product. The whole order decides dine-in or takeout.

## 5. Order Impact

Current order item snapshot is mostly correct and should be preserved.

Recommended order item snapshot direction:

```js
{
  productId,
  productNameSnapshot,
  categoryIdSnapshot,
  typeSnapshot,
  selectedTemperature,
  serviceMode,
  selectedVariant,
  basePrice,
  optionPrice,
  unitPrice,
  unitCost,
  quantity
}
```

Implementation guidance for Sprint 2B:

- Do not recalculate old order item prices from Product.
- Do not rename historical order item fields in one large migration.
- Add compatibility fields gradually if needed.
- Use a product metadata resolver when creating new order items.

## 6. Analytics Impact

Analytics should continue to use order item snapshots.

Expected impact:

- Product category reporting should use `categoryIdSnapshot` or current `item.category`.
- Product type summaries should use order item `type`.
- Temperature summaries should use selected order item temperature.
- Service summaries should use selected order/order item service mode snapshots.
- Product ranking should ideally group by `productId` and display a stable name policy.

Risk:

- If category ids are migrated from `beans` to `retail`, old reports may split unless mapping is handled.
- If temperature values move from Chinese labels to enum values, analytics must normalize both old and new values.

## 7. Backup / Restore Impact

Full backup currently includes `products` and legacy `menuItems`.

Sprint 2B should maintain restore compatibility for:

- products with current fields only.
- products with Product Schema v2 fields.
- products restored from old backups without capability fields.
- `menuItems` fallback.

Recommended backup behavior:

- Keep `exportType: "full"` unchanged.
- Add Product Schema v2 fields through normalize.
- Avoid requiring all products to be rewritten immediately.
- Consider `productSchemaVersion` in backup metadata or system settings, not on each Product.

## 8. Data Consistency Risks

High risk:

- `orderModel.js` hard-code may conflict with Product Editor metadata.
- Migrating categories without alias mapping can affect analytics and old product filters.
- Changing temperature values or order service-mode values without normalization can break summary counts.

Medium risk:

- Product Editor may expose too many fields and confuse daily operation.
- Signature category may become a catch-all unless its rules are clear.

Low risk:

- Adding category defaults as code constants first.
- Keeping schema version in backup/settings metadata rather than every product.
- Keeping current fields during transition.

## 9. Recommended Product Schema

Use a flat schema for Sprint 2B:

```js
{
  id,
  name,
  categoryId,
  type,
  price,
  cost,
  enabled,
  displayOrder,

  temperatureOptions,
  iceExtraPrice,

  variants,
  note,
  createdAt,
  updatedAt
}
```

Compatibility fields may remain during transition:

```js
{
  category,
  active,
  sort,
  supportsHot,
  supportsIce,
  supportsTakeout,
  requiresTemperature,
  requiresServiceType
}
```

## 10. Migration / Normalize Proposal

Use lazy normalize:

```js
categoryId = product.categoryId || product.category || "espresso"
enabled = product.enabled ?? product.active !== false
displayOrder = product.displayOrder ?? product.sort ?? index + 1
temperatureOptions = product.temperatureOptions || fromSupportsHotIce(product)
iceExtraPrice = product.iceExtraPrice ?? categoryDefault.iceExtraPrice ?? 0
```

Normalize should run on:

- app load.
- restore.
- seed products.
- Product Editor save.

Do not run a destructive one-time migration until:

- Product Editor v2 is verified.
- old backups restore successfully.
- order item creation uses the resolver.

## 11. Product Editor Proposal

Minimum Product Editor fields for Sprint 2B:

- product name
- category
- type
- price
- cost
- enabled / stopped sale
- display order
- temperature options
- ice extra price
- variants / flavor
- note

UI guidance:

- Show category defaults as helper text.
- Product explicit settings should be visible and editable.
- Hide ice extra if `iced` is not available.
- Retail products should not show temperature fields.
- Do not show Service Mode fields in Product Editor.
- Keep the editor practical; do not add recipe, material, or inventory fields.

## 12. Open Decisions

- Should current `beans` category be renamed/migrated to `retail`, or should it remain `beans` with Retail label?
- Should `Signature` be a new category immediately in Sprint 2B?
- Should temperature values remain Chinese strings or migrate to stable enum values?
- Service-mode enum cleanup belongs to an Order workflow cleanup, not Product Schema v2.
- Should product schema version live in backup metadata, system settings, or both?

## 13. Validation Checklist For Phase 2B

- Existing products normalize without data loss.
- Old full backup restores.
- Product Editor creates a new product that can be ordered immediately.
- Pour Over iced extra comes from metadata, not hard-code.
- Signature category product can be created without code change.
- Historical paid orders keep original price/cost/category snapshots.
- Analytics does not regress after category/type normalization.
- No inventory or recipe behavior is added.
