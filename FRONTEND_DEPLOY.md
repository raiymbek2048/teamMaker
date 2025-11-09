# Frontend Production Deployment Guide

## Проблема
Запуск `npm run dev` на сервере - это **development режим**, который:
- Падает при разрыве SSH соединения
- Не перезапускается автоматически
- Потребляет больше ресурсов
- Не оптимизирован для production

## Решение
Production деплой с Docker + Nginx:
- Автоматический перезапуск при падении
- Оптимизированная сборка
- Кеширование статических файлов
- Gzip компрессия
- Проксирование API запросов

---

## Деплой на сервер

### Вариант 1: Используя Docker (Рекомендуется)

#### Шаг 1: Загрузите код на сервер
```bash
# Склонируйте репозиторий или загрузите изменения
git pull origin main
```

#### Шаг 2: Соберите и запустите фронтенд
```bash
# Перейдите в корневую директорию проекта
cd teamMaker

# Соберите и запустите только фронтенд
docker-compose up -d --build frontend
```

#### Шаг 3: Проверьте статус
```bash
# Посмотрите логи
docker-compose logs -f frontend

# Проверьте что контейнер запущен
docker ps | grep team-frontend
```

Фронтенд будет доступен на **порту 4200** (http://ваш-сервер:4200)

#### Управление контейнером
```bash
# Остановить
docker-compose stop frontend

# Перезапустить
docker-compose restart frontend

# Пересобрать после изменений кода
docker-compose up -d --build frontend

# Посмотреть логи
docker-compose logs -f frontend
```

---

### Вариант 2: Запуск отдельно от docker-compose

Если вы хотите запустить фронтенд отдельным Docker контейнером:

```bash
# Перейдите в папку frontend
cd frontend

# Соберите образ
docker build -t team-frontend .

# Запустите контейнер
docker run -d \
  --name team-frontend \
  --restart unless-stopped \
  -p 4200:80 \
  team-frontend

# Проверьте статус
docker ps | grep team-frontend

# Посмотрите логи
docker logs -f team-frontend
```

#### Управление контейнером
```bash
# Остановить
docker stop team-frontend

# Запустить
docker start team-frontend

# Перезапустить
docker restart team-frontend

# Удалить контейнер (для пересборки)
docker stop team-frontend
docker rm team-frontend

# Пересобрать и запустить заново
docker build -t team-frontend .
docker run -d --name team-frontend --restart unless-stopped -p 4200:80 team-frontend
```

---

## Локальная разработка

Для локальной разработки ничего не меняется:

```bash
cd frontend
npm run dev
```

Будет использоваться `http://localhost:8500/api` (файл `.env.development`)

---

## Структура файлов

```
frontend/
├── Dockerfile              # Multi-stage build: Node + Nginx
├── nginx.conf              # Конфигурация nginx (статика + API proxy)
├── .dockerignore           # Исключаем node_modules при сборке
├── .env.development        # Локальная разработка (localhost:8500)
└── src/
    └── services/
        └── api.js          # Использует /api в production
```

---

## Как это работает

1. **Build stage**: Vite собирает production bundle в папку `dist/`
2. **Nginx stage**: Nginx раздаёт статику из `dist/` и проксирует `/api` запросы на бэкенд
3. **API routing**:
   - Локально: `http://localhost:8500/api`
   - Production: `/api` → nginx → `http://85.113.27.42:905/api`

---

## Проверка работы

После деплоя:

1. Откройте браузер: `http://ваш-сервер:4200`
2. Проверьте что страница загружается
3. Откройте DevTools → Network → проверьте что API запросы идут на `/api`
4. Проверьте что логин/регистрация работают

---

## Решение проблем

### Контейнер не запускается
```bash
# Посмотрите подробные логи
docker-compose logs frontend

# Или
docker logs team-frontend
```

### Не работают API запросы
1. Проверьте что бэкенд доступен: `curl http://85.113.27.42:905/api/health`
2. Проверьте логи nginx: `docker logs team-frontend`
3. Проверьте CORS настройки на бэкенде

### Порт 4200 занят
Измените порт в `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "8080:80"  # Используйте другой внешний порт
```

Или при прямом запуске:
```bash
docker run -d --name team-frontend --restart unless-stopped -p 8080:80 team-frontend
```

---

## Изменение адреса бэкенда

Если нужно изменить адрес бэкенда:

1. Отредактируйте `frontend/nginx.conf`:
```nginx
location /api/ {
    proxy_pass http://НОВЫЙ_АДРЕС:ПОРТ/api/;
    ...
}
```

2. Пересоберите контейнер:
```bash
docker-compose up -d --build frontend
```

---

## Мониторинг

```bash
# Статус контейнера
docker ps | grep team-frontend

# Логи в реальном времени
docker logs -f team-frontend

# Использование ресурсов
docker stats team-frontend

# Перезапуск при падении
docker update --restart unless-stopped team-frontend
```

---

## Что дальше?

- ✅ Фронтенд запускается в production режиме
- ✅ Автоматический перезапуск при падении
- ✅ Оптимизированная раздача статики
- ✅ Проксирование API запросов
- ✅ Gzip компрессия

**Больше не нужно** заходить на сервер и запускать `npm run dev` каждый день!
