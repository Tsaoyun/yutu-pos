# 隅途咖啡 YUTU POS

iPad mini first 座位／客單管理 POS。設計給一人吧台使用：客人入座後建立訂單，中途可加點，離開時一次現金結帳。

## V1 功能

- 固定座位：廁所旁、靠窗高腳桌、沙發區、轉角、吧台前
- 首頁顯示目前店內狀態：人數、入座時間、目前金額
- 新增訂單、加點、修改數量、刪除品項
- 切換冰／熱、內用／外帶
- 品項依飲品、甜品、熟豆分組，支援出單／已出標記
- 現金後結帳
- 今日營收、今日毛利、飲品杯數、甜品數
- 歷史訂單查看、編輯、刪除
- localStorage 本機保存
- 保留 Firebase / Firestore adapter 架構
- PWA manifest 與 service worker

## V1.1 功能

- 商品管理：新增、編輯、停售、恢復販售
- 商品欄位：品名、類別、類型、售價、成本、販售狀態、排序、備註
- `src/data/menu.js` 僅作為初始商品資料，營業中商品資料存在 localStorage 的 `products`
- 修改商品價格與成本只影響新的訂單
- 訂單品項會保留當下的品名、售價、成本快照
- 歷史訂單可依日期查詢
- 指定日期顯示營業額、毛利、飲品杯數、甜品數、熟豆數、訂單數
- 指定日期顯示商品銷售彙總，可依金額或數量排序

## 本機啟動

需要先安裝 Node.js 與 npm。

```bash
npm install
npm run dev
```

開啟 Vite 顯示的網址，通常是：

```text
http://127.0.0.1:5173
```

Production build:

```bash
npm run build
npm run preview
```

## iPad mini 使用方式

1. 將專案部署到 Vercel，或在同一個 Wi-Fi 下用本機網址開啟。
2. 在 iPad mini Safari 開啟 YUTU POS 網址。
3. 點 Safari 分享按鈕。
4. 選擇「加入主畫面」。
5. 之後從主畫面開啟「隅途 POS」，會以接近 App 的模式使用。

注意：目前資料存在該瀏覽器的 localStorage。若清除 Safari 網站資料、更換裝置或改用不同瀏覽器，資料不會自動同步。未來接 Firestore 後可跨 iPad、iPhone、Mac、Windows 同步。

## 部署到 Vercel

1. 將專案推到 GitHub。
2. 在 Vercel 建立新專案並選擇此 repo。
3. Framework Preset 選 Vite。
4. Build Command 使用：

```bash
npm run build
```

5. Output Directory 使用：

```text
dist
```

本專案已包含 `vercel.json`，Vercel 通常會自動套用。

## Firestore Model

詳細資料結構見：

```text
docs/firestore-schema.md
```

主要集合：

```text
stores/{storeId}/seats/{seatId}
stores/{storeId}/products/{productId}
stores/{storeId}/orders/{orderId}
stores/{storeId}/dailyStats/{yyyy-mm-dd}
```

## 目前限制

- 付款方式 V1 只有現金。
- localStorage 不會跨裝置同步。
- `standalone.html` 只保留為啟動提示頁；正式 PWA / Vercel 使用 `index.html` 與 `src/main.js`。
- 尚未做發票、會員、QR Code 點餐、庫存、複雜報表。
- 歷史訂單編輯會先退回未結帳狀態，修改後需重新結帳。
