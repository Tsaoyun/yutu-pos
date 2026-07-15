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

function supportsTemperature(productOrItem) {
  return Boolean(productOrItem.supportsHot || productOrItem.supportsIce || productOrItem.requiresTemperature);
}

function defaultTemperature(product, requestedTemperature = "") {
  if (!supportsTemperature(product)) return "";
  if (requestedTemperature === "冰" && product.supportsIce !== false) return "冰";
  if (requestedTemperature === "熱" && product.supportsHot !== false) return "熱";
  if (product.supportsHot !== false) return "熱";
  if (product.supportsIce !== false) return "冰";
  return "";
}

export function priceFieldsForItem(item) {
  const basePrice = Number(item.basePrice ?? item.price ?? item.effectivePrice) || 0;
  const iceExtra =
    item.temperature === "冰" && supportsTemperature(item)
      ? Number(item.iceExtraPrice ?? item.iceExtra ?? 0) || 0
      : 0;
  const effectivePrice = basePrice + iceExtra;

  return {
    basePrice,
    effectivePrice,
    iceExtra,
    price: effectivePrice,
    profit: effectivePrice - (Number(item.cost) || 0)
  };
}

export function createOrder({ seatId, people }) {
  const now = new Date();

  return {
    id: `YT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getTime()).slice(-5)}`,
    createdAt: now.toISOString(),
    seatId,
    people,
    linkedSeatIds: [],
    items: [],
    activityLog: [],
    status: "open",
    paymentMethod: null,
    checkedOutAt: null,
    customerSource: "not_asked",
    customerSourceNote: ""
  };
}

export function addOrderItem(order, product, options = {}) {
  const requiresTemperature = supportsTemperature(product);
  const requiresServiceType = product.requiresServiceType ?? product.supportsTakeout !== false;
  const temperature = defaultTemperature(product, options.temperature);
  const serviceType = options.serviceType || (order.seatId === "takeout" ? "外帶" : "內用");
  const baseItem = {
    category: product.category,
    temperature,
    supportsHot: product.supportsHot !== false,
    supportsIce: product.supportsIce !== false,
    iceExtraPrice: Number(product.iceExtraPrice) || 0,
    basePrice: product.price,
    cost: product.cost
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
        supportsHot: product.supportsHot !== false,
        supportsIce: product.supportsIce !== false,
        supportsTakeout: product.supportsTakeout !== false,
        temperature,
        serviceType: requiresServiceType ? serviceType : "",
        iceExtraPrice: Number(product.iceExtraPrice) || 0,
        basePrice: priceFields.basePrice,
        effectivePrice: priceFields.effectivePrice,
        iceExtra: priceFields.iceExtra,
        price: priceFields.price,
        cost: product.cost,
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
  const checkedOutAt = new Date().toISOString();
  return {
    ...order,
    status: "paid",
    paymentMethod,
    checkedOutAt,
    activityLog: [...(Array.isArray(order.activityLog) ? order.activityLog : []), { type: "checkout", at: checkedOutAt }]
  };
}
