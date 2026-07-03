/**
 * Firestore collection plan:
 *
 * stores/{storeId}/seats/{seatId}
 * stores/{storeId}/products/{productId}
 * stores/{storeId}/orders/{orderId}
 * stores/{storeId}/dailyStats/{yyyy-mm-dd}
 *
 * Order document:
 * {
 *   id, createdAt, seatId, people, items[],
 *   total, cost, profit, paymentMethod, checkedOutAt, status
 * }
 */

export const firestoreSchema = {
  seats: {
    id: "string",
    name: "string",
    icon: "string",
    sortOrder: "number",
    active: "boolean"
  },
  products: {
    id: "string",
    name: "string",
    category: "espresso | pourover | tea | dessert | beans",
    price: "number",
    cost: "number",
    profit: "computed price - cost",
    active: "boolean",
    type: "drink | dessert | retail",
    sort: "number",
    note: "string"
  },
  orders: {
    id: "string",
    createdAt: "ISO string",
    seatId: "string",
    people: "number",
    items: "OrderItem[]",
    total: "number",
    cost: "number",
    profit: "number",
    paymentMethod: "cash | null",
    checkedOutAt: "ISO string | null",
    status: "open | paid"
  }
};

export async function syncStateToFirestore({ db, storeId, state }) {
  if (!db || !storeId) {
    return { ok: false, reason: "Firestore is not configured yet." };
  }

  // Wire this to firebase/firestore in production:
  // import { doc, setDoc, writeBatch } from "firebase/firestore";
  // const batch = writeBatch(db);
  // batch.set(doc(db, "stores", storeId), { updatedAt: new Date().toISOString() }, { merge: true });
  // state.orders.forEach(order => batch.set(doc(db, "stores", storeId, "orders", order.id), order, { merge: true }));
  // await batch.commit();
  return { ok: true, syncedOrders: state.orders.length };
}
