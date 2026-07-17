# Docs Addendum: Sprint 1 Daily Operating Workflow

Sprint 1 adds the implemented daily operating workflow documentation:

- `DAILY_OPERATING_WORKFLOW.md`: how operating status, today closing, late entry, paid-order corrections, and void work.
- `DAILY_CLOSING_RULES.md`: daily closing snapshot rules, official/superseded versioning, backup behavior, and recalculation boundaries.

Recommended reading order after Sprint 1:

1. `CURRENT_STATUS.md`
2. `DAILY_OPERATING_WORKFLOW.md`
3. `DAILY_CLOSING_RULES.md`
4. `DATA_MODEL.md`
5. `BACKUP_FORMAT.md`
6. `BUSINESS_RULES.md`
7. `ARCHITECTURE_DECISIONS.md`
8. `TECHNICAL_DEBT.md`

Sprint 2 Phase 2A product metadata planning:

- `SPRINT2_IMPLEMENTATION_REVIEW.md`: final Sprint 2 implementation review and commit readiness.
- `PRODUCT_SPECIFICATION_V1_REVIEW.md`: review of the external Product Specification v1 against the current codebase.
- `SPRINT2B_IMPLEMENTATION_PLAN.md`: implementation sequence and acceptance tests for Product metadata cleanup.
- `PRODUCT_SCHEMA_V2_PROPOSAL.md`: proposed Product Schema v2, category defaults, and field decisions.
- `PRODUCT_RULE_AUDIT.md`: current hard-coded product/order rules and risk table.
- `PRODUCT_MIGRATION_PLAN.md`: proposed lazy normalize and Phase 2B migration steps.
- `MASTER_DATA_GUIDE.md`: master data, transaction data, snapshot, and derived-data boundaries.

# Docs Addendum: Current IA Names

目前介面入口以 v2 導覽命名為準：`POS 工作台`、`訂單歷史`、`今日結帳`、`營運事件`、`庫存現況`、`商品`、`經營分析`、`資料與設定`。

閱讀 UI / UX 文件時，若看到舊稱，請以以下對照理解：

- `銷售紀錄` -> `訂單歷史`
- `營運紀錄` -> `營運事件`
- `資源管理` -> `庫存現況`
- `備份與日結` -> `資料與設定` 頁內的 `今日結帳／日結` 與 `資料備份與還原`

# YUTU POS Docs

這個目錄整理 YUTU POS 目前程式實作對應的產品文件，重點是讓後續產品規劃、Codex 實作與功能檢查可以用同一份現況描述對齊。

文件以目前程式碼為準，不描述尚未實作的未來功能；若無法從程式碼確認，會標示「待確認」。

## 建議閱讀順序

1. `CURRENT_STATUS.md`：先看目前已實作功能與可操作範圍。
2. `BUSINESS_RULES.md`：確認訂單、座位、結帳、報表與備份的營業規則。
3. `DATA_MODEL.md`：確認 localStorage state、orders、日結與庫存預留模型。
4. `BACKUP_FORMAT.md`：確認 full backup、daily report、daily archive 與 restore 的格式差異。
5. `SPRINT_0_ARCHITECTURE_AUDIT.md`：確認 Analytics data contract、hard-coded 規則、source of truth 與技術債。
6. `ARCHITECTURE_DECISIONS.md`：確認後續開發不可違反的已接受架構決策。
7. `TECHNICAL_DEBT.md`：查看目前已知技術債、影響、風險與建議處理 Sprint。
8. `UX_REVIEW.md`：從現場咖啡店 POS 操作效率角度檢查目前流程。
9. `ROADMAP.md`：整理後續階段規劃與開發順序。
10. `firestore-schema.md`：補充 Firestore 資料模型方向，屬於資料同步規劃參考；目前仍是 legacy draft。

目前此分支仍未包含 `FEATURE_SPEC.md`。此文件曾存在於 Git history，但是否恢復需產品決策；建議於 Sprint 1 流程定案後再恢復或重建。

## 使用目的

- 產品規劃：確認目前 POS 是否符合現場營運流程，並排定下一階段改善優先順序。
- Codex 實作：讓後續修改功能時可以先對照現有規則，避免誤改既有流程。
- 功能檢查：作為測試版上正式版前的人工檢查清單初稿。
