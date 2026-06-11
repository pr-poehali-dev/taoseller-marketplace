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

type Section = "home" | "catalog" | "orders" | "storage" | "profile" | "help";

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

const STATUS_CFG = {
  new: { label: "Новый", cls: "text-blue-600 bg-blue-50 border-blue-200" },
  processing: { label: "В обработке", cls: "text-orange-600 bg-orange-50 border-orange-200" },
  shipped: { label: "Отправлен", cls: "text-purple-600 bg-purple-50 border-purple-200" },
  delivered: { label: "Доставлен", cls: "text-green-600 bg-green-50 border-green-200" },
  cancelled: { label: "Отменён", cls: "text-red-500 bg-red-50 border-red-200" },
};

const PROD_STATUS = {
  active: { label: "В наличии", cls: "text-green-600 bg-green-50" },
  low: { label: "Мало", cls: "text-orange-600 bg-orange-50" },
  out: { label: "Нет", cls: "text-red-500 bg-red-50" },
};

const P = "#7c5cbf";
const SURF = "#f8f9fc";
const BDR = "#e8ecf4";

export default function Index() {
  const [section, setSection] = useState<Section>("home");
  const [catFilter, setCatFilter] = useState("Все");
  const [orderFilter, setOrderFilter] = useState("Все");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [dbOrders, setDbOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount] = useState(3);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(ORDERS_API);
      const data = await res.json();
      setDbOrders(data.orders || []);
    } catch { /* молча */ }
    finally { setLoading(false); }
  };

  useEffect(() => { loadOrders(); }, []);

  const categories = ["Все", "Обувь", "Одежда", "Электроника", "Сумки", "Красота", "Аксессуары"];

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchCat = catFilter === "Все" || p.category === catFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
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

  const filteredOrders = allOrders.filter((o) => orderFilter === "Все" || o.status === orderFilter);

  const navLinks: { id: Section; label: string }[] = [
    { id: "home", label: "Главная" },
    { id: "catalog", label: "Каталог" },
    { id: "orders", label: "Заказы" },
    { id: "storage", label: "Склад" },
    { id: "help", label: "Помощь" },
  ];

  const handleNav = (s: Section) => { setSection(s); setMobileMenu(false); };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <header className="sticky top-0 z-40 bg-white" style={{ borderBottom: `1px solid ${BDR}` }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => handleNav("home")} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-brand shadow-sm">
              <span className="text-white font-bold text-base" style={{ fontFamily: "'Oswald', sans-serif" }}>T</span>
            </div>
            <span className="font-bold text-gray-900 text-xl" style={{ fontFamily: "'Oswald', sans-serif" }}>
              TaoSeller<span style={{ color: P }}>.</span>
            </span>
          </button>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((n) => (
              <button
                key={n.id}
                onClick={() => handleNav(n.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  section === n.id
                    ? "text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
                style={section === n.id ? { background: P } : {}}
              >
                {n.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <Icon name="Bell" size={18} />
                {notifCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-bold pulse-dot"
                    style={{ background: P }}
                  >
                    {notifCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div
                    className="absolute right-0 top-11 w-72 rounded-2xl shadow-xl z-50 overflow-hidden notification-enter bg-white"
                    style={{ border: `1px solid ${BDR}` }}
                  >
                    <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: BDR }}>
                      <span className="font-semibold text-gray-800 text-sm">Уведомления</span>
                      <button onClick={() => setNotifOpen(false)} className="text-xs font-medium" style={{ color: P }}>Закрыть</button>
                    </div>
                    {[
                      { icon: "ShoppingCart", title: "Новый заказ #TAO-8821", time: "2 мин", cls: "bg-orange-50 text-orange-500" },
                      { icon: "MessageCircle", title: "Сообщение от покупателя", time: "15 мин", cls: "bg-blue-50 text-blue-500" },
                      { icon: "RefreshCw", title: "Заказ #TAO-8815 доставлен", time: "1 ч", cls: "bg-green-50 text-green-500" },
                    ].map((n, i) => (
                      <div key={i} className="flex gap-3 px-4 py-3 border-b hover:bg-gray-50 transition-all cursor-pointer" style={{ borderColor: BDR }}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${n.cls}`}>
                          <Icon name={n.icon} size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-700 truncate">{n.title}</div>
                          <div className="text-xs text-gray-400">{n.time} назад</div>
                        </div>
                        <div className="w-2 h-2 rounded-full self-center flex-shrink-0" style={{ background: P }} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <button
              onClick={() => handleNav("profile")}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                section === "profile" ? "text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
              style={section === "profile" ? { background: P } : { border: `1.5px solid ${BDR}` }}
            >
              <div className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">Ю</div>
              Профиль
            </button>

            {/* CTA */}
            <button
              onClick={() => setShowForm(true)}
              className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white shadow-sm hover:opacity-90 transition-all"
              style={{ background: P }}
            >
              Заказать
            </button>

            {/* Mobile burger */}
            <button
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <Icon name={mobileMenu ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden border-t px-6 py-4 space-y-1 slide-in" style={{ borderColor: BDR }}>
            {navLinks.map((n) => (
              <button key={n.id} onClick={() => handleNav(n.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${section === n.id ? "text-white" : "text-gray-600 hover:bg-gray-100"}`}
                style={section === n.id ? { background: P } : {}}
              >{n.label}</button>
            ))}
            <button onClick={() => { setShowForm(true); setMobileMenu(false); }}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white mt-2"
              style={{ background: P }}
            >Заказать с Таобао</button>
          </div>
        )}
      </header>

      {/* ═══════════════════ PAGE CONTENT ═══════════════════ */}
      <main>

        {/* ───── HOME ───── */}
        {section === "home" && (
          <div>
            {/* HERO */}
            <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-12">
              {/* Left */}
              <div className="flex-1 min-w-0">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
                  style={{ background: "#f0ebff", color: P }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: P }} />
                  Таобао · Tmall · 1688
                </div>
                <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
                  Заказывай товары<br />
                  из Китая
                  <span className="block" style={{ color: P }}>быстро и выгодно</span>
                </h1>
                <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">Помогаем покупать с Таобао, Tmall и 1688 с доставкой в Россию. </p>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 mb-10">
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all"
                    style={{ background: P, boxShadow: `0 8px 24px ${P}40` }}
                  >
                    <Icon name="ShoppingBag" size={16} />
                    Оформить заказ
                  </button>
                  <button
                    onClick={() => setSection("catalog")}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-all"
                    style={{ border: `1.5px solid ${BDR}`, color: "#374151" }}
                  >
                    Смотреть каталог
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8">
                  {[
                    { value: "50+", label: "Категорий товаров" },
                    { value: "1М+", label: "Наших клиентов" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {s.value}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — hero visual */}
              <div className="flex-shrink-0 relative w-full max-w-sm">
                {/* Big circle bg */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle, #ede9ff 0%, #f5f3ff 60%, transparent 100%)",
                    transform: "scale(1.15)",
                  }}
                />

                {/* Central emoji */}
                <div className="relative flex items-center justify-center" style={{ height: 320 }}>
                  <div
                    className="w-52 h-52 rounded-full flex items-center justify-center text-8xl float-anim shadow-2xl"
                    style={{ background: "linear-gradient(135deg,#ede9ff,#ddd6ff)", boxShadow: `0 20px 60px ${P}30` }}
                  >
                    🛍️
                  </div>

                  {/* Floating card — students */}
                  <div
                    className="absolute top-6 left-0 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg float-anim"
                    style={{ animationDelay: "0.5s", border: `1px solid ${BDR}` }}
                  >
                    <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
                      <Icon name="Users" size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-base leading-none" style={{ fontFamily: "'Oswald', sans-serif" }}>175K</div>
                      <div className="text-xs text-gray-400">Клиентов</div>
                    </div>
                  </div>

                  {/* Floating card — chart */}
                  <div
                    className="absolute bottom-10 right-0 bg-white rounded-2xl px-4 py-3 shadow-lg float-anim w-44"
                    style={{ animationDelay: "1s", border: `1px solid ${BDR}` }}
                  >
                    <div className="text-xs font-semibold text-gray-600 mb-2">Заказы за неделю</div>
                    <div className="flex items-end gap-1 h-10">
                      {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm"
                          style={{
                            height: `${h}%`,
                            background: i === 5 ? P : `${P}40`,
                            borderRadius: 3,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Decorative dots */}
                  <div className="absolute top-4 right-8 w-5 h-5 rounded-full" style={{ background: P, opacity: 0.4 }} />
                  <div className="absolute top-12 right-4 w-3 h-3 rounded-full" style={{ background: P, opacity: 0.25 }} />
                </div>
              </div>
            </section>

            {/* CATEGORIES */}
            <section className="max-w-6xl mx-auto px-6 pb-16 -mt-8">
              <div className="mb-7">
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: "UI/UX дизайн", icon: "Palette", grad: "gradient-pink", sub: "Товары для дизайнеров" },
                  { label: "Электроника", icon: "Cpu", grad: "gradient-purple", sub: "Гаджеты и техника" },
                  { label: "Маркетинг", icon: "Megaphone", grad: "gradient-cyan", sub: "Реклама и продвижение" },
                  { label: "Одежда", icon: "Shirt", grad: "gradient-amber", sub: "Мода и стиль" },
                  { label: "Все категории", icon: "ArrowRight", isMore: true },
                ].map((c, i) => (
                  <button
                    key={i}
                    onClick={() => { setCatFilter(c.isMore ? "Все" : c.label); setSection("catalog"); }}
                    className={`group transition-all rounded-3xl text-left ${c.isMore ? "flex flex-col items-center justify-center gap-3 hover:scale-105" : "hover:scale-105"}`}
                    style={c.isMore
                      ? { background: "#f0ebff", border: `1.5px dashed ${P}`, padding: "2rem 1rem" }
                      : {}}
                  >
                    {!c.isMore ? (
                      <div className={`${c.grad} rounded-3xl p-6 shadow-md h-full`}>
                        <Icon name={c.icon} size={28} className="text-white mb-3" />
                        <div className="font-bold text-white text-base leading-tight">{c.label}</div>
                        {c.sub && <div className="text-white/70 text-xs mt-1">{c.sub}</div>}
                      </div>
                    ) : (
                      <>
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center gradient-brand shadow-md"
                        >
                          <Icon name={c.icon} size={22} className="text-white" />
                        </div>
                        <span className="font-bold text-sm" style={{ color: P }}>Смотреть все</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* BENEFITS */}
            <section style={{ background: SURF }} className="py-16">
              <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: "'Oswald', sans-serif" }}>
                  Почему выбирают TaoSeller
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: "Calculator", title: "Расчёт стоимости", desc: "Автоматически считаем цену в рублях с учётом курса юаня, доставки и комиссии", grad: "gradient-brand" },
                    { icon: "Package", title: "Управление складом", desc: "Храните товары на нашем складе и отправляйте заказы покупателям по всей России", grad: "gradient-cyan" },
                    { icon: "Bell", title: "Уведомления в реальном времени", desc: "Следите за статусом заказов и получайте оповещения о каждом изменении", grad: "gradient-pink" },
                  ].map((b, i) => (
                    <div key={i} className="card-light p-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${b.grad} shadow-sm`}>
                        <Icon name={b.icon} size={22} className="text-white" />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>{b.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* RECENT ORDERS preview */}
            <section className="max-w-6xl mx-auto px-6 py-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Oswald', sans-serif" }}>Последние заказы</h2>
                <button onClick={() => setSection("orders")} className="text-sm font-semibold hover:opacity-70" style={{ color: P }}>Все заказы →</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_ORDERS.slice(0, 3).map((o) => {
                  const sc = STATUS_CFG[o.status as keyof typeof STATUS_CFG];
                  return (
                    <div key={o.id} className="card-light p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl gradient-brand flex items-center justify-center text-white font-bold shadow-sm">{o.buyer[0]}</div>
                          <div>
                            <div className="font-bold text-gray-800 text-sm">#{o.id}</div>
                            <div className="text-xs text-gray-400">{o.buyer}</div>
                          </div>
                        </div>
                        <span className={`tag-badge border rounded-full ${sc.cls}`}>{sc.label}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${BDR}` }}>
                        <span className="text-xs text-gray-400">{o.date}</span>
                        <span className="font-bold text-base" style={{ fontFamily: "'Oswald', sans-serif", color: P }}>{o.total}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ───── CATALOG ───── */}
        {section === "catalog" && (
          <div className="max-w-6xl mx-auto px-6 py-10 space-y-6 slide-in">
            <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-2xl" style={{ border: `1px solid ${BDR}` }}>
              <div className="relative flex items-center flex-1 min-w-48">
                <Icon name="Search" size={15} className="absolute left-3 text-gray-400" />
                <input
                  className="pl-9 pr-4 py-2.5 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none w-full"
                  style={{ background: SURF, border: `1px solid ${BDR}` }}
                  placeholder="Поиск..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setCatFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${catFilter === cat ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-800 bg-gray-100"}`}
                    style={catFilter === cat ? { background: P } : {}}
                  >{cat}</button>
                ))}
              </div>
              <button onClick={() => showToast("Добавление товара — скоро!")} className="btn-primary ml-auto flex items-center gap-2">
                <Icon name="Plus" size={15} />Добавить
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredProducts.map((p) => {
                const sc = PROD_STATUS[p.status as keyof typeof PROD_STATUS];
                return (
                  <div key={p.id} className="card-light overflow-hidden cursor-pointer">
                    <div className="h-36 flex items-center justify-center text-5xl relative" style={{ background: SURF }}>
                      {p.img}
                      <span className={`absolute top-3 right-3 tag-badge rounded-full ${sc.cls}`}>{sc.label}</span>
                    </div>
                    <div className="p-4">
                      <div className="font-bold text-gray-800 text-sm mb-1 truncate">{p.name}</div>
                      <div className="text-xs text-gray-400 mb-3">{p.sku}</div>
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xl" style={{ fontFamily: "'Oswald', sans-serif", color: P }}>{p.price}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1"><Icon name="Box" size={12} />{p.stock} шт</div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => showToast(`Редактирование: ${p.name}`)} className="flex-1 py-2 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-800 transition-all" style={{ background: SURF, border: `1px solid ${BDR}` }}>Редактировать</button>
                        <button onClick={() => showToast(`${p.name} добавлен`)} className="px-3 py-2 rounded-full text-xs font-semibold text-white gradient-brand hover:opacity-90 transition-opacity"><Icon name="Plus" size={13} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center py-20 text-gray-400">
                <Icon name="SearchX" size={40} className="mb-3 opacity-40" />
                <div className="text-sm">Товары не найдены</div>
              </div>
            )}
          </div>
        )}

        {/* ───── ORDERS ───── */}
        {section === "orders" && (
          <div className="max-w-6xl mx-auto px-6 py-10 space-y-5 slide-in">
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl flex-wrap" style={{ border: `1px solid ${BDR}` }}>
              {["Все", "new", "processing", "shipped", "delivered", "cancelled"].map((s) => {
                const isActive = orderFilter === s;
                const label = s === "Все" ? "Все" : STATUS_CFG[s as keyof typeof STATUS_CFG]?.label ?? s;
                const count = s === "Все" ? allOrders.length : allOrders.filter((o) => o.status === s).length;
                return (
                  <button key={s} onClick={() => setOrderFilter(s)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${isActive ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-700 bg-gray-100"}`}
                    style={isActive ? { background: P } : {}}
                  >
                    {label}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-white/25 text-white" : "bg-white text-gray-500"}`}>{count}</span>
                  </button>
                );
              })}
              <div className="ml-auto flex items-center gap-2">
                <button onClick={loadOrders} disabled={loading} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all" style={{ border: `1px solid ${BDR}` }}>
                  <Icon name={loading ? "Loader" : "RefreshCw"} size={14} className={loading ? "animate-spin" : ""} />
                </button>
                <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                  <Icon name="Plus" size={13} />Заказ с Таобао
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: `1px solid ${BDR}` }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BDR}`, background: SURF }}>
                    {["Заказ", "Покупатель", "Товары", "Сумма", "Адрес", "Дата", "Статус", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o, i) => {
                    const sc = STATUS_CFG[o.status as keyof typeof STATUS_CFG];
                    return (
                      <tr key={o.id} className="hover:bg-gray-50 transition-all" style={{ borderBottom: i < filteredOrders.length - 1 ? `1px solid ${BDR}` : "none" }}>
                        <td className="px-4 py-3.5"><div className="font-bold text-gray-800 text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>#{o.id}</div></td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{o.buyer[0]}</div>
                            <span className="text-sm font-medium text-gray-700">{o.buyer}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-400">{o.items} шт.</td>
                        <td className="px-4 py-3.5"><span className="font-bold text-sm" style={{ fontFamily: "'Oswald', sans-serif", color: P }}>{o.total}</span></td>
                        <td className="px-4 py-3.5 text-xs text-gray-400">{o.address}</td>
                        <td className="px-4 py-3.5 text-xs text-gray-400">{o.date}</td>
                        <td className="px-4 py-3.5"><span className={`tag-badge border rounded-full ${sc.cls}`}>{sc.label}</span></td>
                        <td className="px-4 py-3.5">
                          <button onClick={() => showToast(`Заказ #${o.id}`)} className="p-1.5 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-all">
                            <Icon name="ExternalLink" size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {loading && <div className="flex items-center justify-center py-10 gap-2 text-gray-400 text-sm"><Icon name="Loader" size={16} className="animate-spin" />Загружаю...</div>}
              {!loading && filteredOrders.length === 0 && (
                <div className="flex flex-col items-center py-14 text-gray-400">
                  <Icon name="ShoppingCart" size={36} className="mb-3 opacity-30" />
                  <div className="text-sm mb-3">Заказов пока нет</div>
                  <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><Icon name="Plus" size={13} />Создать заказ</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ───── STORAGE ───── */}
        {section === "storage" && (
          <div className="max-w-6xl mx-auto px-6 py-10 space-y-6 slide-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Всего товаров", value: "800", icon: "Package", grad: "gradient-purple" },
                { label: "Занято мест", value: "78%", icon: "BarChart2", grad: "gradient-amber" },
                { label: "Секций", value: "4", icon: "Layers", grad: "gradient-brand" },
                { label: "Нужна доставка", value: "12", icon: "Truck", grad: "gradient-pink" },
              ].map((s, i) => (
                <div key={i} className="card-light p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${s.grad}`}><Icon name={s.icon} size={18} className="text-white" /></div>
                    <span className="text-xs font-medium text-gray-400">{s.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Oswald', sans-serif" }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_STORAGE.map((s) => (
                <div key={s.id} className="card-light p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-bold text-gray-800" style={{ fontFamily: "'Oswald', sans-serif" }}>{s.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">ID: {s.id}</div>
                    </div>
                    <button onClick={() => showToast(`Открыта ${s.name}`)} className="text-xs px-3 py-1.5 rounded-full font-semibold text-gray-500 hover:text-gray-700" style={{ background: SURF, border: `1px solid ${BDR}` }}>Открыть</button>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">{s.items} / {s.capacity}</span>
                    <span className="font-bold" style={{ fontFamily: "'Oswald', sans-serif", color: s.used > 80 ? "#ef4444" : s.used > 60 ? "#f97316" : "#22c55e" }}>{s.used}%</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden bg-gray-100">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${s.used}%`, background: s.used > 80 ? "linear-gradient(90deg,#ef4444,#f97316)" : s.used > 60 ? "linear-gradient(90deg,#f97316,#fbbf24)" : "linear-gradient(90deg,#22c55e,#4ade80)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───── PROFILE ───── */}
        {section === "profile" && (
          <div className="max-w-2xl mx-auto px-6 py-10 space-y-5 slide-in">
            <div className="bg-white rounded-3xl p-6" style={{ border: `1px solid ${BDR}` }}>
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
                <button onClick={() => showToast("Редактирование — скоро!")} className="ml-auto btn-outline flex items-center gap-2"><Icon name="Pencil" size={13} />Изменить</button>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: BDR }}>
                {[{ label: "Заказов выполнено", value: "1,248" }, { label: "На платформе", value: "2 года" }, { label: "Товаров активно", value: "312" }].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Oswald', sans-serif" }}>{s.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl overflow-hidden" style={{ border: `1px solid ${BDR}` }}>
              {[
                { label: "Язык интерфейса", value: "Русский", icon: "Globe" },
                { label: "Часовой пояс", value: "UTC+3 (Москва)", icon: "Clock" },
                { label: "Уведомления", value: "Включены", icon: "Bell" },
                { label: "Подписка", value: "Pro — до 1 янв 2027", icon: "CreditCard" },
                { label: "API-ключ Таобао", value: "••••••••••••••", icon: "Key" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-all cursor-pointer" style={{ borderBottom: `1px solid ${BDR}` }} onClick={() => showToast(`${item.label} — скоро!`)}>
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
            <button onClick={() => showToast("Выход — скоро!")} className="w-full py-3 rounded-2xl text-sm font-semibold text-red-500 bg-red-50 hover:opacity-80 transition-all" style={{ border: "1.5px solid #fecaca" }}>Выйти из аккаунта</button>
          </div>
        )}

        {/* ───── HELP ───── */}
        {section === "help" && (
          <div className="max-w-2xl mx-auto px-6 py-10 space-y-5 slide-in">
            <div className="rounded-3xl p-8 text-center" style={{ background: "linear-gradient(135deg,#f0ebff,#fdf4ff)", border: `1.5px solid #e0d7ff` }}>
              <div className="w-16 h-16 mx-auto rounded-3xl gradient-brand flex items-center justify-center mb-4 shadow-lg float-anim">
                <Icon name="LifeBuoy" size={26} className="text-white" />
              </div>
              <h2 className="font-bold text-gray-900 text-2xl mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>Как мы можем помочь?</h2>
              <p className="text-gray-500 text-sm mb-5">Найдите ответ или обратитесь в поддержку</p>
              <div className="relative max-w-md mx-auto">
                <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="w-full pl-11 pr-4 py-3 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-white shadow-sm" style={{ border: `1px solid ${BDR}` }} placeholder="Поиск..." onFocus={() => showToast("База знаний — скоро!")} />
              </div>
            </div>
            <div className="bg-white rounded-3xl overflow-hidden" style={{ border: `1px solid ${BDR}` }}>
              {["Как добавить товар?", "Как подключить Таобао?", "Как настроить уведомления?", "Как экспортировать заказы?"].map((q, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-all cursor-pointer" style={{ borderBottom: i < 3 ? `1px solid ${BDR}` : "none" }} onClick={() => showToast("Ответ — скоро!")}>
                  <div className="flex items-center gap-3">
                    <Icon name="HelpCircle" size={15} className="text-gray-300" />
                    <span className="text-sm text-gray-700">{q}</span>
                  </div>
                  <Icon name="ChevronRight" size={14} className="text-gray-300" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: "MessageCircle", title: "Чат", desc: "За 5 минут", grad: "gradient-purple" },
                { icon: "Mail", title: "Email", desc: "support@taoseller.ru", grad: "gradient-cyan" },
                { icon: "Phone", title: "Телефон", desc: "+7 800 000-00-00", grad: "gradient-amber" },
              ].map((c, i) => (
                <div key={i} className="card-light p-5 text-center cursor-pointer" onClick={() => showToast(`${c.title} — скоро!`)}>
                  <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 ${c.grad} shadow-sm`}><Icon name={c.icon} size={20} className="text-white" /></div>
                  <div className="font-bold text-gray-800 text-sm mb-1">{c.title}</div>
                  <div className="text-xs text-gray-400 mb-3">{c.desc}</div>
                  <button className="w-full py-2 rounded-full text-xs font-semibold text-white gradient-brand">Написать</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t py-8 mt-4" style={{ borderColor: BDR }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>T</span>
            </div>
            <span className="font-bold text-gray-700" style={{ fontFamily: "'Oswald', sans-serif" }}>TaoSeller.</span>
          </div>
          <div className="flex items-center gap-6">
            {navLinks.map((n) => (
              <button key={n.id} onClick={() => handleNav(n.id)} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">{n.label}</button>
            ))}
          </div>
          <div className="text-xs text-gray-400">© 2026 TaoSeller. Все права защищены.</div>
        </div>
      </footer>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 notification-enter flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl bg-white" style={{ border: `1.5px solid ${BDR}` }}>
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0 shadow-sm"><Icon name="Zap" size={14} className="text-white" /></div>
          <span className="text-sm font-medium text-gray-700">{toast}</span>
        </div>
      )}

      {showForm && (
        <OrderForm
          onClose={() => setShowForm(false)}
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
            } catch { showToast("Ошибка сохранения"); }
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}