# Technical Debt Register

本文件只記錄目前架構、程式或文件中已存在，且會影響維護性、資料一致性或正確性的問題。未來想做但尚未存在的功能，不列為技術債。

| ID | Category | Description | Impact | Risk | Proposed Sprint | Status |
|---|---|---|---|---|---|---|
| TD-001 | Data Contract | Analytics UI 需要 `customerSourceSummary` / `businessEventSummary`，service 第一輪前未固定輸出 | 經營分析可能出現 undefined 或 runtime error | High | Sprint 0 | Fixed |
| TD-002 | Naming | Customer Source / Business Event label 曾有亂碼 | UI 可讀性與報表可信度下降 | Medium | Sprint 0 | Fixed main service labels |
| TD-003 | Hard-coded Rule | `orderModel.js` 以 `POUROVER_ICE_EXTRA = 10` 處理冰飲加價 | 新商品或不同加價規則需改程式 | Medium | Sprint 2 | Open |
| TD-004 | Hard-coded Rule | `orderModel.js` 以 `category === "pourover" || "手沖"` 判斷規則 | category rename / 新分類會破壞價格規則 | Medium | Sprint 2 | Open |
| TD-005 | Hard-coded Rule | 冰熱與內外帶預設仍部分依賴 `product.type` | Product metadata 尚未成為唯一規則來源 | Medium | Sprint 2 | Open |
| TD-006 | Legacy Adapter | `firestoreAdapter.js` 是 stub，schema 未包含 v2 collections | 容易誤以為資料已同步到 Firestore | High | Firestore Sprint | Open |
| TD-007 | Documentation | `BACKUP_FORMAT.md` 曾缺少於此分支工作樹 | Backup contract 缺少獨立文件會降低 restore 安全性 | Medium | Sprint 0 | Fixed |
| TD-008 | Documentation | `FEATURE_SPEC.md` 目前不在此分支工作樹 | 下一階段 feature spec 可能只散落在 Roadmap / design docs | Low-Medium | Product Decision | Needs decision |
| TD-009 | Architecture | `main.js` 同時承擔 normalize、backup、dailyClosing、render、event delegation | 後續功能容易使檔案膨脹，改動風險增加 | Medium | Incremental | Open |
| TD-010 | Data Contract | 日報 / 日結統計與 Analytics summary 有重複推導 | 不同頁面可能算出不同結果 | Medium | Sprint 3 | Open |
| TD-011 | Migration | `menuItems`、`inventoryItems`、`inventoryMovements` 是相容欄位 | 新開發者可能誤認為 v2 truth source | Low-Medium | Documentation / Firestore Sprint | Documented |
| TD-012 | Naming | `今日結帳`、`日結`、`結束營業` 尚未被 Sprint 1 正式定義 | 使用者可能混淆狀態與操作 | Medium | Sprint 1 | Open |
| TD-013 | Migration | Firestore draft 使用 `dailyStats`，目前程式使用 `dailyClosings` | 未來 migration 可能命名衝突 | Medium | Firestore Sprint | Open |
| TD-014 | Future Feature | `inventoryLots.remainingQuantity` 尚未由事件稽核或重算 | 批次剩餘量是快取，長期可能與實際不一致 | Medium | Inventory Sprint | Open |
| TD-015 | Backup Format | Restore 缺少嚴格 `schemaVersion` / `app` gate | 錯誤格式只靠 orders/products 結構攔截，長期 migration 風險較高 | Medium | Backup hardening | Open |
| TD-016 | Restore Safety | Restore 前不會自動建立 rollback backup | 使用者若未手動備份，匯入錯誤資料後回復成本高 | Medium | Backup hardening | Open |
| TD-017 | Schema Compatibility | Backup 中 `seats` 目前不會完整覆蓋 `defaultSeats` | 若未來支援自訂座位，restore 結果可能不符合備份內容 | Low-Medium | Seat customization / Backup hardening | Open |
| TD-018 | Backup Format | Daily archive 不包含 Business Events 明細 | 單日營業封存不等於完整營運事件封存 | Low-Medium | Daily archive v2 | Open |

## Classification Rules

- Bug：已造成或很可能造成錯誤。
- Data Contract：service 與 UI / backup / restore 的固定資料契約問題。
- Hard-coded Rule：商業規則寫在程式分支或常數中，而非資料模型。
- Legacy Adapter：舊 adapter、stub 或尚未接入主流程的同步層。
- Naming：同概念多名稱、亂碼、使用者語意不清。
- Documentation：文件缺漏或與程式不同步。
- Migration：舊資料相容、欄位過渡或未來 Firestore migration 風險。
- Future Feature：已存在資料結構但功能尚未完成，且可能造成誤解或維護風險。
