# Business Rules Addendum: Navigation And Undo Checkout

目前首頁導覽依現場工作模式排序，而不是依資料表排序。`POS 工作台` 是預設入口；其他入口分為營業、紀錄與庫存、管理與分析、系統。

目前介面命名：

- `訂單歷史`：paid orders、指定日期日報、銷售彙總與訂單明細。
- `營運事件`：businessEvents，記錄採購、報廢、自用、測試與招待，不寫入 orders。
- `庫存現況`：inventoryLots，第一版只顯示 / 新增甜點與熟豆批次。
- `資料與設定`：同頁分成 `今日結帳／日結` 與 `資料備份與還原`。

Undo Checkout 規則：

- 首頁不提供全域 `撤銷最後結帳` 按鈕。
- 撤銷入口目前只在 `訂單歷史` 頁顯示。
- 只有最近一筆 paid order 且 `checkedOutAt` 距今不超過 5 分鐘時，才顯示 `撤銷此筆結帳`。
- 操作前確認視窗會列出座位 / 外帶、結帳時間與金額。
- 撤銷後該 order 回到 `status: "open"`，原始品項與出品狀態保留；若座位已被其他 open order 佔用則禁止撤銷。

# Business Rules

本文件從目前程式碼推導 YUTU POS 的營業規則。無法從程式碼確認的事項標示為「待確認」。

## 訂單建立方式

- 內用訂單從座位建立。
- 若座位已有 open order，點座位會選取既有訂單，不會建立新訂單。
- 若座位沒有 open order，系統以 prompt 要求人數；人數必須為大於 0 的數字才會建立訂單。
- 外帶訂單由「新增外帶」建立，不綁定實體座位，`seatId` 固定為 `takeout`，`people` 固定為 1。
- 訂單 id 格式為 `YT-yyyymmdd-xxxxx`，後段取目前 timestamp 後 5 碼。

## 座位佔用邏輯

- 座位是否佔用只看是否存在同 `seatId` 且 `status: "open"` 的訂單。
- 結帳後訂單變成 paid，座位即不再被視為佔用。
- 撤銷結帳時，如果原座位已有其他 open order，內用訂單不可撤銷。
- 外帶訂單允許同時有多張 open order。

## 內用 / 外帶邏輯

- 訂單層級用 `seatId` 區分內用座位與外帶訂單。
- 品項層級用 `serviceType` 記錄內用 / 外帶。
- 內用座位訂單新增品項時，預設 `serviceType` 為內用。
- 外帶訂單新增品項時，預設 `serviceType` 為外帶。
- 非 retail 商品需要 service type；retail 商品不需要 service type。
- open order 可在品項層級切換內用 / 外帶。

## 冰熱邏輯

- 飲品預設需要 `temperature`。
- 新增飲品時預設為熱。
- open order 可在品項層級切換熱 / 冰。
- 手沖類別且溫度為冰時，單杯加價 10 元。
- 冰飲加價會更新 effective price、price、iceExtra 與 profit。
- 非飲品通常不需要冰熱；商品也可透過 `requiresTemperature` 覆寫。待確認：商品管理 UI 目前沒有直接編輯 `requiresTemperature` 的欄位。

## Variant 顯示與統計

- 商品可設定 `variants`，每個 variant 會被正規化為 `{ name, active }`。
- 點選有 active variants 的商品時，使用 prompt 選擇。
- 操作者可輸入序號或完全相符的 variant 名稱。
- 若輸入不合法，該次加入品項會取消。
- 訂單品項以 `variantName` 保存口味 / 規格。
- 訂單顯示商品名稱時，若有 variant，格式為「商品名（variant）」。
- Dashboard 商品排行會把相同商品的 variant 銷量累計在 `variants` 物件中。

## Checkout 後進入歷史訂單

- 結帳只支援現金付款。
- 結帳後訂單狀態改為 `paid`，寫入 `paymentMethod: "cash"` 與 `checkedOutAt`。
- 結帳動作會新增 activity log：`{ type: "checkout", at }`。
- 結帳後會清空 `selectedOrderId`、回到 floor view，並把 `historyDate` 設為今天。
- 歷史頁只列出指定日期且 `status: "paid"` 的訂單。

## Undo Checkout 條件

- 撤銷對象是最近一筆 paid 且有 `checkedOutAt` 的訂單。
- 沒有已結帳訂單時不可撤銷。
- 距離 `checkedOutAt` 超過 5 分鐘不可撤銷。
- 內用訂單若原座位已有 open order，不可撤銷。
- 撤銷前需要 confirm。
- 撤銷後訂單回到 open，清空 `paymentMethod` 與 `checkedOutAt`，並新增 `undoCheckout` activity log。

## Dashboard 資料規則

- Dashboard 是只讀分析頁；目前程式碼未看到它會修改訂單、商品、座位或 localStorage。
- Dashboard 只統計 paid orders。
- 日期判斷使用 `checkedOutAt || createdAt` 轉成本地日期 key。
- 商品排行、類別、冰熱、座位、時段都由同一批 filtered paid orders 計算。
- 待確認：Dashboard 是否需要排除被「編輯已結帳訂單」轉回 open 的歷史資料，目前程式邏輯會排除，因其不再是 paid。
- v2 若加入 Business Events，Dashboard 應同時讀取 paid orders 與 `businessEvents`，但仍保持只讀。
- v2 實際毛利建議為：銷售收入 - 銷售成本 - 報廢成本 - 自用成本 - 測試成本 - 招待成本。

## JSON Backup / Restore 資料範圍

- 完整備份包含：
  - `schemaVersion`
  - `app`
  - `exportType: "full"`
  - `exportedAt`
  - `storageKey`
  - `orders`
  - `products`
  - `seats`
  - `dailyClosings`
  - `inventoryItems`
  - `inventoryMovements`
  - `settings`
- `settings` 包含目前選取座位、分類、訂單、訂單顯示模式、目前頁面、history date、analytics range、analytics dates、analytics sort、sales sort。
- 匯入 full backup 時會還原 orders、products、menuItems、seats、dailyClosings、inventoryItems、inventoryMovements 與 settings。
- 匯入後會經過 `normalizeState`，其中 seats 目前會被重設為 `defaultSeats`。待確認：備份中的 seats 是否預期保留自訂座位；目前程式看起來不會真正使用匯入 seats。
- daily export 不能被 restore；匯入非 full exportType 會丟錯。
- v2 full backup 建議再加入 `businessEvents` 與 `inventoryLots`。
- 未來 `YUTU_MASTER_DATABASE.json` 建議包含 products、orders、展開後 orderItems、dailyClosings、businessEvents、inventoryLots、settings。

## 每日報表計算

- 每日報表依日期 key 篩選 `status: "paid"` 且 `checkedOutAt` 日期等於指定日期的訂單。
- 今日報表使用今天的日期 key。
- 歷史頁「匯出此日期」使用目前 `historyDate`。
- 報表包含 daily summary、product sales summary、orders、products snapshot。
- 若打烊匯出時仍有 open order，系統只提示確認，不會自動結帳、取消或排除以外的其他處理。
- 待確認：營業日是否以凌晨 00:00 切日；目前程式依瀏覽器本地日期 key，不支援自訂營業日切換時間。
- daily archive 會建立 `dailyClosing` 快照。
- 同一天可有多筆 dailyClosing，但只允許一筆 `isOfficial: true`。
- 重新日結時，新 closing 成為 official，舊 official 改為 superseded。
- dailyClosing 是摘要快照，不取代原始 orders。
- v2 dailyClosing 建議加入 wasteCost、personalCost、testCost、complimentaryCost、purchaseAmount、productionCount、roastingOutput、customerSourceSummary。

## Business Events 營運事件規則

目前狀態：未實作，屬於 v2 建議。

- Business Events 應記錄非銷售營運事件，作為咖啡店營運資料庫的核心。
- 建議事件類型：
  - `purchase`
  - `production`
  - `roasting`
  - `waste`
  - `personal`
  - `test`
  - `complimentary`
  - `stock_adjustment`
- 每筆事件至少應包含 id、date、type、itemId / productId、itemName、quantity、unit、amount / costAmount、vendor、note、createdAt、updatedAt。
- 採購可先放在 businessEvents，不需要獨立 collection。
- 生產與烘豆事件可以建立 inventory lot。
- 報廢、自用、測試、招待事件可消耗 inventory lot 或只記錄成本。
- Business Events 不應修改歷史 paid orders。
- Analytics 與 dailyClosing 可依 date 篩選 businessEvents 後產生摘要。

## Usage Type 用途規則

目前狀態：未實作，屬於 v2 建議。

- 商品使用方式建議支援：
  - `sale`
  - `waste`
  - `personal`
  - `test`
  - `complimentary`
  - `other`
- `sale` 由 paid orders 代表，會產生營收。
- `waste`、`personal`、`test`、`complimentary` 不產生營收，只計入成本與庫存流向。
- 報廢、自用、測試、招待不應做成特殊例外，應視為商品或庫存的一種使用方式。
- 第一階段不建議把 usageType 強行塞入既有 orderItem；非銷售用途可先由 businessEvents 記錄。

## Inventory Lots 批次庫存規則

目前狀態：未實作，屬於 v2 建議。

- Inventory Lots 優先用於甜點與熟豆。
- 甜點 production 可建立 lot，例如巴斯克 +8 片。
- 烘豆 roasting 可建立熟豆 lot，例如生豆 1000g -> 熟豆 850g。
- lot 應保存 lotId、itemId、itemName、sourceEventId、madeDate / roastDate / purchaseDate、expireDate、initialQuantity、remainingQuantity、unit、costAmount、note。
- 報廢、自用、測試、招待、盤點修正可消耗或調整 lot。
- 庫存 summary 可由 lots 與 businessEvents 推算，或保存 `remainingQuantity` / `currentQuantity` 快取。
- 不需要一開始支援每杯飲品精準扣牛奶克數。

## Customer Source 客源來源規則

目前狀態：未實作，屬於 v2 建議。

- 客源來源應屬於 order 層級，不是 orderItem 層級。
- 每筆訂單只記一個主要來源。
- 建議欄位：
  - `customerSource`
  - `customerSourceNote`
- `customerSource` 固定值：
  - `google_maps`
  - `instagram`
  - `threads`
  - `walk_in`
  - `friend_referral`
  - `xiaohongshu`
  - `returning_customer`
  - `other`
  - `not_asked`
- 預設值應為 `not_asked`，避免影響快速結帳。
- 不應強制填寫。
- `other` 與 `friend_referral` 可允許填寫 `customerSourceNote`。
- `customerSourceNote` 不列入主要統計，只作為明細備註與匯出資料。

## 資料保存規則

- 主要資料保存在瀏覽器 `localStorage`，key 為 `yutu-pos-state-v1`。
- 每次 `setState` 會 normalize 後存回 localStorage 並重新 render。
- 待確認：正式營運是否已啟用 Firestore 同步；目前主流程使用 localStorage，Firestore adapter 檔案存在但未在 `main.js` 主流程中使用。
# IA Naming Note

- `訂單歷史`：原 `歷史` 入口，查詢 paid orders、指定日期日報、銷售彙總與訂單明細。
- `營運事件`：記錄採購、報廢、自用、測試與招待，不影響銷售訂單。
- `庫存現況`：原 `批次管理` 入口，Phase 4A 頁面內以 `甜點與熟豆批次` 為主。
- `資料與設定`：原 `備份 / 資料` 入口，頁內分為 `今日結帳／日結` 與 `資料備份與還原`。
- `客源分析`：Dashboard 中的 customer source summary。
