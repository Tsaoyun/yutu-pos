# Daily Operating Workflow

This document describes the implemented Sprint 1 daily operating workflow after the product rule adjustment that DailyClosing must not lock POS ordering.

## Operating Status

YUTU POS does not use a manual "start business" action.

The header status is derived from current data:

- `尚未結帳`: there is no official `dailyClosing` for today.
- `今日已結帳`: an official `dailyClosing` exists and still matches today's current records.
- `結帳後有異動`: an official `dailyClosing` exists, but today's orders or business events changed after it was created.

Refreshing the page does not require starting business again because the status is calculated from stored records.

## POS After Daily Closing

An official `dailyClosing` does not lock POS.

After completing today's closing, the operator can still:

- create dine-in table orders.
- create takeout orders.
- use the normal Order Queue.
- mark items served.
- checkout new orders.
- correct or void paid orders through the controlled history flow.
- add or edit Business Events.

Those changes make the official closing outdated. The `今日結帳` page should show `結帳後有異動` and allow `重新完成今日結帳`.

New normal orders after closing are not late entries. They use the normal POS workflow.

## Today Closing Page

The `今日結帳` page is separate from `資料與設定`.

It shows:

- business date
- current closing status
- first order time
- last paid time
- paid order count
- revenue
- profit
- open order count
- payment summary
- business event summary
- official closing summary if the date has already been closed
- late entry form

## Complete Today Closing Flow

The closing flow is:

1. Open `今日結帳`.
2. Confirm there are no open orders.
3. Review the daily summary.
4. Click `完成今日結帳`.
5. Confirm the snapshot.
6. A `dailyClosing` snapshot is created.
7. A full backup JSON is downloaded.
8. The closing shows backup status.

If open orders still exist, completing the closing is blocked and the page lists the open orders.

## Backup On Closing

Sprint 1 closing downloads a full backup, not a daily archive.

The full backup includes:

- orders
- products
- seats
- dailyClosings
- businessEvents
- inventoryLots
- legacy inventory arrays
- settings

If the download cannot be confirmed by the browser call, the closing remains created and its `backupStatus` is set to `pending`. The user can retry full backup download from the closing result panel.

## Re-Closing

If records change after official closing, `重新完成今日結帳` creates a new official `dailyClosing`.

The previous official closing becomes `superseded`; the new one becomes `official` and downloads a new full backup.

## Late Entry

Late entry is for recording a paid historical order that was missed.

Late entries:

- are saved as `orders`.
- use `status: "paid"`.
- use `entryType: "late_entry"`.
- use `fulfillmentStatus: "completed"`.
- do not enter the active order queue.
- do not occupy a seat.
- require a correction reason.

Late entries are included in analytics and daily closing by `businessDate`.

## Paid Order Corrections

Paid order correction is intentionally limited.

Allowed fields:

- payment method
- customer source
- customer source note
- order note
- dine-in / takeaway display on order items

Not allowed in Sprint 1:

- changing products
- changing quantity
- changing price

Larger mistakes should be handled by voiding the paid order and creating a late entry.

## Void Paid Order

Void is not a refund.

Voiding a paid order:

- keeps the order visible in history.
- sets `status: "voided"`.
- stores `previousStatus: "paid"`.
- stores `voidedAt`.
- stores `voidReason`.
- excludes the order from paid-order analytics and closing totals.
- marks the official closing outdated if it affects a closed business date.

Orders are not permanently deleted from history in the Sprint 1 workflow.

