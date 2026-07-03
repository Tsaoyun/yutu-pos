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
import { loadState, saveState, STORAGE_KEY } from "./services/storage.js";
import "./styles.css";

const typeLabels = { drink: "飲品", dessert: "甜品", retail: "熟豆" };
const money = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0
});

const isDebugMode = new URLSearchParams(window.location.search).get("debug") === "1";

const initialState = {
  seats: defaultSeats,
  products: seedProducts(defaultMenuItems),
  orders: [],
  selectedSeatId: defaultSeats[0].id,
  selectedCategoryId: categories[0].id,
  selectedOrderId: null,
  orderDetailMode: "active",
  orderViewMode: "edit",
  activeView: "floor",
  historyDate: todayKey(),
  salesSort: "amount",
  notice: "",
  debug: {}
};

let state = normalizeState(loadState(initialState));

function seedProducts(items) {
  return items.map((item, index) => ({
    ...item,
    requiresTemperature: item.requiresTemperature ?? item.type === "drink",
    requiresServiceType: item.requiresServiceType ?? item.type !== "retail",
    sort: item.sort ?? index + 1,
    note: item.note || ""
  }));
}

function normalizeState(savedState) {
  const savedProducts = Array.isArray(savedState.products)
    ? savedState.products
    : Array.isArray(savedState.menuItems)
      ? savedState.menuItems
      : initialState.products;

  const products = seedProducts(savedProducts).map((product, index) => ({
    ...product,
    id: product.id || `product-${Date.now()}-${index}`,
    name: product.name || "未命名商品",
    category: product.category || "espresso",
    type: product.type || "drink",
    price: Number(product.price) || 0,
    cost: Number(product.cost) || 0,
    requiresTemperature: product.requiresTemperature ?? product.type === "drink",
    requiresServiceType: product.requiresServiceType ?? product.type !== "retail",
    active: product.active !== false,
    sort: Number(product.sort) || index + 1,
    note: product.note || ""
  }));

  const orders = Array.isArray(savedState.orders)
    ? savedState.orders.map((order) => ({
        ...order,
        items: Array.isArray(order.items)
          ? order.items.map((item) => ({
              ...item,
              quantity: Number(item.quantity) || 1,
              price: Number(item.price) || 0,
              cost: Number(item.cost) || 0,
              profit: item.profit ?? (Number(item.price) || 0) - (Number(item.cost) || 0),
              temperature: item.temperature === "冰" ? "冰" : "熱",
              serviceType: item.serviceType === "外帶" ? "外帶" : "內用",
              requiresTemperature: item.requiresTemperature ?? item.type === "drink",
              requiresServiceType: item.requiresServiceType ?? item.type !== "retail",
              served: Boolean(item.served),
              note: item.note || ""
            }))
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
    selectedSeatId: defaultSeats.some((seat) => seat.id === savedState.selectedSeatId)
      ? savedState.selectedSeatId
      : defaultSeats[0].id,
    selectedCategoryId: categories.some((category) => category.id === savedState.selectedCategoryId)
      ? savedState.selectedCategoryId
      : categories[0].id,
    historyDate: savedState.historyDate || todayKey(),
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

function timeLabel(value) {
  return new Date(value).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" });
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
  return state.seats.find((seat) => seat.id === id);
}

function getProduct(id) {
  return state.products.find((product) => product.id === id);
}

function getOpenOrderBySeat(seatId) {
  return state.orders.find((order) => order.seatId === seatId && order.status === "open");
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
  return orders.reduce(
    (stats, order) => {
      const summary = calculateOrder(order);
      stats.revenue += summary.total;
      stats.profit += summary.profit;
      stats.drinks += summary.drinks;
      stats.desserts += summary.desserts;
      stats.retail += order.items.reduce((count, item) => count + (item.type === "retail" ? item.quantity : 0), 0);
      stats.orderCount += 1;
      return stats;
    },
    { revenue: 0, profit: 0, drinks: 0, desserts: 0, retail: 0, orderCount: 0 }
  );
}

function salesSummaryForDate(dateKey) {
  const rows = new Map();
  paidOrdersForDate(dateKey).forEach((order) => {
    order.items.forEach((item) => {
      const key = `${item.productId || item.name}-${item.name}-${item.price}-${item.cost}`;
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
      current.amount += item.price * item.quantity;
      current.cost += item.cost * item.quantity;
      current.profit += (item.price - item.cost) * item.quantity;
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
    setState({ selectedSeatId: seatId, selectedOrderId: existing.id, activeView: "floor", orderDetailMode: "active", orderViewMode: "edit" });
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
    orderViewMode: "edit"
  });
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

    const beforeItemsLength = order.items.length;
    const nextOrder = addOrderItem(order, product);
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

function payOrder() {
  const order = getSelectedOrder();
  if (!order || order.status !== "open" || order.items.length === 0) return;
  replaceOrder(checkoutOrder(order, "cash"));
  setState({ selectedOrderId: null, activeView: "floor", historyDate: todayKey() });
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
  return {
    name: document.querySelector("#product-name").value.trim(),
    category: document.querySelector("#product-category").value,
    type: document.querySelector("#product-type").value,
    price: Number(document.querySelector("#product-price").value),
    cost: Number(document.querySelector("#product-cost").value),
    sort: Number(document.querySelector("#product-sort").value) || state.products.length + 1,
    note: document.querySelector("#product-note").value.trim(),
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
      products: state.products.map((product) => (product.id === productId ? { ...product, ...next } : product))
    });
    return;
  }

  setState({
    products: [
      ...state.products,
      {
        id: `custom-${Date.now()}`,
        ...next
      }
    ]
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

function buildBackupState() {
  return {
    version: "1.1",
    exportedAt: new Date().toISOString(),
    storageKey: STORAGE_KEY,
    state
  };
}

function exportAllData() {
  downloadJson(`yutu-pos-backup-${timestampForFile()}.json`, buildBackupState());
}

function exportTodayData() {
  const date = todayKey();
  const orders = paidOrdersForDate(date);
  const payload = {
    version: "1.1",
    exportedAt: new Date().toISOString(),
    date,
    summary: summarizeOrders(orders),
    sales: salesSummaryForDate(date),
    orders
  };
  downloadJson(`yutu-pos-today-${date}.json`, payload);
}

function validateImportedState(input) {
  const importedState = input?.state || input;
  if (!importedState || typeof importedState !== "object") {
    throw new Error("JSON 不是可用的 POS 備份格式。");
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

function renderSeats() {
  return `
    <section class="seat-grid">
      ${state.seats
        .map((seat) => {
          const order = getOpenOrderBySeat(seat.id);
          const summary = order ? calculateOrder(order) : null;
          return `
            <button class="seat ${order ? "occupied" : ""} ${seat.id === state.selectedSeatId ? "selected" : ""}" data-action="seat" data-id="${seat.id}">
              <span class="seat-icon">${seat.icon}</span>
              <span class="seat-name">${seat.name}</span>
              ${
                order
                  ? `<span class="seat-meta">${order.people}人 · ${timeLabel(order.createdAt)}</span><strong>${money.format(summary.total)}</strong>`
                  : `<span class="seat-meta">目前空位</span><strong>開始</strong>`
              }
            </button>
          `;
        })
        .join("")}
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
      const optionParts = [
        requiresTemperature && item.temperature ? item.temperature : "",
        requiresServiceType && item.serviceType ? item.serviceType : ""
      ].filter(Boolean);
      const subtotal = item.price * item.quantity;
      const groupHeader =
        item.type !== lastType ? `<div class="line-group">${typeLabels[item.type] || "其他"}</div>` : "";
      lastType = item.type;
      return `
        ${groupHeader}
        <article class="line ${item.served ? "served" : ""}">
          <div class="line-title">
            <strong>${item.name}</strong>
            <span>${money.format(item.price)} × ${item.quantity} = ${money.format(subtotal)}</span>
          </div>
          ${
            readonly
              ? `<div class="line-readonly">
                  <span>數量 ${item.quantity}</span>
                  ${optionParts.map((part) => `<span>${part}</span>`).join("")}
                  <span>單價 ${money.format(item.price)}</span>
                  <span>小計 ${money.format(subtotal)}</span>
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
                            <button class="${item.temperature === "熱" ? "active" : ""}" data-action="temp" data-id="${item.lineId}" data-value="熱">熱</button>
                            <button class="${item.temperature === "冰" ? "active" : ""}" data-action="temp" data-id="${item.lineId}" data-value="冰">冰</button>
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
                    <button class="served-toggle ${item.served ? "active" : ""}" data-action="served" data-id="${item.lineId}">${item.served ? "已出" : "出單"}</button>
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
    return `${item.temperature || ""}${item.name}`;
  }
  return item.name;
}

function productionGroups(order) {
  const groups = new Map();
  sortOrderItems(order.items).forEach((item) => {
    const group = typeLabels[item.type] || "其他";
    const label = productionLineLabel(item);
    const key = `${group}:${label}`;
    const current = groups.get(key) || { group, label, quantity: 0 };
    current.quantity += item.quantity;
    groups.set(key, current);
  });
  return [...groups.values()].reduce((result, item) => {
    if (!result[item.group]) result[item.group] = [];
    result[item.group].push(item);
    return result;
  }, {});
}

function renderProductionList(order) {
  const seat = getSeat(order.seatId);
  const groups = productionGroups(order);
  const orderedGroups = ["飲品", "甜品", "熟豆", "其他"];
  return `
    <section class="production-list">
      <header>
        <strong>${seat?.name || "未命名座位"}｜${order.people}人｜${timeLabel(order.createdAt)}</strong>
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
                    .map((item) => `<li>${item.label}${item.quantity > 1 ? ` ×${item.quantity}` : ""}</li>`)
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

function renderOrder() {
  const order = getSelectedOrder();
  if (!order) {
    return `<aside class="order-panel empty"><span>選擇座位</span><strong>新增客人開始點餐</strong></aside>`;
  }
  const seat = getSeat(order.seatId);
  const summary = calculateOrder(order);
  const paid = order.status === "paid";
  const readonlyHistory = paid && state.orderDetailMode === "history";
  const showProductionList = state.orderViewMode === "production";
  if (paid && !order.items?.length) {
    console.warn("[YUTU POS] paid order detail has no items", { orderId: order.id, status: order.status });
  }
  return `
    <aside class="order-panel">
      <div class="order-head">
        <div>
          <span>${seat.icon} ${seat.name}</span>
          <strong>${order.people}人 · 開單 ${timeLabel(order.createdAt)}</strong>
          ${paid ? `<span>結帳 ${timeLabel(order.checkedOutAt)} · ${order.paymentMethod === "cash" ? "現金" : order.paymentMethod || "未記錄付款"}</span>` : ""}
        </div>
        <button class="ghost" data-action="floor">座位</button>
      </div>
      <div class="order-view-toggle">
        <button class="${showProductionList ? "active" : ""}" data-action="order-view" data-value="production">出品清單</button>
        <button class="${!showProductionList ? "active" : ""}" data-action="order-view" data-value="edit">編輯訂單</button>
      </div>
      <div class="line-list">${showProductionList ? renderProductionList(order) : renderOrderItems(order, paid)}</div>
      <div class="checkout">
        <div><span>總金額</span><strong>${money.format(summary.total)}</strong></div>
        <div><span>毛利</span><strong>${money.format(summary.profit)}</strong></div>
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
    active: true,
    sort: state.products.length + 1,
    note: ""
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
        <label>排序<input id="product-sort" type="number" step="1" value="${form.sort}" /></label>
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
  return `
    <section class="history">
      <div class="section-title">
        <h2>歷史查詢</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <div class="history-tools">
        <button data-action="history-yesterday">昨天</button>
        <button data-action="history-today">今天</button>
        <input type="date" value="${state.historyDate}" data-action="history-date" />
      </div>
      <section class="stats report-stats" aria-label="指定日期統計">
        <article><span>營業額</span><strong>${money.format(stats.revenue)}</strong></article>
        <article><span>毛利</span><strong>${money.format(stats.profit)}</strong></article>
        <article><span>飲品杯數</span><strong>${stats.drinks}</strong></article>
        <article><span>甜品數</span><strong>${stats.desserts}</strong></article>
        <article><span>熟豆數</span><strong>${stats.retail}</strong></article>
        <article><span>訂單數</span><strong>${stats.orderCount}</strong></article>
      </section>
      <div class="section-title compact">
        <h2>銷售彙總</h2>
        <button class="ghost" data-action="toggle-sales-sort">依${state.salesSort === "amount" ? "數量" : "金額"}排序</button>
      </div>
      <div class="sales-table">
        ${rows.length ? rows.map((row) => `<article><strong>${row.name}</strong><span>${row.category}</span><span>${row.quantity}</span><span>${money.format(row.amount)}</span><span>${money.format(row.cost)}</span><span>${money.format(row.profit)}</span></article>`).join("") : `<div class="empty-note">此日期尚無銷售紀錄</div>`}
      </div>
      <div class="section-title compact"><h2>訂單明細</h2></div>
      <div class="history-list">
        ${
          paidOrders.length
            ? paidOrders
                .map((order) => {
                  const seat = getSeat(order.seatId);
                  const summary = calculateOrder(order);
                  return `
                    <article class="history-item">
                      <button class="history-open" data-action="open-history" data-id="${order.id}">
                        <span>${order.id}</span>
                        <strong>${seat?.name || "未命名座位"} · ${money.format(summary.total)}</strong>
                        <small>${timeLabel(order.createdAt)} → ${timeLabel(order.checkedOutAt)}</small>
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
        <h2>備份 / 資料</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <div class="backup-actions">
        <button class="primary" data-action="export-all">匯出全部資料</button>
        <button class="secondary" data-action="export-today">匯出今日資料</button>
        <button class="secondary" data-action="import-backup">匯入備份</button>
        <button class="secondary danger-action" data-action="reset-test-orders">重置測試資料</button>
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

function renderMain() {
  if (state.activeView === "backup") return renderBackupPage();
  if (state.activeView === "products") return renderProductManagement();
  if (state.activeView === "history") return renderHistory();
  return `
    <main class="workspace">
      <section class="floor">
        <div class="section-title">
          <h2>目前店內</h2>
          <div class="actions">
            <button class="ghost" data-action="products">商品管理</button>
            <button class="ghost" data-action="history">歷史</button>
            <button class="ghost" data-action="backup">備份 / 資料</button>
          </div>
        </div>
        ${renderSeats()}
        ${renderMenu()}
      </section>
      ${renderOrder()}
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
      <header class="topbar">
        <div><span>YUTU Coffee</span><h1>隅途 POS</h1></div>
        <time>${new Date().toLocaleDateString("zh-TW", { month: "long", day: "numeric", weekday: "short" })}</time>
      </header>
      ${state.notice ? `<div class="notice" role="status">${state.notice}</div>` : ""}
      ${renderStats()}
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
  if (action === "cancel-order") cancelOrder();
  if (action === "edit-paid") editPaidOrder(id);
  if (action === "delete-order") deleteOrder(id);
  if (action === "products") setState({ activeView: "products", editingProductId: null });
  if (action === "backup") setState({ activeView: "backup" });
  if (action === "new-product") openProductEditor(null);
  if (action === "edit-product") openProductEditor(id);
  if (action === "toggle-product") toggleProduct(id);
  if (action === "save-product") saveProduct(id || null);
  if (action === "export-all") exportAllData();
  if (action === "export-today") exportTodayData();
  if (action === "import-backup") document.querySelector("#backup-file")?.click();
  if (action === "reset-test-orders") resetTestOrders();
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
});

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
