function toDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function orderDateKey(order) {
  return toDateKey(order.checkedOutAt || order.createdAt);
}

function orderHour(order) {
  const date = new Date(order.checkedOutAt || order.createdAt);
  if (Number.isNaN(date.getTime())) return "--:00";
  return `${String(date.getHours()).padStart(2, "0")}:00`;
}

function unitPrice(item) {
  return Number(item.effectivePrice ?? item.price) || 0;
}

function unitCost(item) {
  return Number(item.cost) || 0;
}

function quantity(item) {
  return Number(item.quantity) || 0;
}

function marginRate(profit, revenue) {
  return revenue ? profit / revenue : 0;
}

function categoryLabel(category, labels = {}) {
  return labels[category] || category || "其他";
}

function seatLabel(seatId, labels = {}) {
  if (seatId === "takeout") return labels.takeout || "外帶";
  return labels[seatId] || seatId || "未命名座位";
}

function ensureCategoryRows(labels = {}) {
  return Object.values(labels).map((category) => ({
    category,
    quantity: 0,
    revenue: 0,
    cost: 0,
    profit: 0,
    marginRate: 0
  }));
}

export function filterPaidOrdersByDateRange(orders, startDate, endDate) {
  const start = startDate || toDateKey(new Date());
  const end = endDate || start;
  return (Array.isArray(orders) ? orders : []).filter((order) => {
    if (order.status !== "paid") return false;
    const dateKey = orderDateKey(order);
    return dateKey >= start && dateKey <= end;
  });
}

export function buildOverviewMetrics(orders) {
  const metrics = (Array.isArray(orders) ? orders : []).reduce(
    (summary, order) => {
      summary.orderCount += 1;
      summary.people += Number(order.people) || 0;

      order.items?.forEach((item) => {
        const count = quantity(item);
        const revenue = unitPrice(item) * count;
        const cost = unitCost(item) * count;
        const profit = revenue - cost;

        summary.revenue += revenue;
        summary.cost += cost;
        summary.profit += profit;
        summary.drinks += item.type === "drink" ? count : 0;
        summary.desserts += item.type === "dessert" ? count : 0;
        summary.retail += item.type === "retail" ? count : 0;
      });

      return summary;
    },
    {
      revenue: 0,
      cost: 0,
      profit: 0,
      marginRate: 0,
      orderCount: 0,
      people: 0,
      averageTicket: 0,
      drinks: 0,
      desserts: 0,
      retail: 0
    }
  );

  metrics.marginRate = marginRate(metrics.profit, metrics.revenue);
  metrics.averageTicket = metrics.orderCount ? metrics.revenue / metrics.orderCount : 0;
  return metrics;
}

export function buildProductRanking(orders, options = {}) {
  const labels = options.categoryLabels || {};
  const sortBy = options.sortBy || "quantity";
  const rows = new Map();

  (Array.isArray(orders) ? orders : []).forEach((order) => {
    order.items?.forEach((item) => {
      const count = quantity(item);
      const price = unitPrice(item);
      const costPerUnit = unitCost(item);
      const revenue = price * count;
      const cost = costPerUnit * count;
      const profit = revenue - cost;
      const key = `${item.productId || item.name}-${item.name}`;
      const row = rows.get(key) || {
        productId: item.productId || "",
        name: item.name,
        category: categoryLabel(item.category, labels),
        quantity: 0,
        revenue: 0,
        cost: 0,
        profit: 0,
        marginRate: 0,
        iced: 0,
        hot: 0,
        dineIn: 0,
        takeaway: 0,
        variants: {}
      };

      row.quantity += count;
      row.revenue += revenue;
      row.cost += cost;
      row.profit += profit;
      row.iced += item.type === "drink" && item.temperature === "冰" ? count : 0;
      row.hot += item.type === "drink" && item.temperature === "熱" ? count : 0;
      row.dineIn += item.serviceType === "內用" ? count : 0;
      row.takeaway += item.serviceType === "外帶" ? count : 0;
      if (item.variantName) {
        row.variants[item.variantName] = (row.variants[item.variantName] || 0) + count;
      }
      row.marginRate = marginRate(row.profit, row.revenue);
      rows.set(key, row);
    });
  });

  const sorters = {
    quantity: (a, b) => b.quantity - a.quantity || b.revenue - a.revenue,
    revenue: (a, b) => b.revenue - a.revenue || b.quantity - a.quantity,
    profit: (a, b) => b.profit - a.profit || b.revenue - a.revenue
  };

  return [...rows.values()].sort(sorters[sortBy] || sorters.quantity);
}

export function buildCategorySummary(orders, options = {}) {
  const labels = options.categoryLabels || {};
  const seeded = ensureCategoryRows(labels);
  const rows = new Map(seeded.map((row) => [row.category, row]));

  (Array.isArray(orders) ? orders : []).forEach((order) => {
    order.items?.forEach((item) => {
      const count = quantity(item);
      const revenue = unitPrice(item) * count;
      const cost = unitCost(item) * count;
      const profit = revenue - cost;
      const category = categoryLabel(item.category, labels);
      const row = rows.get(category) || { category, quantity: 0, revenue: 0, cost: 0, profit: 0, marginRate: 0 };
      row.quantity += count;
      row.revenue += revenue;
      row.cost += cost;
      row.profit += profit;
      row.marginRate = marginRate(row.profit, row.revenue);
      rows.set(category, row);
    });
  });

  return [...rows.values()];
}

export function buildTemperatureSummary(orders) {
  const summary = { iced: 0, hot: 0, total: 0, icedRate: 0, hotRate: 0 };
  (Array.isArray(orders) ? orders : []).forEach((order) => {
    order.items?.forEach((item) => {
      if (item.type !== "drink") return;
      const count = quantity(item);
      summary.iced += item.temperature === "冰" ? count : 0;
      summary.hot += item.temperature === "熱" ? count : 0;
      summary.total += count;
    });
  });
  summary.icedRate = marginRate(summary.iced, summary.total);
  summary.hotRate = marginRate(summary.hot, summary.total);
  return summary;
}

export function buildHourlySummary(orders) {
  const rows = new Map();
  (Array.isArray(orders) ? orders : []).forEach((order) => {
    const hour = orderHour(order);
    const row = rows.get(hour) || { hour, orderCount: 0, revenue: 0, drinks: 0 };
    row.orderCount += 1;
    order.items?.forEach((item) => {
      const count = quantity(item);
      row.revenue += unitPrice(item) * count;
      row.drinks += item.type === "drink" ? count : 0;
    });
    rows.set(hour, row);
  });
  return [...rows.values()].sort((a, b) => a.hour.localeCompare(b.hour));
}

export function buildSeatSummary(orders, options = {}) {
  const seatLabels = options.seatLabels || {};
  const rows = new Map();
  (Array.isArray(orders) ? orders : []).forEach((order) => {
    const seatName = seatLabel(order.seatId, seatLabels);
    const row = rows.get(seatName) || {
      seatName,
      orderCount: 0,
      people: 0,
      revenue: 0,
      averageTicket: 0
    };
    row.orderCount += 1;
    row.people += Number(order.people) || 0;
    order.items?.forEach((item) => {
      row.revenue += unitPrice(item) * quantity(item);
    });
    row.averageTicket = row.orderCount ? row.revenue / row.orderCount : 0;
    rows.set(seatName, row);
  });
  return [...rows.values()].sort((a, b) => b.revenue - a.revenue || b.orderCount - a.orderCount);
}

export function buildAnalyticsDashboard(orders, options = {}) {
  const paidOrders = filterPaidOrdersByDateRange(orders, options.startDate, options.endDate);
  return {
    startDate: options.startDate,
    endDate: options.endDate,
    paidOrders,
    overview: buildOverviewMetrics(paidOrders),
    productRanking: buildProductRanking(paidOrders, options),
    categorySummary: buildCategorySummary(paidOrders, options),
    temperatureSummary: buildTemperatureSummary(paidOrders),
    hourlySummary: buildHourlySummary(paidOrders),
    seatSummary: buildSeatSummary(paidOrders, options)
  };
}
