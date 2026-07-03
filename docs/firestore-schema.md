# Firestore Schema

目前 V1 先使用 `localStorage`，但保留 Firestore adapter，未來可同步到以下結構。

Root path:

```text
stores/{storeId}
```

## seats

```text
stores/{storeId}/seats/{seatId}
```

```json
{
  "id": "sofa",
  "name": "沙發區",
  "icon": "🛋",
  "sortOrder": 3,
  "active": true,
  "updatedAt": "2026-07-03T00:00:00.000Z"
}
```

## products

```text
stores/{storeId}/products/{productId}
```

```json
{
  "id": "latte",
  "name": "拿鐵咖啡",
  "category": "espresso",
  "price": 130,
  "cost": 26.51,
  "active": true,
  "type": "drink",
  "sort": 2,
  "note": "",
  "updatedAt": "2026-07-03T00:00:00.000Z"
}
```

`profit` is computed in the app as `price - cost`.

## orders

```text
stores/{storeId}/orders/{orderId}
```

```json
{
  "id": "YT-20260703-12345",
  "createdAt": "2026-07-03T06:35:00.000Z",
  "seatId": "sofa",
  "people": 3,
  "items": [
    {
      "lineId": "uuid",
      "productId": "latte",
      "name": "拿鐵咖啡",
      "category": "espresso",
      "type": "drink",
      "quantity": 2,
      "temperature": "熱",
      "serviceType": "內用",
      "price": 130,
      "cost": 26.51,
      "profit": 103.49,
      "served": false,
      "note": ""
    }
  ],
  "total": 260,
  "cost": 53.02,
  "profit": 206.98,
  "paymentMethod": "cash",
  "checkedOutAt": "2026-07-03T07:10:00.000Z",
  "status": "paid"
}
```

## dailyStats

```text
stores/{storeId}/dailyStats/{yyyy-mm-dd}
```

```json
{
  "date": "2026-07-03",
  "revenue": 6200,
  "profit": 3180.5,
  "drinks": 34,
  "desserts": 12,
  "orderCount": 18,
  "updatedAt": "2026-07-03T12:00:00.000Z"
}
```

Daily stats can be computed client-side for the prototype and later moved to a Cloud Function if multiple devices write at the same time.

## V1.1 Notes

- `src/data/menu.js` is seed data only.
- Runtime product records should be read from localStorage now and Firestore later.
- Order items store snapshots of name, category, price, cost, type, and note so product edits do not mutate historical orders.
- `active: false` hides or disables products only for future ordering.
