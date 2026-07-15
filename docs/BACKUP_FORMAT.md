# Backup Format

本文件描述目前 YUTU POS 的 JSON 匯出格式與用途。格式以目前程式實作為準。

## 匯出類型總覽

目前保留三種匯出：

- `full`：完整備份，可用於還原。
- `daily`：每日報表，用於查看指定日期營業資料；目前不支援還原。
- `daily-archive`：每日營業封存檔，用於打烊後保存當日 paid orders、商品快照與日結快照；目前不支援還原。

## Full Backup

用途：完整備份 localStorage 中的 POS 資料，支援 restore。

檔名：

```text
yutu-pos-backup-yyyy-mm-dd-hhmm.json
```

格式：

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
  "inventoryItems": [],
  "inventoryMovements": [],
  "settings": {
    "selectedSeatId": "",
    "selectedCategoryId": "",
    "selectedOrderId": null,
    "orderDetailMode": "active",
    "orderViewMode": "production",
    "activeView": "floor",
    "historyDate": "yyyy-mm-dd",
    "analyticsRange": "today",
    "analyticsStartDate": "yyyy-mm-dd",
    "analyticsEndDate": "yyyy-mm-dd",
    "analyticsSort": "quantity",
    "salesSort": "amount"
  }
}
```

### Restore 行為

restore 目前只接受 `exportType: "full"`，或舊格式中可被辨識為 state 的資料。

full backup restore 會還原：

- `orders`
- `products`
- `menuItems`
- `seats`
- `dailyClosings`
- `inventoryItems`
- `inventoryMovements`
- `settings`

舊 full backup 若沒有 `dailyClosings`、`inventoryItems`、`inventoryMovements`，會補成空陣列。
舊 orders 若沒有 `customerSource` / `customerSourceNote`，normalize 會補 `not_asked` 與空字串。
full backup 中的 orders 會包含 `customerSource` 與 `customerSourceNote`。

注意：目前 normalize 後 `seats` 仍會使用程式內的 `defaultSeats`。因此 full backup 裡的 `seats` 會被讀入流程，但實際座位資料是否完全保留，仍受目前 normalize 規則影響。

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
  "dailySummary": {
    "revenue": 0,
    "cost": 0,
    "profit": 0,
    "drinks": 0,
    "desserts": 0,
    "retail": 0,
    "orderCount": 0,
    "averageTicket": 0
  },
  "productSalesSummary": [],
  "orders": [],
  "productsSnapshot": []
}
```

資料來源：

- `orders` 只包含該日期的 paid orders。
- `orders` 會保留 `customerSource` 與 `customerSourceNote`。
- `dailySummary` 由該批 paid orders 即時計算。
- `productSalesSummary` 由該日期 paid orders 的 items 彙總。
- `productsSnapshot` 是匯出當下的 `state.products`。

Daily report 目前不建立 `dailyClosing`，也不寫入 `dailyClosings`。

## Daily Archive

用途：每天營業結束後下載完整的當日營業封存檔，並同時在 state 中新增一筆日結快照。

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
  "dailySummary": {
    "revenue": 0,
    "cost": 0,
    "profit": 0,
    "drinks": 0,
    "desserts": 0,
    "retail": 0,
    "orderCount": 0,
    "averageTicket": 0
  },
  "productSalesSummary": [],
  "orders": [],
  "productsSnapshot": [],
  "dailyClosing": {
    "id": "",
    "date": "yyyy-mm-dd",
    "closedAt": "ISO datetime",
    "version": 1,
    "status": "official",
    "isOfficial": true,
    "supersededBy": null,
    "supersededAt": null,
    "orderCount": 0,
    "totalSales": 0,
    "totalCost": 0,
    "grossProfit": 0,
    "grossMargin": 0,
    "drinkCount": 0,
    "dessertCount": 0,
    "retailCount": 0,
    "exported": true,
    "exportedAt": "ISO datetime",
    "note": ""
  }
}
```

資料來源：

- `orders` 只包含當日 paid orders。
- `orders` 會保留 `customerSource` 與 `customerSourceNote`。
- `dailySummary` 可由 `orders` 重新計算。
- `dailyClosing` 是日結當下的統計快照。
- `dailyClosing` 同日期可有多個版本，但系統只允許一筆 `isOfficial: true`。
- 若重新日結，新 archive 內的 `dailyClosing` 會是新的 official 版本。
- `productsSnapshot` 是匯出當下的商品資料快照。

Daily archive 目前不支援 restore。

## 三種格式差異

| 格式 | exportType | 是否可還原 | 是否寫入 dailyClosings | 主要用途 |
| --- | --- | --- | --- | --- |
| 完整備份 | `full` | 是 | 否，僅包含既有 `dailyClosings` | 災難復原、換裝置、正式上線前備份 |
| 每日報表 | `daily` | 否 | 否 | 查看或保存某日報表 |
| 每日封存 | `daily-archive` | 否 | 是，執行日結時新增一筆快照 | 打烊封存當日營業資料 |

## 原始資料與可重算資料

### 原始資料

- `orders`
- `products`
- `seats`
- `dailyClosings`
- `inventoryItems`
- `inventoryMovements`

### 可重算統計資料

- `dailySummary`
- `productSalesSummary`
- `dailyClosing.orderCount`
- `dailyClosing.version`
- `dailyClosing.status`
- `dailyClosing.isOfficial`
- `dailyClosing.supersededBy`
- `dailyClosing.supersededAt`
- `dailyClosing.totalSales`
- `dailyClosing.totalCost`
- `dailyClosing.grossProfit`
- `dailyClosing.grossMargin`
- `dailyClosing.drinkCount`
- `dailyClosing.dessertCount`
- `dailyClosing.retailCount`

日結快照保存的是當下結果，但不應取代原始 orders。若日後 paid orders 被編輯、撤銷或刪除，重新計算結果可能與既有 dailyClosing 快照不同。

## 自我檢查結果

- 同一天重複日結：會新增多筆 `dailyClosing`，不阻擋、不覆蓋，但同一天只會有一筆 `isOfficial: true`。
- 重新日結版本規則：新 closing 的 `version` 為當日 closing 數量 + 1；同日舊 official 會改為 `status: "superseded"` 並指向新 closing。
- dailyClosing 對 orders 的影響：只新增快照到 `dailyClosings`，不修改 orders。
- daily-archive 的 orders 範圍：使用 `paidOrdersForDate(date)`，只包含該日期 paid orders。
- dailySummary 重算性：由同一批 paid orders 透過 `summarizeOrders` 計算，可由 orders 重新計算。
- full backup restore：會帶入 `dailyClosings`、`inventoryItems`、`inventoryMovements`；舊備份缺欄位時會補空陣列，舊 `dailyClosings` 也會補 version / official 狀態。
- daily report / daily-archive 區分：daily report 不寫入日結快照；daily archive 是打烊封存並建立日結快照。
## Phase 3B Business Events Backup

full backup 會包含：

```js
{
  businessEvents: []
}
```

相容規則：

- 舊 full backup 若沒有 `businessEvents`，restore / normalize 會補空陣列。
- `businessEvents` 是長期營運事件資料，不存入 `orders`。
- 目前 daily report / daily-archive 仍以 paid orders 與日結摘要為主，不把所有 business event 明細複製進 dailyClosing。
- Business Events 目前支援 `purchase`、`waste`、`personal`、`test`、`complimentary` 的手動紀錄。
- Phase 4A 已新增 `inventoryLots` 批次管理 UI；`production`、`roasting`、`stock_adjustment` 尚未有 UI。

Phase 3C 欄位相容：

- full backup 會自然保存 `itemSource`、`productId`、`materialId`、`itemCategory`、`unitCost`。
- 舊 business event 沒有 `itemSource` 時，restore / normalize 會補 `manual`。
- 舊 event 沒有 `unitCost` 時，若 `quantity > 0` 會用 `costAmount / quantity` 推回；原本 `costAmount` 不會被覆寫。
- `materialId` 目前只是預留欄位，沒有 material CRUD 或 inventoryLots 邏輯。

## Phase 4A Inventory Lots Backup

full backup 會包含：

```js
{
  inventoryLots: []
}
```

相容規則：

- 舊 full backup 若沒有 `inventoryLots`，restore / normalize 會補空陣列。
- `inventoryLots` 目前只保存甜點 / 熟豆批次。
- Phase 4A 不會從 orders、POS 銷售或 Business Events 自動扣 `remainingQuantity`。
- 封存批次使用 `status: "archived"`，不直接刪除批次資料。
