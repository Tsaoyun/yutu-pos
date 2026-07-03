function createLineId() {
  try {
    if (globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }
  } catch {
    // iOS Safari can expose crypto in edge cases where randomUUID still throws.
  }
  return `line-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createOrder({ seatId, people }) {
  const now = new Date();

  return {
    id: `YT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getTime()).slice(-5)}`,
    createdAt: now.toISOString(),
    seatId,
    people,
    items: [],
    status: "open",
    paymentMethod: null,
    checkedOutAt: null
  };
}

export function addOrderItem(order, product, options = {}) {
  const requiresTemperature = product.requiresTemperature ?? product.type === "drink";
  const requiresServiceType = product.requiresServiceType ?? product.type !== "retail";

  return {
    ...order,
    items: [
      ...order.items,
      {
        lineId: createLineId(),
        productId: product.id,
        name: product.name,
        category: product.category,
        type: product.type,
        quantity: 1,
        requiresTemperature,
        requiresServiceType,
        temperature: requiresTemperature ? options.temperature || "熱" : "",
        serviceType: requiresServiceType ? options.serviceType || "內用" : "",
        price: product.price,
        cost: product.cost,
        profit: product.price - product.cost,
        served: false,
        note: options.note || ""
      }
    ]
  };
}

export function updateOrderItem(order, lineId, patch) {
  return {
    ...order,
    items: order.items.map((item) => (item.lineId === lineId ? { ...item, ...patch } : item))
  };
}

export function removeOrderItem(order, lineId) {
  return {
    ...order,
    items: order.items.filter((item) => item.lineId !== lineId)
  };
}

export function calculateOrder(order) {
  return order.items.reduce(
    (summary, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const cost = Number(item.cost) || 0;

      summary.total += price * quantity;
      summary.cost += cost * quantity;
      summary.profit += (price - cost) * quantity;
      summary.drinks += item.type === "drink" ? quantity : 0;
      summary.desserts += item.type === "dessert" ? quantity : 0;
      return summary;
    },
    { total: 0, cost: 0, profit: 0, drinks: 0, desserts: 0 }
  );
}

export function checkoutOrder(order, paymentMethod = "cash") {
  return {
    ...order,
    status: "paid",
    paymentMethod,
    checkedOutAt: new Date().toISOString()
  };
}
