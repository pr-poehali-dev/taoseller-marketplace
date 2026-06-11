import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import OrderForm, { type OrderFormData } from "@/components/OrderForm";

const ORDERS_API = "https://functions.poehali.dev/285ad74b-7b60-4123-b852-f28f47f01e9e";

interface DbOrder {
  id: number;
  order_num: string;
  buyer_name: string;
  buyer_phone: string;
  address: string;
  link: string;
  quantity: number;
  variant: string;
  comment: string;
  photo: string | null;
  price_yuan: number | null;
  price_rub: number | null;
  total_rub: number | null;
  status: string;
  created_at: string;
}

type Page = "home" | "catalog" | "orders" | "storage" | "profile" | "help";

interface Notification {
  id: number;
  type: "order" | "message" | "change";
  title: string;
  text: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, type: "order", title: "Новый заказ!", text: "Заказ #TAO-8821 на сумму ¥1,240", time: "2 мин", read: false },
  { id: 2, type: "message", title: "Сообщение от покупателя", text: "Ли Вэй: Когда будет отправка?", time: "15 мин", read: false },
  { id: 3, type: "change", title: "Изменение статуса", text: "Заказ #TAO-8815 доставлен", time: "1 ч", read: false },
  { id: 4, type: "order", title: "Новый заказ!", text: "Заказ #TAO-8820 на сумму ¥580", time: "2 ч", read: true },
  { id: 5, type: "message", title: "Отзыв покупателя", text: "★★★★★ Отличный товар!", time: "3 ч", read: true },
];

const MOCK_PRODUCTS = [
  { id: 1, name: "Кроссовки Nike Air Max 270", sku: "NK-270-BLK-42", price: "¥ 680", category: "Обувь", stock: 24, status: "active", img: "👟" },
  { id: 2, name: "Рюкзак городской Xiaomi", sku: "XMI-BP-GRY", price: "¥ 320", category: "Сумки", stock: 8, status: "active", img: "🎒" },
  { id: 3, name: "Наушники TWS Pro X5", sku: "TWS-X5-WHT", price: "¥ 450", category: "Электроника", stock: 0, status: "out", img: "🎧" },
  { id: 4, name: "Куртка зимняя мужская", sku: "JKT-WIN-M-BLK", price: "¥ 1,200", category: "Одежда", stock: 15, status: "active", img: "🧥" },
  { id: 5, name: "Умные часы DT3 Pro", sku: "DT3-PRO-BLK", price: "¥ 890", category: "Электроника", stock: 3, status: "low", img: "⌚" },
  { id: 6, name: "Кроссовки Adidas Ultraboost", sku: "AD-UB-WHT-41", price: "¥ 750", category: "Обувь", stock: 18, status: "active", img: "👟" },
  { id: 7, name: "Косметический набор Laneige", sku: "LNG-SET-001", price: "¥ 560", category: "Красота", stock: 42, status: "active", img: "💄" },
  { id: 8, name: "Чехол iPhone 15 кожаный", sku: "IP15-CASE-BRN", price: "¥ 180", category: "Аксессуары", stock: 0, status: "out", img: "📱" },
];

const MOCK_ORDERS = [
  { id: "TAO-8821", buyer: "Ли Вэй", items: 2, total: "¥ 1,240", status: "new", date: "11 июн 2026", address: "Шанхай, р-н Пудун" },
  { id: "TAO-8820", buyer: "Чжан Мэй", items: 1, total: "¥ 580", status: "processing", date: "11 июн 2026", address: "Пекин, Чаоян" },
  { id: "TAO-8819", buyer: "Ван Фан", items: 3, total: "¥ 2,100", status: "shipped", date: "10 июн 2026", address: "Гуанчжоу, Тяньхэ" },
  { id: "TAO-8818", buyer: "Лю Ян", items: 1, total: "¥ 320", status: "delivered", date: "9 июн 2026", address: "Ухань, Хунь" },
  { id: "TAO-8817", buyer: "Чэнь Цзин", items: 2, total: "¥ 950", status: "delivered", date: "8 июн 2026", address: "Чэнду, Цзинь" },
  { id: "TAO-8816", buyer: "Хуан Лей", items: 1, total: "¥ 680", status: "cancelled", date: "7 июн 2026", address: "Нанкин, Гулоу" },
];

const MOCK_STORAGE = [
  { id: "A-01", name: "Секция A — Обувь", items: 156, capacity: 200, used: 78 },
  { id: "B-02", name: "Секция B — Одежда", items: 243, capacity: 300, used: 81 },
  { id: "C-03", name: "Секция C — Электроника", items: 89, capacity: 150, used: 59 },
  { id: "D-04", name: "Секция D — Аксессуары", items: 312, capacity: 400, used: 78 },
];

const statusConfig = {
  new: { label: "Новый", color: "text-blue-600 bg-blue-50 border-blue-200" },
  processing: { label: "В обработке", color: "text-orange-600 bg-orange-50 border-orange-200" },
  shipped: { label: "Отправлен", color: "text-purple-600 bg-purple-50 border-purple-200" },
  delivered: { label: "Доставлен", color: "text-green-600 bg-green-50 border-green-200" },
  cancelled: { label: "Отменён", color: "text-red-500 bg-red-50 border-red-200" },
};

const productStatusConfig = {
  active: { label: "В наличии", color: "text-green-600 bg-green-50" },
  low: { label: "Мало", color: "text-orange-600 bg-orange-50" },
  out: { label: "Нет", color: "text-red-500 bg-red-50" },
};

const notifTypeConfig = {
  order: { icon: "ShoppingCart", color: "text-orange-500", bg: "bg-orange-50" },
  message: { icon: "MessageCircle", color: "text-blue-500", bg: "bg-blue-50" },
  change: { icon: "RefreshCw", color: "text-green-500", bg: "bg-green-50" },
};

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("Все");
  const [orderStatusFilter, setOrderStatusFilter] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [dbOrders, setDbOrders] = useState<DbOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(ORDERS_API);
      const data = await res.json();
      setDbOrders(data.orders || []);
    } catch { /* молча */ }
    finally { setOrdersLoading(false); }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => { loadOrders(); }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setNotifications((prev) => [{
        id: Date.now(), type: "order",
        title: "Новый заказ поступил!",
        text: "Заказ #TAO-8822 на сумму ¥ 975",
        time: "только что", read: false,
      }, ...prev]);
      showToast("Новый заказ #TAO-8822 на ¥ 975");
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  const categories = ["Все", "Обувь", "Одежда", "Электроника", "Сумки", "Красота", "Аксессуары"];

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchCat = categoryFilter === "Все" || p.category === categoryFilter;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const allOrders = dbOrders.length > 0
    ? dbOrders.map((o) => ({
        id: o.order_num, buyer: o.buyer_name, items: o.quantity,
        total: o.total_rub ? `${o.total_rub.toLocaleString("ru")} ₽` : `¥ ${o.price_yuan ?? "—"}`,
        status: o.status,
        date: new Date(o.created_at).toLocaleDateString("ru", { day: "numeric", month: "short", year: "numeric" }),
        address: o.address,
      }))
    : MOCK_ORDERS;

  const filteredOrders = allOrders.filter((o) => orderStatusFilter === "Все" || o.status === orderStatusFilter);
  const newOrdersCount = allOrders.filter((o) => o.status === "new").length;

  const navItems: { id: Page; icon: string; label: string; badge?: number }[] = [
    { id: "home", icon: "LayoutDashboard", label: "Главная" },
    { id: "catalog", icon: "Package", label: "Каталог", badge: MOCK_PRODUCTS.length },
    { id: "orders", icon: "ShoppingCart", label: "Заказы", badge: newOrdersCount || undefined },
    { id: "storage", icon: "Warehouse", label: "Склад" },
    { id: "profile", icon: "UserCircle", label: "Профиль" },
    { id: "help", icon: "LifeBuoy", label: "Помощь" },
  ];

  const SURFACE = "#f8f9fc";
  const BORDER = "#e8ecf4";
  const PURPLE = "#7c5cbf";

  return (
    <div className="flex h-screen overflow-hidden bg-white">

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${sidebarOpen ? "w-60" : "w-16"}`}
        style={{ background: "#fff", borderRight: `1px solid ${BORDER}` }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b" style={{ borderColor: BORDER }}>
          <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center gradient-brand shadow-sm">
            <span className="text-white font-bold text-base" style={{ fontFamily: "'Oswald', sans-serif" }}>T</span>
          </div>
          {sidebarOpen && (
            <div className="fade-in">
              <div className="font-bold text-gray-900 text-lg leading-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>TaoSeller</div>
              <div className="text-xs font-medium" style={{ color: PURPLE }}>Маркетплейс</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                page === item.id ? "active" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
              style={page === item.id ? { color: PURPLE } : {}}
            >
              <div className="flex-shrink-0 relative">
                <Icon name={item.icon} size={18} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-bold pulse-dot gradient-brand">
                    {item.badge}
                  </span>
                )}
              </div>
              {sidebarOpen && <span className="fade-in">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User */}
        {sidebarOpen && (
          <div className="p-3 border-t fade-in" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-3 p-2 rounded-xl" style={{ background: SURFACE }}>
              <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">Ю</div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-800 truncate">Юрий Продавцов</div>
                <div className="text-xs text-green-500 font-medium">● Онлайн</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 h-16 flex-shrink-0 bg-white" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
              <Icon name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} size={18} />
            </button>
            <div className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'Oswald', sans-serif" }}>
              {navItems.find((n) => n.id === page)?.label}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:flex items-center">
              <Icon name="Search" size={15} className="absolute left-3 text-gray-400" />
              <input
                className="pl-9 pr-4 py-2 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 w-52 transition-all"
                style={{ background: SURFACE, border: `1px solid ${BORDER}`, focusRingColor: PURPLE }}
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); if (page !== "catalog") setPage("catalog"); }}
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <Icon name="Bell" size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-bold gradient-brand pulse-dot">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-11 w-80 rounded-2xl shadow-xl z-50 overflow-hidden notification-enter bg-white" style={{ border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: BORDER }}>
                    <span className="font-semibold text-gray-800 text-sm">Уведомления</span>
                    <button onClick={() => setNotifications((p) => p.map((n) => ({ ...n, read: true })))} className="text-xs font-medium" style={{ color: PURPLE }}>Прочитать все</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => {
                      const cfg = notifTypeConfig[n.type];
                      return (
                        <div key={n.id} className={`flex gap-3 px-4 py-3 border-b hover:bg-gray-50 transition-all cursor-pointer ${!n.read ? "bg-purple-50/30" : ""}`} style={{ borderColor: BORDER }}>
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                            <Icon name={cfg.icon} size={15} className={cfg.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-semibold ${!n.read ? "text-gray-800" : "text-gray-500"}`}>{n.title}</span>
                              <span className="text-xs text-gray-400">{n.time}</span>
                            </div>
                            <div className="text-xs text-gray-500 truncate">{n.text}</div>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full self-center flex-shrink-0" style={{ background: PURPLE }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => showToast("Настройки — скоро!")} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
              <Icon name="Settings" size={18} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ background: SURFACE }}>

          {/* ===== HOME ===== */}
          {page === "home" && (
            <div className="space-y-6 slide-in">

              {/* Hero */}
              <div className="rounded-3xl overflow-hidden relative" style={{ background: "radial-gradient(ellipse 80% 100% at 70% 50%, #ede9ff 0%, #f5f3ff 50%, #fff 100%)", minHeight: 260 }}>
                <div className="flex items-center justify-between px-10 py-10">
                  <div className="max-w-md">
                    <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PURPLE }}>Таобао · Tmall · 1688</div>
                    <h1 className="text-4xl font-bold leading-tight text-gray-900 mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
                      Управляй продажами<br />
                      <span className="gradient-brand-text">из одного места</span>
                    </h1>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">Заказы, склад, каталог и аналитика — всё для вашего бизнеса с китайскими площадками.</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowOrderForm(true)} className="btn-primary flex items-center gap-2">
                        <Icon name="Plus" size={15} />
                        Заказ с Таобао
                      </button>
                      <button onClick={() => setPage("catalog")} className="btn-outline">Каталог</button>
                    </div>
                  </div>

                  {/* Stats card float */}
                  <div className="hidden lg:flex flex-col gap-3 mr-4">
                    {[
                      { label: "175K", sub: "Обработано заказов", icon: "ShoppingBag", gradient: "gradient-brand" },
                      { label: "50+", sub: "Категорий товаров", icon: "Package", gradient: "gradient-cyan" },
                    ].map((s, i) => (
                      <div key={i} className="bg-white rounded-2xl px-5 py-3.5 flex items-center gap-4 shadow-md float-anim" style={{ animationDelay: `${i * 0.5}s` }}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.gradient}`}>
                          <Icon name={s.icon} size={18} className="text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg leading-none" style={{ fontFamily: "'Oswald', sans-serif" }}>{s.label}</div>
                          <div className="text-xs text-gray-500">{s.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* decorative circles */}
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full opacity-30" style={{ background: PURPLE }} />
                <div className="absolute top-14 right-16 w-6 h-6 rounded-full opacity-20" style={{ background: PURPLE }} />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Выручка сегодня", value: "¥ 12,480", delta: "+18%", icon: "TrendingUp", grad: "gradient-brand" },
                  { label: "Новых заказов", value: "24", delta: "+5 за час", icon: "ShoppingCart", grad: "gradient-pink" },
                  { label: "Активных товаров", value: "312", delta: "6 заканчиваются", icon: "Package", grad: "gradient-cyan" },
                  { label: "Сообщений", value: "7", delta: "Ждут ответа", icon: "MessageCircle", grad: "gradient-amber" },
                ].map((s, i) => (
                  <div key={i} className="card-light p-5 cursor-pointer" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${s.grad}`}>
                        <Icon name={s.icon} size={19} className="text-white" />
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold text-gray-500 bg-gray-100">{s.delta}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Oswald', sans-serif" }}>{s.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Browse categories — как на макете */}
              <div className="bg-white rounded-3xl p-6" style={{ border: `1px solid ${BORDER}` }}>
                <h3 className="font-bold text-gray-900 text-lg mb-5" style={{ fontFamily: "'Oswald', sans-serif" }}>Категории товаров</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[
                    { label: "Обувь", icon: "Footprints", grad: "gradient-pink" },
                    { label: "Электроника", icon: "Cpu", grad: "gradient-purple" },
                    { label: "Одежда", icon: "Shirt", grad: "gradient-cyan" },
                    { label: "Аксессуары", icon: "Watch", grad: "gradient-amber" },
                    { label: "Все категории", icon: "ArrowRight", grad: "gradient-brand", special: true },
                  ].map((c, i) => (
                    <button
                      key={i}
                      onClick={() => { setCategoryFilter(c.special ? "Все" : c.label); setPage("catalog"); }}
                      className={`flex flex-col items-start gap-3 p-5 rounded-2xl transition-all group hover:scale-105 ${c.special ? "items-center justify-center" : ""}`}
                      style={c.special
                        ? { background: "#f0ebff", border: `1.5px dashed ${PURPLE}` }
                        : undefined}
                    >
                      {!c.special && (
                        <>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.grad} shadow-md`}>
                            <Icon name={c.icon} size={22} className="text-white" />
                          </div>
                          <span className="font-bold text-sm text-white leading-tight hidden" />
                          <div className={`w-full rounded-2xl py-4 px-4 ${c.grad} shadow-sm`}>
                            <Icon name={c.icon} size={24} className="text-white mb-2" />
                            <div className="font-bold text-white text-sm leading-tight">{c.label}</div>
                          </div>
                        </>
                      )}
                      {c.special && (
                        <>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${c.grad}`}>
                            <Icon name={c.icon} size={20} className="text-white" />
                          </div>
                          <span className="font-semibold text-sm" style={{ color: PURPLE }}>Смотреть все</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent orders */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-3xl p-5" style={{ border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: "'Oswald', sans-serif" }}>Последние заказы</h3>
                    <button onClick={() => setPage("orders")} className="text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: PURPLE }}>Все заказы →</button>
                  </div>
                  <div className="space-y-2">
                    {MOCK_ORDERS.slice(0, 4).map((order) => {
                      const sc = statusConfig[order.status as keyof typeof statusConfig];
                      return (
                        <div key={order.id} className="flex items-center justify-between py-2.5 px-3 rounded-2xl hover:bg-gray-50 transition-all" style={{ border: `1px solid ${BORDER}` }}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl gradient-brand flex items-center justify-center flex-shrink-0 shadow-sm">
                              <Icon name="ShoppingBag" size={15} className="text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-800">#{order.id}</div>
                              <div className="text-xs text-gray-400">{order.buyer}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold" style={{ color: PURPLE }}>{order.total}</div>
                            <span className={`tag-badge border ${sc.color}`}>{sc.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5" style={{ border: `1px solid ${BORDER}` }}>
                  <h3 className="font-bold text-gray-900 text-base mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>Активность</h3>
                  <div className="space-y-3">
                    {MOCK_NOTIFICATIONS.slice(0, 5).map((n) => {
                      const cfg = notifTypeConfig[n.type];
                      return (
                        <div key={n.id} className="flex gap-3 items-start">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                            <Icon name={cfg.icon} size={13} className={cfg.color} />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-700 leading-tight">{n.title}</div>
                            <div className="text-xs text-gray-400">{n.time} назад</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== CATALOG ===== */}
          {page === "catalog" && (
            <div className="space-y-5 slide-in">
              <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-2xl" style={{ border: `1px solid ${BORDER}` }}>
                <div className="relative flex items-center flex-1 min-w-48">
                  <Icon name="Search" size={15} className="absolute left-3 text-gray-400" />
                  <input
                    className="pl-9 pr-4 py-2.5 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none w-full"
                    style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                    placeholder="Поиск по названию или SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${categoryFilter === cat ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200"}`}
                      style={categoryFilter === cat ? { background: PURPLE } : {}}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button onClick={() => showToast("Форма добавления — скоро!")} className="btn-primary ml-auto flex items-center gap-2">
                  <Icon name="Plus" size={15} />
                  Добавить товар
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filteredProducts.map((p) => {
                  const sc = productStatusConfig[p.status as keyof typeof productStatusConfig];
                  return (
                    <div key={p.id} className="card-light overflow-hidden cursor-pointer">
                      <div className="h-36 flex items-center justify-center text-5xl relative" style={{ background: SURFACE, borderRadius: "1.25rem 1.25rem 0 0" }}>
                        {p.img}
                        <span className={`absolute top-3 right-3 tag-badge rounded-full ${sc.color}`}>{sc.label}</span>
                      </div>
                      <div className="p-4">
                        <div className="font-bold text-gray-800 text-sm mb-1 truncate">{p.name}</div>
                        <div className="text-xs text-gray-400 mb-3">{p.sku}</div>
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xl" style={{ fontFamily: "'Oswald', sans-serif", color: PURPLE }}>{p.price}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Icon name="Box" size={12} />
                            {p.stock} шт
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => showToast(`Редактирование: ${p.name}`)} className="flex-1 py-2 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-800 transition-all" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                            Редактировать
                          </button>
                          <button onClick={() => showToast(`${p.name} добавлен`)} className="px-3 py-2 rounded-full text-xs font-semibold text-white gradient-brand hover:opacity-90 transition-opacity">
                            <Icon name="Plus" size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Icon name="SearchX" size={40} className="mb-3 opacity-40" />
                  <div className="text-sm">Товары не найдены</div>
                </div>
              )}
            </div>
          )}

          {/* ===== ORDERS ===== */}
          {page === "orders" && (
            <div className="space-y-5 slide-in">
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl flex-wrap" style={{ border: `1px solid ${BORDER}` }}>
                {["Все", "new", "processing", "shipped", "delivered", "cancelled"].map((s) => {
                  const isActive = orderStatusFilter === s;
                  const label = s === "Все" ? "Все" : statusConfig[s as keyof typeof statusConfig]?.label ?? s;
                  const count = s === "Все" ? MOCK_ORDERS.length : MOCK_ORDERS.filter((o) => o.status === s).length;
                  return (
                    <button key={s} onClick={() => setOrderStatusFilter(s)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${isActive ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-700 bg-gray-100"}`}
                      style={isActive ? { background: PURPLE } : {}}
                    >
                      {label}
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-white/25 text-white" : "bg-white text-gray-500"}`}>{count}</span>
                    </button>
                  );
                })}
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={loadOrders} disabled={ordersLoading} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-40" style={{ border: `1px solid ${BORDER}` }}>
                    <Icon name={ordersLoading ? "Loader" : "RefreshCw"} size={14} className={ordersLoading ? "animate-spin" : ""} />
                  </button>
                  <button onClick={() => showToast("Экспорт — скоро!")} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all" style={{ border: `1px solid ${BORDER}` }}>
                    <Icon name="Download" size={13} />Экспорт
                  </button>
                  <button onClick={() => setShowOrderForm(true)} className="btn-primary flex items-center gap-2">
                    <Icon name="Plus" size={13} />Заказ с Таобао
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
                      {["Заказ", "Покупатель", "Товары", "Сумма", "Адрес", "Дата", "Статус", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, i) => {
                      const sc = statusConfig[order.status as keyof typeof statusConfig];
                      return (
                        <tr key={order.id} className="hover:bg-gray-50 transition-all" style={{ borderBottom: i < filteredOrders.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                          <td className="px-4 py-3.5"><div className="font-bold text-gray-800 text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>#{order.id}</div></td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{order.buyer[0]}</div>
                              <span className="text-sm font-medium text-gray-700">{order.buyer}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-gray-400">{order.items} шт.</td>
                          <td className="px-4 py-3.5"><span className="font-bold text-sm" style={{ fontFamily: "'Oswald', sans-serif", color: PURPLE }}>{order.total}</span></td>
                          <td className="px-4 py-3.5 text-xs text-gray-400">{order.address}</td>
                          <td className="px-4 py-3.5 text-xs text-gray-400">{order.date}</td>
                          <td className="px-4 py-3.5"><span className={`tag-badge border rounded-full ${sc.color}`}>{sc.label}</span></td>
                          <td className="px-4 py-3.5">
                            <button onClick={() => showToast(`Заказ #${order.id}`)} className="p-1.5 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-all">
                              <Icon name="ExternalLink" size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {ordersLoading && (
                  <div className="flex items-center justify-center py-10 gap-2 text-gray-400 text-sm">
                    <Icon name="Loader" size={16} className="animate-spin" />Загружаю заказы...
                  </div>
                )}
                {!ordersLoading && filteredOrders.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                    <Icon name="ShoppingCart" size={36} className="mb-3 opacity-30" />
                    <div className="text-sm mb-3">Заказов пока нет</div>
                    <button onClick={() => setShowOrderForm(true)} className="btn-primary flex items-center gap-2">
                      <Icon name="Plus" size={13} />Создать первый заказ
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== STORAGE ===== */}
          {page === "storage" && (
            <div className="space-y-5 slide-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Всего товаров", value: "800", icon: "Package", grad: "gradient-purple" },
                  { label: "Занято мест", value: "78%", icon: "BarChart2", grad: "gradient-amber" },
                  { label: "Секций", value: "4", icon: "Layers", grad: "gradient-brand" },
                  { label: "Нужна доставка", value: "12", icon: "Truck", grad: "gradient-pink" },
                ].map((s, i) => (
                  <div key={i} className="card-light p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${s.grad}`}>
                        <Icon name={s.icon} size={18} className="text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-400">{s.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Oswald', sans-serif" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_STORAGE.map((section) => (
                  <div key={section.id} className="card-light p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-bold text-gray-800" style={{ fontFamily: "'Oswald', sans-serif" }}>{section.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">ID: {section.id}</div>
                      </div>
                      <button onClick={() => showToast(`Открыта ${section.name}`)} className="text-xs px-3 py-1.5 rounded-full font-semibold text-gray-500 hover:text-gray-700 transition-all" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>Открыть</button>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">{section.items} / {section.capacity}</span>
                      <span className="font-bold" style={{ fontFamily: "'Oswald', sans-serif", color: section.used > 80 ? "#ef4444" : section.used > 60 ? "#f97316" : "#22c55e" }}>{section.used}%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden bg-gray-100">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${section.used}%`, background: section.used > 80 ? "linear-gradient(90deg,#ef4444,#f97316)" : section.used > 60 ? "linear-gradient(90deg,#f97316,#fbbf24)" : "linear-gradient(90deg,#22c55e,#4ade80)" }}
                      />
                    </div>
                    <div className="mt-3 flex gap-2">
                      {["Товары", "Движение", "Отчёт"].map((btn) => (
                        <button key={btn} onClick={() => showToast(`${btn}: ${section.name}`)} className="text-xs px-3 py-1.5 rounded-full font-medium text-gray-500 hover:text-gray-700 transition-all" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>{btn}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== PROFILE ===== */}
          {page === "profile" && (
            <div className="space-y-5 slide-in max-w-2xl">
              <div className="bg-white rounded-3xl p-6" style={{ border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 rounded-3xl gradient-brand flex items-center justify-center text-white font-bold text-3xl flex-shrink-0 shadow-lg" style={{ fontFamily: "'Oswald', sans-serif" }}>Ю</div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-xl" style={{ fontFamily: "'Oswald', sans-serif" }}>Юрий Продавцов</h2>
                    <div className="text-sm text-gray-400 mt-0.5">yuri@taoseller.ru</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="tag-badge rounded-full bg-purple-50 text-purple-600">Pro продавец</span>
                      <span className="tag-badge rounded-full bg-green-50 text-green-600">★ 4.9 рейтинг</span>
                    </div>
                  </div>
                  <button onClick={() => showToast("Редактирование — скоро!")} className="ml-auto btn-outline flex items-center gap-2">
                    <Icon name="Pencil" size={13} />Изменить
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: BORDER }}>
                  {[{ label: "Заказов выполнено", value: "1,248" }, { label: "На платформе", value: "2 года" }, { label: "Товаров активно", value: "312" }].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Oswald', sans-serif" }}>{s.value}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <div className="px-5 py-3 border-b" style={{ borderColor: BORDER, background: SURFACE }}>
                  <h3 className="font-bold text-gray-800" style={{ fontFamily: "'Oswald', sans-serif" }}>Настройки</h3>
                </div>
                {[
                  { label: "Язык интерфейса", value: "Русский", icon: "Globe" },
                  { label: "Часовой пояс", value: "UTC+3 (Москва)", icon: "Clock" },
                  { label: "Уведомления", value: "Включены", icon: "Bell" },
                  { label: "Двухфакторная аутентификация", value: "Выключена", icon: "Shield" },
                  { label: "Подписка", value: "Pro — до 1 янв 2027", icon: "CreditCard" },
                  { label: "API-ключ Таобао", value: "••••••••••••••", icon: "Key" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-all cursor-pointer" style={{ borderBottom: i < 5 ? `1px solid ${BORDER}` : "none" }} onClick={() => showToast(`${item.label} — скоро!`)}>
                    <div className="flex items-center gap-3">
                      <Icon name={item.icon} size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{item.value}</span>
                      <Icon name="ChevronRight" size={14} className="text-gray-300" />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => showToast("Выход — скоро!")} className="w-full py-3 rounded-2xl text-sm font-semibold transition-all hover:opacity-80 text-red-500 bg-red-50" style={{ border: "1.5px solid #fecaca" }}>Выйти из аккаунта</button>
            </div>
          )}

          {/* ===== HELP ===== */}
          {page === "help" && (
            <div className="space-y-5 slide-in max-w-2xl">
              <div className="rounded-3xl p-8 text-center" style={{ background: "linear-gradient(135deg, #f0ebff 0%, #fdf4ff 100%)", border: `1.5px solid #e0d7ff` }}>
                <div className="w-16 h-16 mx-auto rounded-3xl gradient-brand flex items-center justify-center mb-4 shadow-lg float-anim">
                  <Icon name="LifeBuoy" size={26} className="text-white" />
                </div>
                <h2 className="font-bold text-gray-900 text-2xl mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>Как мы можем помочь?</h2>
                <p className="text-gray-500 text-sm mb-5">Найдите ответ в базе знаний или обратитесь в поддержку</p>
                <div className="relative max-w-md mx-auto">
                  <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className="w-full pl-11 pr-4 py-3 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-white shadow-sm" style={{ border: `1px solid ${BORDER}` }} placeholder="Поиск по базе знаний..." onFocus={() => showToast("База знаний — скоро!")} />
                </div>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <div className="px-5 py-3 border-b" style={{ borderColor: BORDER, background: SURFACE }}>
                  <h3 className="font-bold text-gray-800" style={{ fontFamily: "'Oswald', sans-serif" }}>Частые вопросы</h3>
                </div>
                {["Как добавить новый товар в каталог?", "Как подключить аккаунт Таобао?", "Как настроить автоматические уведомления?", "Как экспортировать отчёт по заказам?", "Как изменить настройки склада?"].map((q, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-all cursor-pointer" style={{ borderBottom: i < 4 ? `1px solid ${BORDER}` : "none" }} onClick={() => showToast("Ответ — скоро!")}>
                    <div className="flex items-center gap-3">
                      <Icon name="HelpCircle" size={15} className="text-gray-300 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{q}</span>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-gray-300 flex-shrink-0" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: "MessageCircle", title: "Онлайн-чат", desc: "Ответим за 5 минут", action: "Написать", grad: "gradient-purple" },
                  { icon: "Mail", title: "Email", desc: "support@taoseller.ru", action: "Написать", grad: "gradient-cyan" },
                  { icon: "Phone", title: "Телефон", desc: "+7 800 000-00-00", action: "Позвонить", grad: "gradient-amber" },
                ].map((c, i) => (
                  <div key={i} className="card-light p-5 text-center cursor-pointer" onClick={() => showToast(`${c.title} — скоро!`)}>
                    <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 ${c.grad} shadow-sm`}>
                      <Icon name={c.icon} size={20} className="text-white" />
                    </div>
                    <div className="font-bold text-gray-800 text-sm mb-1">{c.title}</div>
                    <div className="text-xs text-gray-400 mb-3">{c.desc}</div>
                    <button className="w-full py-2 rounded-full text-xs font-semibold text-white gradient-brand hover:opacity-90 transition-opacity">{c.action}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 notification-enter flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl bg-white" style={{ border: `1.5px solid ${BORDER}` }}>
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0 shadow-sm">
            <Icon name="Zap" size={14} className="text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">{toastMessage}</span>
        </div>
      )}

      {showNotifications && <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />}

      {showOrderForm && (
        <OrderForm
          onClose={() => setShowOrderForm(false)}
          onSubmit={async (data: OrderFormData) => {
            try {
              await fetch(ORDERS_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  buyer_name: data.name, buyer_phone: data.phone, address: data.address,
                  link: data.link, quantity: data.quantity, variant: data.variant,
                  comment: data.comment, photo: data.photo,
                  price_yuan: data.priceYuan, price_rub: data.priceRub, total_rub: data.totalRub,
                }),
              });
              await loadOrders();
              showToast(`Заказ от ${data.name} сохранён!`);
            } catch {
              showToast("Ошибка при сохранении заказа");
            }
            setShowOrderForm(false);
          }}
        />
      )}
    </div>
  );
}
