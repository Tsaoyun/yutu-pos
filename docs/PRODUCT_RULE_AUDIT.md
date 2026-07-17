# Product Rule Audit

## Sprint 2B Implementation Result

- `src/services/orderModel.js` no longer uses `POUROVER_ICE_EXTRA` or `category === "pourover"` to calculate ice extra price.
- New order item price fields are resolved from the Product/order item `iceExtraPrice` snapshot.
- Product Editor no longer exposes Product-level takeout settings.
- Product cost supports `number | null`; Analytics must not treat `null` as zero.
- `signature` was added as an additive category; existing `beans` category id is preserved.

Sprint 2 Phase 2A audits product-related hard-coded rules. No code changes are implied by this document.

## Rule Table

| Rule ID | Current Rule | Location | Purpose | Data Dependency | Risk | Proposed Metadata | Suggested Phase |
|---|---|---|---|---|---|---|---|
| PR-001 | `POUROVER_ICE_EXTRA = 10` | `src/services/orderModel.js` | Adds fixed ice extra for pourover items | hard-coded constant | Product-specific pricing cannot vary safely | `product.iceExtraPrice`, category default fallback | Sprint 2B |
| PR-002 | `category === "pourover" || category === "手沖"` | `src/services/orderModel.js` | Detects pourover for ice extra | category string | Category rename breaks pricing | resolved product metadata | Sprint 2B |
| PR-003 | `CATEGORY_METADATA.pourover.iceExtraPrice = 10` | `src/main.js` | Provides default ice extra during normalize/editor defaults | category id | Duplicates orderModel pricing rule | category defaults resolved into product | Sprint 2B |
| PR-004 | `product.type === "drink"` | `src/main.js`, `src/services/orderModel.js`, `src/services/analytics.js` | Temperature default, drink counts, UI grouping | product type | Acceptable for analytics, risky for ordering rules | `temperatureOptions`; keep type for analytics | Sprint 2B |
| PR-005 | `product.type !== "retail"` | `src/main.js`, `src/services/orderModel.js` | Default service type requirement | product type | Service behavior should be driven by Order flow, not Product metadata | remove Product dependency where possible; keep service mode order-level | Sprint 2B |
| PR-006 | `item.type === "drink"` | `src/services/orderModel.js`, `src/services/analytics.js`, `src/main.js` | Drink count and temperature analytics | order item snapshot | Acceptable for analytics; should not determine options after snapshot | keep `orderItem.type` snapshot | No urgent change |
| PR-007 | `item.temperature === "冰" / "熱"` | `src/main.js`, `src/services/analytics.js`, `src/services/orderModel.js` | Temperature display and statistics | localized strings in order item | Hard to internationalize; okay for current UI | v2 values `iced` / `hot` with display labels, or keep current for low risk | Product decision |
| PR-008 | `item.serviceType === "內用" / "外帶"` | `src/main.js`, `src/services/analytics.js` | Dine-in/takeaway analytics | localized strings in order item | Hard to internationalize; current UI relies on strings | v2 values `dine_in` / `takeaway` with labels | Product decision |
| PR-009 | Product Editor sets `supportsHot` / `supportsIce` only when selected type is drink | `src/main.js` `buildProductFromForm` | Prevents non-drink hot/ice options | product type | Blocks future non-drink temperature options | `temperatureOptions` independent of type | Sprint 2B |
| PR-010 | Product Editor zeroes `iceExtraPrice` for non-drink products | `src/main.js` `buildProductFromForm` | Avoids irrelevant ice extra | product type | Reasonable now; type-coupled | show field only when temperature supports iced | Sprint 2B |
| PR-011 | Late entry defaults drink temperature to hot | `src/main.js` `saveLateEntry` | Creates a paid historical item quickly | product type | Late entry may not match actual temperature | optional temperature field or product default | Later |
| PR-012 | Inventory lot product list filters dessert lots by `type === "dessert"` and bean lots by `type === "retail"` | `src/main.js` | Limits batch UI to dessert / roasted beans | product type | Acceptable for Phase 4A; may need lot metadata later | lot-specific product capability | Inventory sprint |
| PR-013 | Analytics category label uses order item category snapshot | `src/services/analytics.js` | Historical category reporting | order item snapshot | Good historical behavior | keep snapshot | No change |
| PR-014 | Analytics product ranking key uses `productId || name` plus name | `src/services/analytics.js` | Product ranking grouping | order item snapshot | Product rename can split ranking if name changes after old snapshot | group by productId, display latest/snapshot policy | Analytics sprint |
| PR-015 | Payment method defaults to `cash` | `src/services/orderModel.js` | Current shop only accepts cash | payment domain | Out of product domain | payment object if needed later | Out of Sprint 2 Product |
| PR-016 | Order id uses timestamp suffix | `src/services/orderModel.js` | Local order id | local clock | Out of product domain | backend id / sequence later | Out of Sprint 2 Product |

## Current Product Model

Current product model mixes:

- identity: `id`, `name`
- classification: `category`, `type`
- pricing: `price`, `cost`, `iceExtraPrice`
- availability: `active`
- ordering behavior: `supportsHot`, `supportsIce`, `supportsTakeout`, `requiresTemperature`, `requiresServiceType`
- display/admin: `sort`, `note`, `variants`, `options`

The model is workable but does not yet clearly separate master data, category defaults, product capabilities, and order item snapshots.

## Current Order Item Snapshot

Current order item fields include:

```js
{
  lineId,
  productId,
  name,
  variantName,
  category,
  type,
  quantity,
  requiresTemperature,
  requiresServiceType,
  temperature,
  serviceType,
  basePrice,
  effectivePrice,
  iceExtra,
  price,
  cost,
  profit,
  served,
  note
}
```

This is mostly correct because paid history and analytics should not be recalculated from current product price or current category name.

## Proposed Order Item Snapshot Direction

Sprint 2B can clarify names without changing behavior immediately:

```js
{
  productId,
  productNameSnapshot,
  categoryIdSnapshot,
  typeSnapshot,
  basePrice,
  optionPrice,
  unitPrice,
  unitCost,
  selectedTemperature,
  serviceMode,
  selectedVariant,
  quantity
}
```

Recommendation:

- Do not migrate historical order items aggressively in Sprint 2B.
- Add normalize fallback only when introducing new field names.
- Keep current fields until a later cleanup to avoid analytics regressions.

## Product Editor Current State

The editor currently supports:

- name
- category
- type
- price
- cost
- ice extra price
- sort
- supports hot
- supports ice
- supports takeaway
- variants
- note
- active / stopped sale

Gaps:

- No product schema version tracked in backup/settings metadata.
- No category defaults UI.
- Temperature options are three fields rather than one resolved list.
- Legacy service-related fields exist (`supportsTakeout`, `requiresServiceType`), but Sprint 2B should avoid adding new Product service-mode fields.
- Product metadata and orderModel hard-code still disagree on ice extra source.

## Analytics Current State

Analytics mostly uses order item snapshots:

- product ranking uses item name/productId/category snapshot.
- category summary uses item category snapshot.
- temperature summary uses item temperature snapshot.
- service summary uses item serviceType snapshot.

Risk:

- product ranking can split if product name changes because key combines productId/name.
- analytics filters paid orders by checkout date in service; Sprint 1 introduced `businessDate` elsewhere, so date source should be reviewed separately.

## Open Decisions

- Should v2 store temperature values as English enums (`hot`, `iced`) or keep Chinese UI strings in order items?
- Should Product Schema v2 version be tracked in backup metadata or settings metadata?
- Confirm Category metadata remains static code constants in Sprint 2B.
