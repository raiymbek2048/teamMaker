# Team Maker - Быстрый старт

Полная инструкция по запуску платформы Team Maker (Backend + Frontend)

## Требования

- Java 17
- Node.js 18+
- PostgreSQL 12+
- Docker и Docker Compose (опционально)

## Вариант 1: Запуск с Docker Compose (Рекомендуется)

### Backend

```bash
# В корне проекта
docker-compose up --build

# Backend будет доступен на http://localhost:8500
# Swagger UI: http://localhost:8500/swagger-ui.html
```

### Frontend

```bash
# Откройте новый терминал
cd frontend
npm install
npm run dev

# Frontend будет доступен на http://localhost:5173
```

Готово! Теперь вы можете:
1. Открыть http://localhost:5173 в браузере
2. Зарегистрироваться / Войти
3. Создать проект или присоединиться к существующим

---

## Вариант 2: Ручной запуск

### 1. Запустить PostgreSQL

```bash
# Убедитесь, что PostgreSQL запущен
# База данных: team
# Пользователь: postgres
# Пароль: 1234
# Порт: 5432

# Или запустите только PostgreSQL через Docker:
docker run -d \
  --name postgres-teammaker \
  -e POSTGRES_DB=team \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Запустить Backend

```bash
# В корне проекта
./mvnw spring-boot:run

# Backend будет доступен на http://localhost:8500
# Swagger UI: http://localhost:8500/swagger-ui.html
```

### 3. Запустить Frontend

```bash
# Откройте новый терминал
cd frontend
npm install
npm run dev

# Frontend будет доступен на http://localhost:5173
```

---

## Структура проекта

```
teamMaker/
├── src/                  # Backend (Spring Boot)
│   └── main/
│       ├── java/        # Java код
│       └── resources/   # Конфигурация и миграции
├── frontend/            # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/ # React компоненты
│   │   ├── pages/      # Страницы
│   │   ├── services/   # API сервисы
│   │   └── context/    # Управление состоянием
│   └── package.json
├── docker-compose.yml   # Docker конфигурация
├── pom.xml             # Maven конфигурация
└── README.md           # Документация

```

## Основные эндпоинты

### Backend API (http://localhost:8500/api)

**Аутентификация:**
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход

**Пользователи:**
- `GET /users/me` - Мой профиль
- `PUT /users/me` - Обновить профиль
- `GET /users` - Все пользователи
- `GET /users/{id}` - Пользователь по ID

**Проекты:**
- `GET /projects` - Все проекты
- `POST /projects` - Создать проект
- `GET /projects/{id}` - Проект по ID
- `PUT /projects/{id}` - Обновить проект
- `DELETE /projects/{id}` - Удалить проект
- `POST /projects/{id}/members/{userId}` - Добавить участника
- `DELETE /projects/{id}/members/{userId}` - Удалить участника
- `GET /projects/my-projects` - Мои проекты

### Frontend (http://localhost:5173)

- `/` - Главная (список проектов)
- `/login` - Вход
- `/register` - Регистрация
- `/profile` - Профиль пользователя
- `/users` - Список участников
- `/projects/create` - Создать проект
- `/projects/:id` - Детали проекта
- `/my-projects` - Мои проекты

## Технологии

### Backend
- Java 17
- Spring Boot 3.5.6
- Spring Security + JWT
- PostgreSQL
- Flyway
- Maven
- Docker

### Frontend
- React 19
- Vite
- React Router
- TailwindCSS
- Axios
- Context API

## Тестирование API

### С помощью Swagger UI

Откройте http://localhost:8500/swagger-ui.html

### С помощью curl

```bash
# Регистрация
curl -X POST http://localhost:8500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Вход
curl -X POST http://localhost:8500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"test","password":"password123"}'

# Получить все проекты
curl http://localhost:8500/api/projects
```

## Решение проблем

### Backend не запускается

1. Проверьте, что PostgreSQL запущен и доступен
2. Проверьте логи: `./mvnw spring-boot:run`
3. Убедитесь, что порт 8500 свободен

### Frontend не подключается к API

1. Убедитесь, что backend запущен на порту 8500
2. Проверьте CORS настройки в backend
3. Откройте DevTools в браузере и проверьте Network tab

### База данных

```bash
# Очистить базу данных и начать заново
docker-compose down -v
docker-compose up --build
```

## Следующие шаги

1. Зарегистрируйтесь на http://localhost:5173/register
2. Войдите в систему
3. Заполните свой профиль
4. Создайте свой первый проект
5. Пригласите участников!

## Дополнительная документация

- [Backend API документация](API_FRONTEND.md)
- [Frontend README](FRONTEND_README.md)
- [Backend README](README.md)
