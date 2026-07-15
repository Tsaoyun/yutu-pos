# Data Dictionary

本文件定義 YUTU POS v2 的資料語意。目標是讓後續資料模型、analytics、JSON export 與 Firestore schema 使用同一組命名與規則，避免系統逐步擴充後變成小型 ERP 或出現多個真相來源。

## businessEvent.type

Phase 3A 狀態：enum 與 normalize / create / summary helper 已放在 `src/services/businessEvents.js`。目前尚未實作 Business Events UI，也尚未由 POS 流程自動建立事件。

Phase 3B 狀態：已新增最小版 `營運紀錄` UI，可手動建立 `purchase`、`waste`、`personal`、`test`、`complimentary`。Phase 4A 已新增 `資源管理` UI，第一版管理 `inventoryLots` 甜點與熟豆批次；`production`、`roasting`、`stock_adjustment` UI 尚未實作。

Phase 3C 狀態：Business Events 已支援 `itemSource` 語意。可選 POS 商品自動帶入商品名稱、類別與成本；也可保留 manual 手動輸入。`material` 欄位已預留，但尚未實作 material CRUD 或 UI。

`businessEvent.type` 描述營運事件本身發生了什麼。

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

定義：

- `purchase`：採購事件，例如買熟豆、生豆、牛奶、甜點材料。
- `production`：生產事件，例如製作一顆蛋糕並切成 8 片。
- `roasting`：烘豆事件，例如生豆 1000g 轉成熟豆 850g。
- `waste`：報廢事件，例如過期甜點、失敗出品。
- `personal`：自用事件，例如店主自用飲品或甜點。
- `test`：測試事件，例如研發、試喝、試做。
- `complimentary`：招待事件，例如請客、補償客人。
- `stock_adjustment`：盤點修正，例如實際盤點與系統快取不同。

## usageType

`usageType` 描述品項或庫存被用掉的用途。它不是每一種 business event 都必填。

```text
sale
waste
personal
test
complimentary
other
```

規則：

- `sale`：銷售用途。現階段由 paid orders 推定，不一定要另外建立 businessEvent。
- `waste`：報廢用途，business event 必填。
- `personal`：自用用途，business event 必填。
- `test`：測試用途，business event 必填。
- `complimentary`：招待用途，business event 必填。
- `other`：真正無法分類的使用情境才使用。
- `purchase`、`production`、`roasting`、`stock_adjustment` 可為 `null` 或空值。
- 不強制用 `other` 代表非使用型事件，避免 analytics 混淆。

### usageType Phase 3B 規則

- `waste` / `personal` / `test` / `complimentary` 的 `usageType` 必須與 `type` 對應。
- `purchase` 的 `usageType` 可為 `null`。
- `null` 不會自動轉成 `other`。
- `other` 只保留給真正無法分類的使用情境，目前營運紀錄表單不提供 `other` 選項。

## customerSource

Phase 3A 狀態：選項、label、normalize、是否顯示 note、基礎 summary helper 已集中在 `src/services/customerSource.js`。

`customerSource` 屬於 order 層級。每筆訂單只記一個主要來源。目前 Phase 2 已在訂單面板提供快速選項，預設不阻擋結帳。

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

規則：

- 預設值為 `not_asked`。
- 不強制填寫，避免影響快速結帳。
- `customerSourceNote` 可用於 `other` 或 `friend_referral` 的補充，例如「海大學生介紹」。
- `customerSourceNote` 不列入主要統計，只作為明細備註與匯出資料。
- Analytics 目前會依 `customerSource` 統計訂單數、營收與平均客單價；`customerSourceNote` 不納入主要分類。

## amount / costAmount

`amount` 與 `costAmount` 不應混用。

- `amount`：交易或採購金額，例如銷售收入、採購付款金額。
- `costAmount`：成本影響金額，例如報廢、自用、測試、招待所消耗的成本。

事件規則：

- 銷售收入以 paid orders 的 order item price 計算，不一定寫入 businessEvents。
- 採購事件中 `amount` 與 `costAmount` 可以相同，或依後續採購規則拆分付款金額與入庫成本。
- 報廢、自用、測試、招待通常不產生收入，只記 `costAmount`。
- 生產與烘豆可記 `costAmount`，用於建立 lot 成本。

## itemId / productId

`itemId` 與 `productId` 用途不同。

- `productId`：指向 POS 可銷售商品，例如拿鐵、巴斯克、熟豆包。
- `itemId`：指向營運或庫存品項，例如巴斯克批次、Sidra 熟豆、生豆、牛奶、包材。

使用規則：

- paid order items 必須保存 `productId` 與商品快照。
- businessEvents 若對應可銷售商品，可同時保存 `productId`。
- businessEvents 若是原料、批次、包材或非銷售品項，可只保存 `itemId`。
- `itemName` 必須保存當下名稱快照，避免日後商品或品項改名影響歷史資料。

## itemSource / materialId

`businessEvents.itemSource` 說明事件品項來源：

```text
product
material
manual
```

規則：

- `product`：來源是 POS 商品，保存 `productId`，並帶入 `itemName`、`itemCategory`、`unitCost` 快照。
- `material`：預留給未來 material / purchase item，例如牛奶、包材、生豆；目前沒有 UI。
- `manual`：手動輸入品項，用於臨時材料或尚未建立 material 的事件。
- 舊事件沒有 `itemSource` 時 normalize 補 `manual`。
- `materialId` 目前只保留欄位，尚不是主要查詢來源。

## unitCost / costAmount

- `unitCost`：事件當下的單位成本快照。
- `costAmount`：事件造成的成本影響金額。
- POS 商品來源預設 `unitCost = product.cost`。
- 新增或編輯時，若 `costAmount` 未填，會以 `quantity * unitCost` 計算。
- 舊事件 normalize 不會覆寫原本 `costAmount`；若沒有 `unitCost`，才用 `costAmount / quantity` 推回。

## Truth Source

v2 分析的主要真相來源：

```text
orders + businessEvents
```

規則：

- `orders` 是銷售原始資料。
- `businessEvents` 是非銷售營運事件原始資料。
- `dailyClosings` 是摘要快照，不取代原始資料。
- `inventoryLots.remainingQuantity` 是營運快取，可用於現場快速查看庫存。
- `inventoryItems.currentStock` 是 legacy / 快取欄位，不作為唯一真相來源。
- Analytics 應優先由 `orders` 與 `businessEvents` 計算；lot 快取可用於庫存畫面與稽核輔助。

## Inventory Lot 快取規則

`inventoryLots.remainingQuantity` 是第一階段甜點與熟豆庫存的營運快取。

Phase 4A 狀態：

- 已新增 `src/services/inventoryLots.js`。
- 已新增 `資源管理` UI，第一版功能區為 `甜點與熟豆批次`。
- 只支援建立與查看甜點 / 熟豆批次。
- 支援 `status: "active"` 與 `status: "archived"`。
- 尚未接 Business Events 消耗，也不會由 POS 銷售自動扣批次。
- `material` 來源保留資料模型，但沒有 Material CRUD。

`lotType`：

```text
dessert
roasted_beans
```

`inventoryLot.status`：

```text
active
archived
```

規則：

- Phase 4A 建立甜點 / 熟豆 lot 時，`initialQuantity` 與 `remainingQuantity` 相同。
- 報廢、自用、測試、招待或盤點修正更新 `remainingQuantity` 屬於未來 Phase 4B，Phase 4A 尚未接上。
- 每次更新 lot 快取時，應保留對應 businessEvent 作為稽核來源。
- 必要時，`remainingQuantity` 應可由 source event + consumption events 重算或比對。
- 若快取與事件重算結果不同，應以事件作為稽核依據，再由盤點修正事件校正快取。

## Legacy Inventory

目前程式已預留：

- `inventoryItems`
- `inventoryMovements`

v2 規則：

- v2 主資料來源是 `businessEvents` / `inventoryLots`。
- `inventoryItems` / `inventoryMovements` 保留作為 legacy 相容層或過渡期資料。
- full backup / master export 可保留 legacy 欄位，避免舊資料遺失。
- 不要把 legacy inventory 當成 v2 庫存唯一真相來源。
# IA Naming Note

介面用語以目前 v2 命名為準：`銷售紀錄` 對應 paid orders 與日報；`營運紀錄` 對應 businessEvents；`資源管理` 對應 inventoryLots 的甜點與熟豆批次；`客源分析` 對應 customerSource summary；`備份與日結` 對應 full backup、daily report、daily archive 與 restore。
