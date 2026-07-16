const CUSTOMER_SOURCE_OPTIONS = [
  ["google_maps", "Google 地圖"],
  ["instagram", "Instagram"],
  ["threads", "Threads"],
  ["walk_in", "路過"],
  ["friend_referral", "朋友介紹"],
  ["xiaohongshu", "小紅書"],
  ["returning_customer", "再次回訪"],
  ["other", "其他"],
  ["not_asked", "未詢問"]
];

const CUSTOMER_SOURCE_VALUES = new Set(CUSTOMER_SOURCE_OPTIONS.map(([value]) => value));
const CUSTOMER_SOURCE_NOTE_VALUES = new Set(["other", "friend_referral"]);
const CUSTOMER_SOURCE_LABELS = Object.fromEntries(CUSTOMER_SOURCE_OPTIONS);

function unitPrice(item) {
  return Number(item.effectivePrice ?? item.price) || 0;
}

function quantity(item) {
  return Number(item.quantity) || 0;
}

export function customerSourceOptions() {
  return CUSTOMER_SOURCE_OPTIONS;
}

export function customerSourceLabelMap() {
  return CUSTOMER_SOURCE_LABELS;
}

export function normalizeCustomerSource(value) {
  return CUSTOMER_SOURCE_VALUES.has(value) ? value : "not_asked";
}

export function customerSourceLabel(source) {
  const normalized = normalizeCustomerSource(source);
  return CUSTOMER_SOURCE_LABELS[normalized] || CUSTOMER_SOURCE_LABELS.not_asked;
}

export function shouldShowCustomerSourceNote(source) {
  return CUSTOMER_SOURCE_NOTE_VALUES.has(normalizeCustomerSource(source));
}

export function buildCustomerSourceSummary(orders, options = {}) {
  const labels = options.customerSourceLabels || CUSTOMER_SOURCE_LABELS;
  const rows = new Map();
  (Array.isArray(orders) ? orders : []).forEach((order) => {
    const source = normalizeCustomerSource(order.customerSource);
    const row = rows.get(source) || {
      source,
      label: labels[source] || customerSourceLabel(source),
      orderCount: 0,
      revenue: 0,
      averageTicket: 0
    };
    row.orderCount += 1;
    order.items?.forEach((item) => {
      row.revenue += unitPrice(item) * quantity(item);
    });
    row.averageTicket = row.orderCount ? row.revenue / row.orderCount : 0;
    rows.set(source, row);
  });
  return [...rows.values()].sort((a, b) => b.revenue - a.revenue || b.orderCount - a.orderCount);
}
