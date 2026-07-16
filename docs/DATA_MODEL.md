# Data Model

本文件描述目前 YUTU POS 存在 localStorage 的主要資料模型。內容以目前程式實作為準；`dailyClosings` 與庫存資料是資料穩定化後新增的模型。

## Storage

主要資料存在瀏覽器 `localStorage`：

```text
yutu-pos-state-v1
```

App 啟動時會讀取整包 state，經過 normalize 後再使用。舊資料沒有新欄位時，會補成預設值。

## State 欄位

目前 state 主要欄位：

```js
{
  seats,
  products,
  menuItems,
  orders,
  dailyClosings,
  businessEvents,
  inventoryLots,
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

### 原始營業資料

- `orders`：訂單原始資料，是營收、商品銷售、出品狀態、歷史紀錄的主要來源。
- `products`：目前商品資料，包含售價、成本、分類、停售狀態、口味 / 規格。
- `seats`：座位資料；目前 normalize 後固定使用 `defaultSeats`。
- `dailyClosings`：日結快照，保存某次日結當下的統計結果。
- `inventoryLots`：Phase 4A 甜點 / 熟豆批次資料。只建立與查看批次，不和 POS 銷售或 Business Events 消耗連動。
- `inventoryItems`：庫存品項資料模型，目前只預留。
- `inventoryMovements`：庫存異動資料模型，目前只預留。

### UI / 查詢狀態

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
- `notice`
- `debug`

這些主要用於畫面狀態、篩選條件或除錯，不是營業原始資料。

## Order

新訂單由 `createOrder` 建立，資料結構：

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
  checkedOutAt,
  customerSource,
  customerSourceNote
}
```

欄位說明：

- `id`：訂單 ID，格式類似 `YT-yyyymmdd-xxxxx`。
- `createdAt`：訂單建立時間，ISO string。
- `seatId`：座位 ID；外帶固定為 `takeout`。
- `people`：人數。外帶目前固定為 1。
- `items`：orderItem 陣列。
- `activityLog`：操作紀錄，目前包含 checkout / undoCheckout。
- `status`：`open` 或 `paid`。
- `paymentMethod`：目前只使用 `cash`；未結帳為 `null`。
- `checkedOutAt`：結帳時間；未結帳為 `null`。
- `customerSource`：客源來源，預設 `not_asked`。
- `customerSourceNote`：客源補充備註，預設空字串。

舊資料 normalize 規則：

- 沒有 `customerSource` 的 order 會補 `not_asked`。
- 沒有 `customerSourceNote` 的 order 會補空字串。

可能存在的相容欄位：

- `lastCheckedOutAt`：編輯已結帳訂單時，曾用來暫存原結帳時間。

## OrderItem

品項由 `addOrderItem` 加入訂單，資料結構：

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

欄位說明：

- `lineId`：訂單品項行 ID。
- `productId`：來源商品 ID。
- `name`：加入訂單當下的商品名稱快照。
- `variantName`：口味 / 規格。
- `category`：商品分類。
- `type`：`drink`、`dessert` 或 `retail`。
- `quantity`：數量。
- `requiresTemperature`：是否需要冰熱。
- `requiresServiceType`：是否需要內用 / 外帶。
- `temperature`：熱 / 冰；不需要冰熱時可為空字串。
- `serviceType`：內用 / 外帶；retail 可為空字串。
- `basePrice`：原始售價。
- `effectivePrice`：實際單價，包含冰飲加價。
- `iceExtra`：冰飲加價，目前手沖冰飲加 10。
- `price`：目前等於 `effectivePrice`，保留相容用。
- `cost`：單品成本快照。
- `profit`：單品利潤快照。
- `served`：是否已出品。
- `note`：品項備註欄位；目前資料欄位存在，但尚未看到點餐 UI 寫入。

## BusinessEvents

Phase 3A 已建立 `businessEvents` 的 service / data model foundation：

- `src/services/businessEvents.js` 提供 `BUSINESS_EVENT_TYPES`、`USAGE_TYPES`、`createBusinessEvent`、`normalizeBusinessEvents`、`summarizeBusinessEvents`。
- `state.businessEvents` 目前預設為空陣列。
- 舊 localStorage / 舊 full backup 若沒有 `businessEvents`，normalize 會補空陣列。
- full backup 會保留 `businessEvents`。
- Phase 3B 起已有 Business Events 最小 UI；不會由點餐、付款、日結流程自動新增事件。
- Phase 3B analytics 已接入 `businessEventSummary`，Dashboard 顯示最小營運事件摘要。

Phase 3B 已新增最小可用紀錄：

- UI 位置：`營運事件` 頁。
- 已支援建立 `purchase`、`waste`、`personal`、`test`、`complimentary`。
- 尚未支援 `production`、`roasting`、`stock_adjustment` 的 UI。
- Phase 4A 已新增 `inventoryLots` 批次管理 UI；目前仍沒有完整庫存扣減。
- `waste`、`personal`、`test`、`complimentary` 的 `usageType` 會與 `type` 對應。
- `purchase` 的 `usageType` 可為 `null`，不會自動轉成 `other`。
- Business Events 不會寫入 `orders`，也不會改變付款、日結、Customer Source 流程。

Phase 3C 已新增品項來源語意：

- `itemSource` 可為 `product`、`manual`；`material` 已保留資料模型但尚未提供 UI。
- 選 POS 商品時會帶入 `productId`、`itemName`、`itemCategory`、`unitCost`。
- 手動輸入時可填 `itemName`、`itemCategory`、`unit`、`unitCost`。
- `costAmount` 若未手動填寫，新增 / 編輯時會以 `quantity * unitCost` 計算。
- 舊事件若沒有 `itemSource`，normalize 會補 `manual`，並保留原本 `costAmount`。

基本資料結構：

```js
{
  id,
  date,
  type,
  usageType,
  itemId,
  itemSource,
  productId,
  materialId,
  itemName,
  itemCategory,
  quantity,
  unit,
  unitCost,
  amount,
  costAmount,
  vendor,
  note,
  createdAt,
  updatedAt
}
```

## InventoryLots

Phase 4A 已建立 `inventoryLots` foundation：

- UI 位置：`批次管理` 頁。
- 第一版只支援甜點批次與熟豆批次。
- 可新增批次、查看批次列表、將批次封存為 `archived`。
- 不做刪除。
- 不會自動扣 POS 銷售。
- 不會接 Business Events 消耗。
- 不做 Material CRUD，不做每杯原料扣料。

資料結構：

```js
{
  lotId,
  itemSource,
  productId,
  materialId,
  itemName,
  itemCategory,
  lotType,
  sourceEventId,
  madeDate,
  roastDate,
  purchaseDate,
  expireDate,
  initialQuantity,
  remainingQuantity,
  unit,
  unitCost,
  costAmount,
  status,
  note,
  createdAt,
  updatedAt
}
```

規則：

- `lotType` 目前為 `dessert` 或 `roasted_beans`。
- `remainingQuantity` Phase 4A 只在建立批次時等於 `initialQuantity`，尚未被 Business Events 或 POS 銷售改動。
- `status` 目前支援 `active` 與 `archived`。
- `itemSource: "material"` 僅保留資料模型，UI 尚未開放。
- full backup / restore 會保存並 normalize `inventoryLots`。

## Products / MenuItems

`src/data/menu.js` 的 `menuItems` 是預設商品種子資料。實際運行後，商品資料存在 state 的 `products`。

為了相容舊資料，normalize 會：

- 優先使用 `savedState.products`
- 若沒有 `products`，改用 `savedState.menuItems`
- 最後把 `products` 同步放回 `menuItems`

商品主要欄位：

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

## DailyClosings

`dailyClosings` 是日結快照陣列。每次執行「結束營業 / 匯出今日報表」時，會新增一筆快照。

資料結構：

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

重要規則：

- `dailyClosings` 是快照，不取代 `orders`。
- 所有統計仍應可由該日期的 paid orders 重新計算。
- 同一天重複日結時，會新增多筆快照，不會覆蓋舊快照。
- 同一天只允許一筆 `isOfficial: true` 的正式日結。
- 新日結的 `version` 為當日既有日結數量 + 1。
- 新日結會設為 `status: "official"`、`isOfficial: true`。
- 同日期舊 official 會改為 `status: "superseded"`、`isOfficial: false`，並以 `supersededBy` 指向新日結 ID、`supersededAt` 記錄更新時間。
- 未來若 Dashboard 或正式統計使用 `dailyClosings`，預設應只使用 `isOfficial: true` 的版本。
- 快照不會修改任何 order。

舊資料 normalize 規則：

- 沒有 `version` 的 dailyClosing，會依同日期的 `closedAt` / `exportedAt` 排序補上版本。
- 若同一天沒有 official，會將最新一筆設為 official。
- 若同一天有多筆 official，只保留最新一筆 official，其餘改為 superseded。

## InventoryItems

`inventoryItems` 是預留庫存品項模型，目前沒有 UI，也不參與扣庫存。

資料結構：

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

欄位用途：

- `id`：庫存品項 ID。
- `name`：品項名稱。
- `category`：庫存分類。
- `unit`：單位，例如 g、包、瓶。實際單位規則待確認。
- `currentStock`：目前庫存量。
- `alertStock`：警示庫存量。
- `active`：是否啟用。

## InventoryMovements

`inventoryMovements` 是預留庫存異動模型，目前沒有 UI，也不會由銷售自動產生。

資料結構：

```js
{
  id,
  itemId,
  type,
  quantity,
  createdAt,
  note
}
```

目前保留的 movement type：

- `purchase`
- `adjustment`
- `sale`
- `waste`
- `self_use`

若匯入資料的 type 不在清單內，normalize 會改為 `adjustment`。

## 可重算統計資料

以下資料不是主要原始資料，應可由 `orders` 重新計算：

- 每日營收
- 每日成本
- 每日毛利
- 毛利率
- 訂單數
- 飲品數
- 甜點數
- retail 數
- 商品銷售摘要
- Dashboard 商品排行
- 類別分析
- 冰熱分析
- 座位分析
- 時段分析

`dailyClosings` 會保存其中一份快照，但不是唯一可信來源。需要查帳時，仍應以 paid orders 重算並比對快照。
