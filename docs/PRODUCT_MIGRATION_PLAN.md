# Product Migration Plan

Sprint 2 Phase 2A proposes the migration path only. Do not execute this migration until Phase 2B is approved.

## Goals

- Make product ordering rules metadata-driven.
- Remove product/category hard-code from `orderModel.js`.
- Preserve old orders and analytics.
- Keep full backup / restore compatible.
- Avoid inventory, recipe, ERP, and material consumption changes.

## Recommended Strategy

Use **lazy normalize first**, not a one-time destructive migration.

Reason:

- The app is localStorage-first.
- Existing backups must continue to restore.
- Current product data is small.
- Lazy normalize can be idempotent and low risk.

## Migration Phases

### Phase 2B-1: Add Effective Product Metadata Resolver

Add a product metadata resolver, likely in a service such as:

```text
src/services/productModel.js
```

Responsibilities:

- normalize current product fields.
- resolve category defaults.
- expose `temperatureOptions`.
- expose resolved `iceExtraPrice`.
- keep old fields readable.

No UI behavior should change until resolver output is verified.

### Phase 2B-2: Normalize Product Schema

Normalize old products:

```js
supportsHot/supportsIce -> temperatureOptions
price -> price
cost -> cost
sort -> displayOrder
active -> enabled
category -> categoryId
```

Do not migrate `supportsTakeout` into Product Schema v2. Service Mode remains an Order-level concept.

Compatibility rule:

- Keep old fields during transition.
- New code reads resolved metadata.
- Full backup can include both until Product v2 is stable.

### Phase 2B-3: Update Product Editor

Update Product Editor to edit the resolved metadata:

- temperature options
- ice extra price
- display order
- enabled / stopped sale

Do not add inventory fields.

### Phase 2B-4: Update Order Item Creation

Update `orderModel.addOrderItem` to use resolved product metadata instead of:

- `product.type === "drink"` for temperature
- `category === "pourover"` for ice extra
- `POUROVER_ICE_EXTRA`

Order item must still snapshot:

- product id
- product name
- category id
- type
- selected temperature
- service type selected by the order flow
- base price
- ice extra / option price
- effective unit price
- cost

### Phase 2B-5: Backup / Restore Compatibility

Full backup should remain compatible with:

- current `products`
- legacy `menuItems`
- products missing new v2 fields
- products that have both old and new fields

Restore should normalize after validation.

### Phase 2B-6: Analytics Review

Analytics should continue to use order item snapshots.

Do not recalculate historical order item price, category, type, or temperature from current Product.

## Lazy Normalize Rules

When product lacks v2 fields:

```js
categoryId = product.category || "espresso"
enabled = product.active !== false
displayOrder = product.sort || index + 1
temperatureOptions = [
  product.supportsHot ? "hot" : null,
  product.supportsIce ? "iced" : null
].filter(Boolean)
iceExtraPrice = product.iceExtraPrice ?? categoryDefault.iceExtraPrice ?? 0
```

Service Mode is not part of Product v2 migration.

## One-Time Migration Risks

Avoid one-time migration until product resolver is stable.

Risks:

- corrupting existing product data.
- losing old fields needed by current UI.
- making old backups harder to restore.
- creating inconsistent orders if migration partially fails.

If one-time migration is later needed, require:

- pre-migration full backup.
- migration version.
- idempotent migration.
- rollback plan.
- restore test using old and new backups.

## Validation Plan

Before Phase 2B code changes:

- run product rule audit.
- confirm schema field decisions.
- confirm category default policy.
- confirm Product Editor UI.

After Phase 2B code changes:

- build succeeds.
- old full backup restores.
- newly created product can be ordered without code change.
- hot/iced rules follow product metadata.
- dine-in/takeout remains an Order-level workflow.
- pourover ice extra comes from product/category metadata, not hard-code.
- historical orders keep old price/cost/category snapshots.
- analytics still matches paid order item snapshots.

## Out Of Scope

- inventory lots consumption.
- material CRUD.
- recipe / BOM.
- automatic stock deduction.
- Firestore production migration.
- Daily Closing behavior changes.
