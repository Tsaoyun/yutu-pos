# Database Schema

本文件整理目前資料模型與 YUTU POS v2 建議 schema。現況以 localStorage JSON 為準；Firestore collection 是未來建議，不代表目前已接入線上同步。

## 儲存層

目前正式資料來源：

```text
localStorage["yutu-pos-state-v1"]
```

目前 full backup 是 localStorage state 的 JSON snapshot。

未來 Firestore 建議 root：

```text
stores/{storeId}
```

長期 collections：

```text
stores/{storeId}/products/{productId}
stores/{storeId}/orders/{orderId}
stores/{storeId}/dailyClosings/{closingId}
stores/{storeId}/businessEvents/{eventId}
stores/{storeId}/inventoryLots/{lotId}
stores/{storeId}/settings/{settingId}
```

可保留但非優先：

```text
stores/{storeId}/seats/{seatId}
stores/{storeId}/inventoryItems/{itemId}
stores/{storeId}/inventoryMovements/{movementId}
```

`docs/firestore-schema.md` 目前可視為 legacy draft，尚未完整支援 v2 的 `businessEvents`、`inventoryLots`、dailyClosing 版本規則與 customer source。v2 Phase 1 應先更新本文件，後續再同步更新 `docs/firestore-schema.md`。

## State Schema

目前 state：

```js
{
  seats,
  products,
  menuItems,
  orders,
  dailyClosings,
  inventoryItems,
  inventoryMovements,
  selectedSeatId,
  selectedCategoryId,
  selectedOrderId,
  orderDetailMode,
  orderViewMode,
  activeView,
  historyDate,
  analyticsRange,
  analyticsStartDate,
  analyticsEndDate,
  analyticsSort,
  salesSort,
  notice,
  debug
}
```

v2 建議新增：

```js
{
  businessEvents: [],
  inventoryLots: []
}
```

Migration / normalize policy：

- 舊 orders 沒有 `customerSource` 時，補 `not_asked`。
- 舊 orders 沒有 `customerSourceNote` 時，補空字串。
- 舊 state 或 full backup 沒有 `businessEvents` 時，補空陣列。
- 舊 state 或 full backup 沒有 `inventoryLots` 時，補空陣列。
- legacy `inventoryItems` / `inventoryMovements` 保留，但 v2 不以它們作為主要真相來源。

## Product

目前已實作：

```js
{
  id,
  name,
  category,
  type,
  price,
  cost,
  requiresTemperature,
  requiresServiceType,
  active,
  sort,
  note,
  variants,
  options
}
```

說明：

- `price`：售價。
- `cost`：單位成本，用於 orderItem 成本快照與毛利計算。
- `active`：停售 / 恢復。
- `variants`：口味 / 規格。
- `options`：目前僅保留 forward-compatible slot，尚未有 UI。

## Order

目前已實作：

```js
{
  id,
  createdAt,
  seatId,
  people,
  items,
  activityLog,
  status,
  paymentMethod,
  checkedOutAt
}
```

v2 建議新增：

```js
{
  customerSource: "not_asked",
  customerSourceNote: ""
}
```

`customerSource` 固定值：

```text
google_maps
instagram
threads
walk_in
friend_referral
xiaohongshu
returning_customer
other
not_asked
```

關聯：

- `orders.items[].productId` 指向 `products.id`，但 orderItem 保存商品快照。
- `customerSource` 屬於 order 層級，每筆訂單只記一個主要來源。

## OrderItem

目前已實作：

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

v2 可選擇新增：

```js
{
  usageType: "sale"
}
```

但第一階段不建議改動 orderItem 流程；銷售用途可由 paid orders 推定為 `sale`，非銷售用途先放在 `businessEvents`。

## DailyClosing

目前已實作：

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

v2 建議新增摘要欄位：

```js
{
  wasteCost,
  personalCost,
  testCost,
  complimentaryCost,
  purchaseAmount,
  productionCount,
  roastingOutput,
  customerSourceSummary
}
```

規則：

- 同一天可有多筆 closing。
- 同一天只允許一筆 `isOfficial: true`。
- 日結只保存摘要，不複製所有明細。
- 明細仍由 `orders`、`businessEvents`、`inventoryLots` 查詢。
- dailyClosing 摘要可由 `orders + businessEvents` 重算或稽核。

## BusinessEvent

目前未實作，v2 建議新增。

```js
{
  id,
  date,
  type,
  usageType,
  itemId,
  productId,
  itemName,
  quantity,
  unit,
  amount,
  costAmount,
  vendor,
  sourceLotId,
  targetLotId,
  note,
  createdAt,
  updatedAt
}
```

`type` 固定值：

```text
purchase
production
roasting
waste
personal
test
complimentary
stock_adjustment
```

`usageType` 固定值：

```text
sale
waste
personal
test
complimentary
other
```

`usageType` 規則：

- `waste`、`personal`、`test`、`complimentary` 事件必填。
- `purchase`、`production`、`roasting`、`stock_adjustment` 可為 `null` 或空值。
- 不強制用 `other` 代表非使用型事件，避免 analytics 混淆。
- `other` 只用於真正無法分類的使用情境。

金額欄位：

- `amount`：交易或採購金額，例如銷售收入、採購付款金額。
- `costAmount`：成本影響金額，例如報廢、自用、測試、招待所消耗的成本。
- 採購事件中 `amount` 與 `costAmount` 可以相同，或依後續採購規則拆分付款金額與入庫成本。
- 報廢、自用、測試、招待通常不產生收入，只記 `costAmount`。

說明：

- `purchase` 記錄採購金額，通常有 `vendor`。
- `production` 記錄甜點製作，例如巴斯克 +8 片。
- `roasting` 記錄烘豆轉換，例如生豆 1000g -> 熟豆 850g。
- `waste`、`personal`、`test`、`complimentary` 記錄非銷售消耗。
- `stock_adjustment` 記錄盤點修正。

## InventoryLot

目前未實作，v2 建議新增，優先用於甜點與熟豆。

```js
{
  lotId,
  itemId,
  itemName,
  sourceEventId,
  madeDate,
  roastDate,
  purchaseDate,
  expireDate,
  initialQuantity,
  remainingQuantity,
  unit,
  costAmount,
  note,
  active,
  createdAt,
  updatedAt
}
```

關聯：

- `sourceEventId` 指向建立批次的 `businessEvents.id`。
- `businessEvents.sourceLotId` 可指向被消耗的 lot。
- `businessEvents.targetLotId` 可指向產生的 lot。

## InventoryItem

目前已預留：

```js
{
  id,
  name,
  category,
  unit,
  currentStock,
  alertStock,
  active
}
```

v2 建議：

- 若導入 `inventoryLots`，`currentStock` 可視為快取。
- `inventoryItems.currentStock` 不作為唯一真相來源。
- 第一階段甜點與熟豆庫存以 `inventoryLots.remainingQuantity` 作為營運快取。
- 必要時應可由 source event + consumption events 重算或稽核。

## Analytics Truth Source

v2 analytics 的主要真相來源是：

```text
orders + businessEvents
```

用途：

- `orders`：銷售收入、銷售成本、客源、品項銷售。
- `businessEvents`：採購、報廢、自用、測試、招待、生產、烘豆、盤點修正。
- `inventoryLots`：甜點與熟豆批次庫存的營運快取與稽核輔助。
- `dailyClosings`：日結摘要快照。
- `inventoryItems` / `inventoryMovements`：legacy 相容層或過渡期資料。

## JSON Schema: YUTU_MASTER_DATABASE

未來完整資料庫匯出建議：

```json
{
  "schemaVersion": 2,
  "app": "YUTU_POS",
  "exportType": "master",
  "exportedAt": "ISO datetime",
  "products": [],
  "orders": [],
  "orderItems": [],
  "dailyClosings": [],
  "businessEvents": [],
  "inventoryLots": [],
  "inventoryItems": [],
  "inventoryMovements": [],
  "settings": {}
}
```

`orderItems` 可由 `orders[].items` 展開產生，目的是方便外部分析；原始資料仍保留在 `orders`。

v2 主資料來源是 `businessEvents` / `inventoryLots`。`inventoryItems` / `inventoryMovements` 保留在 master export 中，屬於 legacy 相容層或過渡期資料，不應被視為 v2 庫存唯一真相來源。
