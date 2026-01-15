# 🎮 Каталог Игр

Каталог видеоигр с поиском и фильтрацией. Nuxt 4 + Vue 3 + TypeScript + Design Tokens.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.2.2-00DC82)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5.26-4FC08D)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://www.typescriptlang.org)
[![Design Tokens](https://img.shields.io/badge/Design-Tokens-1572B6)](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 🚀 Запуск

```bash
# Установка зависимостей
npm install

# Настройка переменных окружения
cp example.env .env
# Или переименуйте example.env в .env

# Переменные окружения содержат:
# - RAWG_API_KEY: API ключ для RAWG (бесплатный)
# - RAW_URL: URL RAWG API
# Можно использовать предоставленный ключ или получить свой

# Запуск в режиме разработки
npm run dev
# http://localhost:3000

# Другие режимы
npm run build:ssr     # SSR билд
npm run build:spa     # SPA билд
npm run build:static  # Static генерация
```

### Очистка кэша (при проблемах)
```bash
# Остановить все процессы Node.js
# Удалить директорию .nuxt
rm -rf .nuxt
rm -rf node_modules/.cache

# Перезапустить
npm run dev
```

## 🏗️ Архитектура

```
/
├── assets/css/           # Глобальные стили
│   └── main.css         # Основной CSS с переменными
├── pages/               # Роутинг (index.vue, games/[id].vue)
├── components/          # Vue компоненты
│   ├── Base/            # Базовые переиспользуемые компоненты
│   │   ├── Alert.vue    # Компонент уведомлений
│   │   ├── Button.vue   # Кнопка с вариантами стилей
│   │   ├── Input.vue    # Input с иконкой поиска
│   │   ├── Select.vue   # Select с валидацией
│   │   └── SkeletonLoader.vue # Прелоадер с анимацией
│   ├── GameCard.vue     # Карточка игры
│   ├── GameFilters.vue  # Фильтры с URL-синхронизацией
│   ├── SearchBar.vue    # Компонент поиска
│   ├── Rating.vue       # Рейтинг с звездами
│   └── Icon/            # Иконки
├── composables/         # Vue composables
│   ├── games.ts         # Pinia store для игр
│   └── index.ts         # Экспорт composables
├── lib/                 # Утилиты
│   └── errorMessages.ts # Константы ошибок
├── plugins/             # Nuxt плагины
│   └── pinia-persistedstate.client.ts # Персистентность store
├── server/api/          # API маршруты
│   └── games.get.ts     # REST эндпоинты
├── types/               # TypeScript типы
│   └── game.ts          # Интерфейсы Game, GameDetail
├── layouts/             # Макеты страниц
│   └── default.vue      # Основной layout
└── public/              # Статические файлы
    └── games.json       # Данные игр
```

## 🎯 Функционал

### Поиск и фильтрация
- **Поиск** по названию/жанру/разработчику (case-insensitive)
- **Фильтры** по жанру/платформе
- **URL-персистентность**: Сохранение состояния поиска и фильтров в URL-параметрах (`?search=zelda&genre=rpg&platform=pc`)

### Страница товара
- **Динамическая загрузка** из RAWG API
- **Кэширование** в Pinia store (localStorage)
- **BaseAlert компонент** для отображения ошибок с кнопкой "Попробовать снова"
- **Скриншоты** и метаданные

## 🛠️ Технические фичи

### State Management
```typescript
// Pinia store с персистентностью
persist: {
  storage: localStorage,
  paths: ['games', 'gameDetails', 'filters']
}
```

### SSR/SSG/SPA
- **SSR** - серверный рендеринг для SEO
- **SPA** - клиентская навигация
- **Static** - предварительная генерация

### Бизнес-логика

#### Поиск
```typescript
// Поиск работает напрямую через store с синхронизацией URL
const performSearch = () => {
  const searchTerm = searchQuery.value.trim()
  // Обновляем store напрямую
  gamesStore.setFilters({
    ...gamesStore.filters,
    search: searchTerm
  })
  // Синхронизируем URL
  router.replace({ path: '/', query: { ...query, search: searchTerm } })
}
```

#### Обработка ошибок
```typescript
// Двухуровневая система ошибок
const UI_ERROR_MESSAGES = {
  GAMES_LOAD_FAILED: 'Unable to load the game catalog...',
  GAME_LOAD_FAILED: 'Unable to load game details...'
}

const CONSOLE_ERROR_MESSAGES = {
  GAMES_LOAD_FAILED: 'Failed to fetch games from API',
  GAME_API_ERROR: 'RAWG API returned an error...'
}
```

#### Фильтрация
```typescript
// Каскадная фильтрация с сохранением всех фильтров в URL
if (filters.search) games = games.filter(g =>
  g.title.toLowerCase().includes(filters.search.toLowerCase()) ||
  g.genre.toLowerCase().includes(filters.search.toLowerCase())
)
if (filters.genre) games = games.filter(g => g.genre === filters.genre)
if (filters.platform) games = games.filter(g => g.platform === filters.platform)

router.push({ query: filters })
```

#### Кэширование
```typescript
// Кэш в Pinia store + localStorage
async fetchGameDetail(id: number) {
  if (this.gameDetails[id]) return this.gameDetails[id] // Кэш hit

  const data = await $fetch(`https://api.rawg.io/api/games/${id}`)
  this.gameDetails[id] = data // Кэш set
  return data
}
```

### Система дизайна

#### 🎨 Design Tokens (Система токенов)
Проект использует **централизованную систему дизайн-токенов** на базе CSS Variables:

**Цветовые токены:**
- `--color-gray-50` до `--color-gray-900` - полная шкала серых цветов
- `--color-blue-*`, `--color-red-*`, `--color-green-*` - брендовые цвета
- `--color-text-primary`, `--color-text-secondary` - семантические цвета текста
- `--color-bg-*` - фоновые цвета

**Пространственные токены:**
- `--space-0` до `--space-16` - 8px система отступов (4px, 8px, 12px, 16px, 20px, 24px, 32px, 64px)

**Расположение токенов:** `assets/css/main.css` (секция `:root`)

**Примеры использования:**
```css
/* Вместо жестких значений */
padding: 16px;
color: #3b82f6;

/* Используем токены */
padding: var(--space-4);
color: var(--color-blue-500);
```

#### 🎯 Преимущества системы токенов
- **Единообразие** - все компоненты используют одинаковые цвета и отступы
- **Легкая кастомизация** - изменение одного токена влияет на весь проект
- **Type safety** - токены документированы и предсказуемы
- **Поддерживаемость** - изменения дизайна в одном месте
- **Масштабируемость** - легко добавить новые токены и темы

**Пример изменения темы:**
```css
/* Изменение цветовой схемы */
:root {
  --color-blue-500: #8b5cf6; /* Изменяем синий на фиолетовый */
  --space-4: 20px; /* Увеличиваем стандартный отступ */
}
```

## 🛠️ Технологии

- **Nuxt 4** + **Vue 3** + **TypeScript**
- **Design Tokens (CSS Variables)**
- **Pinia** + **localStorage**
- **RAWG API**
- **ESLint/Prettier**
- **Модульная архитектура**
