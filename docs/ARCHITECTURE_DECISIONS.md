# Architecture Decisions

本文件記錄 YUTU POS v2 已接受的架構決策。它不是待辦清單，也不是功能提案；只有已確定、後續開發不得任意違反的原則會放在這裡。

## ADR-001: Analytics 是唯讀層

Status: Accepted

Context:
YUTU POS 需要提供營收、商品、客源與營運事件分析，但分析不應改變營運資料，否則會讓原始紀錄與統計結果互相污染。

Decision:
Analytics 只能讀取 Order、BusinessEvent、Product、InventoryLot、DailyClosing 等資料。Analytics 不得建立、修改或刪除營運資料。

Consequences:
Analytics 可被重新計算，也可安全切換日期區間。若統計數字錯誤，應回頭檢查來源資料或 summary logic，而不是在 UI 中補寫資料。

Do Not:
不要在 Analytics UI 中直接修改 orders、businessEvents、inventoryLots 或 dailyClosings。

## ADR-002: Paid Orders 是銷售 Source of Truth

Status: Accepted

Context:
銷售、營收、商品銷量與客源統計都來自顧客訂單。DailyClosing 只保存某次日結時的摘要，不能取代原始訂單。

Decision:
實際銷售、營收、商品銷量與客源統計，以 `status: "paid"` 的 orders 為主要 Source of Truth。

Consequences:
歷史訂單、日報與 Analytics 應優先由 paid orders 重算。若 DailyClosing 與 paid orders 重算結果不同，應視為需要稽核的差異。

Do Not:
不要把 DailyClosing 當成銷售原始資料，也不要只改 DailyClosing 來修正銷售數字。

## ADR-003: DailyClosing 是 Snapshot

Status: Accepted

Context:
日結需要保存某日營業結果與封存時間，但日結資料本身不是訂單明細。

Decision:
DailyClosing 是指定日期營業結果的快照，不是訂單、營收或成本的原始 Source of Truth。是否鎖定、補單、重新日結，留待 Sprint 1 定義。

Consequences:
同一天可存在多筆 dailyClosing，但只有一筆 official。正式統計若未來使用 dailyClosings，預設只使用 `isOfficial: true`。

Do Not:
不要把所有 order 明細複製進 DailyClosing，也不要用 DailyClosing 取代 orders。

## ADR-004: BusinessEvent 不取代 Order

Status: Accepted

Context:
YUTU POS v2 以 Business Events 作為咖啡店營運資料庫的重要紀錄，但 POS 現場工作仍需要 Order workflow。

Decision:
BusinessEvent 記錄非銷售營運事件，不得用來取代顧客訂單與 POS workflow。

Consequences:
採購、報廢、自用、測試、招待可以是 BusinessEvent；顧客點餐、出品與結帳仍是 Order。Analytics 可以同時讀取兩者，但兩者不互相覆蓋。

Do Not:
不要把顧客訂單改成全事件化，也不要把報廢 / 自用塞進 orders 當特殊訂單。

## ADR-005: Inventory 暫不自動扣料

Status: Accepted

Context:
一人經營的小型精品咖啡店需要知道甜點與熟豆批次現況，但不需要立即建立 ERP 等級的 recipe / BOM / 每克扣料系統。

Decision:
目前階段不建立 Recipe 或完整 ERP 扣料系統。BusinessEvent 先負責紀錄；`InventoryLot.remainingQuantity` 暫時視為營運快取。

Consequences:
甜點與熟豆批次可先被建立與查看。POS 銷售與 BusinessEvent 暫不自動扣 inventoryLots，未來若要連動，需先定義 consumption event contract。

Do Not:
不要在未定義 lot consumption 規則前，讓 POS 銷售自動扣批次。

## ADR-006: Product Metadata 是未來規則來源

Status: Accepted

Context:
新增商品後應立即符合 POS 點餐流程。長期依賴商品名稱、中文分類或寫死常數會讓新品需要改程式才可正確點餐。

Decision:
冰熱、外帶、價格修正與商品可用規則，應逐步移往 Product metadata。不再長期新增依賴商品名稱或中文 category 字串的判斷。

Consequences:
Sprint 2 應整理 `orderModel.js`，讓 `supportsHot`、`supportsIce`、`supportsTakeout`、`iceExtraPrice` 等欄位成為點餐規則來源。

Do Not:
不要新增 `if (product.name === "...")` 或 `if (category === "手沖")` 這類長期規則。

## ADR-007: UI 不得依賴不固定的 Analytics 欄位

Status: Accepted

Context:
Analytics UI 曾讀取 service 未輸出的欄位，造成 undefined 風險。分析頁需要固定 schema。

Decision:
Analytics Service 應提供固定 Schema，UI 不自行推測欄位、不直接拼湊 Domain 統計。

Consequences:
Analytics 空資料時也必須回傳空陣列、0 或明確 null。新增報表前應先更新 service contract，再接 UI。

Do Not:
不要在 UI 中寫 `dashboard.someMissingField || ...` 來偷偷補資料契約。

## ADR-008: Workspace 架構暫時凍結

Status: Accepted

Context:
POS Workspace 已調整為 `Order Queue + Current Order`，符合現場以一組客人為工作單位的方向。

Decision:
POS Workspace 的主要結構已穩定。除非出現明確操作問題、響應式破版或營業現場 UX 問題，不再進行大幅首頁重構。

Consequences:
後續 Sprint 應把重點放在營業狀態、資料契約、metadata 與 service 邊界，而不是持續重排首頁。

Do Not:
不要把首頁重新改回 KPI Dashboard，也不要把跨訂單單品 task list 當成主軸。

## ADR-009: 高風險系統操作與營業流程分離

Status: Accepted

Context:
Backup、Restore、Reset 等操作風險高，不應與日常點餐或日結主要動作混在同一層級，避免現場誤操作。

Decision:
Backup、Restore、Reset 等高風險操作，不得與日常日結流程混在同一主要操作區域。實際 UI 拆分於 Sprint 1 處理。

Consequences:
`今日結帳` 與 `資料備份與還原` 可以暫時在同一頁分區，但必須維持清楚視覺與操作邊界。

Do Not:
不要把匯入、重置、撤銷、覆蓋資料等危險操作放在首頁一般導航或主要營業 CTA 旁邊。
