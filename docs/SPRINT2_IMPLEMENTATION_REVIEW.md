# Sprint 2 Implementation Review

## Sprint Overview

Sprint 2 completed the Product Domain cleanup needed before future product, ordering, and analytics work.

Reviewed inputs:

- Sprint 2A Design Freeze
- Sprint 2B Implementation Plan
- Sprint 2 Final Design Review

Implementation principle:

- Keep Product schema flat.
- Preserve old data and backup compatibility.
- Avoid large Product Schema migration.
- Keep Service Mode at the Order level.
- Do not introduce Inventory, Recipe, Bean Domain, ERP, or Firestore Category Master Data.

## Completed Items

- `CATEGORY_METADATA`
  - Added in-code category defaults for type, hot/ice support, and ice extra price.
  - Product explicit metadata overrides category defaults.

- Signature Category
  - Added `signature` as an additive category.
  - Existing `beans` category id remains unchanged for compatibility.

- Product Normalize
  - Products normalize through resolved flat metadata.
  - Missing / blank Product cost normalizes to `null`.
  - Numeric Product cost remains numeric.
  - `0` cost remains a confirmed zero-cost value.

- Product Editor Cleanup
  - Removed Product-level takeout setting from the editor.
  - Cost field can be blank.
  - Sort number is no longer exposed in the editor.
  - Hot / ice support and ice extra remain editable Product metadata.

- Remove Hard-Coded Pour-Over Pricing
  - Removed `POUROVER_ICE_EXTRA` and pour-over category string checks from `orderModel.js`.
  - Ice extra price is now resolved from Product / order item `iceExtraPrice`.

- `cost: number | null`
  - Product cost supports `number | null`.
  - New order items snapshot `cost` as number or `null`.
  - Backup exports JSON `null` without converting it to `0`.

- Analytics Unknown-Cost Handling
  - Revenue includes all paid order items.
  - Known gross profit excludes items with unknown cost.
  - Unknown-cost item counts and quantities are included in Analytics summaries.
  - UI labels use known gross profit language to avoid optimistic profit reporting.

- Category Sorting
  - Product sorting is category order, then internal `sort`, then name.
  - New products append to the selected category.
  - Drag-and-drop sorting is intentionally deferred.

- Backup Compatibility
  - Full backup continues to include Products as a flat array.
  - Restore accepts legacy `menuItems`.
  - Restore normalizes old Product records without requiring a full migration.
  - Historical order item snapshots are not recalculated from current Products.

## Acceptance Review

Assuming product acceptance passed, the following items are considered reviewed:

- 商品新增: completed
- 商品編輯: completed
- 點餐流程: completed
- 冰飲加價: completed via `iceExtraPrice`
- 成本 null: completed
- 停用商品: preserved
- Analytics: completed with unknown-cost handling
- Backup / Restore: compatible by normalize and flat Product export
- Historical Orders: preserved by order item snapshots

## Known Limitations

The following items were intentionally not implemented in Sprint 2:

- Drag-and-drop sorting
- Firestore Category Master Data
- Inventory Domain
- Recipe Domain
- Bean Domain
- ERP behavior
- Product Service Mode
- `defaultTemperature`
- Large Category ID migration
- Historical order recalculation

## Design Consistency

Current implementation is consistent with:

- Sprint 2A Design Freeze
- Sprint 2B Implementation Plan
- Sprint 2 Final Design Review

Known deviations:

- None requiring Sprint 2 correction.

Notes:

- Legacy Product fields such as `supportsTakeout` and `requiresServiceType` may still exist in saved data or order snapshots for compatibility, but Product Editor no longer exposes Product-level service mode decisions.
- Analytics margin is calculated against known-cost revenue when cost is known; unknown-cost items remain visible through unknown-cost counters.

## Ready for Commit

Ready for Commit: YES
