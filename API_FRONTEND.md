# API для Frontend разработчиков

## Базовый URL
```
http://localhost:8500/api
```

## Аутентификация

### 1. Регистрация пользователя
**Endpoint:** `POST /auth/register`

**Request:**
```javascript
fetch('http://localhost:8500/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: "john_doe",
    email: "john@example.com",
    password: "password123"
  })
})
```

### 2. Вход
**Endpoint:** `POST /auth/login`

**Request:**
```javascript
fetch('http://localhost:8500/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    login: "john_doe",  // можно использовать username, email или phone
    password: "password123"
  })
})
.then(response => response.json())
.then(data => {
  // Сохраните token в localStorage или state
  localStorage.setItem('token', data.token);
  console.log('Role:', data.role);
});
```

## Работа с пользователями

### 3. Получить профиль текущего пользователя
**Endpoint:** `GET /users/me`

**Request:**
```javascript
fetch('http://localhost:8500/api/users/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => response.json())
.then(user => console.log(user));
```

### 4. Обновить профиль
**Endpoint:** `PUT /users/me`

**Request:**
```javascript
fetch('http://localhost:8500/api/users/me', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: "John Doe",
    age: 25,
    skills: ["Java", "React", "Node.js"],
    bio: "Passionate developer",
    location: "Bishkek",
    phone: "+996700123456",
    telegram: "@johndoe",
    instagram: "johndoe"
  })
})
```

### 5. Получить всех пользователей (для страницы "Участники")
**Endpoint:** `GET /users`

**Request:**
```javascript
// Все пользователи
fetch('http://localhost:8500/api/users')
.then(response => response.json())
.then(users => console.log(users));

// Поиск пользователей
fetch('http://localhost:8500/api/users?search=john')
.then(response => response.json())
.then(users => console.log(users));
```

### 6. Получить профиль пользователя по ID
**Endpoint:** `GET /users/{userId}`

**Request:**
```javascript
const userId = "some-uuid-here";
fetch(`http://localhost:8500/api/users/${userId}`)
.then(response => response.json())
.then(user => console.log(user));
```

## Работа с проектами

### 7. Получить все проекты (для главной страницы)
**Endpoint:** `GET /projects`

**Request:**
```javascript
// Все проекты
fetch('http://localhost:8500/api/projects')
.then(response => response.json())
.then(projects => console.log(projects));

// Фильтрация по сфере
fetch('http://localhost:8500/api/projects?sphere=Технологии')
.then(response => response.json())
.then(projects => console.log(projects));

// Поиск проектов
fetch('http://localhost:8500/api/projects?search=eco')
.then(response => response.json())
.then(projects => console.log(projects));
```

### 8. Создать проект
**Endpoint:** `POST /projects`

**Request:**
```javascript
fetch('http://localhost:8500/api/projects', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Eco Project",
    type: "Open Source",
    sphere: "Экология",
    description: "Проект по очистке окружающей среды",
    requiredSkills: ["Programming", "Biology"],
    location: "Bishkek",
    team: ["Developer", "Designer", "Marketer"]
  })
})
.then(response => response.json())
.then(project => console.log('Created project:', project));
```

### 9. Получить проект по ID
**Endpoint:** `GET /projects/{projectId}`

**Request:**
```javascript
const projectId = "some-uuid-here";
fetch(`http://localhost:8500/api/projects/${projectId}`)
.then(response => response.json())
.then(project => {
  console.log('Project:', project);
  console.log('Owner:', project.owner);
  console.log('Members:', project.members);
});
```

### 10. Обновить проект
**Endpoint:** `PUT /projects/{projectId}`

**Request:**
```javascript
const projectId = "some-uuid-here";
fetch(`http://localhost:8500/api/projects/${projectId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Updated Project Name",
    description: "Updated description",
    requiredSkills: ["Java", "React"]
  })
})
```

### 11. Удалить проект
**Endpoint:** `DELETE /projects/{projectId}`

**Request:**
```javascript
const projectId = "some-uuid-here";
fetch(`http://localhost:8500/api/projects/${projectId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
```

### 12. Добавить участника в проект (лайк/присоединиться)
**Endpoint:** `POST /projects/{projectId}/members/{userId}`

**Request:**
```javascript
const projectId = "project-uuid";
const userId = "user-uuid";
fetch(`http://localhost:8500/api/projects/${projectId}/members/${userId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => response.json())
.then(project => console.log('Updated project:', project));
```

### 13. Удалить участника из проекта
**Endpoint:** `DELETE /projects/{projectId}/members/{userId}`

**Request:**
```javascript
const projectId = "project-uuid";
const userId = "user-uuid";
fetch(`http://localhost:8500/api/projects/${projectId}/members/${userId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
```

### 14. Получить мои проекты
**Endpoint:** `GET /projects/my-projects`

**Request:**
```javascript
fetch('http://localhost:8500/api/projects/my-projects', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => response.json())
.then(projects => console.log('My projects:', projects));
```

## React Hook пример

```javascript
// useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetch('http://localhost:8500/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      });
    }
  }, [token]);

  const login = async (username, password) => {
    const response = await fetch('http://localhost:8500/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: username, password })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return { token, user, login, logout };
};
```

## Сферы проектов (для фильтров)

```javascript
const projectSpheres = [
  "Технологии",
  "Образование",
  "Экология",
  "Финансы",
  "Здоровье",
  "Социальные проекты",
  "Сельское хозяйство",
  "Наука и исследования"
];
```

## Структура ответов

### User Profile Response
```json
{
  "id": "uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "age": 25,
  "skills": ["Java", "React"],
  "bio": "Developer",
  "location": "Bishkek",
  "phone": "+996700123456",
  "telegram": "@johndoe",
  "instagram": "johndoe"
}
```

### Project Response
```json
{
  "id": "uuid",
  "name": "Eco Project",
  "type": "Open Source",
  "sphere": "Экология",
  "description": "Environmental cleanup project",
  "requiredSkills": ["Programming", "Biology"],
  "location": "Bishkek",
  "team": ["Developer", "Designer"],
  "owner": {
    "id": "uuid",
    "username": "john_doe",
    "fullName": "John Doe",
    "age": 25,
    "skills": ["Java"],
    "bio": "Developer",
    "location": "Bishkek"
  },
  "members": [
    { "id": "uuid", "username": "user1", ... },
    { "id": "uuid", "username": "user2", ... }
  ],
  "createdAt": "2025-01-15T10:30:00Z"
}
```

## CORS

Backend настроен на прием запросов с любого origin в development режиме. В production нужно будет настроить конкретные origins.

## Обработка ошибок

```javascript
fetch('http://localhost:8500/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => {
  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login';
    }
    throw new Error('Request failed');
  }
  return response.json();
})
.catch(error => console.error('Error:', error));
```
