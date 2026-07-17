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

export function knownUnitCost(value) {
  if (value === null || value === undefined || value === "") return null;
  const cost = Number(value);
  return Number.isFinite(cost) ? cost : null;
}

export function priceFieldsForItem(item) {
  const basePrice = Number(item.basePrice ?? item.price ?? item.effectivePrice) || 0;
  const iceExtraPrice = Number(item.iceExtraPrice ?? item.iceExtra ?? 0) || 0;
  const iceExtra = item.temperature === "冰" ? iceExtraPrice : 0;
  const effectivePrice = basePrice + iceExtra;
  const cost = knownUnitCost(item.cost);

  return {
    basePrice,
    effectivePrice,
    iceExtra,
    iceExtraPrice,
    price: effectivePrice,
    profit: cost === null ? null : effectivePrice - cost
  };
}

export function createOrder({ seatId, people }) {
  const now = new Date();

  return {
    id: `YT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getTime()).slice(-5)}`,
    createdAt: now.toISOString(),
    seatId,
    people,
    items: [],
    activityLog: [],
    status: "open",
    paymentMethod: null,
    checkedOutAt: null
  };
}

export function addOrderItem(order, product, options = {}) {
  const requiresTemperature = product.requiresTemperature ?? product.type === "drink";
  const requiresServiceType = product.requiresServiceType ?? product.type !== "retail";
  const temperature = requiresTemperature ? options.temperature || "熱" : "";
  const serviceType = options.serviceType || (order.seatId === "takeout" ? "外帶" : "內用");
  const baseItem = {
    category: product.category,
    temperature,
    basePrice: product.price,
    cost: knownUnitCost(product.cost),
    iceExtraPrice: Number(product.iceExtraPrice) || 0
  };
  const priceFields = priceFieldsForItem(baseItem);

  return {
    ...order,
    items: [
      ...order.items,
      {
        lineId: createLineId(),
        productId: product.id,
        name: product.name,
        variantName: options.variantName || "",
        category: product.category,
        type: product.type,
        quantity: 1,
        requiresTemperature,
        requiresServiceType,
        supportsHot: product.supportsHot,
        supportsIce: product.supportsIce,
        iceExtraPrice: priceFields.iceExtraPrice,
        temperature,
        serviceType: requiresServiceType ? serviceType : "",
        basePrice: priceFields.basePrice,
        effectivePrice: priceFields.effectivePrice,
        iceExtra: priceFields.iceExtra,
        price: priceFields.price,
        cost: baseItem.cost,
        profit: priceFields.profit,
        served: false,
        note: options.note || ""
      }
    ]
  };
}

export function updateOrderItem(order, lineId, patch) {
  return {
    ...order,
    items: order.items.map((item) => {
      if (item.lineId !== lineId) return item;
      const next = { ...item, ...patch };
      return { ...next, ...priceFieldsForItem(next) };
    })
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
      const price = Number(item.effectivePrice ?? item.price) || 0;
      const cost = knownUnitCost(item.cost);

      summary.total += price * quantity;
      if (cost === null) {
        summary.unknownCostItems += 1;
        summary.unknownCostQuantity += quantity;
        summary.unknownCostRevenue += price * quantity;
      } else {
        summary.cost += cost * quantity;
        summary.knownCostRevenue += price * quantity;
        summary.profit += (price - cost) * quantity;
      }
      summary.drinks += item.type === "drink" ? quantity : 0;
      summary.desserts += item.type === "dessert" ? quantity : 0;
      summary.retail += item.type === "retail" ? quantity : 0;
      return summary;
    },
    {
      total: 0,
      cost: 0,
      profit: 0,
      knownCostRevenue: 0,
      unknownCostRevenue: 0,
      unknownCostItems: 0,
      unknownCostQuantity: 0,
      drinks: 0,
      desserts: 0,
      retail: 0
    }
  );
}

export function checkoutOrder(order, paymentMethod = "cash") {
  const checkedOutAt = new Date().toISOString();
  return {
    ...order,
    status: "paid",
    paymentMethod,
    checkedOutAt,
    activityLog: [...(Array.isArray(order.activityLog) ? order.activityLog : []), { type: "checkout", at: checkedOutAt }]
  };
}
