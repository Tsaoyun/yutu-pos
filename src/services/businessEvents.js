export const BUSINESS_EVENT_TYPES = [
  "purchase",
  "production",
  "roasting",
  "waste",
  "personal",
  "test",
  "complimentary",
  "stock_adjustment"
];

export const USAGE_TYPES = [
  "sale",
  "waste",
  "personal",
  "test",
  "complimentary",
  "other"
];

export const BUSINESS_EVENT_FORM_TYPES = ["purchase", "waste", "personal", "test", "complimentary"];
export const BUSINESS_EVENT_ITEM_SOURCES = ["product", "material", "manual"];

const BUSINESS_EVENT_TYPE_LABELS = {
  purchase: "採購",
  production: "生產",
  roasting: "烘豆",
  waste: "報廢",
  personal: "自用",
  test: "測試",
  complimentary: "招待",
  stock_adjustment: "盤點修正"
};

const EVENT_TYPE_VALUES = new Set(BUSINESS_EVENT_TYPES);
const USAGE_TYPE_VALUES = new Set(USAGE_TYPES);
const USAGE_EVENT_TYPES = new Set(["waste", "personal", "test", "complimentary"]);
const ITEM_SOURCE_VALUES = new Set(BUSINESS_EVENT_ITEM_SOURCES);

function createId(prefix = "event") {
  try {
    if (globalThis.crypto?.randomUUID) {
      return `${prefix}-${globalThis.crypto.randomUUID()}`;
    }
  } catch {
    // Older browsers may expose crypto without randomUUID.
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeEventType(type) {
  return EVENT_TYPE_VALUES.has(type) ? type : "stock_adjustment";
}

function normalizeUsageType(type, eventType) {
  if (USAGE_EVENT_TYPES.has(eventType)) {
    return USAGE_TYPE_VALUES.has(type) ? type : eventType;
  }
  return USAGE_TYPE_VALUES.has(type) ? type : null;
}

function normalizeItemSource(source) {
  return ITEM_SOURCE_VALUES.has(source) ? source : "manual";
}

function numberOrZero(value) {
  return Number(value) || 0;
}

function quantityOrOne(value) {
  return Math.max(1, Math.trunc(Number(value) || 1));
}

export function businessEventTypeOptions({ formOnly = false } = {}) {
  const types = formOnly ? BUSINESS_EVENT_FORM_TYPES : BUSINESS_EVENT_TYPES;
  return types.map((type) => [type, BUSINESS_EVENT_TYPE_LABELS[type] || type]);
}

export function businessEventTypeLabel(type) {
  return BUSINESS_EVENT_TYPE_LABELS[type] || type || "未分類";
}

export function createBusinessEvent(input = {}) {
  const now = new Date().toISOString();
  const type = normalizeEventType(input.type);
  const quantity = quantityOrOne(input.quantity);
  const legacyUnitCost = input.costAmount && quantity ? numberOrZero(input.costAmount) / quantity : 0;
  const unitCost = Number.isFinite(Number(input.unitCost)) ? numberOrZero(input.unitCost) : legacyUnitCost;
  const costAmount = Number.isFinite(Number(input.costAmount)) ? numberOrZero(input.costAmount) : unitCost * quantity;
  return {
    id: input.id || createId("business-event"),
    date: input.date || now.slice(0, 10),
    type,
    usageType: normalizeUsageType(input.usageType, type),
    itemId: input.itemId || "",
    itemSource: normalizeItemSource(input.itemSource),
    productId: input.productId || "",
    materialId: input.materialId || "",
    itemName: input.itemName || "",
    itemCategory: input.itemCategory || "",
    quantity,
    unit: input.unit || "",
    unitCost,
    amount: numberOrZero(input.amount),
    costAmount,
    vendor: input.vendor || "",
    note: input.note || "",
    createdAt: input.createdAt || now,
    updatedAt: input.updatedAt || now
  };
}

export function normalizeBusinessEvents(events) {
  if (!Array.isArray(events)) return [];
  return events
    .filter((event) => event && typeof event === "object")
    .map((event) => createBusinessEvent(event));
}

export function filterBusinessEventsByDateRange(events, startDate, endDate) {
  const start = startDate || "";
  const end = endDate || start;
  return normalizeBusinessEvents(events).filter((event) => {
    if (!start && !end) return true;
    if (start && event.date < start) return false;
    if (end && event.date > end) return false;
    return true;
  });
}

export function summarizeBusinessEvents(events, options = {}) {
  const scopedEvents = options.startDate || options.endDate
    ? filterBusinessEventsByDateRange(events, options.startDate, options.endDate)
    : normalizeBusinessEvents(events);
  return scopedEvents.reduce(
    (summary, event) => {
      if (event.type === "waste" || event.usageType === "waste") summary.wasteCost += event.costAmount;
      if (event.type === "personal" || event.usageType === "personal") summary.personalCost += event.costAmount;
      if (event.type === "test" || event.usageType === "test") summary.testCost += event.costAmount;
      if (event.type === "complimentary" || event.usageType === "complimentary") {
        summary.complimentaryCost += event.costAmount;
      }
      if (event.type === "purchase") summary.purchaseAmount += event.amount || event.costAmount;
      return summary;
    },
    {
      wasteCost: 0,
      personalCost: 0,
      testCost: 0,
      complimentaryCost: 0,
      purchaseAmount: 0
    }
  );
}
