# Daily Closing Rules

This document defines the implemented Sprint 1 daily closing behavior.

## Source Of Truth

Paid orders are the source of truth for sales.

`dailyClosings` are snapshots. They do not replace orders and should remain recalculable from:

- paid non-voided orders
- business events
- products

## Business Date

Orders can contain `businessDate`.

Daily calculations use:

```text
order.businessDate || checkedOutAt date || paidAt date || createdAt date
```

Late entries rely on `businessDate` so they can be added to a prior business day.

## Official Closing

Only one closing per date should be official.

An official closing is a snapshot and does not lock POS ordering for that date.

When a new closing is generated for a date:

- the previous official closing becomes `superseded`.
- the new closing becomes `official`.
- the previous closing points to the new closing with `supersededBy`.

This preserves audit history without changing the original orders.

## Closing Snapshot Fields

Sprint 1 daily closings may include:

- `id`
- `date`
- `businessDate`
- `closedAt`
- `version`
- `status`
- `isOfficial`
- `supersededBy`
- `supersedesId`
- `supersededAt`
- `orderCount`
- `totalSales`
- `revenue`
- `totalCost`
- `grossProfit`
- `grossMargin`
- `drinkCount`
- `dessertCount`
- `retailCount`
- `paymentSummary`
- `customerSourceSummary`
- `businessEventSummary`
- `openOrderCount`
- `snapshotVersion`
- `changeSummary`
- `exported`
- `exportedAt`
- `backupStatus`
- `backupDownloadedAt`
- `createdAt`
- `note`

Older closings are normalized with safe defaults.

## Blocking Rules

Completing or re-completing today closing is blocked if open orders exist for the current date.

The UI must show those open orders so the operator can finish or correct them before creating a closing snapshot.

The POS itself is not blocked by an official closing. New dine-in and takeout orders still use the normal queue, production, and checkout workflow.

## Backup Rules

The Sprint 1 closing flow downloads a full backup.

If backup download fails:

- do not create another closing.
- keep the created closing.
- mark `backupStatus: "pending"`.
- allow full backup redownload from the closing panel.

## Re-Closing

If orders or business event data changes after closing, the official closing can become outdated.

Re-closing:

- creates a new daily closing snapshot.
- keeps the old snapshot as `superseded`.
- downloads a new full backup.

## Analytics Rules

Daily closing and analytics should exclude:

- `status: "voided"` orders.
- open orders.

They should include:

- paid standard orders.
- paid late-entry orders matching the selected `businessDate`.
