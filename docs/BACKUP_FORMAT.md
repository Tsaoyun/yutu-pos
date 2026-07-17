# Backup Format Addendum: Sprint 1 Daily Operating Workflow

Sprint 1 closing downloads a full backup.

The full backup naturally includes the new normalized order fields and daily closing fields because it exports the full state arrays:

- `orders`
- `products`
- `seats`
- `dailyClosings`
- `businessEvents`
- `inventoryLots`
- `inventoryItems`
- `inventoryMovements`
- `settings`

Important behavior:

- `daily` report export remains a report-only export and is not restorable.
- `daily-archive` remains available as a legacy/export format but is not the Sprint 1 closing backup.
- Daily closing flow uses `exportType: "full"`.
- If full backup download is not confirmed, the created closing is kept with `backupStatus: "pending"` and can redownload full backup.
- Old full backups remain compatible because missing Sprint 1 fields are filled by normalize.

# Backup Format

本文件描述目前 YUTU POS 的 JSON 匯出、封存與還原格式。內容以目前程式實作為準，不描述尚未實作的 Firestore sync 或未來理想格式。

## Current Storage Boundary

- 正式資料目前主要儲存在瀏覽器 `localStorage`。
- storage key 為 `yutu-pos-state-v1`。
- `src/services/firestoreAdapter.js` 仍是 legacy stub，尚未接入 production sync。
- full backup / restore 不等於 Firestore sync。
- daily archive 也與 Firestore sync 無關。

## Format Identifiers

目前匯出 payload 使用：

```js
{
  schemaVersion: 1,
  app: "YUTU_POS",
  exportType,
  exportedAt
}
```

欄位說明：

| Field | Type | Required | Default | Restore behavior |
|---|---|---:|---|---|
| `schemaVersion` | number | Recommended | none | 目前沒有版本分支判斷；仍會依欄位結構驗證 |
| `app` | string | Recommended | none | 目前不作為 restore gate |
| `exportType` | string | Yes for current exports | none | restore 只接受 `full`；`daily` / `daily-archive` 會被拒絕 |
| `exportedAt` | ISO datetime string | Yes for current exports | generated at export | restore 不依此欄位排序或判斷 |
| `storageKey` | string | full backup includes it | `yutu-pos-state-v1` | 文件用途；restore 不依此欄位切換 key |

## Export Types

目前保留三種匯出：

- `full`：完整備份，可用於還原。
- `daily`：每日報表，用於查看指定日期營業資料；目前不支援還原。
- `daily-archive`：每日營業封存檔，用於打烊後保存當日 paid orders、商品快照與日結快照；目前不支援還原。

## Full Backup

用途：

- 完整資料保護。
- 跨裝置搬移。
- 系統還原。
- 正式上線或高風險操作前備份。

檔名：

```text
yutu-pos-backup-yyyy-mm-dd-hhmm.json
```

目前格式：

```json
{
  "schemaVersion": 1,
  "app": "YUTU_POS",
  "exportType": "full",
  "exportedAt": "ISO datetime",
  "storageKey": "yutu-pos-state-v1",
  "orders": [],
  "products": [],
  "seats": [],
  "dailyClosings": [],
  "businessEvents": [],
  "inventoryLots": [],
  "inventoryItems": [],
  "inventoryMovements": [],
  "settings": {}
}
```

### Full Backup Sections

| Section | Type | Required | May be empty | Default if missing | Legacy support | Restore behavior |
|---|---|---:|---:|---|---|---|
| `orders` | array | Yes | Yes | none; missing fails validation | Yes | normalize each order, orderItem, customerSource and linked seats |
| `products` | array | Yes unless `menuItems` exists | Yes | fallback to `menuItems`; missing both fails validation | `menuItems` | normalize product metadata and copy to `menuItems` |
| `menuItems` | array | No | Yes | copied from `products` after normalize | Yes | accepted as legacy product source |
| `seats` | array | No | Yes | `defaultSeats` | Partial | read into import payload, but `normalizeState` currently resets seats to `defaultSeats` |
| `dailyClosings` | array | No | Yes | `[]` | Yes | normalize version, official / superseded status, totals and timestamps |
| `businessEvents` | array | No | Yes | `[]` | Yes | normalize event type, usageType, itemSource, quantity and cost fields |
| `inventoryLots` | array | No | Yes | `[]` | Yes | normalize lot type, item source, quantities, unit cost, status and dates |
| `inventoryItems` | array | No | Yes | `[]` | Legacy | preserved as compatibility layer, not v2 truth source |
| `inventoryMovements` | array | No | Yes | `[]` | Legacy | preserved as compatibility layer, not v2 truth source |
| `settings` | object | No | n/a | current defaults | Partial | merged into state before normalize; UI state may be reset by normalize rules |

### Product Backup Notes

- Full backup preserves the flat Product shape.
- `products[].cost` may be a number or `null`.
  - `null` is exported as JSON `null` and means cost is unknown.
  - `0` means the cost is confirmed as zero.
  - Restore must not convert `null` to `0`.
- `products[].supportsHot`, `products[].supportsIce`, and `products[].iceExtraPrice` are preserved and used by new order item snapshots.
- Product service mode fields are not added in Sprint 2B. Dine-in / takeout remains order-level.
- `products[].sort` is preserved as an internal category-order field. UI does not expose manual sort editing in Sprint 2B.
- `menuItems` remains accepted as a legacy source when `products` is missing.

### Settings Snapshot

`settings` currently stores UI and filter state, including:

- `selectedSeatId`
- `selectedCategoryId`
- `selectedOrderId`
- `orderDetailMode`
- `orderViewMode`
- `activeView`
- `historyDate`
- `analyticsRange`
- `analyticsStartDate`
- `analyticsEndDate`
- `analyticsSort`
- `salesSort`

Settings are convenience state, not business records.

## Daily Report

用途：匯出某一天的營業報表資料，保留原有每日報表行為。

檔名：

```text
yutu-pos-daily-yyyy-mm-dd.json
```

格式：

```json
{
  "schemaVersion": 1,
  "app": "YUTU_POS",
  "exportType": "daily",
  "date": "yyyy-mm-dd",
  "exportedAt": "ISO datetime",
  "dailySummary": {},
  "productSalesSummary": [],
  "orders": [],
  "productsSnapshot": []
}
```

資料來源：

- `orders` 只包含該日期的 paid orders。
- `orders` 會保留 order 層級的 `customerSource` 與 `customerSourceNote`。
- `dailySummary` 由該批 paid orders 即時計算。
- `productSalesSummary` 由該日期 paid order items 彙總。
- `productsSnapshot` 是匯出當下的 `state.products`。
- Daily report 不建立 `dailyClosing`，也不寫入 `dailyClosings`。
- Daily report 目前不支援 restore。

## Daily Archive

用途：每天營業結束後下載當日營業封存檔，並在 state 中新增一筆日結快照。

檔名：

```text
yutu-pos-daily-archive-yyyy-mm-dd.json
```

格式：

```json
{
  "schemaVersion": 1,
  "app": "YUTU_POS",
  "exportType": "daily-archive",
  "date": "yyyy-mm-dd",
  "exportedAt": "ISO datetime",
  "dailySummary": {},
  "productSalesSummary": [],
  "orders": [],
  "productsSnapshot": [],
  "dailyClosing": {}
}
```

目前語意：

- 只封存指定日期資料。
- `orders` 只包含該日期 paid orders。
- 包含 `productsSnapshot`。
- 包含一筆 `dailyClosing`。
- 不包含所有歷史 orders。
- 不包含所有 Business Events 明細；目前 close workflow 只在確認視窗顯示當日 Business Events 筆數。
- 不是 full backup。
- 目前不支援 restore。

## Daily Closing Snapshot

`dailyClosing` 目前至少包含：

```js
{
  id,
  date,
  closedAt,
  version,
  status,
  isOfficial,
  supersededBy,
  supersededAt,
  orderCount,
  totalSales,
  totalCost,
  grossProfit,
  grossMargin,
  drinkCount,
  dessertCount,
  retailCount,
  exported,
  exportedAt,
  note
}
```

規則：

- DailyClosing 是 snapshot，不取代 paid orders。
- 同一天可有多筆 dailyClosing。
- 同一天只允許一筆 `isOfficial: true`。
- 重新日結時，新 closing 變 official，舊 official 變 `superseded`。
- 所有統計仍應可由 paid orders 重新計算與稽核。

## Restore Behavior

目前 restore 入口是 `資料與設定` 頁的 `匯入備份`。

### 行為

- Restore 是覆蓋此裝置 localStorage，不是合併。
- 使用者選檔後會先看到 confirm：`匯入會覆蓋目前本機資料，確定繼續嗎？`
- 只接受 `exportType: "full"`，或舊格式中可被辨識為 state 的資料。
- `daily` 與 `daily-archive` 會被拒絕。
- 匯入 JSON 會先 parse，再 `validateImportedState`，再 `normalizeState`。
- 驗證通過後才指定 `state = validateImportedState(parsed)` 並呼叫 `saveState(state)`。
- 若 JSON parse / validate / save 過程丟錯，會顯示錯誤並停止。
- 若驗證失敗，原本 localStorage 理論上仍保留，因為 save 尚未執行。
- 若 saveState 失敗，會丟出 `localStorage 寫入失敗。`。
- 不認識的欄位會隨 state object 帶入一部分，但主流程只使用 normalize 後已知欄位。

### Validation

Restore currently requires:

- imported value must be object。
- if `exportType` exists, it must be `full`。
- `orders` must be an array。
- `products` or `menuItems` must be an array。

Current limitations:

- `schemaVersion` is recorded but not strictly version-gated.
- `app` is recorded but not strictly validated.
- `seats` from backup are not fully restored because normalize resets to `defaultSeats`.
- Restore is all-or-nothing at localStorage write level, but there is no separate transaction log or rollback file.

### Recommended Safety

- 匯入前先匯出一份 full backup。
- 不要用 daily report 或 daily archive 嘗試還原。
- 不要在正式營業中途測試 restore。
- 若未來接 Firestore，restore 必須重新設計權限、衝突與 transaction policy。

## Format Differences

| Format | exportType | Restore | Scope | Writes dailyClosings | Main purpose |
|---|---|---:|---|---:|---|
| Full Backup | `full` | Yes | Complete local state collections | No, only includes existing snapshots | Disaster recovery, transfer, pre-release backup |
| Daily Report | `daily` | No | One date paid orders + products snapshot | No | Daily report export |
| Daily Archive | `daily-archive` | No | One date paid orders + products snapshot + one dailyClosing | Yes, when created by closing flow | End-of-day archive |

## Original Data vs Derived Data

Original / record data:

- `orders`
- `products`
- `businessEvents`
- `inventoryLots`
- `dailyClosings` as snapshot records
- `inventoryItems` / `inventoryMovements` as legacy compatibility data

Derived data:

- `dailySummary`
- `productSalesSummary`
- Analytics summary
- dailyClosing totals, which should remain auditable from paid orders

Operational cache:

- `inventoryLots.remainingQuantity`
- `inventoryItems.currentStock` legacy cache, not v2 truth source

## Compatibility Summary

- 舊 full backup 沒有 `businessEvents` 時補 `[]`。
- 舊 full backup 沒有 `inventoryLots` 時補 `[]`。
- 舊 full backup 沒有 `dailyClosings` 時補 `[]`。
- 舊 full backup 沒有 `inventoryItems` / `inventoryMovements` 時補 `[]`。
- 舊 orders 沒有 `customerSource` 時補 `not_asked`。
- 舊 orders 沒有 `customerSourceNote` 時補 `""`。
- 舊 business event 沒有 `itemSource` 時補 `manual`。
- 舊 inventory lot 沒有新欄位時由 `normalizeInventoryLots` 補預設值。

## Known Risks

- Restore 缺少嚴格 `schemaVersion` / `app` gate。
- Restore 前沒有自動建立 rollback backup。
- Backup 中的 `seats` 目前不會完整覆蓋程式內 `defaultSeats`。
- Daily archive 不含 Business Events 明細；目前只封存 paid orders、productsSnapshot 與 dailyClosing。
- Firestore adapter 尚未接 production sync，backup / restore 仍是 localStorage 邊界。
