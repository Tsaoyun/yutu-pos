export const INVENTORY_LOT_TYPES = ["dessert", "roasted_beans"];
export const INVENTORY_LOT_STATUSES = ["active", "archived"];
export const INVENTORY_LOT_ITEM_SOURCES = ["product", "material", "manual"];

const LOT_TYPE_LABELS = {
  dessert: "甜點批次",
  roasted_beans: "熟豆批次"
};

const LOT_STATUS_LABELS = {
  active: "使用中",
  archived: "已封存"
};

const LOT_TYPE_VALUES = new Set(INVENTORY_LOT_TYPES);
const LOT_STATUS_VALUES = new Set(INVENTORY_LOT_STATUSES);
const ITEM_SOURCE_VALUES = new Set(INVENTORY_LOT_ITEM_SOURCES);

function createId(prefix = "lot") {
  try {
    if (globalThis.crypto?.randomUUID) {
      return `${prefix}-${globalThis.crypto.randomUUID()}`;
    }
  } catch {
    // Older browsers may expose crypto without randomUUID.
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function numberOrZero(value) {
  return Number(value) || 0;
}

function quantityOrZero(value) {
  return Math.max(0, Math.trunc(Number(value) || 0));
}

function normalizeLotType(type) {
  return LOT_TYPE_VALUES.has(type) ? type : "dessert";
}

function normalizeLotStatus(status) {
  return LOT_STATUS_VALUES.has(status) ? status : "active";
}

function normalizeItemSource(source) {
  return ITEM_SOURCE_VALUES.has(source) ? source : "manual";
}

export function inventoryLotTypeOptions() {
  return INVENTORY_LOT_TYPES.map((type) => [type, LOT_TYPE_LABELS[type] || type]);
}

export function inventoryLotTypeLabel(type) {
  return LOT_TYPE_LABELS[type] || type || "未分類";
}

export function inventoryLotStatusLabel(status) {
  return LOT_STATUS_LABELS[status] || status || "未分類";
}

export function defaultUnitForLotType(type) {
  return normalizeLotType(type) === "roasted_beans" ? "g" : "片";
}

export function createInventoryLot(input = {}) {
  const now = new Date().toISOString();
  const lotType = normalizeLotType(input.lotType);
  const initialQuantity = quantityOrZero(input.initialQuantity);
  const remainingQuantity = input.remainingQuantity === undefined
    ? initialQuantity
    : quantityOrZero(input.remainingQuantity);
  const legacyUnitCost = input.costAmount && initialQuantity ? numberOrZero(input.costAmount) / initialQuantity : 0;
  const unitCost = Number.isFinite(Number(input.unitCost)) ? numberOrZero(input.unitCost) : legacyUnitCost;
  const costAmount = Number.isFinite(Number(input.costAmount)) ? numberOrZero(input.costAmount) : unitCost * initialQuantity;
  return {
    lotId: input.lotId || input.id || createId("inventory-lot"),
    itemSource: normalizeItemSource(input.itemSource),
    productId: input.productId || "",
    materialId: input.materialId || "",
    itemName: input.itemName || "",
    itemCategory: input.itemCategory || "",
    lotType,
    sourceEventId: input.sourceEventId || "",
    madeDate: input.madeDate || "",
    roastDate: input.roastDate || "",
    purchaseDate: input.purchaseDate || "",
    expireDate: input.expireDate || "",
    initialQuantity,
    remainingQuantity,
    unit: input.unit || defaultUnitForLotType(lotType),
    unitCost,
    costAmount,
    status: normalizeLotStatus(input.status),
    note: input.note || "",
    createdAt: input.createdAt || now,
    updatedAt: input.updatedAt || now
  };
}

export function normalizeInventoryLots(lots) {
  if (!Array.isArray(lots)) return [];
  return lots
    .filter((lot) => lot && typeof lot === "object")
    .map((lot) => createInventoryLot(lot));
}
