import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const P = "#f97316";
const GRAD = "linear-gradient(135deg, #ea580c, #f97316, #fb923c)";
const SURF = "#fff8f4";
const BDR = "#fde8d8";

const STEPS = [
  { num: "01", icon: "Search", title: "Найди товар", desc: "Вбей название на русском — мы переведём запрос и найдём лучших поставщиков на Taobao автоматически" },
  { num: "02", icon: "Calculator", title: "Узнай цену", desc: "Сразу видишь стоимость в рублях: курс юаня + доставка до склада + наша комиссия — без сюрпризов" },
  { num: "03", icon: "ShoppingCart", title: "Сделай заказ", desc: "Оплати в рублях на карту. Мы сами свяжемся с продавцом, оплатим и организуем доставку" },
  { num: "04", icon: "Package", title: "Получи товар", desc: "Товар приходит на наш склад, проверяется и отправляется тебе удобным способом по всей России" },
];

const PROS = [
  { icon: "TrendingDown", title: "Цены ниже в 2–5 раз", desc: "По сравнению с готовыми товарами на Ozon и WB — прямые закупки от производителей без посредников", color: "#22c55e" },
  { icon: "Layers", title: "Сотни миллионов товаров", desc: "Практически любой товар, который существует в мире, можно найти на Taobao — одежда, электроника, стройматериалы", color: "#3b82f6" },
  { icon: "Factory", title: "Прямо с фабрик Китая", desc: "Большинство продавцов — сами производители. Минимальная наценка, можно заказать под своим брендом", color: "#f97316" },
  { icon: "RefreshCw", title: "Любые объёмы", desc: "От 1 штуки для себя до 10 000 для бизнеса. Оптовые цены начинаются уже от 5–10 единиц", color: "#8b5cf6" },
  { icon: "ShieldCheck", title: "Защита покупателя", desc: "Taobao — платформа Alibaba Group. Встроенная система защиты: возврат, если товар не пришёл или не соответствует", color: "#ec4899" },
  { icon: "Clock", title: "Скорость доставки", desc: "Авиа-доставка 7–14 дней, морская — 25–40 дней. Выбирай скорость под свои задачи и бюджет", color: "#14b8a6" },
];

const CATS = [
  { emoji: "👗", name: "Одежда и обувь", count: "2.4 млрд товаров" },
  { emoji: "📱", name: "Электроника", count: "680 млн товаров" },
  { emoji: "🏠", name: "Дом и сад", count: "1.1 млрд товаров" },
  { emoji: "💄", name: "Красота и здоровье", count: "420 млн товаров" },
  { emoji: "🎮", name: "Игрушки и хобби", count: "390 млн товаров" },
  { emoji: "🔧", name: "Инструменты", count: "510 млн товаров" },
  { emoji: "🐾", name: "Товары для животных", count: "180 млн товаров" },
  { emoji: "🎒", name: "Сумки и аксессуары", count: "760 млн товаров" },
];

const FAQS = [
  { q: "Нужен ли аккаунт на Taobao?", a: "Нет. Мы работаем через наш аккаунт — тебе не нужно регистрироваться, разбираться в китайском интерфейсе или платить в юанях." },
  { q: "Как оплатить заказ?", a: "Оплата в рублях на карту или через СБП. Мы конвертируем сумму по актуальному курсу юаня на момент заказа." },
  { q: "Что если товар придёт бракованным?", a: "Фотофиксируем посылку при приёмке на склад. Если товар не соответствует — открываем спор с продавцом и возвращаем деньги." },
  { q: "Можно ли заказать под своим брендом?", a: "Да. Многие производители на Taobao предлагают OEM/ODM — нанесение твоего логотипа, кастомная упаковка. Уточняй при заказе." },
  { q: "Минимальный заказ?", a: "Большинство товаров — от 1 штуки. Некоторые производители требуют минималку 5–50 единиц — указано в карточке товара." },
];

export default function TaobaoPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b" style={{ borderColor: BDR }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <Icon name="ArrowLeft" size={18} />
            Назад
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <img
              src="https://cdn.poehali.dev/projects/2441c67b-4ef1-4873-b89c-6e523b912ef0/bucket/b73ece42-1e93-4ca9-a6dc-72bd1dd56b9d.png"
              alt="TaoSeller logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-gray-900" style={{ fontFamily: "'Oswald', sans-serif" }}>Обзор Taobao</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-6" style={{ background: SURF }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 70% 50%, #fed7aa33 0%, transparent 70%)" }} />
        <div className="max-w-5xl mx-auto relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: `${P}15`, color: P, border: `1px solid ${BDR}` }}>
                <Icon name="Zap" size={12} />
                Крупнейший маркетплейс Китая
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Что такое<br />
                <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Taobao?</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 max-w-lg">
                Taobao — китайская торговая платформа Alibaba Group, основана в 2003 году. Более <strong>1 миллиарда товаров</strong>, 900 миллионов пользователей и прямой выход на производителей всего Китая.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 rounded-full text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  style={{ background: GRAD }}
                >
                  Заказать с Taobao
                </button>
                <a href="#how" className="px-6 py-3 rounded-full font-semibold text-sm transition-all hover:bg-gray-100 border" style={{ color: P, borderColor: BDR }}>
                  Как это работает
                </a>
              </div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-3">
              {[
                { val: "1B+", label: "Товаров" },
                { val: "900M", label: "Покупателей" },
                { val: "2003", label: "Год основания" },
                { val: "#1", label: "Маркетплейс Азии" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-sm" style={{ border: `1px solid ${BDR}` }}>
                  <div className="text-2xl font-black mb-1" style={{ fontFamily: "'Oswald', sans-serif", background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</div>
                  <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Oswald', sans-serif" }}>Как мы работаем с Taobao</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Ты не знаешь китайский и никогда не работал с Taobao? Не нужно — мы берём это на себя</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.num} className="relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow" style={{ border: `1px solid ${BDR}` }}>
                <div className="text-5xl font-black mb-4 leading-none" style={{ fontFamily: "'Oswald', sans-serif", background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0.25 }}>{s.num}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 -mt-10" style={{ background: GRAD }}>
                  <Icon name={s.icon} size={18} className="text-white" />
                </div>
                <div className="font-bold text-gray-900 mb-2">{s.title}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 px-6" style={{ background: SURF }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Oswald', sans-serif" }}>Почему Taobao?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Главные преимущества закупок напрямую из Китая</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROS.map((p, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow" style={{ border: `1px solid ${BDR}` }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${p.color}15` }}>
                  <Icon name={p.icon} size={20} style={{ color: p.color }} />
                </div>
                <div className="font-bold text-gray-900 mb-2">{p.title}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Oswald', sans-serif" }}>Популярные категории</h2>
            <p className="text-gray-500">Что чаще всего заказывают наши клиенты с Taobao</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATS.map((c, i) => (
              <button
                key={i}
                onClick={() => navigate("/")}
                className="bg-white rounded-2xl p-5 text-left hover:shadow-md transition-all hover:-translate-y-0.5 group"
                style={{ border: `1px solid ${BDR}` }}
              >
                <div className="text-3xl mb-3">{c.emoji}</div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{c.name}</div>
                <div className="text-xs text-gray-400">{c.count}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Taobao vs competitors */}
      <section className="py-20 px-6" style={{ background: SURF }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Oswald', sans-serif" }}>Taobao vs другие платформы</h2>
          </div>
          <div className="overflow-x-auto rounded-3xl shadow-sm" style={{ border: `1px solid ${BDR}` }}>
            <table className="w-full bg-white text-sm">
              <thead>
                <tr style={{ background: SURF }}>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Критерий</th>
                  {[
                    { name: "Taobao", highlight: true },
                    { name: "1688", highlight: false },
                    { name: "Ozon", highlight: false },
                    { name: "Wildberries", highlight: false },
                  ].map((pl) => (
                    <th key={pl.name} className="px-6 py-4 font-bold text-center" style={pl.highlight ? { color: P } : { color: "#374151" }}>
                      {pl.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { criteria: "Цена", vals: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐⭐"] },
                  { criteria: "Выбор товаров", vals: ["1B+", "200M+", "200M+", "150M+"] },
                  { criteria: "Розничные закупки", vals: ["✅", "⚠️ Мин. партия", "✅", "✅"] },
                  { criteria: "OEM / Свой бренд", vals: ["✅", "✅", "❌", "❌"] },
                  { criteria: "Доставка в РФ", vals: ["Через нас", "Через нас", "✅ Прямая", "✅ Прямая"] },
                  { criteria: "Оплата в рублях", vals: ["Через нас", "Через нас", "✅", "✅"] },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : ""} style={i % 2 !== 0 ? { background: SURF } : {}}>
                    <td className="px-6 py-4 font-medium text-gray-700">{row.criteria}</td>
                    {row.vals.map((v, j) => (
                      <td key={j} className="px-6 py-4 text-center text-gray-600">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Oswald', sans-serif" }}>Частые вопросы</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: `1px solid ${BDR}` }}>
                <div className="font-bold text-gray-900 mb-2 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5" style={{ background: GRAD }}>?</div>
                  {f.q}
                </div>
                <div className="text-sm text-gray-500 leading-relaxed pl-9">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: SURF }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">🛍️</div>
          <h2 className="text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Готов заказать с Taobao?
          </h2>
          <p className="text-gray-500 mb-8 text-lg">Мы переведём, найдём, оплатим и доставим — ты просто указываешь что хочешь</p>
          <button
            onClick={() => navigate("/")}
            className="px-10 py-4 rounded-full text-white font-bold text-base shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            style={{ background: GRAD }}
          >
            Сделать заказ
          </button>
        </div>
      </section>
    </div>
  );
}