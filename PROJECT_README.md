# Flow Intel — Crypto Analytics Dashboard

## 📋 Описание проекта

Flow Intel — это аналитическая платформа для криптовалютного рынка, которая объединяет on-chain данные, smart money активность и market signals в единый decision-making интерфейс.

### Ключевая концепция продукта

```
Market = Action (что делать сейчас?)
Token = Validation (подтверждается ли сигнал структурой?)
Entities = Attribution (кто стоит за движением?)
Graph = Discovery (что ещё связано?)
```

---

## 🏗 Архитектура

### Tech Stack
- **Frontend:** React 18, Tailwind CSS, Recharts, Radix UI, Lucide Icons
- **Backend:** FastAPI, Python 3.11
- **Database:** MongoDB
- **UI Components:** Shadcn/UI

### Структура проекта
```
/app/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── public/
│   │   └── assets/
│   │       └── logo.png
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── components/
│       │   ├── ui/           # Shadcn components
│       │   ├── Header.jsx
│       │   ├── AlertModal.jsx
│       │   ├── MarketSignalCard.jsx
│       │   ├── MarketDislocationCard.jsx
│       │   ├── SmartMoneySnapshot.jsx
│       │   ├── SmartMoneyModal.jsx
│       │   ├── NarrativesSidebar.jsx
│       │   ├── NarrativesModal.jsx
│       │   └── ...
│       └── pages/
│           ├── ArkhamHome.jsx      # Market page
│           ├── TokensPage.jsx      # Token page
│           ├── EntitiesPage.jsx
│           ├── WalletsPage.jsx
│           └── ...
└── memory/
    └── PRD.md
```

---

## 🎨 Дизайн-система

### Цветовая палитра
- **Фон:** Белый (#FFFFFF)
- **Текст:** Чёрный/серый (#111827, #374151, #6B7280)
- **Акценты:** Только серый (монохром), никаких "rainbow" цветов
- **Границы:** Светло-серые (#E5E7EB, #F3F4F6)

### Иконки
- **Библиотека:** Lucide React (только монохромные)
- **❌ Запрещено:** Эмодзи, цветные иконки, 3D иконки

### Кнопки
- **Скругление:** `rounded-xl` или `rounded-2xl`
- **Стиль:** Минималистичный, без градиентов
- **Primary:** `bg-gray-900 text-white`
- **Secondary:** `bg-white border border-gray-200`

### Модальные окна
- **Скругление:** `rounded-2xl` или `rounded-3xl`
- **Фон:** Белый с backdrop blur
- **Закрытие:** Иконка X из Lucide (не эмодзи)

---

## 📱 Страницы

### 1. Market (главная) — `/`

**Роль:** Отвечает на вопрос "Что делать прямо сейчас?"

**Структура:**
```
┌─────────────────────────────────────────────────────┐
│ Market Context: Risk-On (78%) — status bar          │
├─────────────────────────┬───────────────────────────┤
│ LEFT (50%)              │ RIGHT (50%)               │
│ • Market Signal Card    │ • Edge Detected           │
│ • Flow Anomalies Chart  │ • Smart Money + Narratives│
│                         │ • Quick Actions           │
└─────────────────────────┴───────────────────────────┘
```

**Компоненты:**
- `MarketRegimeLayer` — статус-бар с контекстом рынка
- `MarketSignalCard` — главный сигнал (Bullish/Bearish/Neutral)
- `FlowAnomaliesChart` — график аномалий
- `MarketDislocationCard` — Edge detection
- `SmartMoneySnapshot` — топ smart money активность
- `NarrativesSidebar` — топ нарративы
- `QuickActions` — быстрые действия

### 2. Token — `/tokens`

**Роль:** Отвечает на вопрос "Подтверждает ли структура токена сигнал?"

**Это НЕ сигнал, а validation layer.**

**Структура:**
```
┌─────────────────────────────────────────────────────┐
│ Token Selector: BTC | ETH | SOL | BNB | XRP | ADA   │
├─────────────────────────────────────────────────────┤
│ ETH | $3,342 +3.8%                                  │
│ Market Signal: Bullish (57%) → Structure supports   │
├─────────────────────────────────────────────────────┤
│ TOKEN STRUCTURE ASSESSMENT                          │
│ ✓ Smart money: Accumulating                         │
│ ✓ Holders: Strong hands increasing                  │
│ ✓ Market behavior: Whale & inst. buying             │
│ ⚠ Risk: Short-term retail selling                   │
│                                                     │
│ STRUCTURE VERDICT                                   │
│ Supports current Market Signal                      │
│ Durability: Mid-term (1–3 weeks)                    │
│ Confidence: Medium–High                             │
│ [Create Token Alert] [View Related Entities]        │
├─────────────────────────┬───────────────────────────┤
│ LEFT (60%)              │ RIGHT (40%)               │
│ • Holder Composition    │ • Buy/Sell Pressure       │
│   + Interpretation      │   + Interpretation        │
│ • Holding Duration      │ • Trade Size Breakdown    │
│ • Supply Flow Map       │   (кликабельный)          │
│   + Net Effect          │ • Suggested Strategies    │
│                         │   (условные)              │
├─────────────────────────┴───────────────────────────┤
│ [▼ OI & Volume Correlations] — collapsible          │
└─────────────────────────────────────────────────────┘
```

**Ключевые блоки:**

1. **Token Structure Assessment** — главный блок валидации
   - 3 фиксированных подпункта с checkmarks
   - Risk warning
   - Structure Verdict + Durability + Confidence
   - CTA кнопки

2. **Holder Composition** — кто держит токен
   - Strong Hands %
   - Таблица по типам (CEX, Smart Money, Funds, Retail, Contracts, Bridges)
   - **Interpretation line** — вывод одной строкой

3. **Buy/Sell Pressure** — давление на рынке
   - Buy Pressure %
   - Net Flow
   - **Interpretation line**

4. **Trade Size Breakdown** — кто торгует
   - Retail / Active / Pro / Inst. / Whale
   - **Кликабельный** — ведёт на соответствующие entities/wallets

5. **Supply Flow Map** — куда текут токены
   - Mint/Burn, LP Flow, Bridge Flow
   - **Net Effect line**

6. **Suggested Strategies** — рекомендации
   - **Условные** — показывают на чём основаны (Based on: ✓ Smart money accumulation...)

7. **Correlation** — collapsible, research-only

### 3. Entities — `/entities`
- Список институциональных игроков
- Smart money wallets
- Exchanges & Funds

### 4. Wallets — `/wallets`
- Анализ кошельков
- История транзакций

### 5. Watchlist — `/watchlist`
- Отслеживаемые адреса

### 6. Alerts — `/alerts`
- Настроенные алерты

---

## 🔧 Ключевые изменения (текущая сессия)

### Навигация
- ❌ Убран пункт "Strategies" из меню
- ✅ Strategies интегрированы в Token page как "Suggested Strategies"

### Token Page — полный редизайн
1. **Token Structure Assessment** — новый главный блок
2. **Market Context Link** — связь с Market Signal
3. **Interpretation lines** — во всех блоках
4. **Trade Size Breakdown** — стал кликабельным
5. **Suggested Strategies** — стали условными
6. **Correlation** — collapsible по умолчанию

### Стилизация
1. **AlertModal** — Radix UI Select вместо native
2. **Все модалы** — монохромный дизайн
3. **Иконки** — lucide-react вместо эмодзи
4. **Статусы** — серые вместо цветных

---

## 📦 Зависимости

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "recharts": "^2.x",
    "@radix-ui/react-select": "^2.x",
    "@radix-ui/react-dialog": "^1.x",
    "@radix-ui/react-tooltip": "^1.x",
    "lucide-react": "^0.x",
    "tailwindcss": "^3.x",
    "axios": "^1.x",
    "sonner": "^1.x"
  }
}
```

### Backend (requirements.txt)
```
fastapi
uvicorn
pymongo
python-dotenv
```

---

## 🚀 Запуск

### Development
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend
cd frontend
yarn install
yarn start
```

### Environment Variables
```
# frontend/.env
REACT_APP_BACKEND_URL=http://localhost:8001

# backend/.env
MONGO_URL=mongodb://localhost:27017
DB_NAME=flow_intel
```

---

## 📝 TODO / Roadmap

### P1 — High Priority
- [ ] Интеграция с реальными данными (API)
- [ ] Entities page редизайн
- [ ] Wallets page редизайн

### P2 — Medium Priority
- [ ] Mobile responsive
- [ ] Dark mode
- [ ] Real-time updates (WebSocket)

### P3 — Future
- [ ] Graph visualization
- [ ] Portfolio tracking
- [ ] Custom alerts logic

---

## 📸 Скриншоты

### Market Page
- Market Signal как главный decision point
- Two-column layout 50/50
- Монохромный дизайн

### Token Page
- Token Structure Assessment — центр страницы
- Structural verdict вместо signal
- Interpretation lines в каждом блоке
- Suggested Strategies с условиями

---

## 👤 Автор

Flow Intel Team

## 📄 Лицензия

MIT
