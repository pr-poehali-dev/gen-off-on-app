import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "energy" | "energy-test" | "energy-result" | "typology" | "history" | "subscription" | "referral" | "profile" | "admin" | "gen-on";

const ENERGY_QUESTIONS = [
  { id: 1, type: "physical" as const, text: "Как ощущается твоё тело сегодня?" },
  { id: 2, type: "physical" as const, text: "Хватает ли тебе физических сил на день?" },
  { id: 3, type: "physical" as const, text: "Насколько ты бодр и активен прямо сейчас?" },
  { id: 4, type: "physical" as const, text: "Как оцениваешь своё здоровье сегодня?" },
  { id: 5, type: "psychic" as const, text: "Насколько стабильно твоё эмоциональное состояние?" },
  { id: 6, type: "psychic" as const, text: "Есть ли у тебя ясность мыслей и концентрация?" },
  { id: 7, type: "psychic" as const, text: "Как ты себя чувствуешь внутренне прямо сейчас?" },
  { id: 8, type: "psychic" as const, text: "Есть ли у тебя мотивация и вдохновение?" },
  { id: 9, type: "egregor" as const, text: "Чувствуешь ли ты поддержку людей вокруг?" },
  { id: 10, type: "egregor" as const, text: "Насколько ты в потоке и синхронизирован с миром?" },
  { id: 11, type: "egregor" as const, text: "Ощущаешь ли смысл и направление в своей жизни?" },
  { id: 12, type: "egregor" as const, text: "Есть ли у тебя связь с чем-то большим, чем ты сам?" },
];

const GOOD_VALUES = [200, 500, 700, 1000];
const BAD_VALUES = [-300, -500, -700, -1000];

const TYPOLOGY_Q1 = [
  { id: 1, text: "Где ты черпаешь энергию?", options: [{ label: "Среди людей, в общении", val: "E" }, { label: "Наедине с собой", val: "I" }] },
  { id: 2, text: "Что тебе ближе после напряжённого дня?", options: [{ label: "Встретиться с друзьями", val: "E" }, { label: "Побыть одному дома", val: "I" }] },
  { id: 3, text: "Как ты принимаешь решения?", options: [{ label: "Говорю, думаю вслух", val: "E" }, { label: "Сначала обдумываю внутри", val: "I" }] },
];

const TYPOLOGY_Q2 = [
  { id: 1, text: "Как ты воспринимаешь новую информацию?", options: [{ label: "Чувствую сердцем", val: "F" }, { label: "Анализирую логически", val: "T" }, { label: "Доверяю интуиции", val: "N" }, { label: "Опираюсь на факты", val: "S" }] },
  { id: 2, text: "Что важнее при решении проблемы?", options: [{ label: "Эмоции людей", val: "F" }, { label: "Объективные данные", val: "T" }, { label: "Внутреннее предчувствие", val: "N" }, { label: "Практический опыт", val: "S" }] },
  { id: 3, text: "Как ты планируешь будущее?", options: [{ label: "Мечтаю и вижу образы", val: "N" }, { label: "Составляю чёткий план", val: "T" }, { label: "Слушаю своё сердце", val: "F" }, { label: "Иду шаг за шагом", val: "S" }] },
  { id: 4, text: "Что тебя больше вдохновляет?", options: [{ label: "Идеи и возможности", val: "N" }, { label: "Логика и структура", val: "T" }, { label: "Гармония в отношениях", val: "F" }, { label: "Реальные результаты", val: "S" }] },
  { id: 5, text: "Как ты реагируешь на изменения?", options: [{ label: "Вижу новые возможности", val: "N" }, { label: "Оцениваю риски", val: "T" }, { label: "Думаю о влиянии на людей", val: "F" }, { label: "Ищу проверенный путь", val: "S" }] },
];

const SUBSCRIPTIONS = [
  { id: "start", label: "Старт", price: 7000, period: "90 дней", badge: "Первая подписка", color: "hsl(195 100% 55%)" },
  { id: "monthly", label: "Базовый", price: 1000, period: "1 месяц", badge: null, color: "hsl(220 20% 50%)" },
  { id: "quarter", label: "Квартал", price: 3000, period: "3 мес +1", badge: "Выгода 25%", color: "hsl(271 90% 65%)" },
  { id: "half", label: "Полгода", price: 6000, period: "6 мес +2", badge: "Выгода 33%", color: "hsl(22 100% 58%)" },
  { id: "year", label: "Год", price: 12000, period: "12 мес +3", badge: "Лучший выбор", color: "hsl(142 76% 52%)" },
];

function VennDiagram({ physical = 0, psychic = 0, egregor = 0 }: { physical?: number; psychic?: number; egregor?: number }) {
  const maxVal = 4000;
  const pct = (v: number) => Math.max(10, Math.round((v / maxVal) * 100));
  const totalPct = Math.round(((physical + psychic + egregor) / 12000) * 100);
  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      <svg width="220" height="220" viewBox="0 0 220 220" className="absolute inset-0">
        <defs>
          <radialGradient id="physGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(22 100% 58%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(22 100% 58%)" stopOpacity="0.05" />
          </radialGradient>
          <radialGradient id="psychGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(271 90% 65%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(271 90% 65%)" stopOpacity="0.05" />
          </radialGradient>
          <radialGradient id="egrGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(195 100% 55%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(195 100% 55%)" stopOpacity="0.05" />
          </radialGradient>
        </defs>
        <circle cx="85" cy="125" r="65" fill="url(#physGrad)" stroke="hsl(22 100% 58%)" strokeWidth="1.5" strokeOpacity="0.6" />
        <circle cx="135" cy="125" r="65" fill="url(#psychGrad)" stroke="hsl(271 90% 65%)" strokeWidth="1.5" strokeOpacity="0.6" />
        <circle cx="110" cy="82" r="65" fill="url(#egrGrad)" stroke="hsl(195 100% 55%)" strokeWidth="1.5" strokeOpacity="0.6" />
      </svg>
      <div className="absolute" style={{ left: 4, top: 128 }}>
        <div className="text-center">
          <div className="text-xs font-display font-bold" style={{ color: "hsl(22 100% 65%)" }}>{pct(physical)}%</div>
          <div className="text-xs text-muted-foreground">Физ</div>
        </div>
      </div>
      <div className="absolute" style={{ right: 4, top: 128 }}>
        <div className="text-center">
          <div className="text-xs font-display font-bold" style={{ color: "hsl(271 90% 75%)" }}>{pct(psychic)}%</div>
          <div className="text-xs text-muted-foreground">Псих</div>
        </div>
      </div>
      <div className="absolute" style={{ top: 6, left: "50%", transform: "translateX(-50%)" }}>
        <div className="text-center">
          <div className="text-xs font-display font-bold" style={{ color: "hsl(195 100% 65%)" }}>{pct(egregor)}%</div>
          <div className="text-xs text-muted-foreground">Эгр</div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center mt-6">
        <div className="text-center">
          <div className="text-lg font-display font-black text-foreground">{totalPct}%</div>
          <div className="text-xs text-muted-foreground">индекс</div>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ current, onChange }: { current: Page; onChange: (p: Page) => void }) {
  const items = [
    { id: "home" as Page, icon: "Home", label: "Главная" },
    { id: "energy" as Page, icon: "Zap", label: "Энергия" },
    { id: "typology" as Page, icon: "Brain", label: "Типаж" },
    { id: "history" as Page, icon: "BarChart3", label: "История" },
    { id: "profile" as Page, icon: "User", label: "Профиль" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {items.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${current === item.id ? "active" : ""}`}
            onClick={() => onChange(item.id)}
          >
            <Icon name={item.icon} size={22} />
            <span className="text-xs font-body">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const user = { name: "Александр", level: 4, points: 2840, streak: 7 };
  const today = new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-muted-foreground text-sm capitalize">{today}</p>
          <h1 className="font-display font-black text-2xl text-gradient-primary mt-0.5">Привет, {user.name}!</h1>
        </div>
        <button onClick={() => onNavigate("profile")} className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover-scale">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="font-display font-bold text-white text-sm">А</span>
          </div>
        </button>
      </div>

      {/* Gen ON */}
      <button
        className="w-full glass rounded-3xl p-5 relative overflow-hidden hover-scale text-left"
        onClick={() => onNavigate("gen-on")}
        style={{ border: "1px solid hsl(142 76% 52% / 0.3)", boxShadow: "0 0 40px hsl(142 76% 52% / 0.1)" }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, hsl(142 76% 52%) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-body text-muted-foreground uppercase tracking-widest">Статус</span>
            </div>
            <p className="font-display font-black text-3xl" style={{ color: "hsl(142 76% 52%)" }}>ГЕН ON</p>
            <p className="text-muted-foreground text-sm mt-1">Серия: {user.streak} дней подряд 🔥</p>
          </div>
          <div className="w-16 h-16 rounded-2xl glass-light flex items-center justify-center" style={{ boxShadow: "0 0 20px hsl(142 76% 52% / 0.3)" }}>
            <Icon name="Flame" size={28} style={{ color: "hsl(142 76% 52%)" }} />
          </div>
        </div>
      </button>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Trophy" size={16} style={{ color: "hsl(22 100% 58%)" }} />
            <span className="text-xs text-muted-foreground">Уровень</span>
          </div>
          <p className="font-display font-black text-2xl text-foreground">{user.level}</p>
          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: "65%", background: "hsl(22 100% 58%)" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">65% до уровня 5</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Star" size={16} style={{ color: "hsl(271 90% 70%)" }} />
            <span className="text-xs text-muted-foreground">Баллы</span>
          </div>
          <p className="font-display font-black text-2xl text-foreground">{user.points.toLocaleString("ru")}</p>
          <p className="text-xs text-muted-foreground mt-1">≈ {Math.round(user.points * 0.8)} руб. скидка</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-display">Действия</p>
        {[
          { page: "energy" as Page, icon: "Zap", color: "hsl(22 100% 58%)", title: "Проверить энергию", sub: "Последний тест: сегодня" },
          { page: "typology" as Page, icon: "Brain", color: "hsl(271 90% 70%)", title: "Узнать свой типаж", sub: "Типаж: EN" },
          { page: "referral" as Page, icon: "Users", color: "hsl(195 100% 65%)", title: "Пригласить друга", sub: "Рефералов: 3 • +28% от оплат" },
        ].map((a) => (
          <button key={a.page} className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover-scale text-left transition-all duration-300" style={{ borderColor: `${a.color}25` }} onClick={() => onNavigate(a.page)}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${a.color}18` }}>
              <Icon name={a.icon} size={22} style={{ color: a.color }} />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold text-foreground">{a.title}</p>
              <p className="text-sm text-muted-foreground">{a.sub}</p>
            </div>
            <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-display">Достижения</p>
          <span className="text-xs text-primary">4 / 12</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {[
            { icon: "🔥", label: "7 дней", done: true },
            { icon: "⚡", label: "Первый тест", done: true },
            { icon: "🧠", label: "Типаж", done: true },
            { icon: "👥", label: "Реферал", done: true },
            { icon: "💎", label: "30 дней", done: false },
            { icon: "🌟", label: "VIP", done: false },
          ].map((a, i) => (
            <div key={i} className={`flex-shrink-0 w-16 flex flex-col items-center gap-1 rounded-2xl p-2 glass ${!a.done ? "opacity-40" : ""}`}>
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs text-muted-foreground text-center leading-tight">{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EnergyIntroPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-2xl text-gradient-energy">Три энергии</h1>
        <p className="text-muted-foreground text-sm mt-1">Диагностика твоего состояния прямо сейчас</p>
      </div>
      <div className="flex justify-center">
        <VennDiagram physical={2800} psychic={3200} egregor={2100} />
      </div>
      <div className="space-y-3">
        {[
          { icon: "Dumbbell", color: "hsl(22 100% 58%)", title: "Физическая", desc: "Тело, здоровье, физические силы и витальность" },
          { icon: "Brain", color: "hsl(271 90% 70%)", title: "Психическая", desc: "Эмоции, мышление, ментальная устойчивость" },
          { icon: "Sparkles", color: "hsl(195 100% 65%)", title: "Эгрегориальная", desc: "Связь с миром, смысл, поток событий" },
        ].map((e) => (
          <div key={e.title} className="glass rounded-2xl p-4 flex gap-4 items-start hover-scale" style={{ border: `1px solid ${e.color}25` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${e.color}18` }}>
              <Icon name={e.icon} size={20} style={{ color: e.color }} />
            </div>
            <div>
              <p className="font-display font-bold text-sm" style={{ color: e.color }}>{e.title}</p>
              <p className="text-muted-foreground text-sm">{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-4">
        <p className="text-sm text-muted-foreground text-center">Как зарядка смартфона — без энергии всё замирает. Проверяй ежедневно и управляй состоянием осознанно.</p>
      </div>
      <button className="btn-primary w-full" onClick={onStart}>Перейти к тесту → 12 вопросов</button>
    </div>
  );
}

function EnergyTestPage({ onFinish }: { onFinish: (scores: { physical: number; psychic: number; egregor: number }) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [goodMode, setGoodMode] = useState<boolean | null>(null);

  const q = ENERGY_QUESTIONS[step];
  const progress = (step / ENERGY_QUESTIONS.length) * 100;

  const typeColors: Record<string, string> = {
    physical: "hsl(22 100% 58%)",
    psychic: "hsl(271 90% 70%)",
    egregor: "hsl(195 100% 65%)",
  };
  const typeLabels: Record<string, string> = {
    physical: "Физическая",
    psychic: "Психическая",
    egregor: "Эгрегориальная",
  };

  const handleIntensity = (val: number) => {
    const newAnswers = { ...answers, [q.id]: val };
    setAnswers(newAnswers);
    setGoodMode(null);
    if (step < ENERGY_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const scores = { physical: 0, psychic: 0, egregor: 0 };
      ENERGY_QUESTIONS.forEach((qq) => {
        if (newAnswers[qq.id] !== undefined) scores[qq.type] += newAnswers[qq.id];
      });
      onFinish(scores);
    }
  };

  return (
    <div className="space-y-5 animate-scale-in">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Вопрос {step + 1} из {ENERGY_QUESTIONS.length}</span>
          <span className="text-xs font-display font-bold" style={{ color: typeColors[q.type] }}>{typeLabels[q.type]}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: typeColors[q.type] }} />
        </div>
      </div>

      <div className="glass rounded-3xl p-6 min-h-[140px] flex items-center justify-center" style={{ border: `1px solid ${typeColors[q.type]}30` }}>
        <p className="font-display font-bold text-xl text-center text-foreground leading-tight">{q.text}</p>
      </div>

      {goodMode === null ? (
        <div className="grid grid-cols-2 gap-4">
          <button className="rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-300 hover-scale" style={{ background: "hsl(142 76% 52% / 0.12)", border: "2px solid hsl(142 76% 52% / 0.4)" }} onClick={() => setGoodMode(true)}>
            <span className="text-4xl">😊</span>
            <span className="font-display font-bold text-lg" style={{ color: "hsl(142 76% 52%)" }}>Хорошо</span>
          </button>
          <button className="rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-300 hover-scale" style={{ background: "hsl(0 75% 58% / 0.12)", border: "2px solid hsl(0 75% 58% / 0.4)" }} onClick={() => setGoodMode(false)}>
            <span className="text-4xl">😔</span>
            <span className="font-display font-bold text-lg" style={{ color: "hsl(0 75% 58%)" }}>Плохо</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3 animate-scale-in">
          <p className="text-center text-sm text-muted-foreground">Выбери интенсивность:</p>
          <div className="grid grid-cols-4 gap-2">
            {(goodMode ? GOOD_VALUES : BAD_VALUES).map((v, i) => {
              const labels = goodMode ? ["Чуть", "Неплохо", "Хорошо", "Отлично"] : ["Чуть", "Заметно", "Сильно", "Очень"];
              const color = goodMode ? `hsl(142 76% ${35 + i * 8}%)` : `hsl(0 75% ${65 - i * 5}%)`;
              return (
                <button key={v} className="rounded-2xl p-3 flex flex-col items-center gap-1 transition-all duration-200 hover-scale" style={{ background: `${color}18`, border: `2px solid ${color}50` }} onClick={() => handleIntensity(v)}>
                  <span className="font-display font-black text-base" style={{ color }}>{goodMode ? "+" : ""}{v}</span>
                  <span className="text-xs text-muted-foreground">{labels[i]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function EnergyResultPage({ scores, onRetry, onAction }: { scores: { physical: number; psychic: number; egregor: number }; onRetry: () => void; onAction: () => void }) {
  const total = scores.physical + scores.psychic + scores.egregor;
  const pct = Math.round((total / 12000) * 100);
  const getLevel = (p: number) => {
    if (p >= 80) return { label: "Отличный", color: "hsl(142 76% 52%)" };
    if (p >= 60) return { label: "Хороший", color: "hsl(195 100% 55%)" };
    if (p >= 40) return { label: "Средний", color: "hsl(22 100% 58%)" };
    return { label: "Низкий", color: "hsl(0 75% 58%)" };
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="text-center">
        <h1 className="font-display font-black text-2xl text-gradient-energy">Результат теста</h1>
        <p className="text-muted-foreground text-sm mt-1">Твой энергетический индекс</p>
      </div>
      <div className="flex justify-center">
        <VennDiagram physical={scores.physical} psychic={scores.psychic} egregor={scores.egregor} />
      </div>
      <div className="glass rounded-2xl p-4 text-center">
        <p className="text-4xl font-display font-black text-gradient-primary">{pct}%</p>
        <p className="text-muted-foreground text-sm">Общий индекс • {total} / 12000 баллов</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Физическая", val: scores.physical, color: "hsl(22 100% 58%)" },
          { label: "Психическая", val: scores.psychic, color: "hsl(271 90% 70%)" },
          { label: "Эгрегориальная", val: scores.egregor, color: "hsl(195 100% 65%)" },
        ].map((e) => {
          const ep = Math.round((e.val / 4000) * 100);
          const lv = getLevel(ep);
          return (
            <div key={e.label} className="glass rounded-2xl p-3 text-center">
              <p className="text-xs text-muted-foreground leading-tight mb-1">{e.label}</p>
              <p className="font-display font-black text-xl" style={{ color: e.color }}>{ep}%</p>
              <p className="text-xs mt-0.5" style={{ color: lv.color }}>{lv.label}</p>
            </div>
          );
        })}
      </div>
      <div className="glass rounded-2xl p-4">
        <p className="text-sm text-muted-foreground text-center">Управляй энергией ежедневно — как заряжаешь смартфон. Каждый день новый тест поможет отследить динамику.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button className="btn-secondary" onClick={onRetry}>Пройти заново</button>
        <button className="btn-primary" onClick={onAction}>Начать управлять</button>
      </div>
    </div>
  );
}

function GenOnPage() {
  const steps = [
    { icon: "☀️", title: "Проснуться", desc: "Утром, первые минуты дня — самые важные" },
    { icon: "⚪", title: "Обнулиться", desc: "Отпусти всё из вчера. Чистый лист" },
    { icon: "🎯", title: "Поставить цели", desc: "День, неделя, месяц, год, 5 лет, жизнь" },
    { icon: "❤️", title: "Получить отклик", desc: "Прочувствуй эмоциональный отклик от целей" },
    { icon: "🔊", title: "Зафиксировать", desc: "Произнеси 7 раз: «Включаю Ген» или «Ген ON»" },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-1.5 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-display uppercase tracking-widest" style={{ color: "hsl(142 76% 52%)" }}>Механизм активации</span>
        </div>
        <h1 className="font-display font-black text-3xl" style={{ color: "hsl(142 76% 52%)" }}>Ген ON</h1>
        <p className="text-muted-foreground text-sm mt-1">Ритуал включения на максимум</p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-6 bottom-6 w-0.5" style={{ background: "linear-gradient(to bottom, hsl(142 76% 52% / 0.4), hsl(271 90% 65% / 0.4))" }} />
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={i} className="relative flex gap-4 items-start animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-16 h-16 rounded-2xl glass flex-shrink-0 flex items-center justify-center text-2xl z-10">{s.icon}</div>
              <div className="glass rounded-2xl p-4 flex-1">
                <p className="font-display font-bold text-foreground">{s.title}</p>
                <p className="text-muted-foreground text-sm mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl p-6 text-center" style={{ border: "1px solid hsl(142 76% 52% / 0.3)", boxShadow: "0 0 40px hsl(142 76% 52% / 0.08)" }}>
        <p className="font-display font-black text-2xl" style={{ color: "hsl(142 76% 52%)" }}>«Включаю Ген»</p>
        <p className="text-muted-foreground text-sm mt-2">Произноси 7 раз с чувством каждое утро</p>
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-8 h-8 rounded-xl glass-light flex items-center justify-center">
              <span className="text-xs font-display font-bold text-primary">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-4" style={{ border: "1px solid hsl(0 75% 58% / 0.2)" }}>
        <div className="flex items-start gap-3">
          <Icon name="AlertCircle" size={18} style={{ color: "hsl(0 75% 65%)" }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-bold text-sm text-foreground">При сбое</p>
            <p className="text-muted-foreground text-sm">Вспомни слово-триггер и верни состояние. Практика возвращает силу.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypologyPage() {
  const [stage, setStage] = useState<"intro" | "test1" | "test2" | "result">("intro");
  const [t1Answers, setT1Answers] = useState<string[]>([]);
  const [t2Answers, setT2Answers] = useState<string[]>([]);
  const [t1Step, setT1Step] = useState(0);
  const [t2Step, setT2Step] = useState(0);

  const getEI = () => {
    const e = t1Answers.filter((a) => a === "E").length;
    return e > t1Answers.length / 2 ? "E" : "I";
  };

  const getChannel = () => {
    const counts: Record<string, number> = { N: 0, F: 0, T: 0, S: 0 };
    t2Answers.forEach((a) => { if (counts[a] !== undefined) counts[a]++; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N";
  };

  const typology = stage === "result" ? `${getEI()}${getChannel()}` : null;

  const typeDescriptions: Record<string, { label: string; desc: string; color: string }> = {
    EN: { label: "Визионер", desc: "Экстраверт-интуит. Видишь будущее, вдохновляешь других, генерируешь идеи.", color: "hsl(195 100% 65%)" },
    EF: { label: "Энерджайзер", desc: "Экстраверт-чувствующий. Тепло, эмпатия, умеешь создавать атмосферу.", color: "hsl(22 100% 58%)" },
    ET: { label: "Командир", desc: "Экстраверт-логик. Структура, решения, эффективность в действии.", color: "hsl(271 90% 70%)" },
    ES: { label: "Деятель", desc: "Экстраверт-сенсорик. Практичность, результат, здесь и сейчас.", color: "hsl(142 76% 52%)" },
    IN: { label: "Мечтатель", desc: "Интроверт-интуит. Глубина, концепции, внутреннее видение.", color: "hsl(195 100% 65%)" },
    IF: { label: "Гармонист", desc: "Интроверт-чувствующий. Искренность, ценности, внутренний мир.", color: "hsl(22 100% 58%)" },
    IT: { label: "Аналитик", desc: "Интроверт-логик. Точность, системность, независимость.", color: "hsl(271 90% 70%)" },
    IS: { label: "Хранитель", desc: "Интроверт-сенсорик. Надёжность, традиции, стабильность.", color: "hsl(142 76% 52%)" },
  };

  const channelLabels: Record<string, string> = { N: "Интуит", F: "Чувствующий", T: "Логик", S: "Сенсорик" };

  if (stage === "intro") return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-2xl text-gradient-primary">Узнай свой типаж</h1>
        <p className="text-muted-foreground text-sm mt-1">Типология личности в системе GenOffOn</p>
      </div>
      <div className="glass rounded-3xl p-5" style={{ border: "1px solid hsl(271 90% 65% / 0.2)" }}>
        <p className="text-foreground font-body leading-relaxed">Типаж — это твой код взаимодействия с миром. Помогает понять, как ты черпаешь энергию, принимаешь решения и строишь отношения.</p>
        <div className="mt-4 space-y-2">
          {[["1", "Тест на экстраверсию — 3 вопроса"], ["2", "Тест на канал взаимодействия — 5 вопросов"], ["✓", "Получи код личности (EN, EF, IT...)" ]].map(([n, t]) => (
            <div key={n} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl glass-light flex items-center justify-center text-sm font-display font-bold text-primary">{n}</div>
              <span className="text-sm text-foreground">{t}</span>
            </div>
          ))}
        </div>
      </div>
      <button className="btn-primary w-full" onClick={() => setStage("test1")}>Начать тест</button>
    </div>
  );

  if (stage === "test1") {
    const q = TYPOLOGY_Q1[t1Step];
    return (
      <div className="space-y-5 animate-scale-in">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-muted-foreground">Часть 1: Экстраверсия</span>
            <span className="text-xs font-display text-primary">{t1Step + 1} / {TYPOLOGY_Q1.length}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${((t1Step) / TYPOLOGY_Q1.length) * 100}%` }} />
          </div>
        </div>
        <div className="glass rounded-3xl p-6 min-h-[120px] flex items-center justify-center">
          <p className="font-display font-bold text-xl text-center">{q.text}</p>
        </div>
        <div className="space-y-3">
          {q.options.map((opt) => (
            <button key={opt.val} className="w-full glass rounded-2xl p-4 text-left hover-scale transition-all" onClick={() => {
              const next = [...t1Answers, opt.val];
              setT1Answers(next);
              if (t1Step < TYPOLOGY_Q1.length - 1) setT1Step(t1Step + 1);
              else setStage("test2");
            }}>
              <span className="text-foreground font-body">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "test2") {
    const q = TYPOLOGY_Q2[t2Step];
    return (
      <div className="space-y-5 animate-scale-in">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-muted-foreground">Часть 2: Канал взаимодействия</span>
            <span className="text-xs font-display" style={{ color: "hsl(195 100% 65%)" }}>{t2Step + 1} / {TYPOLOGY_Q2.length}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((t2Step) / TYPOLOGY_Q2.length) * 100}%`, background: "hsl(195 100% 55%)" }} />
          </div>
        </div>
        <div className="glass rounded-3xl p-6 min-h-[100px] flex items-center justify-center">
          <p className="font-display font-bold text-xl text-center">{q.text}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt) => (
            <button key={opt.val} className="glass rounded-2xl p-4 text-center hover-scale transition-all" onClick={() => {
              const next = [...t2Answers, opt.val];
              setT2Answers(next);
              if (t2Step < TYPOLOGY_Q2.length - 1) setT2Step(t2Step + 1);
              else setStage("result");
            }}>
              <span className="text-foreground font-body text-sm">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "result" && typology) {
    const td = typeDescriptions[typology] || { label: "Уникальный", desc: "Редкое сочетание качеств.", color: "hsl(271 90% 70%)" };
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-2">Твой типаж</p>
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl mb-3" style={{ background: `${td.color}18`, border: `2px solid ${td.color}60`, boxShadow: `0 0 30px ${td.color}30` }}>
            <span className="font-display font-black text-5xl" style={{ color: td.color }}>{typology}</span>
          </div>
          <h1 className="font-display font-black text-3xl text-foreground">{td.label}</h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">{td.desc}</p>
        </div>
        <div className="glass rounded-2xl p-4 flex items-center gap-3" style={{ border: `1px solid ${td.color}25` }}>
          <span className="font-display font-black text-4xl" style={{ color: td.color }}>{typology[0]}</span>
          <div>
            <p className="font-display font-bold text-sm text-foreground">{typology[0] === "E" ? "Экстраверт" : "Интроверт"}</p>
            <p className="text-xs text-muted-foreground">{typology[0] === "E" ? "Черпаешь энергию из общения" : "Черпаешь энергию из уединения"}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-4 flex items-center gap-3" style={{ border: `1px solid ${td.color}25` }}>
          <span className="font-display font-black text-4xl" style={{ color: td.color }}>{typology[1]}</span>
          <div>
            <p className="font-display font-bold text-sm text-foreground">{channelLabels[typology[1]] ?? "—"}</p>
            <p className="text-xs text-muted-foreground">Канал восприятия информации</p>
          </div>
        </div>
        <button className="btn-secondary w-full" onClick={() => { setStage("intro"); setT1Answers([]); setT2Answers([]); setT1Step(0); setT2Step(0); }}>Пройти заново</button>
        <button className="btn-primary w-full">Получить расширенный разбор (VIP)</button>
      </div>
    );
  }

  return null;
}

function HistoryPage() {
  const data = [
    { date: "28 фев", total: 78, physical: 75, psychic: 82, egregor: 70 },
    { date: "27 фев", total: 65, physical: 60, psychic: 70, egregor: 55 },
    { date: "26 фев", total: 85, physical: 88, psychic: 80, egregor: 88 },
    { date: "25 фев", total: 72, physical: 68, psychic: 78, egregor: 65 },
    { date: "24 фев", total: 58, physical: 55, psychic: 62, egregor: 52 },
    { date: "23 фев", total: 90, physical: 92, psychic: 88, egregor: 90 },
    { date: "22 фев", total: 76, physical: 70, psychic: 80, egregor: 72 },
  ];
  const avg = Math.round(data.reduce((s, d) => s + d.total, 0) / data.length);
  const max = Math.max(...data.map((d) => d.total));

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-2xl text-gradient-primary">История</h1>
        <p className="text-muted-foreground text-sm mt-1">Динамика твоей энергии</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Средний индекс</p>
          <p className="font-display font-black text-3xl text-gradient-primary">{avg}%</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Лучший результат</p>
          <p className="font-display font-black text-3xl" style={{ color: "hsl(142 76% 52%)" }}>{max}%</p>
        </div>
      </div>
      <div className="glass rounded-2xl p-4">
        <p className="text-xs text-muted-foreground mb-3 font-display uppercase tracking-wider">7 дней</p>
        <div className="flex items-end gap-1.5 h-28">
          {data.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg" style={{ height: `${d.total}%`, background: "linear-gradient(to top, hsl(271 90% 65%), hsl(195 100% 55%))", opacity: 0.85 }} />
              <span style={{ fontSize: 9 }} className="text-muted-foreground">{d.date.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="glass rounded-xl p-3 flex items-center gap-3">
            <div className="text-xs text-muted-foreground w-12 flex-shrink-0">{d.date}</div>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${d.total}%`, background: d.total >= 80 ? "hsl(142 76% 52%)" : d.total >= 60 ? "hsl(195 100% 55%)" : "hsl(22 100% 58%)" }} />
            </div>
            <span className="font-display font-bold text-sm text-foreground w-10 text-right">{d.total}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubscriptionPage() {
  const [selected, setSelected] = useState("start");
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-2xl text-gradient-primary">Подписка</h1>
        <p className="text-muted-foreground text-sm mt-1">Открой полный доступ к GenOffOn</p>
      </div>
      <div className="glass rounded-2xl p-4">
        <p className="font-display font-bold text-sm text-foreground mb-2">VIP открывает:</p>
        <div className="space-y-2">
          {["Типажи всех пользователей", "Расширенные материалы", "Персональный разбор", "Приоритетная поддержка"].map((f) => (
            <div key={f} className="flex items-center gap-2">
              <Icon name="Check" size={14} style={{ color: "hsl(142 76% 52%)" }} />
              <span className="text-sm text-foreground">{f}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {SUBSCRIPTIONS.map((sub) => (
          <button key={sub.id} className="w-full glass rounded-2xl p-4 text-left transition-all duration-300 hover-scale" style={selected === sub.id ? { borderColor: sub.color, borderWidth: 2, boxShadow: `0 0 20px ${sub.color}25` } : {}} onClick={() => setSelected(sub.id)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: sub.color }}>
                  {selected === sub.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: sub.color }} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-foreground">{sub.label}</span>
                    {sub.badge && <span className="text-xs px-2 py-0.5 rounded-full font-body" style={{ background: `${sub.color}20`, color: sub.color }}>{sub.badge}</span>}
                  </div>
                  <span className="text-xs text-muted-foreground">{sub.period}</span>
                </div>
              </div>
              <span className="font-display font-black text-xl text-foreground">{sub.price.toLocaleString("ru")} ₽</span>
            </div>
          </button>
        ))}
      </div>
      <div className="glass rounded-xl p-3 flex items-center gap-3" style={{ border: "1px solid hsl(142 76% 52% / 0.2)" }}>
        <Icon name="Star" size={16} style={{ color: "hsl(271 90% 70%)" }} />
        <p className="text-xs text-muted-foreground">У тебя <span className="text-foreground font-bold">2840 баллов</span> — можно оплатить до 80% стоимости</p>
      </div>
      <button className="btn-primary w-full">Оформить подписку</button>
    </div>
  );
}

function ReferralPage() {
  const refCode = "ALEX-GEN7";
  const refs = [
    { name: "Михаил К.", level: 1, earned: 700 },
    { name: "Екатерина М.", level: 1, earned: 420 },
    { name: "Андрей В.", level: 2, earned: 210 },
    { name: "Ольга П.", level: 2, earned: 180 },
    { name: "Дмитрий Н.", level: 3, earned: 90 },
  ];
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-2xl text-gradient-primary">Реферальная программа</h1>
        <p className="text-muted-foreground text-sm mt-1">Приглашай друзей — получай баллы</p>
      </div>
      <div className="glass rounded-2xl p-5 text-center" style={{ border: "1px solid hsl(195 100% 55% / 0.3)" }}>
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-display">Твой реферальный код</p>
        <div className="flex items-center justify-center gap-3">
          <span className="font-display font-black text-3xl text-gradient-primary">{refCode}</span>
          <button className="glass-light rounded-xl p-2 hover-scale">
            <Icon name="Copy" size={18} style={{ color: "hsl(195 100% 65%)" }} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { val: "10%", label: "1 линия", color: "hsl(195 100% 65%)" },
          { val: "3%", label: "2–7 линии", color: "hsl(271 90% 70%)" },
          { val: "28%", label: "Итого", color: "hsl(142 76% 52%)" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-3">
            <p className="font-display font-black text-xl" style={{ color: s.color }}>{s.val}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-display">Моя команда ({refs.length})</p>
        {refs.map((r, i) => (
          <div key={i} className="glass rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-light flex items-center justify-center font-display font-bold text-foreground">{r.name[0]}</div>
            <div className="flex-1">
              <p className="text-sm font-body text-foreground">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.level} линия</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-display font-bold" style={{ color: "hsl(142 76% 52%)" }}>+{r.earned}</p>
              <p className="text-xs text-muted-foreground">баллов</p>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-primary w-full">Поделиться ссылкой</button>
    </div>
  );
}

function ProfilePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-black text-2xl text-gradient-primary">Профиль</h1>
        <button className="glass-light rounded-xl p-2 hover-scale" onClick={() => onNavigate("admin")}>
          <Icon name="Settings" size={18} className="text-muted-foreground" />
        </button>
      </div>
      <div className="glass rounded-3xl p-5 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3">
          <span className="font-display font-black text-3xl text-white">А</span>
        </div>
        <h2 className="font-display font-black text-xl text-foreground">Александр Петров</h2>
        <p className="text-muted-foreground text-sm mt-1">Предприниматель • Москва</p>
        <div className="flex justify-center gap-2 mt-3 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-display font-bold" style={{ background: "hsl(271 90% 65% / 0.15)", color: "hsl(271 90% 75%)" }}>EN</span>
          <span className="px-3 py-1 rounded-full text-xs font-display font-bold" style={{ background: "hsl(195 100% 55% / 0.15)", color: "hsl(195 100% 65%)" }}>ENEF</span>
          <span className="px-3 py-1 rounded-full text-xs font-display font-bold" style={{ background: "hsl(142 76% 52% / 0.15)", color: "hsl(142 76% 65%)" }}>Уровень 4</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[{ val: "47", label: "Тестов" }, { val: "7", label: "Дней серия" }, { val: "2840", label: "Баллов" }].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-3">
            <p className="font-display font-black text-xl text-foreground">{s.val}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-4 space-y-1">
        {[
          { icon: "Bell", label: "Уведомления", desc: "08:00, 13:00, 18:00" },
          { icon: "Crown", label: "Подписка", desc: "Free → обновить до VIP" },
          { icon: "Share2", label: "Соцсети", desc: "Добавить профили" },
          { icon: "LogOut", label: "Выйти", desc: "" },
        ].map((item) => (
          <button key={item.label} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-all text-left">
            <Icon name={item.icon} size={18} className="text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-body text-foreground">{item.label}</p>
              {item.desc && <p className="text-xs text-muted-foreground">{item.desc}</p>}
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}

function AdminPage() {
  const stats = [
    { label: "Пользователей", val: "1 247", icon: "Users", color: "hsl(195 100% 65%)" },
    { label: "VIP подписок", val: "89", icon: "Crown", color: "hsl(271 90% 70%)" },
    { label: "Конверсия", val: "7.1%", icon: "TrendingUp", color: "hsl(142 76% 52%)" },
    { label: "Ср. энергия", val: "71%", icon: "Zap", color: "hsl(22 100% 58%)" },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <div className="inline-flex items-center gap-2 glass-light rounded-full px-3 py-1 mb-2">
          <Icon name="Shield" size={12} style={{ color: "hsl(271 90% 70%)" }} />
          <span className="text-xs font-display text-primary uppercase tracking-widest">Админ-панель</span>
        </div>
        <h1 className="font-display font-black text-2xl text-foreground">Управление</h1>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name={s.icon} size={16} style={{ color: s.color }} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="font-display font-black text-2xl text-foreground">{s.val}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[
          { icon: "Users", label: "Пользователи", desc: "Просмотр, блокировка, редактирование" },
          { icon: "Crown", label: "Подписки", desc: "Цены, активация, деактивация" },
          { icon: "Package", label: "Пакеты", desc: "Создание и редактирование" },
          { icon: "GitBranch", label: "Реферальная структура", desc: "Просмотр связей" },
          { icon: "Star", label: "Начисление баллов", desc: "Корректировка счетов" },
          { icon: "BarChart2", label: "Статистика", desc: "Регистрации, конверсия, тренды" },
        ].map((item) => (
          <button key={item.label} className="w-full glass rounded-xl p-4 flex items-center gap-3 hover-scale transition-all text-left">
            <div className="w-10 h-10 rounded-xl glass-light flex items-center justify-center flex-shrink-0">
              <Icon name={item.icon} size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [energyScores, setEnergyScores] = useState({ physical: 0, psychic: 0, egregor: 0 });

  const activeNav: Page = ["energy", "energy-test", "energy-result", "gen-on"].includes(page)
    ? "energy"
    : ["home", "typology", "history", "profile"].includes(page)
    ? page as Page
    : "home";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-28">
        {page === "home" && <HomePage onNavigate={setPage} />}
        {page === "energy" && <EnergyIntroPage onStart={() => setPage("energy-test")} />}
        {page === "energy-test" && (
          <EnergyTestPage onFinish={(scores) => { setEnergyScores(scores); setPage("energy-result"); }} />
        )}
        {page === "energy-result" && (
          <EnergyResultPage scores={energyScores} onRetry={() => setPage("energy-test")} onAction={() => setPage("gen-on")} />
        )}
        {page === "gen-on" && <GenOnPage />}
        {page === "typology" && <TypologyPage />}
        {page === "history" && <HistoryPage />}
        {page === "subscription" && <SubscriptionPage />}
        {page === "referral" && <ReferralPage />}
        {page === "profile" && <ProfilePage onNavigate={setPage} />}
        {page === "admin" && <AdminPage />}
      </div>

      {page !== "energy-test" && (
        <BottomNav current={activeNav} onChange={setPage} />
      )}
    </div>
  );
}
