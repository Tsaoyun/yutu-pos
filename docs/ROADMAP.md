# Roadmap

本文件是 YUTU POS v2 的開發優先順序。原則是先穩定資料模型，再加小 UI，再做分析；避免一次做成複雜 ERP。

## Phase 0: 現況穩定

狀態：進行中。

目標：

- 確保現有 POS 點餐、付款、日結、備份不受影響。
- 保持正式版與 feature branch 分離。
- 補齊 docs，讓資料模型與備份格式清楚。

已完成 / 已有：

- localStorage state。
- paid orders 分析。
- daily archive。
- dailyClosing official / superseded version 規則。
- inventoryItems / inventoryMovements 預留。

資訊架構命名：

- `歷史` 已整理為 `銷售紀錄`，頁面標題使用 `銷售紀錄 / 日報`。
- `批次管理` 已整理為 `資源管理`，頁面內標題聚焦 `甜點與熟豆批次`。
- `備份 / 資料` 已整理為 `備份與日結`。
- Dashboard 的 `Customer Source` 已整理為 `客源分析`。

## Phase 1: 資料模型基礎

優先順序：最高。

目標：

- 建立 enum / data dictionary，統一定義 event type、usage type、customer source 與金額語意。
- 新增 `businessEvents`。
- 新增 `inventoryLots`。
- orders 新增 `customerSource`、`customerSourceNote`。
- full backup 加入 v2 資料。
- 建立 migration / normalize policy，確保舊 localStorage 與舊 full backup 可安全升級。
- 建立 service extraction policy，避免 `main.js` 繼續承擔所有 v2 邏輯。
- 建立 analytics truth source policy，明確規定 `orders + businessEvents` 為分析主要真相來源。
- 更新 `DATABASE_SCHEMA.md`，並在後續同步更新 `docs/firestore-schema.md`。

不做：

- 不做複雜 UI。
- 不做自動扣料。
- 不接 Firebase 主流程。
- 不影響結帳速度。

驗收：

- 舊 localStorage 可 normalize。
- full backup 可包含新欄位。
- existing orders 預設 `customerSource: "not_asked"`。
- 舊備份沒有 `businessEvents` / `inventoryLots` 時補空陣列。
- legacy `inventoryItems` / `inventoryMovements` 保留但不作為 v2 主要真相來源。
- Phase 1 不新增大型 UI，只完成資料語意、normalize 與 export 基礎。

備註：

- `docs/firestore-schema.md` 目前視為 legacy draft，尚未完整支援 v2。
- v2 schema 以 `DATABASE_SCHEMA.md` 為優先藍圖；Firestore 實作前再同步舊 schema 文件。
- service extraction 可先新增 `businessEvents.js`、`inventoryLots.js`、`customerSource.js`、`backupModel.js` 或 `exportModel.js` 的資料函式，不急著重構畫面。

## Phase 2: Customer Source 小 UI

優先順序：高。

狀態：Implemented in `feature/business-events-foundation`。

目標：

- 在建立訂單或結帳區加入快速客源選項。
- 預設 `not_asked`。
- 不強制填寫。
- `other` 與 `friend_referral` 可填 note。
- Dashboard 的 `客源分析` 顯示各客源訂單數、營收與平均客單價。

原因：

- 客源分析價值高。
- 對現場流程影響小。
- 不需要庫存或事件 UI 就能先累積資料。

驗收：

- 內用 / 外帶 orders 都能保存 customer source。
- paid order 歷史與 full backup 保留客源資料。
- Dashboard 可顯示客源分析基礎統計。

## Phase 3: Business Events 輕量輸入
Phase 3A status: Implemented in `feature/business-events-foundation`.

Phase 3B status: Minimal usable Business Events implemented in `feature/business-events-foundation`.

Phase 3C status: BusinessEvent item source semantics implemented in `feature/business-events-foundation`.

已完成：
- `src/services/customerSource.js`：Customer Source enum / label / normalize / note rule / summary helper。
- `src/services/businessEvents.js`：Business Event enum / Usage Type enum / create / normalize / summary helper。
- `state.businessEvents` 預設空陣列，舊資料 normalize 補空陣列。
- full backup 匯出與 restore 保留 `businessEvents`。
- analytics 已接入 `businessEventSummary`，Phase 3B Dashboard 顯示最小營運事件摘要。
- `營運紀錄` 頁可新增 `purchase`、`waste`、`personal`、`test`、`complimentary`。
- 事件列表支援日期與 type 篩選。
- Dashboard 顯示 `purchaseAmount`、`wasteCost`、`personalCost`、`testCost`、`complimentaryCost`。
- Business Events 支援 `itemSource: product | manual`；`material` 欄位已預留但尚未開 UI。
- POS 商品來源會帶入商品名稱、類別與成本；manual 來源可手填單位成本與成本金額。

尚未實作：
- production / roasting / inventory lots 操作。
- 自動由點餐、付款、日結流程建立 business events。

優先順序：高。

目標：

- 新增一個簡單「營運事件」資料頁或表單。
- 支援 purchase、production、roasting、waste、personal、test、complimentary、stock_adjustment。
- 已支援 POS 商品來源與手動輸入；material 只預留欄位。

不做：

- 不做供應商管理完整模組。
- 不做採購流程審核。
- 不做配方扣料。

驗收：

- 可以新增事件。
- 可以依日期篩選事件。
- JSON full backup 包含事件。

## Phase 4: Inventory Lots for Dessert / Beans

優先順序：中高。

Phase 4A status: Resource Management Foundation implemented in `feature/business-events-foundation`.

已完成：
- 新增 `src/services/inventoryLots.js`。
- 新增 `state.inventoryLots` 與 normalize。
- full backup / restore 保留 `inventoryLots`，舊備份缺欄位時補空陣列。
- 新增 `資源管理` 頁，頁面內以 `甜點與熟豆批次` 作為第一版功能區。
- 可新增甜點批次與熟豆批次。
- 可查看批次列表。
- 可將批次封存為 `archived`，不做刪除。

尚未實作：
- BusinessEvent 消耗批次。
- POS 銷售自動扣批次。
- Material CRUD。
- 每杯原料扣料。

目標：

- production 建立甜點 lot。
- roasting 建立熟豆 lot。
- waste/personal/test/complimentary 可消耗 lot。
- 顯示簡易庫存 summary。

不做：

- 不追牛奶、蛋、麵粉每杯用量。
- 不做完整 ERP 庫存估價。

驗收：

- 看得到甜點剩幾片。
- 看得到熟豆剩幾克。
- 看得到快過期批次。

## Phase 5: Analytics 升級

優先順序：中。

目標：

- Dashboard 加入 business event 彙總。
- 新增實際毛利：

```text
銷售收入 - 銷售成本 - 報廢成本 - 自用成本 - 測試成本 - 招待成本
```

- 新增客源分析 summary。
- 新增 purchase / production / roasting summary。

驗收：

- 日期範圍分析同時吃 paid orders 與 businessEvents。
- 日 / 月客源統計可查看。
- 各來源營收與平均客單價可查看。

## Phase 6: Daily Closing v2

優先順序：中。

目標：

- dailyClosing 摘要加入：
  - wasteCost
  - personalCost
  - testCost
  - complimentaryCost
  - purchaseAmount
  - productionCount
  - roastingOutput
  - customerSourceSummary

規則：

- 日結仍只存摘要。
- 明細由 orders / businessEvents / inventoryLots 保留。
- official / superseded 規則維持。

## Phase 7: Firestore / Multi-device

優先順序：後段，需正式評估。

目標：

- 把 localStorage model 對應到 Firestore collections。
- 支援長期 collection + date query。
- 避免每天一張表。
- 同步更新 `docs/firestore-schema.md`，避免它停留在 legacy draft 狀態。

風險：

- 多裝置同時寫入需要衝突策略。
- 日結 official 版本需要交易或後端保證。
- 現場營業中不可直接切換同步模式。

## 暫不做

- 複雜 ERP。
- 完整配方 BOM。
- 每杯飲品精準扣牛奶克數。
- 採購審核流程。
- 薪資、人事、會計總帳。
- 強制客源填寫。

