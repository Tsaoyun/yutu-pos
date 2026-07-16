# Current Status Addendum: Navigation IA

目前首頁預設為 `POS 工作台`，主體仍是 `Order Queue + Current Order`，用於處理進行中的內用與外帶訂單。

已完成的導覽命名與分區：

- `訂單歷史`：查詢已結帳訂單、指定日期日報、銷售彙總與訂單明細。
- `今日結帳`：導向 `資料與設定` 頁中的 `今日結帳／日結` 區塊，處理今日資料匯出與結束營業 / 日報匯出。
- `營運事件`：原營運紀錄，用於記錄採購、報廢、自用、測試與招待，不影響銷售訂單。
- `庫存現況`：原資源管理，第一版內容為 `甜點與熟豆批次`。
- `商品`：導向商品管理。
- `經營分析`：Dashboard / analytics。
- `資料與設定`：同頁分為 `今日結帳／日結` 與 `資料備份與還原`。

首頁已移除 `撤銷最後結帳` 全域危險按鈕。撤銷入口目前只在 `訂單歷史` 顯示，且只針對最近一筆仍在 5 分鐘可撤銷時間內的結帳，按鈕會顯示明確桌位 / 外帶與金額。

# Current Status

本文件依目前 `src/` 程式碼描述已實作功能。畫面文字若因原始檔編碼顯示異常，本文件以程式 action、資料欄位與流程邏輯為準。

## POS 點餐流程

- 首頁為 POS 工作區，包含座位區、外帶訂單區、商品分類與訂單明細。
- 內用訂單從座位按鈕建立；系統會詢問人數，建立 `status: "open"` 的訂單。
- 已有未結帳訂單的座位再次點選時，會切回該座位的既有 open order，不會建立第二張同座位內用訂單。
- 點商品會加入目前選取的 open order；若沒有 open order，程式會阻擋加入商品並顯示提示。
- 訂單明細可在「出品清單」與「編輯訂單」兩種模式切換。

## 座位

- 內用座位由 `src/data/seats.js` 的 `defaultSeats` 提供。
- 座位卡會顯示是否被佔用、開單時間、人數、停留時間與目前金額。
- 座位佔用依據為同一 `seatId` 是否存在 `status: "open"` 的訂單。

## 人數

- 內用訂單建立時以 `window.prompt` 輸入人數，預設值為 2。
- 外帶訂單建立時固定 `people: 1`。
- Dashboard 與歷史報表會統計已結帳訂單的人數。

## 商品管理

- 已實作商品管理頁，可新增、編輯商品。
- 商品欄位包含名稱、類別、類型、售價、成本、排序、口味 / 規格、備註、販售狀態。
- 商品可切換停售 / 恢復；停售商品會在點餐商品按鈕上 disabled，不能被加入訂單。
- 預設商品來自 `src/data/menu.js`，啟動後會正規化到 `state.products`。

## 冰熱

- 飲品預設需要冰熱選項。
- 新增飲品時預設溫度為熱。
- 訂單編輯模式可切換熱 / 冰。
- 手沖類別在冰飲時會加價 10 元，並反映在單價、利潤與報表統計。

## 內外帶

- 非 retail 商品預設需要內用 / 外帶選項。
- 內用座位建立的訂單，品項預設為內用。
- 外帶訂單建立的品項，預設為外帶。
- 訂單編輯模式可切換品項層級的內用 / 外帶。
- Retail 商品不需要 service type。

## Variant / 口味

- 商品可在商品管理中設定多個口味 / 規格。
- 點選有 active variant 的商品時，系統以 `window.prompt` 讓操作者選擇口味 / 規格。
- 訂單品項會保存 `variantName`。
- 商品排行會統計各 variant 的銷售數量分布。

## 數量修改

- 訂單編輯模式中每個品項有減少、增加數量按鈕。
- 數量減到 0 或以下時，會移除該品項。
- 修改數量後會重新計算小計、總金額、成本與利潤。

## 刪除商品

- open order 的品項可在訂單編輯模式刪除，刪除前有 confirm。
- 歷史訂單可刪除整張紀錄，刪除前有 confirm。
- 商品管理中的「停售」是停用商品，不是刪除商品。

## 出品清單

- 訂單明細預設為出品清單模式。
- 出品清單依商品類型分組，顯示飲品、甜點、retail 等品項。
- 飲品出品名稱包含冰熱與商品名稱。
- 已結帳訂單的出品清單按鈕會 disabled。

## Served 狀態

- 每個訂單品項都有 `served` 狀態，新增時預設 `false`。
- open order 可在出品清單中點擊品項切換已出 / 未出。
- served 狀態會保存在訂單品項中，也會在已結帳訂單的只讀明細中顯示。

## 歷史訂單

- 歷史頁依 `historyDate` 顯示該日期已結帳訂單。
- 可切換今天、昨天或指定日期。
- 歷史頁包含當日營收、利潤、訂單數、飲品數、甜點數、retail 數與平均客單。
- 可查看歷史訂單明細，並可刪除歷史訂單。
- 已結帳訂單也可透過「編輯訂單」轉回 open 狀態，需 confirm。

## 現金結帳

- open order 且至少有一個品項時，可按現金結帳。
- 結帳前會以 confirm 顯示座位 / 外帶、人數、總金額與品項摘要。
- 確認後訂單變為 `status: "paid"`，`paymentMethod: "cash"`，並寫入 `checkedOutAt`。
- 目前沒有輸入收到金額、自動找零或其他付款方式。

## Undo Checkout

- 已實作受控 Undo Checkout：`訂單歷史` 只會針對最近一筆仍在 5 分鐘內可撤銷的結帳顯示 `撤銷此筆結帳`，首頁不再提供全域撤銷按鈕。
- 只會找最近一筆有 `checkedOutAt` 的 paid order。
- 結帳超過 5 分鐘不可撤銷。
- 內用訂單若原座位已有其他 open order，不可撤銷。
- 撤銷後訂單回到 open，清空 `paymentMethod` 與 `checkedOutAt`，並寫入 activity log。

## JSON Backup

- 備份頁可匯出完整備份 JSON。
- 完整備份包含 `orders`、`products`、`seats`、畫面 / 查詢設定 snapshot，以及 schema version、app name、export type、export time、storage key。
- 檔名格式為 `yutu-pos-backup-yyyy-mm-dd-hhmm.json`。

## JSON Restore

- 備份頁可匯入 JSON。
- 匯入前有 confirm。
- 目前只接受 full backup 格式，或舊格式中可被辨識為 state 的資料。
- 匯入後會覆蓋本機 `localStorage` 中的 POS 狀態。

## 每日打烊報表

- 備份頁有「結束營業 / 匯出今日報表」動作。
- 若仍有 open order，匯出前會詢問是否仍要匯出。
- 每日報表依指定日期的 paid orders 產生，包含 daily summary、商品銷售摘要、orders 與 products snapshot。
- 檔名格式為 `yutu-pos-daily-yyyy-mm-dd.json`。

## Dashboard

- 已實作經營分析 Dashboard。
- Dashboard 只讀取 `orders` 產生分析資料，未看到會修改訂單或商品資料的邏輯。
- Dashboard 只統計 `status: "paid"` 且日期落在範圍內的訂單。

## 日期切換

- 歷史頁支援今天、昨天與日期選擇器。
- Dashboard 支援今日、昨日、七天、本月與自訂日期範圍。
- 自訂日期若起訖顛倒，程式會自動以較早日期作為 start、較晚日期作為 end。

## 今日 / 昨日 / 七天 / 本月 / 自訂日期

- 今日：startDate 與 endDate 都是今天。
- 昨日：startDate 與 endDate 都是昨天。
- 七天：從今天往前 6 天到今天，合計 7 天。
- 本月：從本月 1 日到今天。
- 自訂日期：使用 `analyticsStartDate` 與 `analyticsEndDate`。

## 商品排行

- Dashboard 商品排行預設取前 8 名。
- 可依數量、營收、利潤排序。
- 欄位包含商品、類別、數量、營收、成本、利潤、毛利率、variant 分布、冰熱數量、內用 / 外帶數量。

## 類別分析

- Dashboard 依商品類別彙總數量、營收、利潤與毛利率。
- 類別列會先以目前 category labels 初始化，因此即使某類別無銷售，也可能顯示為 0。

## 冰熱分析

- Dashboard 統計飲品品項的冰、熱數量與比例。
- 非飲品不納入冰熱統計。

## 座位分析

- Dashboard 依 seatId / 外帶彙總訂單數、人數、營收與平均客單。
- 排序依營收高到低，其次依訂單數。

## 時段分析

- Dashboard 依訂單 `checkedOutAt`，若沒有則用 `createdAt`，彙總到小時。
- 欄位包含小時、訂單數、營收與飲品數。

