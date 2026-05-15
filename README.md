# Freelance Marketplace

Проект представляет собой веб-приложение для фриланс-маркетплейса, построенное на стеке:
- Backend: Django 6 + Django REST Framework + PostgreSQL
- Frontend: React + Vite
- Контейнеризация: Docker Compose

## Структура проекта

- `docker-compose.yml` — основное описание сервиса
- `diplom_project/` — backend-приложение Django
  - `diplom_project/` — настройки Django
  - `users/` — регистрация, авторизация, профили
  - `jobs/` — создание и управление заявками на работу
  - `proposals/` — отклики на задания и рейтинги
  - `orders/` — штатный CRUD для заказов
- `frontend/` — React-приложение
  - `src/pages/` — страницы пользовательского интерфейса
  - `src/services/` — клиентские запросы к API

## Запуск в Docker

Используется `docker compose`.

1. В корне проекта выполните:
```bash
docker compose up --build
```

2. После запуска:
- Backend доступен на `http://127.0.0.1:8000`
- Frontend доступен на `http://127.0.0.1:5173`

### Что делает `docker compose`?

- `backend`:
  - читает настройки БД из `diplom_project/docker.env`
  - выполняет `python manage.py migrate`
  - собирает статические файлы `collectstatic`
  - запускает `gunicorn` на `0.0.0.0:8000`
- `frontend`:
  - собирает и запускает приложение Vite на `5173`
- `db`:
  - PostgreSQL 17
  - пользователь `postgres`, пароль `postgres`
  - база `freelance_db`

## Переменные окружения

В `diplom_project/docker.env` настроены параметры подключения к PostgreSQL:
```env
DB_NAME=freelance_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432
```

## Бизнес-логика и функциональность

### Пользователи

Пользователь регистрируется по email и выбирает роль:
- `client` — клиент, создаёт заказы и принимает предложения
- `contractor` — исполнитель, отправляет предложения и получает рейтинги
- `admin` — встроенная роль Django (через админку)

Поддерживается JWT-авторизация.

### Заявки на работу (Jobs)

Клиенты могут:
- создавать новую задачу
- смотреть свои задачи
- фильтровать задачи по статусу, бюджету и поиску по заголовку
- менять статус задачи: `open`, `in_progress`, `completed`, `cancelled`

Статусы заявки в `jobs.models.JobRequest`:
- `OPEN`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

### Предложения (Proposals)

Исполнители могут:
- отправить предложение на открытое задание
- указать сообщение и цену
- существующие предложения проверяются на дублирование

Клиенты могут:
- просмотреть предложения по своей заявке
- принять предложение

Статусы предложения в `proposals.models.Proposal`:
- `PENDING`
- `ACCEPTED`
- `REJECTED`

### Рейтинг исполнителей

После того как работа в статусе `in_progress` или `completed`, клиент может оставить рейтинг исполнителю.

Рейтинг хранится в `Rating` с полями:
- `job` — задание
- `client` — заказчик
- `contractor` — исполнитель
- `rating` — 1–5
- `comment`

У пользователя исполнителя вычисляется `average_rating`.

### Заказы (Orders)

Приложение `orders` реализует базовый CRUD для заказов с полями:
- `title`
- `description`
- `status` (`pending`, `in_progress`, `completed`, `cancelled`)

## Архитектура API

### Основные URL

- `POST /api/register/` — регистрация
- `POST /api/token/` — получение JWT-токена
- `POST /api/token/refresh/` — обновление токена
- `GET /api/me/` — текущий профиль
- `GET /api/users/` — список пользователей
- `GET /jobs/` — список задач
- `POST /jobs/` — создание задачи (только клиент)
- `POST /proposals/` — отправка предложения (только исполнитель)
- `POST /proposals/{id}/accept/` — принять предложение (только клиент)
- `POST /ratings/` — оставить рейтинг
- `GET /orders/` — заказы

### Маршруты фронтенда

- `/` — главная
- `/login` — вход
- `/register` — регистрация
- `/create-job` — создание заявки
- `/jobs` — лента задач
- `/jobs/:id` — страница задачи
- `/proposals` — предложения
- `/my-proposals` — мои отклики
- `/client` — панель клиента
- `/contractor` — панель исполнителя
- `/dashboard` — общая панель
- `/profile` — профиль пользователя
- `/contractor/:id` — профиль исполнителя

## Как работать с проектом при необходимости

### Админка Django

После запуска можно создать суперпользователя вручную:
```bash
docker compose exec backend python manage.py createsuperuser
```
Админка доступна по `http://127.0.0.1:8000/admin/`.

### Полезные команды

- `docker compose up --build` — полный старт проекта
- `docker compose down` — остановить контейнеры
- `docker compose exec backend python manage.py migrate` — применить миграции
- `docker compose exec backend python manage.py collectstatic --noinput` — собрать статические файлы

## Особенности реализации

- Backend использует Django REST Framework и JWT через `rest_framework_simplejwt`
- Frontend использует Axios для запросов к `http://127.0.0.1:8000`
- Токен хранится в `localStorage` и автоматически подставляется в заголовок `Authorization`
- Кросс-доменные запросы разрешены для `http://localhost:5173`

## Примечания

- `DEBUG = True` в настройках Django, поэтому проект готов к локальному запуску, но требует доработки конфигурации для продакшн-режима
- Пароли и данные БД заданы в `diplom_project/docker.env`
- Для корректной работы фронтенда важно запускать backend до frontend или одновременно через Docker Compose
