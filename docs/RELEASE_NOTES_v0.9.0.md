# YUTU POS v0.9.0 — Product Foundation

Release date: 2026-07-17

## Release Summary

YUTU POS v0.9.0 stabilizes the Workspace and completes the Sprint 2 Product Foundation work. This release keeps YUTU POS focused on a small coffee shop operating workflow while making Product rules safer, more explicit, and easier to extend.

## Highlights

- Workspace stabilization
  - Order-centric Workspace flow.
  - Current store state remains focused on active orders and next actions.
  - Navigation and page naming are clearer for POS, order history, daily closing, operations, inventory status, products, analytics, and data/settings.

- Product Domain cleanup
  - Product schema remains flat and backward compatible.
  - `CATEGORY_METADATA` is the in-code source for category defaults.
  - Product explicit metadata overrides category defaults.

- Signature Category
  - Added `signature` as an additive Product category.
  - Existing `beans` category id remains unchanged for compatibility.

- Metadata-driven temperature and cold surcharge
  - Removed hard-coded pour-over price logic from `orderModel.js`.
  - Cold surcharge now uses Product / order item `iceExtraPrice`.
  - New order items snapshot Product temperature metadata.

- `cost: number | null`
  - Product cost can be blank.
  - Blank cost saves as `null`, meaning unknown or not yet estimated.
  - `0` remains a confirmed zero-cost value.

- Unknown-cost Analytics
  - Revenue includes all paid order items.
  - Known gross profit excludes unknown-cost items.
  - Unknown-cost item counts are visible so profit is not overstated.

- Product Editor cleanup
  - Removed Product-level takeout settings from Product Editor.
  - Service Mode remains an Order-level workflow concept.
  - Removed manual sort-number editing from the first version.

- Category-based sorting
  - Products sort by category order, then internal `sort`, then name.
  - New products append to the selected category.

- Backup compatibility
  - Full backup keeps the flat Product array.
  - Restore accepts legacy `menuItems`.
  - `cost: null` is preserved through backup / restore.
  - Historical order item snapshots are not recalculated from current Product records.

## Known Limitations

- No drag-and-drop product sorting.
- No Firestore Category Master Data.
- No Inventory Domain expansion.
- No Recipe Domain.
- No Bean Domain.
- No ERP behavior.
- No Product Service Mode.
- No `defaultTemperature`.
- No large Category ID migration.

## Release Readiness

- Sprint 2 Implementation Review completed.
- Product acceptance marked as passed.
- Ready for production release pending deployment verification.
