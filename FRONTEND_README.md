# Team Maker Frontend

Modern React frontend for Team Maker platform built with Vite, React Router, and TailwindCSS.

## Быстрый старт

```bash
# Перейти в папку frontend
cd frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

Приложение будет доступно на http://localhost:5173

## Требования

- Node.js 18+ и npm
- Backend сервер запущен на http://localhost:8500

## Технологии

- **React 19** - UI библиотека
- **Vite** - Быстрый сборщик
- **React Router** - Маршрутизация
- **TailwindCSS** - CSS фреймворк
- **Axios** - HTTP клиент
- **Context API** - Управление состоянием

## Структура проекта

```
frontend/
├── src/
│   ├── components/        # Переиспользуемые компоненты
│   │   ├── layout/       # Layout компоненты (Navbar, Layout)
│   │   ├── ProjectCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/          # React Context (AuthContext)
│   ├── pages/            # Страницы приложения
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Users.jsx
│   │   ├── CreateProject.jsx
│   │   ├── ProjectDetails.jsx
│   │   └── MyProjects.jsx
│   ├── services/         # API сервисы
│   │   └── api.js
│   ├── utils/            # Утилиты и константы
│   ├── App.jsx           # Главный компонент с роутингом
│   ├── main.jsx          # Точка входа
│   └── index.css         # Глобальные стили с Tailwind
├── public/               # Статические файлы
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Основные функции

### Страницы

1. **Home** - Просмотр всех проектов с поиском и фильтрацией
2. **Login/Register** - Аутентификация пользователей
3. **Profile** - Просмотр и редактирование профиля
4. **Users** - Поиск участников команды
5. **Create Project** - Форма создания нового проекта
6. **Project Details** - Детальная информация о проекте
7. **My Projects** - Проекты пользователя

### Компоненты

- **Navbar** - Навигация с состоянием аутентификации
- **Layout** - Основной layout wrapper
- **ProjectCard** - Карточка проекта
- **ProtectedRoute** - Защищенные роуты для авторизованных пользователей

## API интеграция

Frontend подключается к backend REST API на `http://localhost:8500/api`

### Аутентификация
- JWT токены хранятся в localStorage
- Автоматическое добавление токена к запросам
- Редирект на login при 401 ошибке

## Доступные команды

```bash
# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Просмотр production сборки
npm run preview

# Линтинг кода
npm run lint
```

## Стилизация

TailwindCSS utility классы с кастомной конфигурацией:

- Кастомная цветовая палитра (primary цвета)
- Переиспользуемые классы (.btn-primary, .input-field, .card)
- Responsive breakpoints
- Hover и transition эффекты

## Заметки разработчика

- Все API запросы используют Axios interceptors для управления токенами
- Context API для глобального состояния аутентификации
- Защищенные роуты автоматически редиректят на login
- Валидация форм на всех input формах
- Loading состояния для асинхронных операций
- Обработка ошибок с user-friendly сообщениями
