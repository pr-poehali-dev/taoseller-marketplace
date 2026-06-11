import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import OrderForm, { type OrderFormData } from "@/components/OrderForm";

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
  { id: 5, type: "message", title: "Отзыв покупателя", text: "Чжан Вэй: ★★★★★ Отличный товар!", time: "3 ч", read: true },
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const newNotif: Notification = {
        id: Date.now(),
        type: "order",
        title: "Новый заказ поступил!",
        text: "Заказ #TAO-8822 на сумму ¥ 975",
        time: "только что",
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      showToast("🛒 Новый заказ #TAO-8822 на ¥ 975");
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const categories = ["Все", "Обувь", "Одежда", "Электроника", "Сумки", "Красота", "Аксессуары"];

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchCat = categoryFilter === "Все" || p.category === categoryFilter;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredOrders = MOCK_ORDERS.filter((o) => {
    return orderStatusFilter === "Все" || o.status === orderStatusFilter;
  });

  const navItems: { id: Page; icon: string; label: string; badge?: number }[] = [
    { id: "home", icon: "LayoutDashboard", label: "Главная" },
    { id: "catalog", icon: "Package", label: "Каталог", badge: MOCK_PRODUCTS.length },
    { id: "orders", icon: "ShoppingCart", label: "Заказы", badge: MOCK_ORDERS.filter((o) => o.status === "new").length },
    { id: "storage", icon: "Warehouse", label: "Склад" },
    { id: "profile", icon: "UserCircle", label: "Профиль" },
    { id: "help", icon: "LifeBuoy", label: "Помощь" },
  ];

  const statusConfig = {
    new: { label: "Новый", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    processing: { label: "В обработке", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
    shipped: { label: "Отправлен", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    delivered: { label: "Доставлен", color: "text-green-400 bg-green-500/10 border-green-500/20" },
    cancelled: { label: "Отменён", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  };

  const productStatusConfig = {
    active: { label: "В наличии", color: "text-green-400 bg-green-500/10" },
    low: { label: "Мало", color: "text-orange-400 bg-orange-500/10" },
    out: { label: "Нет", color: "text-red-400 bg-red-500/10" },
  };

  const notifTypeConfig = {
    order: { icon: "ShoppingCart", color: "text-orange-400", bg: "bg-orange-500/10" },
    message: { icon: "MessageCircle", color: "text-blue-400", bg: "bg-blue-500/10" },
    change: { icon: "RefreshCw", color: "text-green-400", bg: "bg-green-500/10" },
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--tao-dark)", fontFamily: "'Golos Text', sans-serif" }}>

      {/* Sidebar */}
      <aside
        className={`flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${sidebarOpen ? "w-60" : "w-16"}`}
        style={{ background: "var(--tao-surface)", borderRight: "1px solid var(--tao-border)" }}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b" style={{ borderColor: "var(--tao-border)" }}>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center gradient-brand">
            <span className="text-white font-bold text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>T</span>
          </div>
          {sidebarOpen && (
            <div className="fade-in">
              <div className="font-bold text-white text-lg leading-none" style={{ fontFamily: "'Oswald', sans-serif" }}>TaoSeller</div>
              <div className="text-xs" style={{ color: "var(--tao-red)" }}>Таобао платформа</div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                page === item.id ? "active" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              style={page === item.id ? { color: "var(--tao-red)" } : {}}
            >
              <div className="flex-shrink-0 relative">
                <Icon name={item.icon} size={18} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-bold pulse-dot gradient-brand"
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="p-3 border-t" style={{ borderColor: "var(--tao-border)" }}>
            <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                Ю
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">Юрий Продавцов</div>
                <div className="text-xs" style={{ color: "var(--tao-green)" }}>● Онлайн</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 h-16 flex-shrink-0"
          style={{ background: "var(--tao-surface)", borderBottom: "1px solid var(--tao-border)" }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Icon name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} size={18} />
            </button>
            <div className="text-white font-semibold text-lg" style={{ fontFamily: "'Oswald', sans-serif" }}>
              {navItems.find((n) => n.id === page)?.label}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:flex items-center">
              <Icon name="Search" size={15} className="absolute left-3 text-gray-500" />
              <input
                className="pl-9 pr-4 py-2 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none w-52 transition-all"
                style={{ background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (page !== "catalog") setPage("catalog");
                }}
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Icon name="Bell" size={18} />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-bold gradient-brand pulse-dot"
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute right-0 top-11 w-80 rounded-xl shadow-2xl z-50 overflow-hidden notification-enter"
                  style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--tao-border)" }}>
                    <span className="font-semibold text-white text-sm">Уведомления</span>
                    <button onClick={markAllRead} className="text-xs" style={{ color: "var(--tao-red)" }}>
                      Прочитать все
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => {
                      const cfg = notifTypeConfig[n.type];
                      return (
                        <div
                          key={n.id}
                          className={`flex gap-3 px-4 py-3 border-b cursor-pointer transition-all hover:bg-white/3 ${!n.read ? "bg-white/2" : ""}`}
                          style={{ borderColor: "var(--tao-border)" }}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                            <Icon name={cfg.icon} size={15} className={cfg.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-semibold ${!n.read ? "text-white" : "text-gray-400"}`}>{n.title}</span>
                              <span className="text-xs text-gray-600">{n.time}</span>
                            </div>
                            <div className="text-xs text-gray-500 truncate">{n.text}</div>
                          </div>
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full self-center flex-shrink-0" style={{ background: "var(--tao-red)" }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => showToast("Настройки — скоро!")}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Icon name="Settings" size={18} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* HOME */}
          {page === "home" && (
            <div className="space-y-6 slide-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Выручка сегодня", value: "¥ 12,480", delta: "+18%", icon: "TrendingUp", color: "#30D158", bg: "rgba(48,209,88,0.1)" },
                  { label: "Новых заказов", value: "24", delta: "+5 за час", icon: "ShoppingCart", color: "#FF9500", bg: "rgba(255,149,0,0.1)" },
                  { label: "Активных товаров", value: "312", delta: "6 заканчиваются", icon: "Package", color: "#0A84FF", bg: "rgba(10,132,255,0.1)" },
                  { label: "Сообщений", value: "7", delta: "Требуют ответа", icon: "MessageCircle", color: "#BF5AF2", bg: "rgba(191,90,242,0.1)" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="card-hover rounded-xl p-5 cursor-pointer"
                    style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)", animationDelay: `${i * 0.07}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                        <Icon name={s.icon} size={18} style={{ color: s.color }} />
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: s.color, background: "rgba(255,255,255,0.05)" }}>
                        {s.delta}
                      </span>
                    </div>
                    <div className="text-2xl text-white font-semibold" style={{ fontFamily: "'Oswald', sans-serif" }}>{s.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 rounded-xl p-5" style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white text-base" style={{ fontFamily: "'Oswald', sans-serif" }}>Последние заказы</h3>
                    <button onClick={() => setPage("orders")} className="text-xs font-medium hover:opacity-80" style={{ color: "var(--tao-red)" }}>
                      Все заказы →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {MOCK_ORDERS.slice(0, 4).map((order) => {
                      const sc = statusConfig[order.status as keyof typeof statusConfig];
                      return (
                        <div
                          key={order.id}
                          className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/3 transition-all"
                          style={{ border: "1px solid var(--tao-border)" }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
                              <Icon name="ShoppingBag" size={14} className="text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-white">#{order.id}</div>
                              <div className="text-xs text-gray-500">{order.buyer}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold" style={{ color: "var(--tao-orange)" }}>{order.total}</div>
                            <span className={`tag-badge border ${sc.color}`}>{sc.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl p-5" style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}>
                  <h3 className="font-semibold text-white text-base mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>Активность</h3>
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((n) => {
                      const cfg = notifTypeConfig[n.type];
                      return (
                        <div key={n.id} className="flex gap-3 items-start">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                            <Icon name={cfg.icon} size={13} className={cfg.color} />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-white leading-tight">{n.title}</div>
                            <div className="text-xs text-gray-600">{n.time} назад</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-5" style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}>
                <h3 className="font-semibold text-white text-base mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>Быстрые действия</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Добавить товар", icon: "PlusCircle", color: "#FF4D1A", page: "catalog" as Page },
                    { label: "Заказ с Таобао", icon: "ShoppingCart", color: "#FF9500", page: "orders" as Page },
                    { label: "Управление складом", icon: "Warehouse", color: "#0A84FF", page: "storage" as Page },
                    { label: "Написать в поддержку", icon: "HeadphonesIcon", color: "#30D158", page: "help" as Page },
                  ].map((a, i) => (
                    <button
                      key={i}
                      onClick={() => i === 1 ? setShowOrderForm(true) : setPage(a.page)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-all group"
                      style={{ border: "1px solid var(--tao-border)" }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ background: `${a.color}18` }}
                      >
                        <Icon name={a.icon} size={18} style={{ color: a.color }} />
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-white transition-colors text-center">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CATALOG */}
          {page === "catalog" && (
            <div className="space-y-5 slide-in">
              <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl" style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}>
                <div className="relative flex items-center flex-1 min-w-48">
                  <Icon name="Search" size={15} className="absolute left-3 text-gray-500" />
                  <input
                    className="pl-9 pr-4 py-2 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none w-full transition-all"
                    style={{ background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${categoryFilter === cat ? "text-white" : "text-gray-400 hover:text-white"}`}
                      style={categoryFilter === cat ? { background: "linear-gradient(135deg, #FF4D1A, #FF9500)" } : { background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => showToast("Форма добавления товара — скоро!")}
                  className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium gradient-brand hover:opacity-90 transition-opacity"
                >
                  <Icon name="Plus" size={15} />
                  Добавить товар
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filteredProducts.map((p, i) => {
                  const sc = productStatusConfig[p.status as keyof typeof productStatusConfig];
                  return (
                    <div
                      key={p.id}
                      className="card-hover rounded-xl overflow-hidden cursor-pointer"
                      style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}
                    >
                      <div className="h-36 flex items-center justify-center text-5xl relative" style={{ background: "rgba(255,255,255,0.02)" }}>
                        {p.img}
                        <span className={`absolute top-3 right-3 tag-badge rounded-full ${sc.color}`}>{sc.label}</span>
                      </div>
                      <div className="p-4">
                        <div className="font-semibold text-white text-sm mb-1 truncate">{p.name}</div>
                        <div className="text-xs text-gray-500 mb-3">{p.sku}</div>
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-lg" style={{ fontFamily: "'Oswald', sans-serif", color: "var(--tao-orange)" }}>{p.price}</div>
                          <div className="text-xs text-gray-400">
                            <Icon name="Box" size={12} className="inline mr-1" />
                            {p.stock} шт
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => showToast(`Редактирование: ${p.name}`)}
                            className="flex-1 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-all"
                            style={{ background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => showToast(`${p.name} добавлен в заказ`)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white gradient-brand hover:opacity-90 transition-opacity"
                          >
                            <Icon name="Plus" size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <Icon name="SearchX" size={40} className="mb-3 opacity-40" />
                  <div className="text-sm">Товары не найдены</div>
                </div>
              )}
            </div>
          )}

          {/* ORDERS */}
          {page === "orders" && (
            <div className="space-y-5 slide-in">
              <div className="flex items-center gap-2 p-3 rounded-xl flex-wrap" style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}>
                {["Все", "new", "processing", "shipped", "delivered", "cancelled"].map((s) => {
                  const isActive = orderStatusFilter === s;
                  const label = s === "Все" ? "Все" : statusConfig[s as keyof typeof statusConfig]?.label ?? s;
                  const count = s === "Все" ? MOCK_ORDERS.length : MOCK_ORDERS.filter((o) => o.status === s).length;
                  return (
                    <button
                      key={s}
                      onClick={() => setOrderStatusFilter(s)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`}
                      style={isActive ? { background: "linear-gradient(135deg, #FF4D1A, #FF9500)" } : { background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                    >
                      {label}
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-gray-500"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => showToast("Экспорт заказов — скоро!")}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-all"
                    style={{ background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                  >
                    <Icon name="Download" size={13} />
                    Экспорт
                  </button>
                  <button
                    onClick={() => setShowOrderForm(true)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium text-white gradient-brand hover:opacity-90 transition-opacity"
                  >
                    <Icon name="Plus" size={13} />
                    Заказ с Таобао
                  </button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--tao-border)" }}>
                      {["Заказ", "Покупатель", "Товары", "Сумма", "Адрес", "Дата", "Статус", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, i) => {
                      const sc = statusConfig[order.status as keyof typeof statusConfig];
                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-white/2 transition-all"
                          style={{ borderBottom: i < filteredOrders.length - 1 ? "1px solid var(--tao-border)" : "none" }}
                        >
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-white text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>#{order.id}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                {order.buyer[0]}
                              </div>
                              <span className="text-sm text-white">{order.buyer}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-gray-400">{order.items} шт.</td>
                          <td className="px-4 py-3.5">
                            <span className="font-semibold text-sm" style={{ fontFamily: "'Oswald', sans-serif", color: "var(--tao-orange)" }}>{order.total}</span>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-gray-500">{order.address}</td>
                          <td className="px-4 py-3.5 text-xs text-gray-500">{order.date}</td>
                          <td className="px-4 py-3.5">
                            <span className={`tag-badge border rounded-full ${sc.color}`}>{sc.label}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => showToast(`Открыт заказ #${order.id}`)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <Icon name="ExternalLink" size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STORAGE */}
          {page === "storage" && (
            <div className="space-y-5 slide-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Всего товаров", value: "800", icon: "Package", color: "#0A84FF" },
                  { label: "Занято мест", value: "78%", icon: "BarChart2", color: "#FF9500" },
                  { label: "Секций", value: "4", icon: "Layers", color: "#BF5AF2" },
                  { label: "Нужна доставка", value: "12", icon: "Truck", color: "#FF4D1A" },
                ].map((s, i) => (
                  <div key={i} className="card-hover rounded-xl p-5" style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                        <Icon name={s.icon} size={17} style={{ color: s.color }} />
                      </div>
                      <span className="text-xs text-gray-500">{s.label}</span>
                    </div>
                    <div className="text-2xl text-white font-semibold" style={{ fontFamily: "'Oswald', sans-serif" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_STORAGE.map((section) => (
                  <div key={section.id} className="card-hover rounded-xl p-5" style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-semibold text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>{section.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">ID: {section.id}</div>
                      </div>
                      <button
                        onClick={() => showToast(`Открыта ${section.name}`)}
                        className="text-xs px-3 py-1 rounded-lg text-gray-400 hover:text-white transition-all"
                        style={{ background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                      >
                        Открыть
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">{section.items} / {section.capacity} мест</span>
                      <span
                        className="font-semibold"
                        style={{
                          fontFamily: "'Oswald', sans-serif",
                          color: section.used > 80 ? "var(--tao-red)" : section.used > 60 ? "var(--tao-orange)" : "var(--tao-green)"
                        }}
                      >
                        {section.used}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--tao-dark)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${section.used}%`,
                          background: section.used > 80
                            ? "linear-gradient(90deg, #FF4D1A, #FF9500)"
                            : section.used > 60
                            ? "linear-gradient(90deg, #FF9500, #FFD60A)"
                            : "linear-gradient(90deg, #30D158, #00E676)",
                        }}
                      />
                    </div>
                    <div className="mt-3 flex gap-2">
                      {["Товары", "Движение", "Отчёт"].map((btn) => (
                        <button
                          key={btn}
                          onClick={() => showToast(`${btn}: ${section.name}`)}
                          className="text-xs px-2.5 py-1 rounded-lg text-gray-500 hover:text-white transition-all"
                          style={{ background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-5" style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}>
                <h3 className="font-semibold text-white mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>Движение товаров</h3>
                <div className="space-y-2">
                  {[
                    { action: "Поступление", item: "Кроссовки Nike Air Max 270", qty: "+50 шт", time: "Сегодня 10:30", type: "in" },
                    { action: "Отгрузка", item: "Рюкзак городской Xiaomi", qty: "-12 шт", time: "Сегодня 09:15", type: "out" },
                    { action: "Поступление", item: "Умные часы DT3 Pro", qty: "+20 шт", time: "Вчера 16:45", type: "in" },
                    { action: "Отгрузка", item: "Куртка зимняя мужская", qty: "-5 шт", time: "Вчера 14:20", type: "out" },
                    { action: "Инвентаризация", item: "Секция C — Электроника", qty: "89 шт", time: "Вчера 11:00", type: "check" },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg" style={{ border: "1px solid var(--tao-border)" }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: m.type === "in" ? "rgba(48,209,88,0.1)" : m.type === "out" ? "rgba(255,77,26,0.1)" : "rgba(10,132,255,0.1)" }}
                        >
                          <Icon
                            name={m.type === "in" ? "ArrowDownCircle" : m.type === "out" ? "ArrowUpCircle" : "ClipboardList"}
                            size={14}
                            style={{ color: m.type === "in" ? "#30D158" : m.type === "out" ? "#FF4D1A" : "#0A84FF" }}
                          />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-white">{m.action}: </span>
                          <span className="text-sm text-gray-400">{m.item}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold" style={{ fontFamily: "'Oswald', sans-serif", color: m.type === "in" ? "#30D158" : m.type === "out" ? "#FF4D1A" : "#0A84FF" }}>
                          {m.qty}
                        </div>
                        <div className="text-xs text-gray-600">{m.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {page === "profile" && (
            <div className="space-y-5 slide-in max-w-3xl">
              <div className="rounded-xl p-6" style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}>
                <div className="flex items-center gap-5 mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white font-bold text-3xl flex-shrink-0 glow-red"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    Ю
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-xl" style={{ fontFamily: "'Oswald', sans-serif" }}>Юрий Продавцов</h2>
                    <div className="text-sm text-gray-400 mt-0.5">yuri@taoseller.ru</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="tag-badge" style={{ color: "#FF9500", background: "rgba(255,149,0,0.12)" }}>Pro продавец</span>
                      <span className="tag-badge" style={{ color: "#30D158", background: "rgba(48,209,88,0.12)" }}>★ 4.9 рейтинг</span>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast("Редактирование профиля — скоро!")}
                    className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all"
                    style={{ background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                  >
                    <Icon name="Pencil" size={14} />
                    Изменить
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: "1px solid var(--tao-border)" }}>
                  {[
                    { label: "Заказов выполнено", value: "1,248" },
                    { label: "На платформе", value: "2 года" },
                    { label: "Товаров активно", value: "312" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-2xl text-white font-semibold" style={{ fontFamily: "'Oswald', sans-serif" }}>{s.value}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}>
                <div className="px-5 py-3 border-b" style={{ borderColor: "var(--tao-border)" }}>
                  <h3 className="font-semibold text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>Настройки</h3>
                </div>
                {[
                  { label: "Язык интерфейса", value: "Русский", icon: "Globe" },
                  { label: "Часовой пояс", value: "UTC+3 (Москва)", icon: "Clock" },
                  { label: "Уведомления", value: "Включены", icon: "Bell" },
                  { label: "Двухфакторная аутентификация", value: "Выключена", icon: "Shield" },
                  { label: "Подписка", value: "Pro — активна до 1 янв 2027", icon: "CreditCard" },
                  { label: "API-ключ Таобао", value: "••••••••••••••••••••", icon: "Key" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-white/2 transition-all cursor-pointer"
                    style={{ borderBottom: i < 5 ? "1px solid var(--tao-border)" : "none" }}
                    onClick={() => showToast(`${item.label} — скоро!`)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={item.icon} size={16} className="text-gray-500" />
                      <span className="text-sm text-white">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{item.value}</span>
                      <Icon name="ChevronRight" size={14} className="text-gray-600" />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => showToast("Выход — скоро!")}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{ background: "rgba(255,77,26,0.1)", border: "1px solid rgba(255,77,26,0.2)", color: "var(--tao-red)" }}
              >
                Выйти из аккаунта
              </button>
            </div>
          )}

          {/* HELP */}
          {page === "help" && (
            <div className="space-y-5 slide-in max-w-3xl">
              <div
                className="rounded-xl p-8 text-center"
                style={{ background: "linear-gradient(135deg, rgba(255,77,26,0.12) 0%, rgba(255,149,0,0.08) 100%)", border: "1px solid rgba(255,77,26,0.2)" }}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl gradient-brand flex items-center justify-center mb-4 glow-red" style={{ animation: "float 3s ease-in-out infinite" }}>
                  <Icon name="LifeBuoy" size={24} className="text-white" />
                </div>
                <h2 className="font-bold text-white text-2xl mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>Как мы можем помочь?</h2>
                <p className="text-gray-400 text-sm mb-5">Найдите ответ в базе знаний или обратитесь в поддержку</p>
                <div className="relative max-w-md mx-auto">
                  <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                    style={{ background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                    placeholder="Поиск по базе знаний..."
                    onFocus={() => showToast("База знаний — скоро!")}
                  />
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}>
                <div className="px-5 py-3 border-b" style={{ borderColor: "var(--tao-border)" }}>
                  <h3 className="font-semibold text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>Частые вопросы</h3>
                </div>
                {[
                  "Как добавить новый товар в каталог?",
                  "Как подключить аккаунт Таобао?",
                  "Как настроить автоматические уведомления?",
                  "Как экспортировать отчёт по заказам?",
                  "Как изменить настройки склада?",
                ].map((q, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-white/2 transition-all cursor-pointer"
                    style={{ borderBottom: i < 4 ? "1px solid var(--tao-border)" : "none" }}
                    onClick={() => showToast("Ответ на вопрос — скоро!")}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name="HelpCircle" size={15} className="text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-white">{q}</span>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-gray-600 flex-shrink-0" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: "MessageCircle", title: "Онлайн-чат", desc: "Ответим в течение 5 минут", action: "Написать", color: "#0A84FF" },
                  { icon: "Mail", title: "Email поддержка", desc: "support@taoseller.ru", action: "Написать", color: "#30D158" },
                  { icon: "Phone", title: "Телефон", desc: "+7 800 000-00-00", action: "Позвонить", color: "#FF9500" },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="card-hover rounded-xl p-5 text-center cursor-pointer"
                    style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}
                    onClick={() => showToast(`${c.title} — скоро!`)}
                  >
                    <div className="w-11 h-11 rounded-xl mx-auto flex items-center justify-center mb-3" style={{ background: `${c.color}18` }}>
                      <Icon name={c.icon} size={20} style={{ color: c.color }} />
                    </div>
                    <div className="font-semibold text-white text-sm mb-1">{c.title}</div>
                    <div className="text-xs text-gray-500 mb-3">{c.desc}</div>
                    <button className="w-full py-2 rounded-lg text-xs font-medium text-white gradient-brand hover:opacity-90 transition-opacity">
                      {c.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div
          className="fixed bottom-6 right-6 z-50 notification-enter flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl"
          style={{ background: "var(--tao-surface)", border: "1px solid rgba(255,77,26,0.3)" }}
        >
          <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <Icon name="Zap" size={13} className="text-white" />
          </div>
          <span className="text-sm text-white">{toastMessage}</span>
        </div>
      )}

      {/* Overlay for notifications */}
      {showNotifications && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          onClose={() => setShowOrderForm(false)}
          onSubmit={(data: OrderFormData) => {
            const newOrder = {
              id: `TAO-${8823 + Math.floor(Math.random() * 100)}`,
              buyer: data.name,
              items: data.quantity,
              total: `¥ ${data.quantity * 120}`,
              status: "new" as const,
              date: new Date().toLocaleDateString("ru", { day: "numeric", month: "short", year: "numeric" }),
              address: data.address,
            };
            MOCK_ORDERS.unshift(newOrder);
            setShowOrderForm(false);
            showToast(`Заказ от ${data.name} оформлен!`);
          }}
        />
      )}
    </div>
  );
}