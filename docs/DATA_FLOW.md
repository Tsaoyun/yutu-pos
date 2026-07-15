# Data Flow

本文件描述 YUTU POS v2 的營運資料流。現有 POS 已實作銷售、結帳、日報與備份；採購、生產、烘豆、報廢、自用、招待、盤點目前尚未實作，以下為基於現有架構的建議流程。

## 共通原則

- 長期資料存在長期 array / collection，不每天開新表。
- 所有流程用 `date` 篩選。
- 銷售原始資料是 `orders`。
- 非銷售營運原始資料是 `businessEvents`。
- 甜點與熟豆批次資料是 `inventoryLots`。
- 日結只存摘要，不複製所有明細。
- 報廢、自用、測試、招待都是 usage type，不是特殊例外。
- `purchase`、`production`、`roasting`、`stock_adjustment` 可不填 usageType；不要用 `other` 代表這些非使用型事件。
- `other` 只用於真正無法分類的使用情境。
- `amount` 表示交易或採購金額；`costAmount` 表示成本影響金額。
- Analytics 主要真相來源是 `orders + businessEvents`。
- `inventoryLots.remainingQuantity` 是營運快取，可用於現場庫存檢視，但應可由事件稽核。
- `inventoryItems.currentStock` 不作為唯一真相來源。

## 採購 Purchase

目前狀態：未實作。v2 建議放在 `businessEvents`。

新增資料：

```js
businessEvents.push({
  type: "purchase",
  usageType: null,
  date,
  itemId,
  itemName,
  quantity,
  unit,
  amount, // 採購付款金額
  costAmount, // 可與 amount 相同，或依後續規則代表入庫成本
  vendor,
  note,
  createdAt,
  updatedAt
})
```

可能修改資料：

- 若採購品項需要建立批次，例如熟豆或可追蹤甜點原料，可建立 `inventoryLots`。
- 原料類如牛奶、蛋、麵粉第一階段可只記事件，不做每杯扣料。

分析影響：

- 增加 `purchaseAmount`。
- 可依 vendor、item、date 統計採購成本。

## 生產 Production

目前狀態：未實作。

例子：做一顆巴斯克，切 8 片。

新增資料：

```js
businessEvents.push({
  type: "production",
  usageType: null,
  date,
  itemId,
  itemName: "巴斯克",
  quantity: 8,
  unit: "slice",
  costAmount,
  note,
  createdAt,
  updatedAt
})
```

建立批次：

```js
inventoryLots.push({
  lotId,
  itemId,
  itemName: "巴斯克",
  sourceEventId,
  madeDate: date,
  expireDate,
  initialQuantity: 8,
  remainingQuantity: 8,
  unit: "slice",
  costAmount,
  note
})
```

分析影響：

- 增加 `productionCount`。
- 產生甜點批次庫存。

## 烘豆 Roasting

目前狀態：未實作。

例子：生豆 1000g -> 熟豆 850g。

新增資料：

```js
businessEvents.push({
  type: "roasting",
  usageType: null,
  date,
  itemId,
  itemName: "Sidra 熟豆",
  quantity: 850,
  unit: "g",
  costAmount,
  note: "生豆 1000g -> 熟豆 850g",
  createdAt,
  updatedAt
})
```

建立熟豆批次：

```js
inventoryLots.push({
  lotId,
  itemId,
  itemName: "Sidra 熟豆",
  sourceEventId,
  roastDate: date,
  initialQuantity: 850,
  remainingQuantity: 850,
  unit: "g",
  costAmount,
  note
})
```

分析影響：

- 增加 `roastingOutput`。
- 熟豆剩餘克數可由 lots 觀察。

## 銷售 Sale

目前狀態：已實作，來源是 paid orders。

新增資料：

- 建立 order。
- 加入 order items。
- 結帳後 order 改為 `status: "paid"`。

目前會修改：

- `orders`
- order item 的 quantity、temperature、serviceType、served 等

v2 建議：

- order 新增 `customerSource`、`customerSourceNote`。
- 銷售用途可由 paid order 推定為 `usageType: "sale"`，不一定要另外建立 businessEvent。
- 若未來要扣甜點 / 熟豆 lot，可在結帳或出品後產生消耗事件；第一階段不建議自動扣所有原料。

分析影響：

- 產生營收。
- 產生銷售成本。
- 客源來源統計依 order 層級彙總。

## 報廢 Waste

目前狀態：未實作。

新增資料：

```js
businessEvents.push({
  type: "waste",
  usageType: "waste",
  date,
  itemId,
  productId,
  itemName,
  quantity,
  unit,
  costAmount,
  sourceLotId,
  note,
  createdAt,
  updatedAt
})
```

可能修改：

- 若指定 lot，減少 `inventoryLots.remainingQuantity`。
- `remainingQuantity` 是第一階段甜點與熟豆庫存的營運快取，必要時應可由 source event + consumption events 重算或稽核。

分析影響：

- 增加 `wasteCost`。
- 不增加營收。
- 影響實際毛利。

## 自用 Personal

目前狀態：未實作。

流程同報廢，但：

```js
type: "personal"
usageType: "personal"
```

分析影響：

- 增加 `personalCost`。
- 不增加營收。

## 測試 Test

目前狀態：未實作。

流程同報廢，但：

```js
type: "test"
usageType: "test"
```

分析影響：

- 增加 `testCost`。
- 可用來分離研發 / 測試消耗。

## 招待 Complimentary

目前狀態：未實作。

流程同報廢，但：

```js
type: "complimentary"
usageType: "complimentary"
```

分析影響：

- 增加 `complimentaryCost`。
- 不增加營收。
- 未來可分析招待成本。

## 盤點修正 Stock Adjustment

目前狀態：未實作。

新增資料：

```js
businessEvents.push({
  type: "stock_adjustment",
  usageType: null,
  date,
  itemId,
  itemName,
  quantity,
  unit,
  sourceLotId,
  note,
  createdAt,
  updatedAt
})
```

可能修改：

- 直接調整指定 `inventoryLots.remainingQuantity`。
- 或只記錄 adjustment event，由 summary 計算庫存差異。第一階段建議若有 lot 就更新 lot 快取，並保留 event 作為稽核。
- 不使用 `other` 代表盤點修正；`other` 只保留給無法分類的使用情境。

## Inventory Summary

目前狀態：未實作。

建議計算方式：

- 甜點剩餘片數：同 item active lots 的 `remainingQuantity` 加總。
- 熟豆剩餘克數：同 item active lots 的 `remainingQuantity` 加總。
- 快過期批次：`expireDate` 接近今天且 `remainingQuantity > 0`。
- 報廢 / 自用 / 測試 / 招待消耗：依 `businessEvents.type` 與 `costAmount` 彙總。
- `inventoryItems.currentStock` 不作為唯一真相來源；若保留，僅作 legacy 相容或快取。

## Daily Closing Flow

目前已實作 daily closing 快照與 official / superseded 版本規則。

v2 建議日結摘要加入：

- `wasteCost`
- `personalCost`
- `testCost`
- `complimentaryCost`
- `purchaseAmount`
- `productionCount`
- `roastingOutput`
- `customerSourceSummary`

日結不應複製 businessEvents 明細，只保存摘要與 version 狀態。
