import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

interface OrderFormProps {
  onClose: () => void;
  onSubmit: (data: OrderFormData) => void;
}

export interface OrderFormData {
  link: string;
  quantity: number;
  variant: string;
  name: string;
  phone: string;
  address: string;
  comment: string;
  photo: string | null;
  priceYuan: number | null;
  priceRub: number | null;
  totalRub: number | null;
}

const CNY_TO_RUB = 13.2;
const DELIVERY_RUB = 650;
const COMMISSION = 0.07;

function extractPrice(link: string): number | null {
  if (!link.includes("taobao") && !link.includes("tmall") && !link.includes("1688") && !link.includes("tb.cn")) return null;
  // Эмуляция парсинга — возвращаем случайную цену в диапазоне как демо
  const seed = link.length;
  return Math.round((80 + (seed % 120)) * 10) / 10;
}

export default function OrderForm({ onClose, onSubmit }: OrderFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [linkError, setLinkError] = useState("");
  const [priceYuan, setPriceYuan] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isValidLink = (v: string) =>
    v.includes("taobao") || v.includes("tmall") || v.includes("1688") || v.includes("tb.cn") || v.includes("item.taobao");

  const handleCalc = () => {
    if (!link.trim()) { setLinkError("Вставьте ссылку на товар"); return; }
    if (!isValidLink(link)) { setLinkError("Ссылка должна быть с Таобао, Tmall или 1688"); return; }
    setLinkError("");
    setCalculating(true);
    setTimeout(() => {
      const p = extractPrice(link);
      setPriceYuan(p ?? 120);
      setCalculating(false);
      setStep(2);
    }, 1200);
  };

  const pricePerItem = priceYuan ? Math.round(priceYuan * CNY_TO_RUB) : 0;
  const commission = Math.round(pricePerItem * quantity * COMMISSION);
  const total = pricePerItem * quantity + DELIVERY_RUB + commission;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({
        link, quantity, variant, name, phone, address, comment, photo,
        priceYuan: priceYuan,
        priceRub: priceYuan ? Math.round(priceYuan * CNY_TO_RUB) : null,
        totalRub: total,
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl slide-in"
        style={{ background: "var(--tao-surface)", border: "1px solid var(--tao-border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--tao-border)", background: "linear-gradient(135deg, rgba(255,77,26,0.08), rgba(255,149,0,0.05))" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
              <Icon name="ShoppingBag" size={17} className="text-white" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Заказ с Таобао
              </div>
              <div className="text-xs text-gray-500">Шаг {step} из 2</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex px-6 pt-4 gap-2">
          {[
            { n: 1, label: "Товар и расчёт" },
            { n: 2, label: "Данные покупателя" },
          ].map((s) => (
            <div key={s.n} className={`flex-1 h-1 rounded-full transition-all duration-500 ${step >= s.n ? "" : "opacity-20"}`}
              style={{ background: step >= s.n ? "linear-gradient(90deg, #FF4D1A, #FF9500)" : "var(--tao-border)" }}
            />
          ))}
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">

          {/* STEP 1 */}
          {step === 1 && !submitted && (
            <div className="space-y-5 fade-in">
              {/* Link */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Ссылка на товар *
                </label>
                <div className="relative">
                  <Icon name="Link" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                    style={{ background: "var(--tao-dark)", border: `1px solid ${linkError ? "rgba(255,77,26,0.6)" : "var(--tao-border)"}` }}
                    placeholder="https://item.taobao.com/item.htm?id=..."
                    value={link}
                    onChange={(e) => { setLink(e.target.value); setLinkError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleCalc()}
                  />
                </div>
                {linkError && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Icon name="AlertCircle" size={12} style={{ color: "var(--tao-red)" }} />
                    <span className="text-xs" style={{ color: "var(--tao-red)" }}>{linkError}</span>
                  </div>
                )}
                <div className="text-xs text-gray-600 mt-1.5">Поддерживается taobao.com, tmall.com, 1688.com, tb.cn</div>
              </div>

              {/* Qty + variant */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Количество
                  </label>
                  <div className="flex items-center gap-0" style={{ border: "1px solid var(--tao-border)", borderRadius: "0.75rem", overflow: "hidden", background: "var(--tao-dark)" }}>
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-bold text-lg"
                    >
                      −
                    </button>
                    <div className="flex-1 text-center text-white font-semibold text-base" style={{ fontFamily: "'Oswald', sans-serif" }}>
                      {quantity}
                    </div>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Размер / цвет / вариант
                  </label>
                  <input
                    className="w-full px-3 py-3 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                    style={{ background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                    placeholder="Например: XL, красный"
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                  />
                </div>
              </div>

              {/* Photo upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Фото товара (скриншот)
                </label>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                {photo ? (
                  <div className="relative group">
                    <img src={photo} alt="товар" className="w-full h-36 object-cover rounded-xl" style={{ border: "1px solid var(--tao-border)" }} />
                    <button
                      onClick={() => setPhoto(null)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-all"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-all"
                    style={{ borderColor: "var(--tao-border)", background: "var(--tao-dark)" }}
                  >
                    <Icon name="ImagePlus" size={22} />
                    <span className="text-xs">Нажмите для загрузки фото</span>
                  </button>
                )}
              </div>

              {/* Calculate button */}
              <button
                onClick={handleCalc}
                disabled={calculating}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm gradient-brand hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {calculating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Рассчитываю стоимость...
                  </>
                ) : (
                  <>
                    <Icon name="Calculator" size={16} />
                    Рассчитать стоимость
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && !submitted && (
            <div className="space-y-5 fade-in">
              {/* Price breakdown */}
              <div
                className="rounded-xl p-4"
                style={{ background: "linear-gradient(135deg, rgba(255,77,26,0.08), rgba(255,149,0,0.05))", border: "1px solid rgba(255,149,0,0.2)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Calculator" size={15} style={{ color: "var(--tao-orange)" }} />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">Расчёт стоимости</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: `Цена товара (¥${priceYuan}) × ${quantity}`, value: `${pricePerItem * quantity} ₽` },
                    { label: "Доставка до склада", value: `${DELIVERY_RUB} ₽` },
                    { label: `Комиссия сервиса (7%)`, value: `${commission} ₽` },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{row.label}</span>
                      <span className="text-white font-medium">{row.value}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-1 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,149,0,0.2)" }}>
                    <span className="text-white font-semibold">Итого</span>
                    <span className="text-xl font-bold" style={{ fontFamily: "'Oswald', sans-serif", color: "var(--tao-orange)" }}>
                      {total.toLocaleString("ru")} ₽
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">Курс ¥1 = {CNY_TO_RUB} ₽ · Итог может измениться после подтверждения</div>
              </div>

              {/* Buyer info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Имя *</label>
                  <input
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                    style={{ background: "var(--tao-dark)", border: `1px solid ${!name && name !== undefined ? "var(--tao-border)" : "var(--tao-border)"}` }}
                    placeholder="Иван Иванов"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Телефон *</label>
                  <input
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                    style={{ background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                    placeholder="+7 900 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Адрес доставки *</label>
                <input
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                  style={{ background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                  placeholder="Город, улица, дом, квартира"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Комментарий</label>
                <textarea
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all resize-none"
                  style={{ background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                  placeholder="Особые пожелания к заказу..."
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all"
                  style={{ background: "var(--tao-dark)", border: "1px solid var(--tao-border)" }}
                >
                  ← Назад
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!name.trim() || !phone.trim() || !address.trim()}
                  className="flex-1 py-3 rounded-xl text-white font-semibold text-sm gradient-brand hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Icon name="CheckCircle" size={16} />
                  Оформить заказ · {total.toLocaleString("ru")} ₽
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {submitted && (
            <div className="py-8 flex flex-col items-center text-center fade-in">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 glow-red"
                style={{ background: "linear-gradient(135deg, #30D158, #00E676)" }}
              >
                <Icon name="CheckCircle" size={30} className="text-white" />
              </div>
              <h3 className="font-bold text-white text-xl mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Заказ оформлен!
              </h3>
              <p className="text-gray-400 text-sm mb-1">Менеджер свяжется с <span className="text-white">{name}</span></p>
              <p className="text-gray-500 text-xs mb-5">в течение 30 минут по номеру {phone}</p>
              <div
                className="w-full rounded-xl px-4 py-3 flex items-center justify-between"
                style={{ background: "rgba(48,209,88,0.08)", border: "1px solid rgba(48,209,88,0.2)" }}
              >
                <span className="text-sm text-gray-400">Сумма заказа</span>
                <span className="font-bold text-lg" style={{ fontFamily: "'Oswald', sans-serif", color: "#30D158" }}>
                  {total.toLocaleString("ru")} ₽
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}