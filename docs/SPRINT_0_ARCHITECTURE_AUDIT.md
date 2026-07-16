# Sprint 0 Architecture Audit

本文件記錄 Sprint 0 的架構清理結果。範圍限於資料契約、系統邊界、命名、技術債與後續重構依據；不描述新功能，也不改變既有 POS workflow。

## 1. Current Architecture Summary

目前 YUTU POS v2 仍是 local-first 的單店咖啡店營運系統。POS 工作台處理即時接客、點餐、出品與結帳；Business Events 記錄非銷售營運事件；Analytics 只讀取資料並產生統計。

| Domain | 目前責任 | 類型 | Source / Role |
|---|---|---|---|
| `Order` | 接客、點餐、出品、結帳、座位 / 外帶狀態 | Workflow Data / Record | 銷售與服務流程的主要紀錄 |
| `Product` | 可販售商品、售價、成本、冰熱、外帶與停售 metadata | Master Data | 新訂單建立 orderItem snapshot 的來源 |
| `BusinessEvent` | 採購、報廢、自用、測試、招待等非銷售營運事件 | Record | 非銷售成本與營運事件的原始紀錄 |
| `InventoryLot` | 甜點與熟豆批次、剩餘數量、到期日 | Operational Cache / Record | 第一版批次庫存現況，不自動扣 POS 或 Business Events |
| `DailyClosing` | 指定日期日結摘要與 official / superseded 版本 | Snapshot | paid orders 與當日摘要的快照，不取代 orders |
| `Analytics` | 經營分析、商品排行、客源分析、營運事件摘要 | Derived Data | 唯讀統計層，不寫入 Domain Entity |
| `System / Backup` | full backup、daily report、daily archive、restore、reset 測試資料 | System Management | 資料保護與系統管理，不是日常點餐流程 |

### Data Role 定義

- Master Data：長期主資料，例如 `products`。
- Workflow Data：正在被現場操作推進的流程資料，例如 open `orders`。
- Record：已發生事件的原始紀錄，例如 paid `orders`、`businessEvents`。
- Snapshot：某一時點的摘要，例如 `dailyClosings`。
- Derived Data：可由原始資料重算的統計，例如 Analytics summary。
- Operational Cache：為現場操作方便保存的狀態，例如 `inventoryLots.remainingQuantity`。

## 2. Analytics Data Contract

目前 `src/services/analytics.js` 是 Analytics UI 的資料契約來源。`main.js` 的經營分析頁不應自行補算缺漏欄位，也不應猜測欄位是否存在。

### Contract 原則

- Analytics Service 必須回傳固定結構。
- 無資料時必須回傳空陣列、0 或明確的 `null`。
- 不得因無資料回傳 `undefined`。
- `comparisonSummary` 尚未實作時固定為 `null`。
- Analytics 僅讀取資料，不建立、修改或刪除任何 Domain Entity。
- 日期區間以 UI 傳入的 `startDate` / `endDate` 為準，paid orders 使用 `checkedOutAt || createdAt` 轉成 local date key。

### AnalyticsSummary Contract

`buildAnalyticsDashboard(orders, options)` 固定回傳：

```js
{
  schemaVersion,
  startDate,
  endDate,
  paidOrders,
  overview,
  salesSummary,
  productRanking,
  productSummary,
  categorySummary,
  temperatureSummary,
  hourlySummary,
  seatSummary,
  customerSourceSummary,
  businessEventSummary,
  comparisonSummary
}
```

### Field Definition

#### `schemaVersion`

- type: `number`
- required: Yes
- default: `1`
- source: Analytics service constant
- description: Analytics contract version，方便未來 UI 判斷 schema 變更。
- UI 使用位置: 目前未顯示，作為 contract guard。

#### `startDate` / `endDate`

- type: `string | undefined`
- required: Yes
- default: 由 caller 傳入；若 filter helper 未收到日期，預設使用今日。
- source: Analytics UI date range state
- description: 本次分析區間。
- UI 使用位置: 日期切換與 custom range。

#### `paidOrders`

- type: `Order[]`
- required: Yes
- default: `[]`
- source: `orders` 中 `status === "paid"` 且日期落在區間內的訂單。
- description: Analytics 所有銷售統計的基礎資料。
- UI 使用位置: 目前不直接顯示，供 debug / future drilldown。

#### `overview` / `salesSummary`

- type: `object`
- required: Yes
- default: `{ revenue: 0, cost: 0, profit: 0, marginRate: 0, orderCount: 0, people: 0, averageTicket: 0, drinks: 0, desserts: 0, retail: 0 }`
- source: paid orders within selected date range
- description: 銷售摘要。`salesSummary` 是穩定 contract alias，`overview` 保留現有 UI 相容。
- UI 使用位置: 經營分析頂部摘要卡。

#### `productRanking` / `productSummary`

- type: `Array`
- required: Yes
- default: `[]`
- source: paid order items within selected date range
- description: 依商品彙總數量、營收、成本、毛利、冰熱、內外帶與 variant。`productSummary` 是穩定 contract alias。
- UI 使用位置: 商品排行。

#### `categorySummary`

- type: `Array`
- required: Yes
- default: 依 category labels 產生 0 值 rows，無 labels 時為 `[]`
- source: paid order items within selected date range
- description: 依商品分類彙總數量、營收、成本與毛利。
- UI 使用位置: 類別分析。

#### `temperatureSummary`

- type: `object`
- required: Yes
- default: `{ iced: 0, hot: 0, total: 0, icedRate: 0, hotRate: 0 }`
- source: paid order items with `type === "drink"`
- description: 飲品冰熱統計。
- UI 使用位置: 冰熱分析。

#### `hourlySummary`

- type: `Array`
- required: Yes
- default: `[]`
- source: paid orders grouped by `checkedOutAt || createdAt` hour
- description: 時段訂單數、營收與飲品數。
- UI 使用位置: 時段分析。

#### `seatSummary`

- type: `Array`
- required: Yes
- default: `[]`
- source: paid orders grouped by `seatId`
- description: 座位 / 外帶分析，包含訂單數、人數、營收、平均客單。
- UI 使用位置: 座位分析。

#### `customerSourceSummary`

- type: `Array`
- required: Yes
- default: `[]`
- source: paid orders within selected date range
- description: 依 `orders.customerSource` 統計訂單數、營收與平均客單；`customerSourceNote` 不納入主要分類。
- UI 使用位置: 客源分析。

#### `businessEventSummary`

- type: `object`
- required: Yes
- default: `{ wasteCost: 0, personalCost: 0, testCost: 0, complimentaryCost: 0, purchaseAmount: 0 }`
- source: `businessEvents` within selected date range
- description: 最小營運事件摘要。採購使用 `amount || costAmount`；報廢、自用、測試、招待使用 `costAmount`。
- UI 使用位置: 營運事件摘要。

#### `comparisonSummary`

- type: `object | null`
- required: Yes
- default: `null`
- source: Not implemented
- description: 預留同期比較 contract。未實作前必須是 `null`，不可回傳 undefined 或空殼假資料。
- UI 使用位置: 目前未顯示。

### Sprint 0 修正

- `customerSourceSummary` 已由 `buildCustomerSourceSummary(paidOrders)` 產生。
- `businessEventSummary` 已由 `summarizeBusinessEvents(businessEvents, dateRange)` 產生。
- Analytics label fallback 已改為可讀中文，避免經營分析頁出現亂碼。
- `comparisonSummary` 明確為 `null`。

## 3. Metadata Migration Matrix

Product 目前已具備 `category`、`type`、`price`、`cost`、`supportsHot`、`supportsIce`、`supportsTakeout`、`iceExtraPrice`、`requiresTemperature`、`requiresServiceType`、`variants`、`active`。

Sprint 0 不全面重寫商品規則，只記錄遷移方向。

| Current Rule | Current Location | Current Purpose | Proposed Metadata | Migration Sprint | Risk |
|---|---|---|---|---|---|
| `POUROVER_ICE_EXTRA = 10` | `src/services/orderModel.js` | 手沖冰飲固定加價 | 優先用現有 `product.iceExtraPrice`；未來可升級為 `priceModifiers` | Sprint 2 | Medium：新商品加價若未寫入 metadata，價格會不一致 |
| `category === "pourover"` | `src/services/orderModel.js` | 判斷手沖是否冰飲加價 | 現有 `iceExtraPrice > 0` 可處理，不一定要新增欄位 | Sprint 2 | Medium：category 字串變更會破壞價格規則 |
| `category === "手沖"` | `src/services/orderModel.js` | 舊中文 category fallback | 用 normalize / migration 轉為 category id，再用 metadata | Sprint 2 | Medium：舊資料相容需要保留 migration fallback |
| `product.type === "drink"` | `src/services/orderModel.js` / `src/main.js` | 預設是否需要冰熱、飲品統計 | 現有 `supportsHot` / `supportsIce` / `requiresTemperature` 可處理點餐規則；`type` 保留為分析 enum | Sprint 2 | Low-Medium：type enum 可保留，但不應獨立決定所有點餐規則 |
| `product.type !== "retail"` | `src/services/orderModel.js` / `src/main.js` | 預設是否需要內用 / 外帶 | 現有 `supportsTakeout` / `requiresServiceType` 可處理 | Sprint 2 | Low-Medium：retail 例外規則若增加會變複雜 |
| `CATEGORY_METADATA.pourover.iceExtraPrice = 10` | `src/main.js` | 商品建立表單的分類預設值 | 可保留作為 default，但新 order pricing 應依 product snapshot | Sprint 2 | Low：合理 default；風險在被誤用為 truth source |
| `CATEGORY_METADATA[item.category]?.iceExtraPrice` | `src/main.js` normalize | 舊 orderItem 缺 `iceExtraPrice` 時 fallback | 保留 migration fallback；新資料不應依賴 | Sprint 2 | Low：migration 需要，但要避免覆蓋舊訂單 snapshot |
| `item.temperature === "冰" / "熱"` | `src/services/analytics.js` / `src/main.js` | orderItem snapshot 統計與 UI active state | 這是 orderItem snapshot enum，可保留；未來可用 `temperatureOptions` 限制可選值 | Future | Low |
| `item.serviceType === "內用" / "外帶"` | `src/services/analytics.js` / `src/main.js` | orderItem snapshot 統計與 UI active state | 這是 orderItem snapshot enum，可保留；未來可用 `defaultServiceMode` / `takeawayPolicy` | Future | Low |
| `paymentMethod = "cash"` | `src/services/orderModel.js` | 目前只收現金 | 現階段符合 business rule；未來可升級 payment object | Future | Low |
| timestamp 後 5 碼 | `src/services/orderModel.js` | 訂單 id suffix | 可保留；若接後端改用 server id / sequence | Future | Low-Medium：極低機率撞號 |

### Metadata 建議評估

- `temperatureOptions`：解決「可冰 / 可熱 / 預設溫度」；現有欄位可先支援，不急著新增。
- `takeawayPolicy`：解決「可外帶 / 外帶加價 / 禁止外帶」；目前只需 `supportsTakeout`。
- `priceModifiers`：解決複合加價規則；目前只有冰飲加價，先用 `iceExtraPrice` 足夠。
- `defaultTemperature`：若現場常需要預設熱或冰，可於 Sprint 2 評估。
- `defaultServiceMode`：外帶訂單預設外帶、內用訂單預設內用，目前由 order context 決定即可。
- `productRole`：若未來區分「可販售商品 / 原料 / 包材」，可評估；目前不要把 Product 變成 Material ERP。

## 4. orderModel Rule Inventory

| Rule ID | 規則說明 | 目前程式位置 | 依賴欄位 | 是否 hard-coded | 資料風險 | 預計處理 Sprint |
|---|---|---|---|---|---|---|
| OM-001 | 手沖冰飲加價 10 元 | `src/services/orderModel.js` `POUROVER_ICE_EXTRA` | category、temperature | Yes | 新商品或不同加價規則無法由商品資料控制 | Sprint 2 |
| OM-002 | 手沖判斷依 `pourover` / `手沖` | `src/services/orderModel.js` `isPourover` | category 字串 | Yes | category rename 或新分類會破壞規則 | Sprint 2 |
| OM-003 | 飲品預設需要冰熱 | `src/services/orderModel.js` `addOrderItem` | product.type | Partial | 若非飲品也需要溫度或飲品不可冰熱，需 metadata 覆寫 | Sprint 2 |
| OM-004 | 非零售預設需要 service type | `src/services/orderModel.js` `addOrderItem` | product.type | Partial | 商品服務方式與 type 綁太緊 | Sprint 2 |
| OM-005 | 外帶訂單預設 serviceType 外帶，其餘內用 | `src/services/orderModel.js` `addOrderItem` | order.seatId | Acceptable | 符合目前流程；若未來外帶商品可內用需再調整 | Future |
| OM-006 | 新品項數量固定 1 | `src/services/orderModel.js` `addOrderItem` | none | Yes | 低，加入後可改數量 | No change |
| OM-007 | 結帳付款方式預設 `cash` | `src/services/orderModel.js` `checkoutOrder` | paymentMethod default | Yes | 低，目前店內只收現金 | Future |
| OM-008 | 訂單 id 使用日期 + timestamp suffix | `src/services/orderModel.js` `createOrder` | local clock | Yes | 離線單機低風險；多人 / Firestore 時需重新設計 | Firestore Sprint |

本輪不重寫 `orderModel.js`。只有明確 bug、亂碼、undefined、dead code 或不影響流程的小型命名修正才可直接修改。

## 5. Firestore Adapter Audit

目前 Firestore 尚未接入主流程，`src/services/firestoreAdapter.js` 是 legacy stub / draft。主資料仍在 localStorage 與 JSON backup。

| Collection | Local State | Firestore Read | Firestore Write | Backup | Restore | Status |
|---|---:|---:|---:|---:|---:|---|
| `orders` | Yes | No | Stub only | Yes | Yes | Local-first truth source |
| `products` | Yes | No | No | Yes | Yes | Local-first master data |
| `businessEvents` | Yes | No | No | Yes | Yes | v2 local collection |
| `inventoryLots` | Yes | No | No | Yes | Yes | v2 local collection |
| `dailyClosings` | Yes | No | No | Yes | Yes | v2 local snapshot |
| `inventoryItems` | Yes, legacy | No | No | Yes | Yes | Legacy compatibility |
| `inventoryMovements` | Yes, legacy | No | No | Yes | Yes | Legacy compatibility |
| `settings` | Partial | No | No | export metadata only | Partial | Not a full domain model |

### Firestore 問題回答

1. 目前 Firestore Adapter 是否只是 legacy stub：是。
2. 哪些 collection 已實際同步：沒有 production sync；`syncStateToFirestore` 只回傳 stub result，沒有寫入 Firestore。
3. 哪些 collection 只存在本地資料或備份格式：全部 v2 collections 目前都只存在 localStorage / JSON backup。
4. 是否存在資料遺失風險：若使用者只依賴 Firestore，以目前程式會有風險；實際主流程尚未接 Firestore，所以風險是「誤以為已同步」。
5. full backup 是否涵蓋全部 v2 collections：目前 `buildFullBackupPayload` 包含 `orders`、`products`、`seats`、`dailyClosings`、`businessEvents`、`inventoryLots`、`inventoryItems`、`inventoryMovements`。
6. restore 是否能還原全部 v2 collections：目前 full backup restore 會帶入上述欄位並經 `normalizeState`；舊備份缺欄位會補預設值。
7. daily archive 是否與 Firestore sync 有關：無。daily archive 是下載 JSON 封存檔，不是同步機制。
8. 未來 Adapter 應採單一 generic interface，還是各 Domain service 分開：建議採 domain repository interface，例如 `ordersRepository`、`productsRepository`、`businessEventsRepository`，底層可共用 generic Firestore helper。不要讓 `main.js` 直接呼叫 Firestore collection 細節。

### Firestore Roadmap

- 先更新 schema 文件，確認 collection、index、migration。
- 再建立 repository interface。
- 最後才接 production Firestore。
- 不在 Sprint 0 做 production migration 或寫入測試。

## 6. Source Of Truth Matrix

| Data Concept | Source of Truth | Snapshot / Cache / Derived | Consumers | Notes |
|---|---|---|---|---|
| Sales revenue | paid `orders` orderItems | `dailyClosings` snapshot、Analytics derived | Analytics、daily report、history | 不以 dailyClosing 取代 orders |
| Order total | orderItems 的 `effectivePrice * quantity` 即時計算 | checkout confirm / dailyClosing snapshot | Current Order、history、backup | 不應另存多個 total truth |
| Product price snapshot | orderItem `basePrice` / `effectivePrice` / `price` | Product current price is only new-order source | History、Analytics | 舊訂單不應被 product price 修改影響 |
| Product cost snapshot | orderItem `cost` | Product current cost is only new-order source | Profit、Analytics | 毛利以 orderItem snapshot 為準 |
| Product rules | Future: Product metadata | Current: some orderModel hard-code | POS ordering | Sprint 2 遷移 |
| Payment status | `orders.status` + `checkedOutAt` + `paymentMethod` | activityLog | Workspace、history、Analytics | `paid` 是銷售納入統計的條件 |
| Seat assignment | open `orders.seatId` + `linkedSeatIds` | none | Workspace、seat cards | paid order 不佔用座位 |
| Order date | `createdAt` | none | Queue、history fallback | 開單時間 |
| Paid date | `checkedOutAt` | dailyClosing snapshot | Analytics、history、daily report | 銷售歸屬日優先使用 checkout time |
| Daily sales total | paid orders 重算 | `dailyClosings` snapshot | Daily archive、資料與設定 | snapshot 可稽核，不是唯一真相 |
| Customer source | `orders.customerSource` | Analytics summary | History、Analytics | label 由 customerSource service 提供 |
| Business event cost | `businessEvents.amount` / `costAmount` | Analytics summary | Business Events page、Analytics | 不寫入 orders |
| Inventory quantity | `inventoryLots.remainingQuantity` | Operational cache | 庫存現況 | Phase 4A 不自動扣，未來需 event audit |
| Customer source label | `customerSource.js` mapping | UI rendered text | Current Order、History、Analytics | 不應在 UI 重複定義 |
| Event type label | `businessEvents.js` mapping | UI rendered text | Business Events page、Analytics | 不應在 UI 重複定義 |

### Snapshot / Calculation Rules

- 建立訂單時應 snapshot：商品名稱、分類、type、售價、成本、冰飲加價、variant、點餐規則必要欄位。
- 即時計算：order total、profit、Analytics、daily report。
- 不得多處維護：customer source label、event type label、銷售總額、BusinessEvent summary。
- 仍有多重來源風險：Product price vs orderItem price、Product metadata vs orderModel hard-code、DailyClosing snapshot vs paid orders。

## 7. Documentation Gaps

### `FEATURE_SPEC.md`

- Git history: 曾存在於 commit `1f4d3f7 feat: redesign workspace around order queue`。
- Current branch working tree: 不存在。
- README: 第一輪已移除直接必讀引用，改用 `ROADMAP.md`。
- Existing equivalent: `ROADMAP.md` 與 `YUTU_OS_DESIGN_SYSTEM.md` 覆蓋部分規劃，但不是同一種功能規格文件。
- Classification: Needs Product Decision。
- Recommendation: 若後續仍要維持「下一階段功能規格與驗收條件」格式，可從 git history 恢復後更新；若 Roadmap 已取代，正式移除引用即可。

### `BACKUP_FORMAT.md`

- Git history: 曾存在於 commit `1f4d3f7 feat: redesign workspace around order queue`。
- Current branch working tree: 不存在。
- README: 第一輪已移除直接必讀引用，並標註目前缺檔。
- Existing equivalent: `DATA_MODEL.md` 有部分 backup / restore 欄位說明，但缺少完整 export format contract。
- Classification: Can Restore Safely, but needs review。
- Recommendation: 建議從 git history 恢復，再依目前 full backup、daily report、daily archive 更新。Backup contract 對正式營業資料保護重要，不建議只靠 DATA_MODEL 取代。

## 8. Naming and Label Consistency

### 已集中 mapping

- Customer Source label：`src/services/customerSource.js`
- Business Event type label：`src/services/businessEvents.js`
- Analytics category / seat fallback：`src/services/analytics.js`

### 仍需產品決策

- `今日結帳`、`日結`、`結束營業` 目前仍同時存在。Sprint 0 不直接定義它們是否等價。
- `Daily Closing` 在文件中是資料模型；UI 應優先使用中文。
- `Business Event` / `營運事件`：UI 使用中文，文件可中英並列。
- `Inventory Lot` / `庫存批次` / `庫存現況`：`InventoryLot` 是資料模型，`庫存現況` 是頁面，`甜點與熟豆批次` 是目前頁內功能範圍。

## 9. Sprint 1 / Sprint 2 Decision Queue

### Sprint 1 前需要產品決策

- `今日結帳` 是否等於 `結束營業`，或只是資料確認入口。
- 已關店後是否允許補單、撤銷、重新日結。
- open orders 存在時，日結 / daily archive 的正式規則。
- Backup / Restore 是否要從 `資料與設定` 拆成更低頻、風險更高的區塊。

### Sprint 2 前需要技術決策

- Product metadata 是否只用現有 `supportsHot` / `supportsIce` / `supportsTakeout` / `iceExtraPrice`，或新增 `temperatureOptions` / `priceModifiers`。
- `orderModel.js` 是否改名為 `orderService.js`，或保持現名只整理內部。
- 舊 orderItem 缺 metadata 時的 migration fallback 保留多久。

## 10. Recommended Next Order

1. Sprint 1：定義營業狀態、今日結帳、結束營業與高風險系統操作邊界。
2. Sprint 2：重構 `orderModel.js`，移除手沖 / 冰飲加價 hard-code。
3. Sprint 3：整理 summary / reporting service，降低 `main.js` 重複計算。
4. Sprint 4：維護 `BACKUP_FORMAT.md` 並補強 schema validation，再設計 Firestore repository。
5. Sprint 5：Inventory / Business Events 連動前，先定義 lot consumption event contract。
