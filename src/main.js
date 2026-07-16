import { categories, menuItems as defaultMenuItems } from "./data/menu.js";
import { defaultSeats } from "./data/seats.js";
import {
  addOrderItem,
  calculateOrder,
  checkoutOrder,
  createOrder,
  removeOrderItem,
  updateOrderItem
} from "./services/orderModel.js";
import { buildAnalyticsDashboard } from "./services/analytics.js";
import {
  customerSourceLabel,
  customerSourceLabelMap,
  customerSourceOptions,
  normalizeCustomerSource,
  shouldShowCustomerSourceNote
} from "./services/customerSource.js";
import {
  businessEventTypeLabel,
  businessEventTypeOptions,
  createBusinessEvent,
  normalizeBusinessEvents
} from "./services/businessEvents.js";
import {
  createInventoryLot,
  defaultUnitForLotType,
  inventoryLotStatusLabel,
  inventoryLotTypeLabel,
  inventoryLotTypeOptions,
  normalizeInventoryLots
} from "./services/inventoryLots.js";
import { loadState, saveState, STORAGE_KEY } from "./services/storage.js";
import "./styles.css";

const typeLabels = { drink: "飲品", dessert: "甜品", retail: "熟豆" };
const APP_BRANCH = "feature/analytics-dashboard";
const PRODUCTION_HOSTS = ["yutu-pos.vercel.app"];
const TAKEOUT_SEAT_ID = "takeout";
const TAKEOUT_SEAT = { id: TAKEOUT_SEAT_ID, name: "外帶", icon: "🥡" };
const UNDO_CHECKOUT_LIMIT_MINUTES = 5;
const money = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0
});
const percent = new Intl.NumberFormat("zh-TW", {
  style: "percent",
  maximumFractionDigits: 1
});
const CATEGORY_METADATA = {
  pourover: { iceExtraPrice: 10 }
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const isDebugMode = new URLSearchParams(window.location.search).get("debug") === "1";
const EXPORT_SCHEMA_VERSION = 1;
const EXPORT_APP_NAME = "YUTU_POS";

const initialState = {
  seats: defaultSeats,
  products: seedProducts(defaultMenuItems),
  orders: [],
  dailyClosings: [],
  businessEvents: [],
  inventoryLots: [],
  inventoryItems: [],
  inventoryMovements: [],
  selectedSeatId: defaultSeats[0].id,
  selectedCategoryId: categories[0].id,
  selectedOrderId: null,
  orderDetailMode: "active",
  orderViewMode: "production",
  activeView: "floor",
  historyDate: todayKey(),
  analyticsRange: "today",
  analyticsStartDate: todayKey(),
  analyticsEndDate: todayKey(),
  analyticsSort: "quantity",
  salesSort: "amount",
  businessEventDate: todayKey(),
  businessEventFormType: "purchase",
  businessEventItemSource: "manual",
  businessEventProductId: "",
  businessEventTypeFilter: "all",
  editingBusinessEventId: null,
  inventoryLotType: "dessert",
  inventoryLotItemSource: "product",
  inventoryLotProductId: "",
  inventoryLotStatusFilter: "active",
  notice: "",
  debug: {}
};

let state = normalizeState(loadState(initialState));

function normalizeVariants(variants) {
  if (!Array.isArray(variants)) return [];
  return variants
    .map((variant) => {
      if (typeof variant === "string") {
        const name = variant.trim();
        return name ? { name, active: true } : null;
      }
      if (variant && typeof variant === "object") {
        const name = String(variant.name || "").trim();
        return name ? { ...variant, name, active: variant.active !== false } : null;
      }
      return null;
    })
    .filter(Boolean);
}

function variantNames(product, { activeOnly = false } = {}) {
  return normalizeVariants(product?.variants)
    .filter((variant) => !activeOnly || variant.active !== false)
    .map((variant) => variant.name);
}

// Keep a forward-compatible slot for future product options, e.g. [{ name, type, values }].
function normalizeOptions(options) {
  return Array.isArray(options) ? options.filter((option) => option && typeof option === "object") : [];
}

function productMetadataDefaults(product) {
  const type = product.type || "drink";
  const category = product.category || "espresso";
  const isDrink = type === "drink";
  const isRetail = type === "retail";
  const categoryMetadata = CATEGORY_METADATA[category] || {};
  return {
    supportsHot: product.supportsHot ?? isDrink,
    supportsIce: product.supportsIce ?? isDrink,
    supportsTakeout: product.supportsTakeout ?? !isRetail,
    iceExtraPrice: Number(product.iceExtraPrice ?? (isDrink ? categoryMetadata.iceExtraPrice : 0)) || 0
  };
}

function normalizeDailyClosings(dailyClosings) {
  if (!Array.isArray(dailyClosings)) return [];
  const normalized = dailyClosings
    .filter((closing) => closing && typeof closing === "object")
    .map((closing, index) => {
      const totalSales = Number(closing.totalSales) || 0;
      const grossProfit = Number(closing.grossProfit) || 0;
      const date = closing.date || todayKey();
      const closedAt = closing.closedAt || closing.exportedAt || new Date().toISOString();
      return {
        ...closing,
        id: closing.id || `closing-${date}-${index}`,
        date,
        closedAt,
        orderCount: Number(closing.orderCount) || 0,
        totalSales,
        totalCost: Number(closing.totalCost) || 0,
        grossProfit,
        grossMargin: Number(closing.grossMargin ?? (totalSales ? grossProfit / totalSales : 0)) || 0,
        drinkCount: Number(closing.drinkCount) || 0,
        dessertCount: Number(closing.dessertCount) || 0,
        retailCount: Number(closing.retailCount) || 0,
        exported: Boolean(closing.exported),
        exportedAt: closing.exportedAt || null,
        version: Number(closing.version) || null,
        status: closing.status === "superseded" ? "superseded" : "official",
        isOfficial: closing.isOfficial !== false && closing.status !== "superseded",
        supersededBy: closing.supersededBy || null,
        supersededAt: closing.supersededAt || null,
        note: closing.note || ""
      };
    });

  const groups = new Map();
  normalized.forEach((closing) => {
    const group = groups.get(closing.date) || [];
    group.push(closing);
    groups.set(closing.date, group);
  });

  groups.forEach((group) => {
    group.sort((a, b) => {
      const timeDelta = new Date(a.closedAt) - new Date(b.closedAt);
      if (timeDelta !== 0) return timeDelta;
      return String(a.id).localeCompare(String(b.id));
    });

    group.forEach((closing, index) => {
      closing.version = closing.version || index + 1;
    });

    const officialCandidates = group.filter((closing) => closing.isOfficial);
    const official = officialCandidates.length ? officialCandidates[officialCandidates.length - 1] : group[group.length - 1];
    official.status = "official";
    official.isOfficial = true;
    official.supersededBy = null;
    official.supersededAt = null;

    group.forEach((closing) => {
      if (closing.id === official.id) return;
      closing.status = "superseded";
      closing.isOfficial = false;
      closing.supersededBy = closing.supersededBy || official.id;
      closing.supersededAt = closing.supersededAt || official.closedAt;
    });
  });

  return normalized;
}

function normalizeInventoryItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      ...item,
      id: item.id || `inventory-item-${Date.now()}-${index}`,
      name: item.name || "",
      category: item.category || "",
      unit: item.unit || "",
      currentStock: Number(item.currentStock) || 0,
      alertStock: Number(item.alertStock) || 0,
      active: item.active !== false
    }));
}

function normalizeInventoryMovements(movements) {
  const allowedTypes = new Set(["purchase", "adjustment", "sale", "waste", "self_use"]);
  if (!Array.isArray(movements)) return [];
  return movements
    .filter((movement) => movement && typeof movement === "object")
    .map((movement, index) => ({
      ...movement,
      id: movement.id || `inventory-movement-${Date.now()}-${index}`,
      itemId: movement.itemId || "",
      type: allowedTypes.has(movement.type) ? movement.type : "adjustment",
      quantity: Number(movement.quantity) || 0,
      createdAt: movement.createdAt || new Date().toISOString(),
      note: movement.note || ""
    }));
}

function seedProducts(items) {
  return items.map((item, index) => {
    const metadata = productMetadataDefaults(item);
    return {
      ...item,
      ...metadata,
      requiresTemperature: item.requiresTemperature ?? (metadata.supportsHot || metadata.supportsIce),
      requiresServiceType: item.requiresServiceType ?? metadata.supportsTakeout,
      sort: item.sort ?? index + 1,
      note: item.note || "",
      variants: normalizeVariants(item.variants),
      options: normalizeOptions(item.options)
    };
  });
}

function normalizeState(savedState) {
  const savedProducts = Array.isArray(savedState.products)
    ? savedState.products
    : Array.isArray(savedState.menuItems)
      ? savedState.menuItems
      : initialState.products;

  const products = seedProducts(savedProducts).map((product, index) => {
    const metadata = productMetadataDefaults(product);
    return {
      ...product,
      ...metadata,
      id: product.id || `product-${Date.now()}-${index}`,
      name: product.name || "未命名商品",
      category: product.category || "espresso",
      type: product.type || "drink",
      price: Number(product.price) || 0,
      cost: Number(product.cost) || 0,
      requiresTemperature: product.requiresTemperature ?? (metadata.supportsHot || metadata.supportsIce),
      requiresServiceType: product.requiresServiceType ?? metadata.supportsTakeout,
      active: product.active !== false,
      sort: Number(product.sort) || index + 1,
      note: product.note || "",
      variants: normalizeVariants(product.variants),
      options: normalizeOptions(product.options)
    };
  });

  const orders = Array.isArray(savedState.orders)
    ? savedState.orders.map((order) => ({
        ...order,
        companionSeatIds: Array.isArray(order.companionSeatIds) ? order.companionSeatIds : [],
        linkedSeatIds: Array.isArray(order.linkedSeatIds)
          ? order.linkedSeatIds
          : Array.isArray(order.companionSeatIds)
            ? order.companionSeatIds
            : [],
        customerSource: normalizeCustomerSource(order.customerSource),
        customerSourceNote: order.customerSourceNote || "",
        activityLog: Array.isArray(order.activityLog) ? order.activityLog : [],
        items: Array.isArray(order.items)
          ? order.items.map((item) => {
              const price = Number(item.price) || 0;
              const basePrice = Number(item.basePrice ?? price) || 0;
              const effectivePrice = Number(item.effectivePrice ?? price) || 0;
              const fallbackServiceType = order.seatId === TAKEOUT_SEAT_ID ? "外帶" : "內用";
              const itemRequiresTemperature = item.requiresTemperature ?? item.type === "drink";
              const itemRequiresServiceType = item.requiresServiceType ?? item.type !== "retail";
              const normalized = {
                ...item,
                quantity: Number(item.quantity) || 1,
                basePrice,
                effectivePrice,
                iceExtra: Number(item.iceExtra ?? effectivePrice - basePrice) || 0,
                price: effectivePrice,
                cost: Number(item.cost) || 0,
                profit: effectivePrice - (Number(item.cost) || 0),
                supportsHot: item.supportsHot ?? itemRequiresTemperature,
                supportsIce: item.supportsIce ?? itemRequiresTemperature,
                supportsTakeout: item.supportsTakeout ?? itemRequiresServiceType,
                iceExtraPrice: Number(item.iceExtraPrice ?? CATEGORY_METADATA[item.category]?.iceExtraPrice ?? item.iceExtra) || 0,
                temperature: itemRequiresTemperature ? item.temperature === "冰" ? "冰" : "熱" : "",
                serviceType: item.serviceType === "外帶" ? "外帶" : fallbackServiceType,
                requiresTemperature: itemRequiresTemperature,
                requiresServiceType: itemRequiresServiceType,
                variantName: item.variantName || "",
                served: Boolean(item.served),
                note: item.note || ""
              };
              return normalized;
            })
          : []
      }))
    : [];

  return {
    ...initialState,
    ...savedState,
    seats: defaultSeats,
    products,
    menuItems: products,
    orders,
    dailyClosings: normalizeDailyClosings(savedState.dailyClosings),
    businessEvents: normalizeBusinessEvents(savedState.businessEvents),
    inventoryLots: normalizeInventoryLots(savedState.inventoryLots),
    inventoryItems: normalizeInventoryItems(savedState.inventoryItems),
    inventoryMovements: normalizeInventoryMovements(savedState.inventoryMovements),
    selectedSeatId: savedState.selectedSeatId === TAKEOUT_SEAT_ID
      ? TAKEOUT_SEAT_ID
      : defaultSeats.some((seat) => seat.id === savedState.selectedSeatId)
      ? savedState.selectedSeatId
      : defaultSeats[0].id,
    selectedCategoryId: categories.some((category) => category.id === savedState.selectedCategoryId)
      ? savedState.selectedCategoryId
      : categories[0].id,
    historyDate: savedState.historyDate || todayKey(),
    analyticsRange: savedState.analyticsRange || "today",
    analyticsStartDate: savedState.analyticsStartDate || todayKey(),
    analyticsEndDate: savedState.analyticsEndDate || todayKey(),
    analyticsSort: savedState.analyticsSort || "quantity",
    businessEventDate: savedState.businessEventDate || todayKey(),
    businessEventFormType: businessEventTypeOptions({ formOnly: true }).some(([type]) => type === savedState.businessEventFormType)
      ? savedState.businessEventFormType
      : "purchase",
    businessEventItemSource: ["product", "manual"].includes(savedState.businessEventItemSource)
      ? savedState.businessEventItemSource
      : "manual",
    businessEventProductId: savedState.businessEventProductId || "",
    businessEventTypeFilter: savedState.businessEventTypeFilter || "all",
    editingBusinessEventId: savedState.editingBusinessEventId || null,
    inventoryLotType: inventoryLotTypeOptions().some(([type]) => type === savedState.inventoryLotType)
      ? savedState.inventoryLotType
      : "dessert",
    inventoryLotItemSource: ["product", "manual"].includes(savedState.inventoryLotItemSource)
      ? savedState.inventoryLotItemSource
      : "product",
    inventoryLotProductId: savedState.inventoryLotProductId || "",
    inventoryLotStatusFilter: ["active", "archived", "all"].includes(savedState.inventoryLotStatusFilter)
      ? savedState.inventoryLotStatusFilter
      : "active",
    salesSort: savedState.salesSort || "amount"
  };
}

function todayKey(date = new Date()) {
  return toDateKey(date);
}

function toDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function shiftDate(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

function monthStart(dateKey = todayKey()) {
  return `${dateKey.slice(0, 7)}-01`;
}

function analyticsDateRangeFor(rangeName = state.analyticsRange) {
  const today = todayKey();
  if (rangeName === "yesterday") {
    const yesterday = shiftDate(today, -1);
    return { label: "昨日", startDate: yesterday, endDate: yesterday };
  }
  if (rangeName === "seven-days") {
    return { label: "近 7 天", startDate: shiftDate(today, -6), endDate: today };
  }
  if (rangeName === "month") {
    return { label: "本月", startDate: monthStart(today), endDate: today };
  }
  if (rangeName === "custom") {
    const startDate = state.analyticsStartDate || today;
    const endDate = state.analyticsEndDate || startDate;
    return {
      label: `${startDate} - ${endDate}`,
      startDate: startDate <= endDate ? startDate : endDate,
      endDate: startDate <= endDate ? endDate : startDate
    };
  }
  return { label: "今日", startDate: today, endDate: today };
}

function analyticsDateRange() {
  return analyticsDateRangeFor(state.analyticsRange);
}

function timeLabel(value) {
  return new Date(value).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" });
}

function minutesBetween(startValue, endValue = new Date()) {
  const start = new Date(startValue);
  const end = endValue instanceof Date ? endValue : new Date(endValue);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60000));
}

function stayMinutes(order) {
  return minutesBetween(order.createdAt, order.checkedOutAt || new Date());
}

function formatDuration(minutes) {
  const safeMinutes = Math.max(0, Math.floor(Number(minutes) || 0));
  if (safeMinutes < 60) return `${safeMinutes} 分`;
  const hours = Math.floor(safeMinutes / 60);
  const rest = safeMinutes % 60;
  return rest ? `${hours} 小時 ${rest} 分` : `${hours} 小時`;
}

function openedDateLabel(order) {
  const openedKey = toDateKey(order?.createdAt);
  if (!openedKey || openedKey === todayKey()) return "";
  if (openedKey === shiftDate(todayKey(), -1)) return "昨天開單";
  return `${openedKey} 開單`;
}

function stayLabel(order) {
  return openedDateLabel(order) || `已坐 ${formatDuration(stayMinutes(order))}`;
}

function activeDurationLabel(order) {
  const openedLabel = openedDateLabel(order);
  if (openedLabel) return openedLabel;
  return order.seatId === TAKEOUT_SEAT_ID ? `已等 ${formatDuration(stayMinutes(order))}` : stayLabel(order);
}

function completedStayLabel(order) {
  return `停留 ${formatDuration(stayMinutes(order))}`;
}

function stayAlertClass(order) {
  const minutes = stayMinutes(order);
  if (minutes >= 90) return "stay-danger";
  if (minutes >= 60) return "stay-warning";
  return "";
}

function setState(patch) {
  state = normalizeState({ ...state, ...patch });
  const storageSaveExecuted = saveState(state);
  render();
  return { storageSaveExecuted, renderAfterSaveExecuted: true };
}

function showNotice(message, details = {}) {
  console.warn(`[YUTU POS] ${message}`, details);
  state = normalizeState({ ...state, notice: message });
  saveState(state);
  render();
}

function currentOpenOrder() {
  return getOpenOrderBySeat(state.selectedSeatId);
}

function selectedOrderItemCount() {
  return getSelectedOrder()?.items?.length ?? 0;
}

function writeDebug(patch, shouldRender = false) {
  if (!isDebugMode) return;
  state = normalizeState({
    ...state,
    debug: {
      ...state.debug,
      ...patch,
      selectedSeatId: state.selectedSeatId,
      selectedOrderId: state.selectedOrderId,
      currentOpenOrderId: currentOpenOrder()?.id || "",
      ordersLength: state.orders.length,
      selectedOrderItemsLength: selectedOrderItemCount(),
      updatedAt: new Date().toLocaleTimeString("zh-TW")
    }
  });
  saveState(state);
  if (shouldRender) render();
}

function warnAddProduct(reason, details = {}) {
  console.warn(`[YUTU POS] addProduct failed: ${reason}`, details);
  writeDebug({ addProductExecuted: true, addProductFailureReason: reason, ...details });
}

function getSeat(id) {
  if (id === TAKEOUT_SEAT_ID) return TAKEOUT_SEAT;
  return state.seats.find((seat) => seat.id === id);
}

function seatName(orderOrSeatId) {
  const seatId = typeof orderOrSeatId === "string" ? orderOrSeatId : orderOrSeatId?.seatId;
  return getSeat(seatId)?.name || "未命名座位";
}

function orderSeatIds(order) {
  return [order?.seatId, ...(Array.isArray(order?.linkedSeatIds) ? order.linkedSeatIds : [])].filter(Boolean);
}

function orderSeatName(order) {
  return orderSeatIds(order).map((seatId) => seatName(seatId)).join("＋") || seatName(order);
}

function seatIcon(orderOrSeatId) {
  const seatId = typeof orderOrSeatId === "string" ? orderOrSeatId : orderOrSeatId?.seatId;
  return getSeat(seatId)?.icon || "";
}

function getProduct(id) {
  return state.products.find((product) => product.id === id);
}

function getOpenOrderBySeat(seatId) {
  return state.orders.find((order) => order.status === "open" && orderSeatIds(order).includes(seatId));
}

function todayOfficialClosing() {
  return state.dailyClosings.find((closing) => closing.date === todayKey() && closing.isOfficial === true) || null;
}

function isStoreClosedToday() {
  return Boolean(todayOfficialClosing());
}

function openTakeoutOrders() {
  return state.orders
    .filter((order) => order.seatId === TAKEOUT_SEAT_ID && order.status === "open")
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function getSelectedOrder() {
  if (state.selectedOrderId) {
    const selected = state.orders.find((order) => order.id === state.selectedOrderId);
    if (selected?.status === "open") return selected;
    if (selected?.status === "paid" && state.orderDetailMode === "history") return selected;
    if (selected && state.activeView !== "floor") return selected;
  }
  return getOpenOrderBySeat(state.selectedSeatId) || null;
}

function paidOrdersForDate(dateKey) {
  return state.orders.filter((order) => order.status === "paid" && toDateKey(order.checkedOutAt) === dateKey);
}

function summarizeOrders(orders) {
  const stats = orders.reduce(
    (stats, order) => {
      const summary = calculateOrder(order);
      stats.revenue += summary.total;
      stats.cost += summary.cost;
      stats.profit += summary.profit;
      stats.drinks += summary.drinks;
      stats.desserts += summary.desserts;
      stats.retail += order.items.reduce((count, item) => count + (item.type === "retail" ? item.quantity : 0), 0);
      stats.orderCount += 1;
      return stats;
    },
    { revenue: 0, cost: 0, profit: 0, drinks: 0, desserts: 0, retail: 0, orderCount: 0, averageTicket: 0 }
  );
  stats.averageTicket = stats.orderCount ? stats.revenue / stats.orderCount : 0;
  return stats;
}

function salesSummaryForDate(dateKey) {
  const rows = new Map();
  paidOrdersForDate(dateKey).forEach((order) => {
    order.items.forEach((item) => {
      const price = Number(item.effectivePrice ?? item.price) || 0;
      const key = `${item.productId || item.name}-${item.name}-${price}-${item.cost}`;
      const current =
        rows.get(key) ||
        {
          name: item.name,
          category: categoryName(item.category),
          quantity: 0,
          amount: 0,
          cost: 0,
          profit: 0
        };
      current.quantity += item.quantity;
      current.amount += price * item.quantity;
      current.cost += item.cost * item.quantity;
      current.profit += (price - item.cost) * item.quantity;
      rows.set(key, current);
    });
  });

  return [...rows.values()].sort((a, b) =>
    state.salesSort === "quantity" ? b.quantity - a.quantity || b.amount - a.amount : b.amount - a.amount
  );
}

function categoryName(categoryId) {
  return categories.find((category) => category.id === categoryId)?.name || categoryId;
}

function categoryLabelMap() {
  return Object.fromEntries(categories.map((category) => [category.id, category.name]));
}

function seatLabelMap() {
  return {
    ...Object.fromEntries(state.seats.map((seat) => [seat.id, seat.name])),
    [TAKEOUT_SEAT_ID]: TAKEOUT_SEAT.name
  };
}

function isProductionUrl() {
  const hostname = window.location.hostname;
  return PRODUCTION_HOSTS.includes(hostname);
}

function shouldShowDevBanner() {
  return APP_BRANCH !== "main" || !isProductionUrl();
}

function sortedProducts() {
  return [...state.products].sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name, "zh-Hant"));
}

function visibleProducts() {
  return sortedProducts().filter((product) => product.category === state.selectedCategoryId);
}

function sortOrderItems(items) {
  const typeOrder = { drink: 1, dessert: 2, retail: 3 };
  const temperatureOrder = { 冰: 1, 熱: 2 };
  return [...items].sort((a, b) => {
    const typeDelta = (typeOrder[a.type] || 9) - (typeOrder[b.type] || 9);
    if (typeDelta !== 0) return typeDelta;
    const nameDelta = a.name.localeCompare(b.name, "zh-Hant");
    if (nameDelta !== 0) return nameDelta;
    return (temperatureOrder[a.temperature] || 9) - (temperatureOrder[b.temperature] || 9);
  });
}

function replaceOrder(nextOrder) {
  const beforeOrder = state.orders.find((order) => order.id === nextOrder.id);
  const replaced = Boolean(beforeOrder);
  const nextOrders = state.orders.map((order) => (order.id === nextOrder.id ? nextOrder : order));
  const result = setState({
    orders: nextOrders,
    selectedSeatId: nextOrder.seatId,
    selectedOrderId: nextOrder.id,
    activeView: "floor",
    notice: ""
  });
  writeDebug({
    replaceOrderExecuted: true,
    replaceOrderMatched: replaced,
    beforeItemsLength: beforeOrder?.items?.length ?? "",
    afterItemsLength: nextOrder.items?.length ?? "",
    storageSaveExecuted: result.storageSaveExecuted,
    renderAfterSaveExecuted: result.renderAfterSaveExecuted,
    selectedOrderItemsLength: nextOrder.items?.length ?? 0
  }, true);
  return { ...result, replaced, afterItemsLength: nextOrder.items?.length ?? 0 };
}

function startOrder(seatId) {
  const existing = getOpenOrderBySeat(seatId);
  if (existing) {
    setState({ selectedSeatId: seatId, selectedOrderId: existing.id, activeView: "floor", orderDetailMode: "active", orderViewMode: "production" });
    return;
  }

  const people = Number(window.prompt("輸入人數", "2"));
  if (!people || people < 1) return;
  const order = createOrder({ seatId, people });
  setState({
    orders: [order, ...state.orders],
    selectedSeatId: seatId,
    selectedOrderId: order.id,
    activeView: "floor",
    orderDetailMode: "active",
    orderViewMode: "production"
  });
}

function orderItemName(item) {
  return item.variantName ? `${item.name}（${item.variantName}）` : item.name;
}

function variantDistributionText(row) {
  const entries = Object.entries(row.variants || {});
  return entries.length ? entries.map(([name, count]) => `${name} ${count}`).join("、") : "-";
}

function variantDistributionDetails(row) {
  const entries = Object.entries(row.variants || {});
  if (!entries.length) return "-";
  return `
    <details class="variant-details">
      <summary>${entries.length} 種口味</summary>
      ${entries.map(([name, count]) => `<span>${name} ${count}</span>`).join("")}
    </details>
  `;
}

function activityLogText(order) {
  const logs = Array.isArray(order.activityLog) ? order.activityLog : [];
  return logs
    .map((entry) => {
      const label = entry.type === "checkout" ? "結帳" : entry.type === "undoCheckout" ? "撤銷" : entry.type;
      return `${label} ${timeLabel(entry.at)}`;
    })
    .join("、");
}

function startTakeoutOrder() {
  const order = createOrder({ seatId: TAKEOUT_SEAT_ID, people: 1 });
  setState({
    orders: [order, ...state.orders],
    selectedSeatId: TAKEOUT_SEAT_ID,
    selectedOrderId: order.id,
    activeView: "floor",
    orderDetailMode: "active",
    orderViewMode: "production"
  });
}

function selectOrder(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;
  setState({
    selectedSeatId: order.seatId,
    selectedOrderId: order.id,
    activeView: "floor",
    orderDetailMode: order.status === "paid" ? "history" : "active",
    orderViewMode: "production"
  });
}

function productSummaryText(order) {
  return order.items
    .map((item) => {
      const prefix = item.requiresTemperature && item.temperature ? item.temperature : "";
      return `${prefix}${orderItemName(item)}×${item.quantity}`;
    })
    .join("、");
}

function addProduct(productId, source = "unknown") {
  try {
    writeDebug({
      clickedProductId: productId || "",
      productClickSource: source,
      addProductExecuted: true,
      addProductFailureReason: "",
      replaceOrderExecuted: false,
      storageSaveExecuted: false,
      renderAfterSaveExecuted: false
    });
    const order = getSelectedOrder();
    const product = getProduct(productId);
    writeDebug({ productFound: Boolean(product) });
    if (!product) {
      warnAddProduct("product not found", { productId, source });
      showNotice("找不到商品資料，請到商品管理確認今日菜單。", { productId });
      return;
    }
    if (product.active === false) {
      warnAddProduct("product inactive", { productId, productName: product.name, source });
      showNotice(`${product.name} 目前停售，無法加入訂單。`, { productId });
      return;
    }
    if (!order) {
      warnAddProduct("no open order", {
        productId,
        source,
        selectedOrderId: state.selectedOrderId,
        selectedSeatId: state.selectedSeatId,
        currentOpenOrderId: currentOpenOrder()?.id || ""
      });
      showNotice("請先選擇座位並新增訂單。", {
        productId,
        selectedOrderId: state.selectedOrderId,
        selectedSeatId: state.selectedSeatId
      });
      return;
    }
    if (order.status !== "open") {
      warnAddProduct("selected order is not open", { productId, source, orderId: order.id, status: order.status });
      showNotice("這張訂單已結帳，請先新增或編輯訂單。", { orderId: order.id, status: order.status });
      return;
    }

    const variantName = chooseProductVariant(product);
    if (variantName === null) return;

    const beforeItemsLength = order.items.length;
    const nextOrder = addOrderItem(order, product, { variantName });
    const newItem = nextOrder.items[nextOrder.items.length - 1];
    const afterItemsLength = nextOrder.items.length;
    writeDebug({
      productFound: true,
      addProductFailureReason: "",
      beforeItemsLength,
      afterItemsLength,
      newItemLineId: newItem?.lineId || "",
      selectedOrderItemsLengthBefore: beforeItemsLength
    });

    if (afterItemsLength !== beforeItemsLength + 1) {
      warnAddProduct("item length did not increase", { beforeItemsLength, afterItemsLength, lineId: newItem?.lineId });
      showNotice("商品加入失敗：訂單品項數沒有增加。");
      return;
    }

    replaceOrder(nextOrder);
  } catch (error) {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    warnAddProduct(message, { productId, source });
    showNotice(`商品加入失敗：${message}`);
  }
}

function handleProductClick(productId, source, event = null) {
  const button = event?.currentTarget || event?.target?.closest?.("button");
  const fallbackId = button?.getAttribute?.("data-product-id") || button?.dataset?.id || "";
  const resolvedId = productId || fallbackId;
  console.log("[YUTU POS] product click", {
    id: resolvedId,
    selectedSeatId: state.selectedSeatId,
    selectedOrderId: state.selectedOrderId
  });
  writeDebug({
    clickedProductId: resolvedId || "",
    productClickSource: source,
    eventTargetTag: event?.target?.tagName || "",
    closestButtonFound: Boolean(button),
    closestButtonAction: button?.dataset?.action || "",
    datasetId: button?.dataset?.id || "",
    productDatasetId: button?.getAttribute?.("data-product-id") || "",
    productFound: Boolean(getProduct(resolvedId)),
    addProductExecuted: false,
    addProductFailureReason: ""
  });

  if (!resolvedId) {
    warnAddProduct("missing product id from click event", { source });
    showNotice("商品點擊沒有讀到商品 ID，請回報 Debug Panel。");
    render();
    return;
  }

  addProduct(resolvedId, source);
}

function updateLine(lineId, patch) {
  const order = getSelectedOrder();
  if (!order || order.status !== "open") return;
  replaceOrder(updateOrderItem(order, lineId, patch));
}

function removeLine(lineId) {
  const order = getSelectedOrder();
  if (!order || order.status !== "open") return;
  if (!window.confirm("確定刪除此品項嗎？")) return;
  replaceOrder(removeOrderItem(order, lineId));
}

function updateOrderMeta(patch) {
  const order = getSelectedOrder();
  if (!order || order.status !== "open") return;
  replaceOrder({ ...order, ...patch });
}

function isSeatOccupied(seatId, exceptOrderId = "") {
  return state.orders.some((order) => (
    order.status === "open" &&
    order.id !== exceptOrderId &&
    orderSeatIds(order).includes(seatId)
  ));
}

function payOrder() {
  const order = getSelectedOrder();
  if (!order || order.status !== "open" || order.items.length === 0) return;
  const summary = calculateOrder(order);
  const confirmed = window.confirm(
    [
      "確定要完成結帳嗎？",
      "",
      `座位 / 外帶：${seatName(order)}`,
      `人數：${order.people}`,
      `總金額：${money.format(summary.total)}`,
      `品項：${productSummaryText(order)}`
    ].join("\n")
  );
  if (!confirmed) return;
  replaceOrder(checkoutOrder(order, "cash"));
  setState({ selectedOrderId: null, activeView: "floor", historyDate: todayKey() });
}

function lastPaidOrder() {
  return [...state.orders]
    .filter((order) => order.status === "paid" && order.checkedOutAt)
    .sort((a, b) => new Date(b.checkedOutAt) - new Date(a.checkedOutAt))[0];
}

function canUndoCheckout(order) {
  return Boolean(order?.status === "paid" && order.checkedOutAt && minutesBetween(order.checkedOutAt, new Date()) <= UNDO_CHECKOUT_LIMIT_MINUTES);
}

function undoCheckoutOrder(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) {
    showNotice("找不到要撤銷的結帳訂單。");
    return;
  }
  if (!canUndoCheckout(order)) {
    showNotice("此筆結帳已超過 5 分鐘，無法撤銷。");
    return;
  }
  if (order.seatId !== TAKEOUT_SEAT_ID) {
    const occupiedSeat = orderSeatIds(order).find((seatId) => isSeatOccupied(seatId, order.id));
    if (occupiedSeat) {
      showNotice(`${seatName(occupiedSeat)} 已有進行中的訂單，無法撤銷。`);
      return;
    }
  }
  const summary = calculateOrder(order);
  const confirmed = window.confirm(
    [
      "確定要撤銷這筆結帳嗎？",
      "",
      `座位 / 外帶：${orderSeatName(order)}`,
      `結帳時間：${timeLabel(order.checkedOutAt)}`,
      `金額：${money.format(summary.total)}`
    ].join("\n")
  );
  if (!confirmed) return;
  const undoAt = new Date().toISOString();
  setState({
    orders: state.orders.map((item) =>
      item.id === order.id
        ? {
            ...item,
            status: "open",
            paymentMethod: null,
            checkedOutAt: null,
            activityLog: [...(Array.isArray(item.activityLog) ? item.activityLog : []), { type: "undoCheckout", at: undoAt }]
          }
        : item
    ),
    selectedSeatId: order.seatId,
    selectedOrderId: order.id,
    activeView: "floor",
    orderDetailMode: "active",
    orderViewMode: "production",
    historyDate: todayKey(),
    notice: `已撤銷 ${orderSeatName(order)} 的結帳。`
  });
}

function undoLastCheckout() {
  const order = lastPaidOrder();
  if (!order) {
    showNotice("目前沒有可撤銷的已結帳訂單。");
    return;
  }
  undoCheckoutOrder(order.id);
}

function cancelOrder() {
  const order = getSelectedOrder();
  if (!order || order.status !== "open") return;
  if (order.items.length > 0 && !window.confirm("這張訂單已有品項，確定要取消嗎？")) return;
  setState({
    orders: state.orders.filter((item) => item.id !== order.id),
    selectedOrderId: null,
    activeView: "floor"
  });
}

function editPaidOrder(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order || order.status !== "paid") return;
  const occupiedSeat = order.seatId !== TAKEOUT_SEAT_ID
    ? orderSeatIds(order).find((seatId) => isSeatOccupied(seatId, order.id))
    : null;
  if (occupiedSeat) {
    showNotice(`${seatName(occupiedSeat)} 已有進行中的訂單，無法轉回編輯。`);
    return;
  }
  if (!window.confirm("要把這張歷史訂單退回可編輯狀態嗎？修改後需要重新結帳。")) return;
  setState({
    orders: state.orders.map((item) =>
      item.id === order.id
        ? { ...item, status: "open", paymentMethod: null, lastCheckedOutAt: item.checkedOutAt, checkedOutAt: null }
        : item
    ),
    selectedOrderId: order.id,
    selectedSeatId: order.seatId,
    activeView: "floor"
  });
}

function deleteOrder(orderId) {
  if (!state.orders.some((item) => item.id === orderId)) return;
  if (!window.confirm("確定刪除這筆訂單紀錄嗎？這個動作無法復原。")) return;
  setState({
    orders: state.orders.filter((item) => item.id !== orderId),
    selectedOrderId: state.selectedOrderId === orderId ? null : state.selectedOrderId,
    activeView: "history"
  });
}

function buildProductFromForm() {
  const form = document.querySelector(".product-form");
  const existing = form?.dataset?.editing ? getProduct(form.dataset.editing) : null;
  const existingVariants = normalizeVariants(existing?.variants);
  const selectedType = document.querySelector("#product-type").value;
  const nextVariantNames = document
    .querySelector("#product-variants")
    .value.split(/[\n,，、]/)
    .map((item) => item.trim())
    .filter(Boolean);
  return {
    name: document.querySelector("#product-name").value.trim(),
    category: document.querySelector("#product-category").value,
    type: selectedType,
    price: Number(document.querySelector("#product-price").value),
    cost: Number(document.querySelector("#product-cost").value),
    supportsHot: selectedType === "drink" && document.querySelector("#product-supports-hot").checked,
    supportsIce: selectedType === "drink" && document.querySelector("#product-supports-ice").checked,
    supportsTakeout: document.querySelector("#product-supports-takeout").checked,
    iceExtraPrice: selectedType === "drink" ? Number(document.querySelector("#product-ice-extra-price").value) || 0 : 0,
    sort: Number(document.querySelector("#product-sort").value) || state.products.length + 1,
    note: document.querySelector("#product-note").value.trim(),
    variants: nextVariantNames.map((name) => existingVariants.find((variant) => variant.name === name) || name),
    active: document.querySelector("#product-active").checked
  };
}

function saveProduct(productId = null) {
  const next = buildProductFromForm();
  if (!next.name || Number.isNaN(next.price) || Number.isNaN(next.cost)) {
    window.alert("請輸入品名、售價與成本。");
    return;
  }

  if (productId) {
    setState({
      products: state.products.map((product) => (
        product.id === productId
          ? {
              ...product,
              ...next,
              requiresTemperature: next.supportsHot || next.supportsIce,
              requiresServiceType: next.supportsTakeout
            }
          : product
      ))
    });
    return;
  }

  setState({
    products: [
      ...state.products,
      {
        id: `custom-${Date.now()}`,
        ...next,
        requiresTemperature: next.supportsHot || next.supportsIce,
        requiresServiceType: next.supportsTakeout
      }
    ]
  });
}

function targetSeatPrompt(message, excludedSeatIds = [], { emptyOnly = false, exceptOrderId = "" } = {}) {
  const seats = state.seats.filter((seat) => (
    !excludedSeatIds.includes(seat.id) &&
    (!emptyOnly || !isSeatOccupied(seat.id, exceptOrderId))
  ));
  if (!seats.length) {
    showNotice("目前沒有可選的空桌。");
    return null;
  }
  const choices = seats.map((seat, index) => `${index + 1}. ${seat.name}`).join("\n");
  const input = window.prompt(`${message}\n${choices}`, "1");
  if (input === null) return null;
  const index = Number(input) - 1;
  if (Number.isInteger(index) && seats[index]) return seats[index];
  const typed = input.trim();
  return seats.find((seat) => seat.name === typed || seat.id === typed) || null;
}

function moveSelectedOrder() {
  const order = getSelectedOrder();
  if (!order || order.seatId === TAKEOUT_SEAT_ID) return;
  const targetSeat = targetSeatPrompt("選擇要換到哪一桌：", orderSeatIds(order), { emptyOnly: true, exceptOrderId: order.id });
  if (!targetSeat) return;
  if (isSeatOccupied(targetSeat.id, order.id)) {
    showNotice("目標桌位已有進行中的訂單，無法換桌。");
    return;
  }
  if (!window.confirm(`確定將主桌 ${seatName(order)} 換到 ${targetSeat.name} 嗎？關聯桌位會保持不變。`)) return;
  setState({
    orders: state.orders.map((item) => (item.id === order.id ? { ...item, seatId: targetSeat.id } : item)),
    selectedSeatId: targetSeat.id,
    selectedOrderId: order.id,
    activeView: "floor",
    notice: `已將 ${seatName(order)} 換到 ${targetSeat.name}。`
  });
}

function addLinkedSeatToOrder() {
  const order = getSelectedOrder();
  if (!order || order.seatId === TAKEOUT_SEAT_ID) return;
  const excluded = orderSeatIds(order);
  const targetSeat = targetSeatPrompt("選擇新增使用桌位：", excluded, { emptyOnly: true, exceptOrderId: order.id });
  if (!targetSeat) return;
  if (isSeatOccupied(targetSeat.id, order.id)) {
    showNotice("此桌已有進行中的訂單，不能加入桌位群組。");
    return;
  }
  if (!window.confirm(`將 ${targetSeat.name} 加入 ${orderSeatName(order)} 的使用桌位嗎？`)) return;
  setState({
    orders: state.orders.map((item) => (
      item.id === order.id
        ? { ...item, linkedSeatIds: [...new Set([...(item.linkedSeatIds || []), targetSeat.id])] }
        : item
    )),
    selectedSeatId: order.seatId,
    selectedOrderId: order.id,
    activeView: "floor",
    notice: `${targetSeat.name} 已加入 ${orderSeatName(order)}。`
  });
}

function removeLinkedSeatFromOrder(seatId) {
  const order = getSelectedOrder();
  if (!order || !order.linkedSeatIds?.includes(seatId)) return;
  setState({
    orders: state.orders.map((item) => (
      item.id === order.id
        ? { ...item, linkedSeatIds: item.linkedSeatIds.filter((linkedSeatId) => linkedSeatId !== seatId) }
        : item
    )),
    selectedSeatId: order.seatId,
    selectedOrderId: order.id,
    activeView: "floor",
    notice: `${seatName(seatId)} 已從桌位群組移除。`
  });
}

function toggleProduct(productId) {
  setState({
    products: state.products.map((product) =>
      product.id === productId ? { ...product, active: !product.active } : product
    )
  });
}

function openProductEditor(productId) {
  setState({ activeView: "products", editingProductId: productId || null });
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function timestampForFile(date = new Date()) {
  const datePart = toDateKey(date);
  const timePart = `${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;
  return `${datePart}-${timePart}`;
}

function chooseProductVariant(product) {
  const variants = variantNames(product, { activeOnly: true });
  if (!variants.length) return "";
  const message = [`選擇 ${product.name} 口味 / 規格：`, ...variants.map((variant, index) => `${index + 1}. ${variant}`)].join("\n");
  const input = window.prompt(message, "1");
  if (input === null) return null;
  const selectedIndex = Number(input) - 1;
  if (Number.isInteger(selectedIndex) && variants[selectedIndex]) return variants[selectedIndex];
  const typed = input.trim();
  if (variants.includes(typed)) return typed;
  window.alert("找不到這個口味 / 規格，請重新點選商品。");
  return null;
}

function exportSettingsSnapshot(source = state) {
  return {
    selectedSeatId: source.selectedSeatId || defaultSeats[0].id,
    selectedCategoryId: source.selectedCategoryId || categories[0].id,
    selectedOrderId: source.selectedOrderId || null,
    orderDetailMode: source.orderDetailMode || "active",
    orderViewMode: source.orderViewMode || "production",
    activeView: source.activeView || "floor",
    historyDate: source.historyDate || todayKey(),
    analyticsRange: source.analyticsRange || "today",
    analyticsStartDate: source.analyticsStartDate || todayKey(),
    analyticsEndDate: source.analyticsEndDate || todayKey(),
    analyticsSort: source.analyticsSort || "quantity",
    salesSort: source.salesSort || "amount"
  };
}

function buildDailyClosingSnapshot(date = todayKey(), exportedAt = new Date().toISOString(), note = "", version = 1) {
  const orders = paidOrdersForDate(date);
  const summary = summarizeOrders(orders);
  return {
    id: `closing-${date}-${exportedAt.replace(/[:.]/g, "-")}`,
    date,
    closedAt: exportedAt,
    version,
    status: "official",
    isOfficial: true,
    supersededBy: null,
    supersededAt: null,
    orderCount: summary.orderCount,
    totalSales: summary.revenue,
    totalCost: summary.cost,
    grossProfit: summary.profit,
    grossMargin: summary.revenue ? summary.profit / summary.revenue : 0,
    drinkCount: summary.drinks,
    dessertCount: summary.desserts,
    retailCount: summary.retail,
    exported: true,
    exportedAt,
    note
  };
}

function applyOfficialDailyClosing(nextClosing, existingClosings = state.dailyClosings, supersededAt = nextClosing.closedAt) {
  return [
    nextClosing,
    ...existingClosings.map((closing) => {
      if (closing.date !== nextClosing.date || closing.isOfficial !== true) return closing;
      return {
        ...closing,
        status: "superseded",
        isOfficial: false,
        supersededBy: nextClosing.id,
        supersededAt
      };
    })
  ];
}

function buildFullBackupPayload() {
  return {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    app: EXPORT_APP_NAME,
    exportType: "full",
    exportedAt: new Date().toISOString(),
    storageKey: STORAGE_KEY,
    orders: state.orders,
    products: state.products,
    seats: state.seats,
    dailyClosings: state.dailyClosings,
    businessEvents: state.businessEvents,
    inventoryLots: state.inventoryLots,
    inventoryItems: state.inventoryItems,
    inventoryMovements: state.inventoryMovements,
    settings: exportSettingsSnapshot()
  };
}

function exportAllData() {
  downloadJson(`yutu-pos-backup-${timestampForFile()}.json`, buildFullBackupPayload());
}

function buildDailyReportPayload(date = todayKey()) {
  const orders = paidOrdersForDate(date);
  return {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    app: EXPORT_APP_NAME,
    exportType: "daily",
    date,
    exportedAt: new Date().toISOString(),
    dailySummary: summarizeOrders(orders),
    productSalesSummary: salesSummaryForDate(date),
    orders,
    productsSnapshot: state.products
  };
}

function buildDailyArchivePayload(date = todayKey(), dailyClosing = null, exportedAt = new Date().toISOString()) {
  const orders = paidOrdersForDate(date);
  return {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    app: EXPORT_APP_NAME,
    exportType: "daily-archive",
    date,
    exportedAt,
    dailySummary: summarizeOrders(orders),
    productSalesSummary: salesSummaryForDate(date),
    orders,
    productsSnapshot: state.products,
    dailyClosing: dailyClosing || buildDailyClosingSnapshot(date, exportedAt)
  };
}

function exportDailyData(date = todayKey()) {
  downloadJson(`yutu-pos-daily-${date}.json`, buildDailyReportPayload(date));
}

function exportTodayData() {
  exportDailyData(todayKey());
}

function exportClosingReport() {
  const openOrders = state.orders.filter((order) => order.status === "open");
  if (openOrders.length && !window.confirm("目前仍有未結帳訂單，是否仍要匯出今日報表？")) return;
  const date = todayKey();
  const exportedAt = new Date().toISOString();
  const version = state.dailyClosings.filter((closing) => closing.date === date).length + 1;
  const dailyClosing = buildDailyClosingSnapshot(date, exportedAt, "", version);
  setState({
    dailyClosings: applyOfficialDailyClosing(dailyClosing, state.dailyClosings, exportedAt)
  });
  downloadJson(`yutu-pos-daily-archive-${date}.json`, buildDailyArchivePayload(date, dailyClosing, exportedAt));
}

function closeStoreWorkflow() {
  const openOrders = state.orders.filter((order) => order.status === "open");
  if (openOrders.length) {
    showNotice("仍有未結帳桌位，請先完成結帳或取消訂單後再關店。");
    return;
  }
  const date = todayKey();
  const orders = paidOrdersForDate(date);
  const summary = summarizeOrders(orders);
  const businessEvents = state.businessEvents.filter((event) => event.date === date);
  const cashSales = orders
    .filter((order) => order.paymentMethod === "cash")
    .reduce((total, order) => total + calculateOrder(order).total, 0);
  const electronicSales = orders
    .filter((order) => order.paymentMethod && order.paymentMethod !== "cash")
    .reduce((total, order) => total + calculateOrder(order).total, 0);
  const confirmed = window.confirm(
    [
      "確認今日營業資料並關店？",
      "",
      `今日營收：${money.format(summary.revenue)}`,
      `訂單數：${summary.orderCount}`,
      `現金收入：${money.format(cashSales)}`,
      `電子支付：${money.format(electronicSales)}`,
      `今日 Business Events：${businessEvents.length} 筆`
    ].join("\n")
  );
  if (!confirmed) return;

  const exportedAt = new Date().toISOString();
  const version = state.dailyClosings.filter((closing) => closing.date === date).length + 1;
  const dailyClosing = buildDailyClosingSnapshot(date, exportedAt, "", version);
  setState({
    dailyClosings: applyOfficialDailyClosing(dailyClosing, state.dailyClosings, exportedAt),
    activeView: "floor",
    notice: "今日已關店，daily archive 已匯出。"
  });
  downloadJson(`yutu-pos-daily-archive-${date}.json`, buildDailyArchivePayload(date, dailyClosing, exportedAt));
}

function validateImportedState(input) {
  const importedState =
    input?.exportType === "full"
      ? {
          ...(input.settings || {}),
          orders: input.orders,
          products: input.products || input.menuItems,
          menuItems: input.products || input.menuItems,
          seats: input.seats || defaultSeats,
          dailyClosings: input.dailyClosings || [],
          businessEvents: input.businessEvents || [],
          inventoryLots: input.inventoryLots || [],
          inventoryItems: input.inventoryItems || [],
          inventoryMovements: input.inventoryMovements || []
        }
      : input?.state || input;

  if (!importedState || typeof importedState !== "object") {
    throw new Error("JSON 不是可用的 POS 備份格式。");
  }
  if (input?.exportType && input.exportType !== "full") {
    throw new Error("此檔案不是完整備份，請選擇匯出全部資料的 JSON。");
  }
  if (!Array.isArray(importedState.orders)) {
    throw new Error("備份缺少 orders 陣列。");
  }
  if (!Array.isArray(importedState.products) && !Array.isArray(importedState.menuItems)) {
    throw new Error("備份缺少 products 陣列。");
  }
  return normalizeState(importedState);
}

function importBackupFile(file) {
  if (!file) return;
  if (!window.confirm("匯入會覆蓋目前本機資料，確定繼續嗎？")) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      state = validateImportedState(parsed);
      const saved = saveState(state);
      if (!saved) throw new Error("localStorage 寫入失敗。");
      render();
      window.alert("備份已匯入。");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showNotice(`匯入失敗：${message}`);
    }
  };
  reader.onerror = () => showNotice("匯入失敗：無法讀取檔案。");
  reader.readAsText(file, "utf-8");
}

function resetTestOrders() {
  if (!window.confirm("這會清空所有訂單紀錄，但保留商品與座位，確定嗎？")) return;
  setState({
    orders: [],
    selectedOrderId: null,
    activeView: "backup",
    notice: "已清空測試訂單紀錄，商品與座位已保留。"
  });
}

function renderStats() {
  const stats = summarizeOrders(paidOrdersForDate(todayKey()));
  return `
    <section class="stats" aria-label="今日統計">
      <article><span>今日營收</span><strong>${money.format(stats.revenue)}</strong></article>
      <article><span>今日毛利</span><strong>${money.format(stats.profit)}</strong></article>
      <article><span>飲品杯數</span><strong>${stats.drinks}</strong></article>
      <article><span>甜品數</span><strong>${stats.desserts}</strong></article>
    </section>
  `;
}

function openStoreOrders() {
  return state.orders
    .filter((order) => order.status === "open")
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function orderPendingItems(order) {
  return (order.items || []).filter((item) => !item.served);
}

function orderReadyForCheckout(order) {
  return order.items?.length > 0 && orderPendingItems(order).length === 0;
}

function orderWorkspaceStatus(order) {
  if (!order) return { key: "empty", label: "空位", hint: "可入座" };
  if (!order.items?.length) return { key: "ordering", label: "點餐中", hint: "加入品項" };
  const pendingCount = orderPendingItems(order).length;
  if (pendingCount === order.items.length) return { key: "waiting", label: "等待製作", hint: `${pendingCount} 項待出` };
  if (orderReadyForCheckout(order)) return { key: "ready", label: "可結帳", hint: "前往收款" };
  return { key: "making", label: "製作中", hint: `${pendingCount} 項待出` };
}

function workspaceOverview() {
  const openOrders = openStoreOrders();
  const pendingItems = openOrders.reduce((count, order) => count + orderPendingItems(order).length, 0);
  const readyOrders = openOrders.filter(orderReadyForCheckout).length;
  const emptySeats = state.seats.filter((seat) => !getOpenOrderBySeat(seat.id)).length;
  return { openOrders, pendingItems, readyOrders, emptySeats };
}

function workCategory(item) {
  const categoryIndex = categories.findIndex((category) => category.id === item.category);
  if (categoryIndex >= 0) {
    const category = categories[categoryIndex];
    return { key: category.id, label: category.name, order: categoryIndex + 1 };
  }
  return { key: item.type || "other", label: typeLabels[item.type] || "其他", order: 8 };
}

function orderItemCountSummary(order) {
  const counts = (order.items || []).reduce(
    (counts, item) => {
      const quantity = Number(item.quantity) || 0;
      if (item.type === "drink") counts.drinks += quantity;
      if (item.type === "dessert") counts.desserts += quantity;
      if (item.type === "retail") counts.retail += quantity;
      return counts;
    },
    { drinks: 0, desserts: 0, retail: 0 }
  );
  return [
    counts.drinks ? `飲品 ${counts.drinks}` : "",
    counts.desserts ? `甜點 ${counts.desserts}` : "",
    counts.retail ? `熟豆 ${counts.retail}` : ""
  ].filter(Boolean).join("｜") || "尚無品項";
}

function orderNextAction(order) {
  const status = orderWorkspaceStatus(order);
  if (status.key === "ordering") return "繼續點餐";
  if (status.key === "ready") return "前往結帳";
  if (status.key === "waiting") return "開始出品";
  return "查看出品";
}

function renderWorkspaceStatus() {
  const overview = workspaceOverview();
  return `
    <section class="workspace-status-block" aria-label="今日狀態">
      <div class="workspace-status-title">
        <h3>今日狀態</h3>
        <span>一眼確認空位、待出品與可結帳桌</span>
      </div>
      <div class="workspace-status">
        <article><span>空位</span><strong>${overview.emptySeats}</strong></article>
        <article><span>進行中</span><strong>${overview.openOrders.length}</strong></article>
        <article><span>待出品</span><strong>${overview.pendingItems}</strong></article>
        <article><span>可結帳</span><strong>${overview.readyOrders}</strong></article>
      </div>
    </section>
  `;
}

function renderWorkspaceNav() {
  const groups = [
    {
      title: "營業",
      items: [
        { action: "floor", label: "POS 工作台" },
        { action: "history", label: "訂單歷史" },
        { action: "backup", label: "今日結帳" }
      ]
    },
    {
      title: "紀錄與庫存",
      items: [
        { action: "business-events", label: "營運事件" },
        { action: "inventory-lots", label: "庫存現況" }
      ]
    },
    {
      title: "管理與分析",
      items: [
        { action: "products", label: "商品" },
        { action: "analytics", label: "經營分析" }
      ]
    },
    {
      title: "系統",
      items: [{ action: "backup", label: "資料與設定" }]
    }
  ];
  return `
    <nav class="workspace-nav" aria-label="主要功能">
      ${groups
        .map(
          (group) => `
            <div class="nav-group">
              <span>${group.title}</span>
              <div>
                ${group.items
                  .map(
                    (item) => `
                      <button class="ghost ${state.activeView === item.action ? "active" : ""}" data-action="${item.action}">${item.label}</button>
                    `
                  )
                  .join("")}
              </div>
            </div>
          `
        )
        .join("")}
    </nav>
  `;
}

function renderSeats() {
  return `
    <section class="floor-block store-state-block">
      <div class="floor-subtitle">
        <div>
          <h3>桌位狀態</h3>
          <p>空位、製作中與可結帳桌一眼確認</p>
        </div>
      </div>
      <div class="seat-grid">
        ${state.seats
          .map((seat) => {
            const order = getOpenOrderBySeat(seat.id);
            const summary = order ? calculateOrder(order) : null;
            const status = orderWorkspaceStatus(order);
            const stayClass = order ? stayAlertClass(order) : "";
            return `
              <button class="seat ${order ? "occupied" : ""} status-${status.key} ${stayClass} ${seat.id === state.selectedSeatId ? "selected" : ""}" data-action="seat" data-id="${seat.id}">
                <span class="seat-top"><span class="seat-name">${seat.name}</span><span class="seat-status">${status.label}</span></span>
                ${
                  order
                    ? `<span class="seat-meta">${order.people}人</span>
                       <span class="seat-stay">開單 ${timeLabel(order.createdAt)} · ${activeDurationLabel(order)}</span>
                       <strong class="seat-total">${money.format(summary.total)}</strong>`
                    : `<span class="seat-meta">空位</span><span class="seat-stay"></span><strong class="seat-total subtle">開始</strong>`
                }
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderTakeoutOrders() {
  const orders = openTakeoutOrders();
  return `
    <section class="floor-block takeout-block">
      <div class="floor-subtitle">
        <h3>外帶訂單</h3>
        <button class="ghost" data-action="new-takeout">新增外帶</button>
      </div>
      <div class="takeout-list">
        ${
          orders.length
            ? orders
                .map((order) => {
                  const summary = calculateOrder(order);
                  return `
                    <button class="takeout-card ${order.id === state.selectedOrderId ? "selected" : ""}" data-action="select-order" data-id="${order.id}">
                      <span>${TAKEOUT_SEAT.icon} 外帶 · ${orderWorkspaceStatus(order).label}</span>
                      <strong>${activeDurationLabel(order)}</strong>
                      <small>開單 ${timeLabel(order.createdAt)} · ${money.format(summary.total)}</small>
                    </button>
                  `;
                })
                .join("")
            : `<div class="empty-note">目前沒有未結帳外帶訂單</div>`
        }
      </div>
    </section>
  `;
}

function renderMenu() {
  return `
    <section class="menu-panel">
      <div class="tabs">
        ${categories
          .map(
            (category) => `
              <button class="${category.id === state.selectedCategoryId ? "active" : ""}" data-action="category" data-id="${category.id}">
                ${category.name}
              </button>
            `
          )
          .join("")}
      </div>
      <div class="product-grid">
        ${visibleProducts()
          .map(
            (product) => `
              <button class="product ${product.active ? "" : "inactive"}" data-action="product" data-id="${product.id}" data-product-id="${product.id}" ${product.active ? "" : "disabled"}>
                <span>${product.name}</span>
                <strong>${money.format(product.price)}</strong>
              </button>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderOrderItems(order, paid) {
  if (!order.items.length) return `<div class="empty-note">點選左側商品加入訂單</div>`;
  let lastType = "";
  return sortOrderItems(order.items)
    .map((item) => {
      const readonly = paid;
      const requiresTemperature = item.requiresTemperature ?? item.type === "drink";
      const requiresServiceType = item.requiresServiceType ?? item.type !== "retail";
      const temperatureOptions = [
        item.supportsHot !== false ? "熱" : "",
        item.supportsIce !== false ? "冰" : ""
      ].filter(Boolean);
      const optionParts = [
        requiresTemperature && item.temperature ? item.temperature : "",
        requiresServiceType && item.serviceType ? item.serviceType : ""
      ].filter(Boolean);
      const unitPrice = Number(item.effectivePrice ?? item.price) || 0;
      const subtotal = unitPrice * item.quantity;
      const groupHeader =
        item.type !== lastType ? `<div class="line-group">${typeLabels[item.type] || "其他"}</div>` : "";
      lastType = item.type;
      return `
        ${groupHeader}
        <article class="line ${item.served ? "served" : ""}">
          <div class="line-title">
            <strong>${orderItemName(item)}</strong>
            <span>${money.format(subtotal)}</span>
          </div>
          <div class="line-meta">
            <span>${optionParts.join("｜") || "一般"}</span>
            <span>×${item.quantity}</span>
            ${item.iceExtra ? `<span>冰飲 +${money.format(item.iceExtra)}</span>` : ""}
          </div>
          ${
            readonly
              ? `<div class="line-readonly">
                  <span>數量 ${item.quantity}</span>
                  ${optionParts.map((part) => `<span>${part}</span>`).join("")}
                  <span>單價 ${money.format(unitPrice)}</span>
                  ${item.iceExtra ? `<span>冰飲加價 ${money.format(item.iceExtra)}</span>` : ""}
                  <span>小計 ${money.format(subtotal)}</span>
                  <span>${item.served ? "已出" : "未出"}</span>
                </div>`
              : `<div class="line-edit">
                  <section class="line-section">
                    <span class="line-section-label">數量</span>
                    <div class="quantity-control">
                      <button data-action="qty" data-id="${item.lineId}" data-value="${item.quantity - 1}" aria-label="減少數量">−</button>
                      <strong>${item.quantity}</strong>
                      <button data-action="qty" data-id="${item.lineId}" data-value="${item.quantity + 1}" aria-label="增加數量">＋</button>
                    </div>
                  </section>
                  ${
                    requiresTemperature
                      ? `<section class="line-section">
                          <span class="line-section-label">溫度</span>
                          <div class="segmented-control">
                            ${temperatureOptions.map((temperature) => `<button class="${item.temperature === temperature ? "active" : ""}" data-action="temp" data-id="${item.lineId}" data-value="${temperature}">${temperature}</button>`).join("")}
                          </div>
                        </section>`
                      : ""
                  }
                  ${
                    requiresServiceType
                      ? `<section class="line-section">
                          <span class="line-section-label">用餐</span>
                          <div class="segmented-control">
                            <button class="${item.serviceType === "內用" ? "active" : ""}" data-action="service" data-id="${item.lineId}" data-value="內用">內用</button>
                            <button class="${item.serviceType === "外帶" ? "active" : ""}" data-action="service" data-id="${item.lineId}" data-value="外帶">外帶</button>
                          </div>
                        </section>`
                      : ""
                  }
                  <section class="line-secondary-actions">
                    <button class="danger" data-action="remove" data-id="${item.lineId}">刪除</button>
                  </section>
                </div>`
          }
        </article>
      `;
    })
    .join("");
}

function productionLineLabel(item) {
  if (item.type === "drink") {
    return `${item.temperature || ""}${orderItemName(item)}`;
  }
  return orderItemName(item);
}

function productionGroups(order) {
  const groups = new Map();
  sortOrderItems(order.items).forEach((item) => {
    const group = workCategory(item).label;
    const label = productionLineLabel(item);
    const current = groups.get(group) || [];
    current.push({ ...item, group, label });
    groups.set(group, current);
  });
  return Object.fromEntries(groups);
}

function renderProductionList(order) {
  const groups = productionGroups(order);
  const paid = order.status === "paid";
  const orderedGroups = [...categories.map((category) => category.name), "其他"];
  return `
    <section class="production-list">
      <header>
        <strong>${seatName(order)}｜${order.people}人｜${activeDurationLabel(order)}</strong>
        <span>依工作順序出品，已完成項目會淡化。</span>
      </header>
      ${
        orderedGroups
          .filter((group) => groups[group]?.length)
          .map(
            (group) => `
              <section class="production-group">
                <h3>${group}</h3>
                <ul>
                  ${groups[group]
                    .map(
                      (item) => `
                        <li>
                          <button class="production-item ${item.served ? "served" : ""}" data-action="served" data-id="${item.lineId}" ${paid ? "disabled" : ""}>
                            <span class="production-check">${item.served ? "✓" : ""}</span>
                            <span class="production-name">
                              <strong>${item.label}${item.quantity > 1 ? ` ×${item.quantity}` : ""}</strong>
                              <small>${[item.serviceType, seatName(order)].filter(Boolean).join(" · ")}</small>
                              ${item.note ? `<small>${escapeHtml(item.note)}</small>` : ""}
                            </span>
                            ${item.served ? `<span class="production-status">已出</span>` : ""}
                          </button>
                        </li>
                      `
                    )
                    .join("")}
                </ul>
              </section>
            `
          )
          .join("") || `<div class="empty-note">尚無品項</div>`
      }
    </section>
  `;
}

function renderCustomerSource(order, paid) {
  const source = normalizeCustomerSource(order.customerSource);
  const note = order.customerSourceNote || "";
  const safeNote = escapeHtml(note);
  if (paid) {
    return `
      <section class="customer-source-panel readonly">
        <span>Customer source</span>
        <strong>${customerSourceLabel(source)}</strong>
        ${note ? `<small>${safeNote}</small>` : ""}
      </section>
    `;
  }
  return `
    <section class="customer-source-panel">
      <label>
        Customer source
        <select data-action="customer-source" data-id="${order.id}">
          ${customerSourceOptions().map(
            ([value, label]) => `<option value="${value}" ${source === value ? "selected" : ""}>${label}</option>`
          ).join("")}
        </select>
      </label>
      ${
        shouldShowCustomerSourceNote(source)
          ? `<label>
              Note
              <input value="${safeNote}" placeholder="Optional" data-action="customer-source-note" data-id="${order.id}" />
            </label>`
      : ""
  }
    </section>
  `;
}

function renderOrderInfoPanel(order, paid) {
  const source = normalizeCustomerSource(order.customerSource);
  return `
    <details class="order-info-panel">
      <summary>
        <span>訂單資訊</span>
        <small>客源：${customerSourceLabel(source)}</small>
      </summary>
      ${renderCustomerSource(order, paid)}
    </details>
  `;
}

function renderOrderQueue() {
  const orders = openStoreOrders();
  const visibleCount = Math.min(orders.length, 6);
  return `
    <section class="order-queue" aria-label="Order Queue">
      <div class="queue-head">
        <div>
          <span>Order Queue</span>
          <h2>來客順序</h2>
        </div>
        <div class="queue-head-actions">
          <small>${orders.length} 組進行中</small>
          <button class="ghost" data-action="new-takeout">新增外帶</button>
        </div>
      </div>
      <div class="queue-list">
        ${
          orders.length
            ? orders
                .map((order, index) => {
                  const status = orderWorkspaceStatus(order);
                  const selected = order.id === state.selectedOrderId;
                  return `
                    <button class="queue-order status-${status.key} ${selected ? "selected" : ""}" data-action="select-order" data-id="${order.id}">
                      <span class="queue-order-index">${index + 1}</span>
                      <div>
                        <span class="queue-order-row"><strong>${orderSeatName(order)}</strong><em>${status.label}</em></span>
                        <small>${order.people}人 · ${orderItemCountSummary(order)}</small>
                        <small class="queue-time">開單 ${timeLabel(order.createdAt)} · ${activeDurationLabel(order)}</small>
                      </div>
                    </button>
                  `;
                })
                .join("")
            : `<div class="empty-note">目前沒有進行中的訂單</div>`
        }
      </div>
      ${orders.length > visibleCount ? `<p class="queue-more">另有 ${orders.length - visibleCount} 組，向下捲動查看</p>` : ""}
    </section>
  `;
}

function renderOrder() {
  const order = getSelectedOrder();
  if (!order) {
    return `<aside class="order-panel empty"><span>尚未選擇訂單</span><strong>點選座位、外帶訂單或 Order Queue 開始處理。</strong></aside>`;
  }
  const summary = calculateOrder(order);
  const paid = order.status === "paid";
  const readonlyHistory = paid && state.orderDetailMode === "history";
  const showProductionList = state.orderViewMode === "production";
  const status = orderWorkspaceStatus(order);
  const linkedSeats = (order.linkedSeatIds || []).map((seatId) => ({ id: seatId, name: seatName(seatId) }));
  if (paid && !order.items?.length) {
    console.warn("[YUTU POS] paid order detail has no items", { orderId: order.id, status: order.status });
  }
  return `
    <aside class="order-panel">
      <div class="order-head">
        <div>
          <span>${seatIcon(order)} ${orderSeatName(order)} · ${status.label}</span>
          <strong>${order.people}人 · 開單 ${timeLabel(order.createdAt)}</strong>
          ${paid ? `<span>結帳 ${timeLabel(order.checkedOutAt)} · ${completedStayLabel(order)} · ${order.paymentMethod === "cash" ? "現金" : order.paymentMethod || "未記錄付款"}</span>` : `<span>${activeDurationLabel(order)}</span>`}
          ${paid && activityLogText(order) ? `<span>${activityLogText(order)}</span>` : ""}
        </div>
        <button class="ghost" data-action="floor">座位</button>
      </div>
      ${renderOrderInfoPanel(order, paid)}
      ${
        !paid && order.seatId !== TAKEOUT_SEAT_ID
          ? `<details class="order-actions-panel">
              <summary>
                <span>桌位操作</span>
                ${linkedSeats.length ? `<small>已加 ${linkedSeats.length} 桌</small>` : `<small>換桌 / 新增使用桌位</small>`}
              </summary>
              ${linkedSeats.length ? `<small>使用桌位：${linkedSeats.map((seat) => seat.name).join("、")}</small>` : ""}
              <div>
                <button class="secondary" data-action="move-table">換桌</button>
                <button class="secondary" data-action="add-linked-seat">新增使用桌位</button>
              </div>
              ${
                linkedSeats.length
                  ? `<div class="linked-seat-list">
                      ${linkedSeats.map((seat) => `<button class="ghost" data-action="remove-linked-seat" data-id="${seat.id}">移除 ${seat.name}</button>`).join("")}
                    </div>`
                  : ""
              }
            </details>`
          : ""
      }
      <section class="order-operation-panel">
        <span>訂單操作</span>
        <div class="order-view-toggle">
          <button class="${showProductionList ? "active" : ""}" data-action="order-view" data-value="production">出品清單</button>
          <button class="${!showProductionList ? "active" : ""}" data-action="order-view" data-value="edit">編輯訂單</button>
        </div>
      </section>
      <div class="line-list">${showProductionList ? renderProductionList(order) : renderOrderItems(order, paid)}</div>
      <div class="checkout">
        <div><span>總金額</span><strong>${money.format(summary.total)}</strong></div>
        <div><span>${showProductionList ? "下一步" : "毛利"}</span><strong>${showProductionList ? status.hint : money.format(summary.profit)}</strong></div>
        ${
          paid
            ? readonlyHistory
              ? `<button class="paid" disabled>已結帳 · 現金</button>`
              : `<button class="paid" disabled>已結帳 · 現金</button>
                 <button class="secondary" data-action="edit-paid" data-id="${order.id}">編輯訂單</button>
                 <button class="secondary danger-action" data-action="delete-order" data-id="${order.id}">刪除紀錄</button>`
            : `<button class="primary" data-action="checkout" ${order.items.length === 0 ? "disabled" : ""}>現金結帳</button>
               <button class="secondary danger-action" data-action="cancel-order">取消客人</button>`
        }
      </div>
    </aside>
  `;
}

function renderProductManagement() {
  const editing = state.editingProductId ? getProduct(state.editingProductId) : null;
  const form = editing || {
    name: "",
    category: state.selectedCategoryId,
    type: "drink",
    price: "",
    cost: "",
    supportsHot: true,
    supportsIce: true,
    supportsTakeout: true,
    iceExtraPrice: CATEGORY_METADATA[state.selectedCategoryId]?.iceExtraPrice || 0,
    active: true,
    sort: state.products.length + 1,
    note: "",
    variants: []
  };
  return `
    <section class="management">
      <div class="section-title">
        <h2>商品管理</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <form class="product-form" data-editing="${editing?.id || ""}">
        <label>品名<input id="product-name" value="${form.name}" /></label>
        <label>類別<select id="product-category">${categories.map((category) => `<option value="${category.id}" ${category.id === form.category ? "selected" : ""}>${category.name}</option>`).join("")}</select></label>
        <label>類型<select id="product-type">${Object.entries(typeLabels).map(([value, label]) => `<option value="${value}" ${value === form.type ? "selected" : ""}>${label}</option>`).join("")}</select></label>
        <label>售價<input id="product-price" type="number" step="0.001" value="${form.price}" /></label>
        <label>成本<input id="product-cost" type="number" step="0.001" value="${form.cost}" /></label>
        <label>冰飲加價<input id="product-ice-extra-price" type="number" step="1" value="${Number(form.iceExtraPrice) || 0}" /></label>
        <label>排序<input id="product-sort" type="number" step="1" value="${form.sort}" /></label>
        <label class="check-row"><input id="product-supports-hot" type="checkbox" ${form.supportsHot !== false ? "checked" : ""} /> 可做熱飲</label>
        <label class="check-row"><input id="product-supports-ice" type="checkbox" ${form.supportsIce !== false ? "checked" : ""} /> 可做冰飲</label>
        <label class="check-row"><input id="product-supports-takeout" type="checkbox" ${form.supportsTakeout !== false ? "checked" : ""} /> 可外帶</label>
        <label class="wide">口味 / 規格<textarea id="product-variants" placeholder="焙茶、伯爵">${variantNames(form).join("\n")}</textarea></label>
        <label class="wide">備註<input id="product-note" value="${form.note || ""}" /></label>
        <label class="check-row"><input id="product-active" type="checkbox" ${form.active !== false ? "checked" : ""} /> 販售中</label>
        <button class="primary" type="button" data-action="save-product" data-id="${editing?.id || ""}">${editing ? "儲存商品" : "新增商品"}</button>
        ${editing ? `<button class="secondary" type="button" data-action="new-product">清空表單</button>` : ""}
      </form>
      <div class="product-admin-list">
        ${sortedProducts()
          .map(
            (product) => `
              <article class="admin-product ${product.active ? "" : "inactive"}">
                <div>
                  <strong>${product.sort}. ${product.name}</strong>
                  <span>${categoryName(product.category)} · ${typeLabels[product.type]} · ${money.format(product.price)} / 成本 ${money.format(product.cost)}</span>
                  <small>${[
                    product.supportsHot ? "熱" : "",
                    product.supportsIce ? "冰" : "",
                    product.supportsTakeout ? "可外帶" : "",
                    product.iceExtraPrice ? `冰飲 +${money.format(product.iceExtraPrice)}` : ""
                  ].filter(Boolean).join(" · ") || "無點餐選項"}</small>
                  ${variantNames(product).length ? `<small>口味 / 規格：${variantNames(product).join("、")}</small>` : ""}
                  ${product.note ? `<small>${product.note}</small>` : ""}
                </div>
                <button data-action="edit-product" data-id="${product.id}">編輯</button>
                <button class="${product.active ? "danger-action" : ""}" data-action="toggle-product" data-id="${product.id}">${product.active ? "停售" : "恢復"}</button>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderHistory() {
  const paidOrders = paidOrdersForDate(state.historyDate);
  const stats = summarizeOrders(paidOrders);
  const rows = salesSummaryForDate(state.historyDate);
  const undoCandidate = lastPaidOrder();
  const showUndo = canUndoCheckout(undoCandidate);
  return `
    <section class="history">
      <div class="section-title">
        <h2>訂單歷史</h2>
        <div class="actions">
          ${
            showUndo
              ? `<button class="ghost danger-action" data-action="undo-order-checkout" data-id="${undoCandidate.id}">撤銷此筆結帳：${orderSeatName(undoCandidate)} · ${money.format(calculateOrder(undoCandidate).total)}</button>`
              : ""
          }
          <button class="ghost" data-action="floor">返回點餐</button>
        </div>
      </div>
      <div class="history-tools">
        <button data-action="history-yesterday">昨天</button>
        <button data-action="history-today">今天</button>
        <input type="date" value="${state.historyDate}" data-action="history-date" />
        <button data-action="export-report-date">匯出此日期</button>
      </div>
      <section class="stats report-stats" aria-label="指定日期統計">
        <article><span>營業額</span><strong>${money.format(stats.revenue)}</strong></article>
        <article><span>毛利</span><strong>${money.format(stats.profit)}</strong></article>
        <article><span>訂單數</span><strong>${stats.orderCount}</strong></article>
        <article><span>飲品杯數</span><strong>${stats.drinks}</strong></article>
        <article><span>甜品數</span><strong>${stats.desserts}</strong></article>
        <article><span>熟豆數</span><strong>${stats.retail}</strong></article>
        <article><span>平均客單價</span><strong>${money.format(stats.averageTicket)}</strong></article>
      </section>
      <div class="section-title compact">
        <h2>銷售彙總</h2>
        <button class="ghost" data-action="toggle-sales-sort">依${state.salesSort === "amount" ? "數量" : "金額"}排序</button>
      </div>
      <div class="sales-table">
        ${
          rows.length
            ? `<article class="sales-header"><strong>商品名稱</strong><span>類別</span><span>數量</span><span>銷售金額</span><span>成本</span><span>毛利</span></article>
               ${rows.map((row) => `<article><strong>${row.name}</strong><span>${row.category}</span><span>${row.quantity}</span><span>${money.format(row.amount)}</span><span>${money.format(row.cost)}</span><span>${money.format(row.profit)}</span></article>`).join("")}`
            : `<div class="empty-note">此日期尚無銷售紀錄</div>`
        }
      </div>
      <div class="section-title compact"><h2>訂單明細</h2></div>
      <div class="history-list">
        ${
          paidOrders.length
            ? paidOrders
                .map((order) => {
                  const summary = calculateOrder(order);
                  const sourceText = `客源：${customerSourceLabel(order.customerSource)}${order.customerSourceNote ? ` (${escapeHtml(order.customerSourceNote)})` : ""}`;
                  return `
                    <article class="history-item">
                      <button class="history-open" data-action="open-history" data-id="${order.id}">
                        <span>${timeLabel(order.checkedOutAt || order.createdAt)} · ${seatName(order)} · ${order.people}人</span>
                        <strong>${money.format(summary.total)}</strong>
                        <small>${sourceText}</small>
                        <small>${productSummaryText(order) || "無商品"} · ${completedStayLabel(order)}${activityLogText(order) ? ` · ${activityLogText(order)}` : ""}</small>
                      </button>
                      <button class="history-delete" data-action="delete-order" data-id="${order.id}">刪除</button>
                    </article>
                  `;
                })
                .join("")
            : `<div class="empty-note">此日期尚無已結帳訂單</div>`
        }
      </div>
    </section>
  `;
}

function renderBackupPage() {
  const todayOrders = paidOrdersForDate(todayKey());
  const todaySummary = summarizeOrders(todayOrders);
  return `
    <section class="management">
      <div class="section-title">
        <h2>資料與設定</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <div class="backup-sections">
        <section class="backup-section">
          <div>
            <h3>今日結帳／日結</h3>
            <p>營業結束前確認今日訂單，匯出日報並建立日結快照。</p>
          </div>
          <div class="backup-actions">
            <button class="primary" data-action="export-closing">結束營業 / 匯出今日報表</button>
            <button class="secondary" data-action="export-today">匯出今日資料</button>
          </div>
        </section>
        <section class="backup-section">
          <div>
            <h3>資料備份與還原</h3>
            <p>完整備份、匯入還原與測試資料清理。匯入與清空會影響此裝置資料。</p>
          </div>
          <div class="backup-actions">
            <button class="primary" data-action="export-all">匯出全部資料</button>
            <button class="secondary" data-action="import-backup">匯入備份</button>
            <button class="secondary danger-action" data-action="reset-test-orders">清空測試訂單資料</button>
          </div>
        </section>
        <input id="backup-file" type="file" accept="application/json,.json" hidden />
      </div>
      <div class="backup-summary">
        <article><span>目前訂單總數</span><strong>${state.orders.length}</strong></article>
        <article><span>商品數</span><strong>${state.products.length}</strong></article>
        <article><span>今日已結帳訂單</span><strong>${todayOrders.length}</strong></article>
        <article><span>今日營業額</span><strong>${money.format(todaySummary.revenue)}</strong></article>
      </div>
      <p class="backup-note">匯入會覆蓋此裝置的 localStorage 資料。正式試營運前可先匯出備份，再重置測試資料。</p>
    </section>
  `;
}

function filteredBusinessEvents() {
  return [...state.businessEvents]
    .filter((event) => !state.businessEventDate || event.date === state.businessEventDate)
    .filter((event) => state.businessEventTypeFilter === "all" || event.type === state.businessEventTypeFilter)
    .sort((a, b) => {
      const dateDelta = String(b.date || "").localeCompare(String(a.date || ""));
      if (dateDelta !== 0) return dateDelta;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
}

function editingBusinessEvent() {
  return state.businessEvents.find((event) => event.id === state.editingBusinessEventId) || null;
}

function businessEventProductOptions() {
  return state.products.filter((product) => product.active !== false);
}

function selectedBusinessEventProduct(productId) {
  const products = businessEventProductOptions();
  return products.find((product) => product.id === productId) || products[0] || null;
}

function saveBusinessEvent() {
  const form = document.querySelector("#business-event-form");
  if (!form) return;
  const data = new FormData(form);
  const type = String(data.get("type") || "purchase");
  const itemSource = String(data.get("itemSource") || "manual") === "product" ? "product" : "manual";
  const product = itemSource === "product" ? selectedBusinessEventProduct(String(data.get("productId") || "")) : null;
  const editing = editingBusinessEvent();
  const itemName = product
    ? editing?.productId === product.id && editing?.itemName
      ? editing.itemName
      : product.name
    : String(data.get("itemName") || "").trim();
  const itemCategory = String(data.get("itemCategory") || "").trim();
  const quantity = Math.max(1, Math.trunc(Number(data.get("quantity")) || 1));
  const unitCost = Number(data.get("unitCost")) || 0;
  const amount = Number(data.get("amount")) || 0;
  const rawCostAmount = String(data.get("costAmount") ?? "").trim();
  const costAmount = rawCostAmount === "" ? quantity * unitCost : Number(rawCostAmount) || 0;

  if (itemSource === "product" && !product) {
    showNotice("請選擇 POS 商品。");
    return;
  }
  if (!itemName) {
    showNotice("請填寫品項名稱。");
    return;
  }
  if (type === "purchase" && amount <= 0) {
    showNotice("採購事件請填寫採購金額。");
    return;
  }
  if (type !== "purchase" && costAmount <= 0) {
    showNotice("報廢、自用、測試或招待請填寫成本金額。");
    return;
  }

  const event = createBusinessEvent({
    ...(editing || {}),
    date: String(data.get("date") || todayKey()),
    type,
    usageType: type === "purchase" ? null : type,
    itemSource,
    productId: product?.id || "",
    materialId: "",
    itemName,
    itemCategory,
    quantity,
    unit: String(data.get("unit") || "").trim(),
    unitCost,
    amount: type === "purchase" ? amount : 0,
    costAmount,
    vendor: type === "purchase" ? String(data.get("vendor") || "").trim() : "",
    note: String(data.get("note") || "").trim(),
    updatedAt: new Date().toISOString()
  });
  const businessEvents = editing
    ? state.businessEvents.map((item) => (item.id === editing.id ? event : item))
    : [...state.businessEvents, event];

  setState({
    businessEvents,
    businessEventDate: event.date,
    businessEventTypeFilter: "all",
    businessEventFormType: event.type,
    businessEventItemSource: event.itemSource,
    businessEventProductId: event.productId,
    editingBusinessEventId: null,
    notice: `${editing ? "已更新" : "已新增"}營運事件：${businessEventTypeLabel(event.type)} / ${event.itemName}`
  });
}

function renderBusinessEventsPage() {
  const editing = editingBusinessEvent();
  const formType = state.businessEventFormType || editing?.type || "purchase";
  const isPurchase = formType === "purchase";
  const itemSource = state.businessEventItemSource || editing?.itemSource || "manual";
  const productOptions = businessEventProductOptions();
  const selectedProduct = itemSource === "product"
    ? selectedBusinessEventProduct(state.businessEventProductId || editing?.productId || "")
    : null;
  const rows = filteredBusinessEvents();
  const typeOptions = businessEventTypeOptions({ formOnly: true });
  const formDate = editing?.date || state.businessEventDate || todayKey();
  const quantityValue = editing?.quantity || 1;
  const itemCategoryValue = editing?.itemCategory ?? selectedProduct?.category ?? "";
  const unitCostValue = editing?.unitCost ?? (selectedProduct ? Number(selectedProduct.cost) || 0 : "");
  const amountValue = editing?.amount || "";
  const calculatedCostAmount = unitCostValue ? quantityValue * Number(unitCostValue) : 0;
  const costAmountValue = editing?.costAmount ?? "";
  return `
    <section class="business-events-page">
      <div class="section-title">
        <div>
          <h2>營運事件</h2>
          <p>記錄採購、報廢、自用、測試與招待，不影響銷售訂單。</p>
        </div>
        <button class="ghost" data-action="floor">回到 POS</button>
      </div>

      <form id="business-event-form" class="business-event-form">
        <label>
          日期
          <input type="date" name="date" value="${formDate}" />
        </label>
        <label>
          類型
          <select name="type" data-action="business-event-type">
            ${typeOptions.map(([type, label]) => `<option value="${type}" ${formType === type ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
        <label>
          品項來源
          <select name="itemSource" data-action="business-event-item-source">
            <option value="product" ${itemSource === "product" ? "selected" : ""}>POS 商品</option>
            <option value="manual" ${itemSource === "manual" ? "selected" : ""}>手動輸入</option>
            <option value="material" disabled>Material 未開放</option>
          </select>
        </label>
        ${
          itemSource === "product"
            ? `<label>
                POS 商品
                <select name="productId" data-action="business-event-product">
                  ${productOptions.map((product) => `<option value="${product.id}" ${selectedProduct?.id === product.id ? "selected" : ""}>${product.name}</option>`).join("")}
                </select>
              </label>`
            : `<label>
                品項
                <input name="itemName" value="${escapeHtml(editing?.itemName || "")}" placeholder="例如：牛奶、巴斯克、濾紙" />
              </label>`
        }
        <label>
          品項類別
          <input name="itemCategory" value="${escapeHtml(itemCategoryValue)}" placeholder="可空白" />
        </label>
        <label>
          數量
          <input name="quantity" type="number" min="1" step="1" value="${quantityValue}" />
        </label>
        <label>
          單位
          <input name="unit" value="${escapeHtml(editing?.unit || "")}" placeholder="g / ml / 片 / 包" />
        </label>
        <label>
          單位成本
          <input name="unitCost" type="number" min="0" step="1" value="${unitCostValue}" placeholder="0" />
        </label>
        ${
          isPurchase
            ? `<label>
                採購金額
                <input name="amount" type="number" min="0" step="1" value="${amountValue}" placeholder="0" />
              </label>
              <label>
                成本金額
                <input name="costAmount" type="number" min="0" step="1" value="${costAmountValue}" placeholder="${calculatedCostAmount ? `預設 ${calculatedCostAmount}` : "可空白"}" />
              </label>
              <label>
                供應商
                <input name="vendor" value="${escapeHtml(editing?.vendor || "")}" placeholder="可空白" />
              </label>`
            : `<label>
                成本金額
                <input name="costAmount" type="number" min="0" step="1" value="${costAmountValue}" placeholder="${calculatedCostAmount ? `預設 ${calculatedCostAmount}` : "0"}" />
              </label>`
        }
        <label class="wide">
          備註
          <input name="note" value="${escapeHtml(editing?.note || "")}" placeholder="可空白" />
        </label>
        <div class="form-actions">
          <button class="primary" data-action="save-business-event">${editing ? "更新紀錄" : "新增紀錄"}</button>
          ${editing ? `<button class="secondary" data-action="cancel-business-event-edit">取消</button>` : ""}
        </div>
      </form>

      <div class="business-event-filters">
        <label>
          日期
          <input type="date" value="${state.businessEventDate || todayKey()}" data-action="business-event-date" />
        </label>
        <label>
          類型
          <select data-action="business-event-filter-type">
            <option value="all" ${state.businessEventTypeFilter === "all" ? "selected" : ""}>全部</option>
            ${typeOptions.map(([type, label]) => `<option value="${type}" ${state.businessEventTypeFilter === type ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
      </div>

      <div class="analytics-table business-event-table">
        ${
          rows.length
            ? `<div class="analytics-table-head"><span>日期</span><span>類型</span><span>品項</span><span>數量</span><span>金額 / 成本</span><span>備註</span><span>操作</span></div>
               ${rows.map((event) => `
                 <div>
                   <span>${event.date}</span>
                   <strong>${businessEventTypeLabel(event.type)}</strong>
                   <span>${escapeHtml(event.itemName)}</span>
                   <span>${event.quantity || 0} ${escapeHtml(event.unit)}</span>
                   <span>${event.type === "purchase" ? money.format(event.amount) : money.format(event.costAmount)}</span>
                   <span>${event.vendor ? `${escapeHtml(event.vendor)} / ` : ""}${escapeHtml(event.note || "")}</span>
                   <button class="ghost" data-action="edit-business-event" data-id="${event.id}">編輯</button>
                 </div>
               `).join("")}`
            : `<div class="empty-note">此日期與類型尚無營運事件</div>`
        }
      </div>
    </section>
  `;
}

function inventoryLotProductOptions(lotType = state.inventoryLotType) {
  const targetType = lotType === "roasted_beans" ? "retail" : "dessert";
  return state.products.filter((product) => product.active !== false && product.type === targetType);
}

function selectedInventoryLotProduct(productId, lotType = state.inventoryLotType) {
  const products = inventoryLotProductOptions(lotType);
  return products.find((product) => product.id === productId) || products[0] || null;
}

function filteredInventoryLots() {
  return [...state.inventoryLots]
    .filter((lot) => state.inventoryLotStatusFilter === "all" || lot.status === state.inventoryLotStatusFilter)
    .sort((a, b) => {
      const dateA = a.madeDate || a.roastDate || a.purchaseDate || a.createdAt || "";
      const dateB = b.madeDate || b.roastDate || b.purchaseDate || b.createdAt || "";
      const dateDelta = String(dateB).localeCompare(String(dateA));
      if (dateDelta !== 0) return dateDelta;
      return String(a.itemName).localeCompare(String(b.itemName), "zh-Hant");
    });
}

function saveInventoryLot() {
  const form = document.querySelector("#inventory-lot-form");
  if (!form) return;
  const data = new FormData(form);
  const lotType = String(data.get("lotType") || "dessert");
  const itemSource = String(data.get("itemSource") || "manual") === "product" ? "product" : "manual";
  const product = itemSource === "product" ? selectedInventoryLotProduct(String(data.get("productId") || ""), lotType) : null;
  const itemName = product ? product.name : String(data.get("itemName") || "").trim();
  const itemCategory = product ? product.category : String(data.get("itemCategory") || "").trim();
  const initialQuantity = Math.max(1, Math.trunc(Number(data.get("initialQuantity")) || 1));
  const unitCost = Number(data.get("unitCost")) || 0;
  const rawCostAmount = String(data.get("costAmount") ?? "").trim();
  const costAmount = rawCostAmount === "" ? initialQuantity * unitCost : Number(rawCostAmount) || 0;

  if (itemSource === "product" && !product) {
    showNotice("請先建立或啟用對應的甜點 / 熟豆商品。");
    return;
  }
  if (!itemName) {
    showNotice("請填寫批次品項名稱。");
    return;
  }
  if (initialQuantity <= 0) {
    showNotice("批次初始數量需大於 0。");
    return;
  }

  const lot = createInventoryLot({
    itemSource,
    productId: product?.id || "",
    materialId: "",
    itemName,
    itemCategory,
    lotType,
    sourceEventId: "",
    madeDate: lotType === "dessert" ? String(data.get("madeDate") || "") : "",
    roastDate: lotType === "roasted_beans" ? String(data.get("roastDate") || "") : "",
    purchaseDate: String(data.get("purchaseDate") || ""),
    expireDate: String(data.get("expireDate") || ""),
    initialQuantity,
    remainingQuantity: initialQuantity,
    unit: String(data.get("unit") || defaultUnitForLotType(lotType)).trim(),
    unitCost,
    costAmount,
    status: "active",
    note: String(data.get("note") || "").trim()
  });

  setState({
    inventoryLots: [...state.inventoryLots, lot],
    inventoryLotType: lot.lotType,
    inventoryLotItemSource: lot.itemSource === "product" ? "product" : "manual",
    inventoryLotProductId: lot.productId,
    inventoryLotStatusFilter: "active",
    notice: `已新增批次：${lot.itemName}`
  });
}

function archiveInventoryLot(lotId) {
  const lot = state.inventoryLots.find((item) => item.lotId === lotId);
  if (!lot) return;
  setState({
    inventoryLots: state.inventoryLots.map((item) => (
      item.lotId === lotId ? { ...item, status: "archived", updatedAt: new Date().toISOString() } : item
    )),
    notice: `已封存批次：${lot.itemName}`
  });
}

function renderInventoryLotsPage() {
  const lotType = state.inventoryLotType || "dessert";
  const itemSource = state.inventoryLotItemSource || "product";
  const productOptions = inventoryLotProductOptions(lotType);
  const selectedProduct = itemSource === "product"
    ? selectedInventoryLotProduct(state.inventoryLotProductId, lotType)
    : null;
  const unitCostValue = selectedProduct ? Number(selectedProduct.cost) || 0 : "";
  const defaultUnit = defaultUnitForLotType(lotType);
  const today = todayKey();
  const rows = filteredInventoryLots();
  return `
    <section class="inventory-lots-page">
      <div class="section-title">
        <div>
          <h2>庫存現況</h2>
          <h3>甜點與熟豆批次</h3>
          <p>第一版只管理甜點與熟豆批次，不會自動扣 POS 銷售或 Business Events。</p>
        </div>
        <button class="ghost" data-action="floor">回到 POS</button>
      </div>

      <form id="inventory-lot-form" class="inventory-lot-form">
        <label>
          批次類型
          <select name="lotType" data-action="inventory-lot-type">
            ${inventoryLotTypeOptions().map(([type, label]) => `<option value="${type}" ${lotType === type ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
        <label>
          品項來源
          <select name="itemSource" data-action="inventory-lot-item-source">
            <option value="product" ${itemSource === "product" ? "selected" : ""}>POS 商品</option>
            <option value="manual" ${itemSource === "manual" ? "selected" : ""}>手動輸入</option>
            <option value="material" disabled>Material 未開放</option>
          </select>
        </label>
        ${
          itemSource === "product"
            ? `<label>
                POS 商品
                <select name="productId" data-action="inventory-lot-product">
                  ${productOptions.map((product) => `<option value="${product.id}" ${selectedProduct?.id === product.id ? "selected" : ""}>${product.name}</option>`).join("")}
                </select>
              </label>`
            : `<label>
                品項名稱
                <input name="itemName" placeholder="${lotType === "roasted_beans" ? "例如：Sidra 熟豆" : "例如：巴斯克"}" />
              </label>`
        }
        <label>
          品項類別
          <input name="itemCategory" value="${escapeHtml(selectedProduct?.category || "")}" placeholder="可空白" />
        </label>
        ${
          lotType === "dessert"
            ? `<label>製作日期<input name="madeDate" type="date" value="${today}" /></label>`
            : `<label>烘焙日期<input name="roastDate" type="date" value="${today}" /></label>`
        }
        <label>
          採購日期
          <input name="purchaseDate" type="date" />
        </label>
        <label>
          到期日
          <input name="expireDate" type="date" />
        </label>
        <label>
          初始數量
          <input name="initialQuantity" type="number" min="1" step="1" value="1" />
        </label>
        <label>
          單位
          <input name="unit" value="${defaultUnit}" />
        </label>
        <label>
          單位成本
          <input name="unitCost" type="number" min="0" step="1" value="${unitCostValue}" placeholder="0" />
        </label>
        <label>
          總成本
          <input name="costAmount" type="number" min="0" step="1" placeholder="可空白" />
        </label>
        <label class="wide">
          備註
          <input name="note" placeholder="可空白" />
        </label>
        <div class="form-actions">
          <button class="primary" data-action="save-inventory-lot">新增批次</button>
        </div>
      </form>

      <div class="inventory-lot-filters">
        <label>
          狀態
          <select data-action="inventory-lot-status-filter">
            <option value="active" ${state.inventoryLotStatusFilter === "active" ? "selected" : ""}>使用中</option>
            <option value="archived" ${state.inventoryLotStatusFilter === "archived" ? "selected" : ""}>已封存</option>
            <option value="all" ${state.inventoryLotStatusFilter === "all" ? "selected" : ""}>全部</option>
          </select>
        </label>
      </div>

      <div class="analytics-table inventory-lot-table">
        ${
          rows.length
            ? `<div class="analytics-table-head"><span>類型</span><span>品項</span><span>日期</span><span>到期</span><span>初始</span><span>剩餘</span><span>成本</span><span>狀態</span><span>備註</span><span>操作</span></div>
               ${rows.map((lot) => {
                 const lotDate = lot.lotType === "roasted_beans" ? lot.roastDate : lot.madeDate;
                 return `
                   <div>
                     <span>${inventoryLotTypeLabel(lot.lotType)}</span>
                     <strong>${escapeHtml(lot.itemName)}</strong>
                     <span>${lotDate || lot.purchaseDate || "-"}</span>
                     <span>${lot.expireDate || "-"}</span>
                     <span>${lot.initialQuantity} ${escapeHtml(lot.unit)}</span>
                     <span>${lot.remainingQuantity} ${escapeHtml(lot.unit)}</span>
                     <span>${money.format(lot.costAmount)}</span>
                     <span>${inventoryLotStatusLabel(lot.status)}</span>
                     <span>${escapeHtml(lot.note || "")}</span>
                     <span>${lot.status === "active" ? `<button class="ghost" data-action="archive-inventory-lot" data-id="${lot.lotId}">封存</button>` : "-"}</span>
                   </div>
                 `;
               }).join("")}`
            : `<div class="empty-note">目前沒有符合條件的批次</div>`
        }
      </div>
    </section>
  `;
}

function renderAnalyticsDashboard() {
  const range = analyticsDateRange();
  const dashboard = buildAnalyticsDashboard(state.orders, {
    startDate: range.startDate,
    endDate: range.endDate,
    sortBy: state.analyticsSort,
    categoryLabels: categoryLabelMap(),
    seatLabels: seatLabelMap(),
    customerSourceLabels: customerSourceLabelMap(),
    businessEvents: state.businessEvents
  });
  const {
    overview,
    productRanking,
    categorySummary,
    temperatureSummary,
    hourlySummary,
    seatSummary,
    customerSourceSummary,
    businessEventSummary
  } = dashboard;
  const topProducts = productRanking.slice(0, 8);
  const rangeButtons = [
    ["today", "今日"],
    ["yesterday", "昨日"],
    ["seven-days", "近 7 天"],
    ["month", "本月"],
    ["custom", "自訂日期"]
  ];
  const sortButtons = [
    ["quantity", "銷售數量"],
    ["revenue", "營收"],
    ["profit", "毛利"]
  ];

  return `
    <section class="analytics-page">
      <div class="section-title">
        <div>
          <h2>經營分析</h2>
          <span class="analytics-range-label">${range.label}</span>
        </div>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>

      <div class="analytics-toolbar">
        <div class="analytics-range-tabs">
          ${rangeButtons
            .map(
              ([value, label]) => `
                <button class="${state.analyticsRange === value ? "active" : ""}" data-action="analytics-range" data-value="${value}">${label}</button>
              `
            )
            .join("")}
        </div>
        <div class="analytics-custom-dates">
          <label>開始<input type="date" value="${range.startDate}" data-action="analytics-start-date" /></label>
          <label>結束<input type="date" value="${range.endDate}" data-action="analytics-end-date" /></label>
        </div>
      </div>

      <section class="stats analytics-stats" aria-label="經營分析概覽">
        <article><span>營業額</span><strong>${money.format(overview.revenue)}</strong></article>
        <article><span>毛利</span><strong>${money.format(overview.profit)}</strong></article>
        <article><span>毛利率</span><strong>${percent.format(overview.marginRate)}</strong></article>
        <article><span>訂單數</span><strong>${overview.orderCount}</strong></article>
        <article><span>人數</span><strong>${overview.people}</strong></article>
        <article><span>平均客單價</span><strong>${money.format(overview.averageTicket)}</strong></article>
        <article><span>飲品杯數</span><strong>${overview.drinks}</strong></article>
        <article><span>甜點數</span><strong>${overview.desserts}</strong></article>
        <article><span>熟豆數</span><strong>${overview.retail}</strong></article>
      </section>

      <section class="analytics-panel">
        <div class="section-title compact"><h2>營運事件摘要</h2></div>
        <div class="business-event-summary">
          <article><span>採購金額</span><strong>${money.format(businessEventSummary.purchaseAmount)}</strong></article>
          <article><span>報廢成本</span><strong>${money.format(businessEventSummary.wasteCost)}</strong></article>
          <article><span>自用成本</span><strong>${money.format(businessEventSummary.personalCost)}</strong></article>
          <article><span>測試成本</span><strong>${money.format(businessEventSummary.testCost)}</strong></article>
          <article><span>招待成本</span><strong>${money.format(businessEventSummary.complimentaryCost)}</strong></article>
        </div>
      </section>

      <section class="analytics-panel">
        <div class="section-title compact"><h2>客源分析</h2></div>
        <div class="analytics-table customer-source-table">
          ${
            customerSourceSummary.length
              ? `<div class="analytics-table-head"><span>來源</span><span>訂單數</span><span>營收</span><span>平均客單價</span></div>
                 ${customerSourceSummary
                   .map(
                     (row) => `
                       <div>
                         <strong>${row.label}</strong>
                         <span>${row.orderCount}</span>
                         <span>${money.format(row.revenue)}</span>
                         <span>${money.format(row.averageTicket)}</span>
                       </div>
                     `
                   )
                   .join("")}`
              : `<div class="empty-note">No paid orders in this range.</div>`
          }
        </div>
      </section>

      <section class="analytics-panel">
        <div class="section-title compact">
          <h2>商品銷售排行</h2>
          <div class="analytics-sort">
            ${sortButtons
              .map(
                ([value, label]) => `<button class="${state.analyticsSort === value ? "active" : ""}" data-action="analytics-sort" data-value="${value}">${label}</button>`
              )
              .join("")}
          </div>
        </div>
        <div class="analytics-table product-ranking-table">
          ${
            topProducts.length
              ? `<div class="analytics-table-head">
                    <span>排名</span><span>商品名稱</span><span>類別</span><span>數量</span><span>營收</span><span>成本</span><span>毛利</span><span>毛利率</span><span>口味 / 規格</span><span>冰 / 熱</span><span>內用 / 外帶</span>
                 </div>
                 ${topProducts
                   .map(
                     (row, index) => `
                       <div>
                         <span>${index + 1}</span>
                         <strong>${row.name}</strong>
                         <span>${row.category}</span>
                         <span>${row.quantity}</span>
                         <span>${money.format(row.revenue)}</span>
                         <span>${money.format(row.cost)}</span>
                         <span>${money.format(row.profit)}</span>
                         <span>${percent.format(row.marginRate)}</span>
                         <span>${variantDistributionDetails(row)}</span>
                         <span>${row.iced || row.hot ? `冰 ${row.iced} / 熱 ${row.hot}` : "-"}</span>
                         <span>內用 ${row.dineIn} / 外帶 ${row.takeaway}</span>
                       </div>
                     `
                   )
                   .join("")}`
              : `<div class="empty-note">此區間尚無已結帳銷售</div>`
          }
        </div>
      </section>

      <section class="analytics-grid">
        <article class="analytics-panel">
          <div class="section-title compact"><h2>類別分析</h2></div>
          <div class="analytics-table category-summary-table">
            ${
              categorySummary.length
                ? `<div class="analytics-table-head"><span>類別</span><span>數量</span><span>營收</span><span>毛利</span><span>毛利率</span></div>
                   ${categorySummary
                     .map(
                       (row) => `
                         <div>
                           <strong>${row.category}</strong>
                           <span>${row.quantity}</span>
                           <span>${money.format(row.revenue)}</span>
                           <span>${money.format(row.profit)}</span>
                           <span>${percent.format(row.marginRate)}</span>
                         </div>
                       `
                     )
                     .join("")}`
                : `<div class="empty-note">此區間尚無類別資料</div>`
            }
          </div>
        </article>
        <article class="analytics-panel">
          <div class="section-title compact"><h2>冰熱分析</h2></div>
          <div class="temperature-summary">
            <article><span>冰飲數量</span><strong>${temperatureSummary.iced}</strong><small>${percent.format(temperatureSummary.icedRate)}</small></article>
            <article><span>熱飲數量</span><strong>${temperatureSummary.hot}</strong><small>${percent.format(temperatureSummary.hotRate)}</small></article>
          </div>
        </article>
      </section>

      <section class="analytics-grid">
        <article class="analytics-panel">
          <div class="section-title compact"><h2>時段分析</h2></div>
          <div class="analytics-table hourly-summary-table">
            ${
              hourlySummary.length
                ? `<div class="analytics-table-head"><span>小時</span><span>訂單數</span><span>營業額</span><span>飲品杯數</span></div>
                   ${hourlySummary
                     .map(
                       (row) => `
                         <div>
                           <strong>${row.hour}</strong>
                           <span>${row.orderCount} 單</span>
                           <span>${money.format(row.revenue)}</span>
                           <span>${row.drinks} 杯</span>
                         </div>
                       `
                     )
                     .join("")}`
                : `<div class="empty-note">此區間尚無時段資料</div>`
            }
          </div>
        </article>
        <article class="analytics-panel">
          <div class="section-title compact"><h2>座位分析</h2></div>
          <div class="analytics-table seat-summary-table">
            ${
              seatSummary.length
                ? `<div class="analytics-table-head"><span>座位名稱</span><span>訂單數</span><span>人數</span><span>營業額</span><span>平均客單價</span></div>
                   ${seatSummary
                     .map(
                       (row) => `
                         <div>
                           <strong>${row.seatName}</strong>
                           <span>${row.orderCount}</span>
                           <span>${row.people}</span>
                           <span>${money.format(row.revenue)}</span>
                           <span>${money.format(row.averageTicket)}</span>
                         </div>
                       `
                     )
                     .join("")}`
                : `<div class="empty-note">此區間尚無座位資料</div>`
            }
          </div>
        </article>
      </section>
    </section>
  `;
}

function renderMain() {
  if (state.activeView === "analytics") return renderAnalyticsDashboard();
  if (state.activeView === "backup") return renderBackupPage();
  if (state.activeView === "business-events") return renderBusinessEventsPage();
  if (state.activeView === "inventory-lots") return renderInventoryLotsPage();
  if (state.activeView === "products") return renderProductManagement();
  if (state.activeView === "history") return renderHistory();
  return `
    <main class="workspace">
      <section class="floor workspace-floor">
        <div class="section-title workspace-title">
          ${renderWorkspaceNav()}
        </div>
        ${renderWorkspaceStatus()}
        ${renderSeats()}
        ${renderMenu()}
      </section>
      <aside class="task-column">
        ${renderOrderQueue()}
        ${renderOrder()}
      </aside>
    </main>
  `;
}

function renderDebugPanel() {
  if (!isDebugMode) return "";
  const debug = state.debug || {};
  const rows = [
    ["clicked product id", debug.clickedProductId || ""],
    ["selectedSeatId", debug.selectedSeatId || state.selectedSeatId || ""],
    ["selectedOrderId", debug.selectedOrderId || state.selectedOrderId || ""],
    ["current open order id", debug.currentOpenOrderId || currentOpenOrder()?.id || ""],
    ["product found", String(debug.productFound ?? "")],
    ["addProduct executed", String(debug.addProductExecuted ?? "")],
    ["failure reason", debug.addProductFailureReason || ""],
    ["before items.length", String(debug.beforeItemsLength ?? debug.selectedOrderItemsLengthBefore ?? "")],
    ["after items.length", String(debug.afterItemsLength ?? "")],
    ["new item lineId", debug.newItemLineId || ""],
    ["replaceOrder executed", String(debug.replaceOrderExecuted ?? "")],
    ["storage save executed", String(debug.storageSaveExecuted ?? "")],
    ["render after save executed", String(debug.renderAfterSaveExecuted ?? "")],
    ["orders.length", String(debug.ordersLength ?? state.orders.length)],
    ["selected items.length", String(debug.selectedOrderItemsLength ?? selectedOrderItemCount())],
    ["dataset.id", debug.datasetId || ""],
    ["data-product-id", debug.productDatasetId || ""],
    ["closest button", String(debug.closestButtonFound ?? "")],
    ["source", debug.productClickSource || ""],
    ["updated", debug.updatedAt || ""]
  ];
  return `
    <aside class="debug-panel" aria-label="Debug Panel">
      <strong>Debug Panel</strong>
      ${rows.map(([label, value]) => `<div><span>${label}</span><code>${value}</code></div>`).join("")}
    </aside>
  `;
}

function bindProductButtons() {
  document.querySelectorAll(".product[data-product-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      handleProductClick(button.getAttribute("data-product-id"), "direct-product-button", event);
    });
  });
}

function render() {
  document.querySelector("#app").innerHTML = `
    <div class="shell">
      ${shouldShowDevBanner() ? `<div class="dev-banner">🟠 開發版本 ${APP_BRANCH}</div>` : ""}
      <header class="topbar">
        <div class="topbar-title"><span>YUTU POS</span><h1>POS 工作台</h1><small>接單、點餐與結帳</small></div>
        <div class="store-status">
          <time>${new Date().toLocaleDateString("zh-TW", { month: "long", day: "numeric", weekday: "short" })}</time>
          <strong>${isStoreClosedToday() ? "今日已關店" : "營業中"}</strong>
          ${isStoreClosedToday() ? "" : `<button class="close-store-button" data-action="close-store">結束營業</button>`}
        </div>
      </header>
      ${state.notice ? `<div class="notice" role="status">${state.notice}</div>` : ""}
      ${state.activeView === "floor" ? "" : renderStats()}
      ${renderMain()}
      ${renderDebugPanel()}
    </div>
  `;
  document.querySelectorAll("button:not([type])").forEach((button) => {
    button.type = "button";
  });
  bindProductButtons();
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  event.preventDefault();
  const { action, id, value } = button.dataset;

  if (action === "seat") startOrder(id);
  if (action === "new-takeout") startTakeoutOrder();
  if (action === "select-order") selectOrder(id);
  if (action === "category") setState({ selectedCategoryId: id });
  if (action === "product") handleProductClick(id, "delegated-document-click", event);
  if (action === "qty") {
    const nextQuantity = Number(value);
    nextQuantity <= 0 ? removeLine(id) : updateLine(id, { quantity: nextQuantity });
  }
  if (action === "temp") updateLine(id, { temperature: value });
  if (action === "service") updateLine(id, { serviceType: value });
  if (action === "served") {
    const order = getSelectedOrder();
    const item = order?.items.find((line) => line.lineId === id);
    if (item) updateLine(id, { served: !item.served });
  }
  if (action === "remove") removeLine(id);
  if (action === "checkout") payOrder();
  if (action === "close-store") closeStoreWorkflow();
  if (action === "move-table") moveSelectedOrder();
  if (action === "add-linked-seat") addLinkedSeatToOrder();
  if (action === "remove-linked-seat") removeLinkedSeatFromOrder(id);
  if (action === "undo-checkout") undoLastCheckout();
  if (action === "undo-order-checkout") undoCheckoutOrder(id);
  if (action === "cancel-order") cancelOrder();
  if (action === "edit-paid") editPaidOrder(id);
  if (action === "delete-order") deleteOrder(id);
  if (action === "products") setState({ activeView: "products", editingProductId: null });
  if (action === "business-events") setState({ activeView: "business-events", businessEventDate: state.businessEventDate || todayKey() });
  if (action === "inventory-lots") setState({ activeView: "inventory-lots" });
  if (action === "analytics") setState({ activeView: "analytics" });
  if (action === "backup") setState({ activeView: "backup" });
  if (action === "new-product") openProductEditor(null);
  if (action === "edit-product") openProductEditor(id);
  if (action === "toggle-product") toggleProduct(id);
  if (action === "save-product") saveProduct(id || null);
  if (action === "export-all") exportAllData();
  if (action === "export-today") exportTodayData();
  if (action === "export-closing") exportClosingReport();
  if (action === "export-report-date") exportDailyData(state.historyDate || todayKey());
  if (action === "import-backup") document.querySelector("#backup-file")?.click();
  if (action === "reset-test-orders") resetTestOrders();
  if (action === "save-business-event") saveBusinessEvent();
  if (action === "save-inventory-lot") saveInventoryLot();
  if (action === "archive-inventory-lot") archiveInventoryLot(id);
  if (action === "edit-business-event") {
    const eventRecord = state.businessEvents.find((eventItem) => eventItem.id === id);
    if (eventRecord) {
      setState({
        activeView: "business-events",
        editingBusinessEventId: id,
        businessEventFormType: eventRecord.type,
        businessEventItemSource: eventRecord.itemSource || "manual",
        businessEventProductId: eventRecord.productId || "",
        businessEventDate: eventRecord.date || state.businessEventDate || todayKey()
      });
    }
  }
  if (action === "cancel-business-event-edit") setState({ editingBusinessEventId: null });
  if (action === "history") setState({ activeView: "history", historyDate: state.historyDate || todayKey() });
  if (action === "floor") setState({ activeView: "floor", orderDetailMode: "active" });
  if (action === "open-history") {
    const order = state.orders.find((item) => item.id === id);
    if (!order) {
      console.warn("[YUTU POS] history order not found", { orderId: id });
      showNotice("找不到這筆歷史訂單。");
    } else {
      setState({ selectedOrderId: id, selectedSeatId: order.seatId, activeView: "floor", orderDetailMode: "history" });
    }
  }
  if (action === "history-yesterday") setState({ historyDate: shiftDate(todayKey(), -1) });
  if (action === "history-today") setState({ historyDate: todayKey() });
  if (action === "toggle-sales-sort") setState({ salesSort: state.salesSort === "amount" ? "quantity" : "amount" });
  if (action === "order-view") setState({ orderViewMode: value === "production" ? "production" : "edit" });
  if (action === "analytics-range") {
    const nextRange = value || "today";
    const nextPatch = { analyticsRange: nextRange };
    if (nextRange !== "custom") {
      const current = analyticsDateRangeFor(nextRange);
      nextPatch.analyticsStartDate = current.startDate;
      nextPatch.analyticsEndDate = current.endDate;
    }
    setState(nextPatch);
  }
  if (action === "analytics-sort") setState({ analyticsSort: value || "quantity" });
});

document.addEventListener("change", (event) => {
  if (event.target?.id === "backup-file") {
    importBackupFile(event.target.files?.[0]);
    event.target.value = "";
    return;
  }
  const target = event.target.closest("[data-action]");
  if (!target) return;
  if (target.dataset.action === "history-date") setState({ historyDate: target.value || todayKey() });
  if (target.dataset.action === "analytics-start-date") {
    setState({ analyticsRange: "custom", analyticsStartDate: target.value || todayKey() });
  }
  if (target.dataset.action === "analytics-end-date") {
    setState({ analyticsRange: "custom", analyticsEndDate: target.value || todayKey() });
  }
  if (target.dataset.action === "business-event-date") {
    setState({ businessEventDate: target.value || todayKey() });
  }
  if (target.dataset.action === "business-event-filter-type") {
    setState({ businessEventTypeFilter: target.value || "all" });
  }
  if (target.dataset.action === "business-event-type") {
    setState({ businessEventFormType: target.value || "purchase" });
  }
  if (target.dataset.action === "business-event-item-source") {
    const source = target.value === "product" ? "product" : "manual";
    const product = source === "product" ? selectedBusinessEventProduct(state.businessEventProductId) : null;
    setState({
      businessEventItemSource: source,
      businessEventProductId: product?.id || ""
    });
  }
  if (target.dataset.action === "business-event-product") {
    setState({ businessEventItemSource: "product", businessEventProductId: target.value || "" });
  }
  if (target.dataset.action === "inventory-lot-type") {
    const lotType = target.value || "dessert";
    const product = selectedInventoryLotProduct(state.inventoryLotProductId, lotType);
    setState({
      inventoryLotType: lotType,
      inventoryLotProductId: product?.id || ""
    });
  }
  if (target.dataset.action === "inventory-lot-item-source") {
    const source = target.value === "product" ? "product" : "manual";
    const product = source === "product" ? selectedInventoryLotProduct(state.inventoryLotProductId, state.inventoryLotType) : null;
    setState({
      inventoryLotItemSource: source,
      inventoryLotProductId: product?.id || ""
    });
  }
  if (target.dataset.action === "inventory-lot-product") {
    setState({ inventoryLotItemSource: "product", inventoryLotProductId: target.value || "" });
  }
  if (target.dataset.action === "inventory-lot-status-filter") {
    setState({ inventoryLotStatusFilter: target.value || "active" });
  }
  if (target.dataset.action === "customer-source") {
    const source = normalizeCustomerSource(target.value);
    updateOrderMeta({
      customerSource: source,
      customerSourceNote: shouldShowCustomerSourceNote(source) ? getSelectedOrder()?.customerSourceNote || "" : ""
    });
  }
  if (target.dataset.action === "customer-source-note") {
    updateOrderMeta({ customerSourceNote: target.value || "" });
  }
});

document.addEventListener("submit", (event) => {
  if (!["business-event-form", "inventory-lot-form"].includes(event.target?.id)) return;
  event.preventDefault();
  event.target.id === "business-event-form" ? saveBusinessEvent() : saveInventoryLot();
});

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
