# YUTU POS Docs

這個目錄整理 YUTU POS 目前程式實作對應的產品文件，重點是讓後續產品規劃、Codex 實作與功能檢查可以用同一份現況描述對齊。

文件以目前程式碼為準，不描述尚未實作的未來功能；若無法從程式碼確認，會標示「待確認」。

## 建議閱讀順序

1. `CURRENT_STATUS.md`：先看目前已實作功能與可操作範圍。
2. `BUSINESS_RULES.md`：確認訂單、座位、結帳、報表與備份的營業規則。
3. `DATA_MODEL.md`：確認 localStorage state、orders、日結與庫存預留模型。
4. `BACKUP_FORMAT.md`：確認 full backup、daily report、daily archive 的格式差異。
5. `UX_REVIEW.md`：從現場咖啡店 POS 操作效率角度檢查目前流程。
6. `FEATURE_SPEC.md`：整理下一階段已知要做的功能規格與驗收條件。
7. `firestore-schema.md`：補充 Firestore 資料模型方向，屬於資料同步規劃參考。

## 使用目的

- 產品規劃：確認目前 POS 是否符合現場營運流程，並排定下一階段改善優先順序。
- Codex 實作：讓後續修改功能時可以先對照現有規則，避免誤改既有流程。
- 功能檢查：作為測試版上正式版前的人工檢查清單初稿。
