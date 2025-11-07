# Team Maker Backend

Платформа для поиска и создания команд для совместных проектов.

## Технологии

- Java 17
- Spring Boot 3.5.6
- PostgreSQL
- Flyway (database migrations)
- Maven
- Docker/Docker Compose
- JWT Authentication

## Запуск проекта

### С помощью Docker Compose

```bash
docker-compose up --build
```

Приложение будет доступно на `http://localhost:8500`

### Локально

1. Убедитесь, что PostgreSQL запущен на `localhost:5432`
2. База данных: `team`, пользователь: `postgres`, пароль: `1234`
3. Запустите приложение:

```bash
./mvnw spring-boot:run
```

## API Endpoints

### Swagger UI
Документация API доступна по адресу: `http://localhost:8500/swagger-ui.html`

### Аутентификация

#### Регистрация
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Вход
```
POST /api/auth/login
Content-Type: application/json

{
  "login": "john_doe",  // username, email или phone
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "role": "USER"
}
```

### Пользователи (User API)

#### Получить текущий профиль
```
GET /api/users/me
Authorization: Bearer {token}
```

#### Обновить профиль
```
PUT /api/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Doe",
  "age": 25,
  "skills": ["Java", "Spring Boot", "React"],
  "bio": "Software developer passionate about creating teams",
  "location": "Bishkek, Kyrgyzstan",
  "phone": "+996700123456",
  "telegram": "@johndoe",
  "instagram": "johndoe"
}
```

#### Получить профиль пользователя по ID
```
GET /api/users/{userId}
```

#### Получить всех пользователей
```
GET /api/users

// Поиск пользователей
GET /api/users?search=john
```

### Проекты (Project API)

#### Создать проект
```
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Eco Project",
  "type": "Open Source",
  "sphere": "Экология",
  "description": "Проект по очистке окружающей среды",
  "requiredSkills": ["Programming", "Biology"],
  "location": "Bishkek",
  "team": ["Developer", "Designer"]
}
```

#### Получить проект по ID
```
GET /api/projects/{projectId}
```

#### Получить все проекты
```
GET /api/projects

// Фильтрация по сфере
GET /api/projects?sphere=Экология

// Поиск проектов
GET /api/projects?search=eco
```

#### Обновить проект
```
PUT /api/projects/{projectId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

#### Удалить проект
```
DELETE /api/projects/{projectId}
Authorization: Bearer {token}
```

#### Добавить участника в проект
```
POST /api/projects/{projectId}/members/{userId}
Authorization: Bearer {token}
```

#### Удалить участника из проекта
```
DELETE /api/projects/{projectId}/members/{userId}
Authorization: Bearer {token}
```

#### Получить мои проекты
```
GET /api/projects/my-projects
Authorization: Bearer {token}
```

## Структура базы данных

### Таблица users
- id (UUID)
- username (уникальный)
- email (уникальный)
- password (зашифрованный)
- full_name
- age
- bio
- location
- phone
- telegram
- instagram
- role (USER, ADMIN)
- created_at
- updated_at
- active

### Таблица projects
- id (UUID)
- name
- type
- sphere (сфера: Технологии, Образование, Экология, Финансы, etc.)
- description
- location
- owner_id (FK -> users)
- created_at
- updated_at
- active

### Связующие таблицы
- user_skills: навыки пользователя
- project_required_skills: требуемые навыки для проекта
- project_team: состав команды проекта
- project_members: участники проекта (many-to-many)

## Сферы проектов

- Технологии
- Образование
- Экология
- Финансы
- Здоровье
- Социальные проекты
- Сельское хозяйство
- Наука и исследования

## Миграции Flyway

Миграции находятся в `src/main/resources/db/migration/`
- V1__Create_users_table.sql
- V2__Create_projects_table.sql

## Безопасность

- JWT токены для аутентификации
- Пароли шифруются с помощью BCrypt
- Spring Security для защиты endpoints

## Дополнительно

MinIO настроен в docker-compose для будущей интеграции хранения файлов (изображения профилей, логотипы проектов).
