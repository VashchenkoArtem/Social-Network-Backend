# Social Network Backend

**[English](#english) | [Українська](#українська)**

---

<a name="english"></a>

REST API + WebSocket backend for a social network platform. Built with **Node.js**, **Express**, **TypeScript**, **Prisma** and **PostgreSQL**. Supports real-time messaging via **Socket.IO**, image uploads via **Cloudinary** and **Multer**, JWT authentication, and connects to a remote PostgreSQL database through an SSH tunnel.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express 5 |
| ORM | Prisma 6 |
| Database | PostgreSQL (hosted on PythonAnywhere) |
| Real-time | Socket.IO |
| Auth | JWT (jsonwebtoken) + bcrypt |
| File storage | Cloudinary + Multer + Sharp |
| Email | Nodemailer |
| DB connection | SSH tunnel (tunnel-ssh) |

---

## Features

- **Authentication** — registration, login, email verification code, password recovery
- **User profiles** — avatar, pseudonym, signature (text or image), birth date
- **Posts** — create, edit, delete posts with images, tags, and links; pagination; view tracking
- **Reactions** — likes (👍) and hearts (❤️) on posts
- **Friends** — friend requests, accept/decline, recommended people
- **Chats** — personal and group chats, group avatar, leave/delete group
- **Messages** — send text & images, unread count, mark as read
- **Albums** — photo albums with visibility control per album and per photo
- **Tags** — attach tags to posts
- **Real-time** — online status, new messages, chat events via Socket.IO

---

## Project Structure

```
src/
├── album/          # Albums and photos
├── chat/           # Chats (REST + Socket)
├── client/         # Prisma client singleton
├── config/         # Cloudinary, SSH tunnel, paths
├── errors/         # Custom error classes
├── friends/        # Friend requests and recommendations
├── message/        # Messages (REST + Socket)
├── middlewares/    # Auth (JWT), file upload, Socket auth
├── post/           # Posts
├── postHearts/     # Heart reactions
├── postLikes/      # Like reactions
├── socket/         # Socket.IO server manager
├── tag/            # Tags
├── user/           # Users and profiles
└── server.ts       # Entry point

prisma/
├── schema/         # Prisma model files (split by domain)
├── migrations/     # SQL migrations
└── schema.prisma   # Main Prisma config
```

Each domain module follows the same pattern: `router → controller → service → repository`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Access to the PostgreSQL database (credentials required for SSH tunnel)

### Installation

```bash
git clone https://github.com/VashchenkoArtem/Social-Network-Backend.git
cd Social-Network-Backend
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@127.0.0.1:5433/DB_NAME"

# SSH tunnel (PythonAnywhere)
USER_PASSWORD=your_pythonanywhere_password

# JWT
JWT_SECRET=your_jwt_secret

# Email (for verification codes)
MAIL_USER=your@email.com
MAIL_PASS=your_email_password

# Cloudinary
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET_KEY=your_cloudinary_api_secret
```

### Run

```bash
npm start
```

The server starts on port **8000** and is available at `http://<local-ip>:8000`.

---

## API Reference

All protected routes require the header:
```
Authorization: Bearer <token>
```

### Auth & Users

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/registration` | ❌ | Register a new user |
| POST | `/send-code` | ❌ | Send email verification code |
| POST | `/login` | ❌ | Login, returns JWT |
| POST | `/find-code` | ❌ | Get code for password reset |
| GET | `/me` | ✅ | Get current user profile |
| PATCH | `/update-user` | ✅ | Update profile (avatar upload) |
| PATCH | `/update-password` | ✅ | Change password |
| PATCH | `/signature` | ✅ | Update signature (image upload) |
| GET | `/users/:userId` | ✅ | Get user by ID |

### Posts

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/posts` | ✅ | Get all posts (paginated) |
| GET | `/posts/my` | ✅ | Get current user's posts |
| GET | `/users/:userId/posts` | ✅ | Get posts by user ID |
| POST | `/posts` | ✅ | Create post (up to 7 images) |
| PATCH | `/posts/:id` | ✅ | Update post |
| DELETE | `/posts/:id` | ✅ | Delete post |
| POST | `/posts/:id/view` | ✅ | Mark post as viewed |

### Reactions

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST/DELETE | `/posts/:id/like` | ✅ | Toggle like on post |
| POST/DELETE | `/posts/:id/heart` | ✅ | Toggle heart on post |

### Friends

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/friends` | ✅ | Get friends list |
| GET | `/requests` | ✅ | Get incoming/outgoing requests |
| POST | `/requests` | ✅ | Send friend request |
| PATCH | `/requests` | ✅ | Accept or decline request |
| DELETE | `/requests/:requestId` | ✅ | Cancel request |
| GET | `/recommended` | ✅ | Get recommended people |

### Chats

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/personal-chats` | ✅ | Get personal chats |
| GET | `/group-chats` | ✅ | Get group chats |
| GET | `/chat/:chatId` | ✅ | Get chat by ID |
| POST | `/chat` | ✅ | Create chat (personal or group) |
| PATCH | `/chat/:id` | ✅ | Update group chat |
| DELETE | `/group-chats/:id` | ✅ | Delete group chat |
| DELETE | `/group-chats/:id/leave` | ✅ | Leave group chat |

### Messages

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/messages/chats/:chatId` | ✅ | Get messages in a chat |
| POST | `/messages/chat/:chatId` | ✅ | Send message (up to 7 images) |
| GET | `/messages/unread` | ✅ | Get unread message count |
| GET | `/messages/unreadChat` | ✅ | Get unread messages by chat |
| GET | `/messages/read/chat/:chatId` | ✅ | Mark all messages in chat as read |

### Albums

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/albums/:userId` | ✅ | Get user's albums |
| POST | `/albums` | ✅ | Create album |
| PATCH | `/albums/:id` | ✅ | Update album |
| DELETE | `/albums/:id` | ✅ | Delete album |
| PATCH | `/albums/:id/visibility` | ✅ | Toggle album visibility |
| POST | `/upload/:albumId` | ✅ | Upload photos to album (up to 10) |
| DELETE | `/photo/:photoId` | ✅ | Delete photo |
| PATCH | `/photo/:photoId/visibility` | ✅ | Toggle photo visibility |

---

## WebSocket Events

The server uses Socket.IO with JWT authentication on the socket connection.

| Event | Direction | Description |
|-------|-----------|-------------|
| `connection` | server | User connects and is registered as online |
| `disconnect` | server | User goes offline |
| `send_message` | client → server | Send a new message |
| `new_message` | server → client | Receive a new message |
| `join_chat` | client → server | Join a chat room |
| `leave_chat` | client → server | Leave a chat room |

Connect with the token in the `auth` field:
```js
const socket = io("http://<host>:8000", {
  auth: { token: "Bearer <jwt_token>" }
});
```

---

## Database

PostgreSQL schema managed by Prisma. The database is hosted on **PythonAnywhere** and connected via an SSH tunnel that starts automatically when the server boots.

Key models: `user_app_user`, `profile_app_profile`, `post_app_post`, `chat_app_chat`, `chat_app_message`, `user_app_friendship`, `profile_app_album`.

To apply migrations:
```bash
npx prisma migrate deploy
```

To regenerate the Prisma client after schema changes:
```bash
npx prisma generate
```


---
---

<a name="українська"></a>

# Social Network Backend

REST API + WebSocket бекенд для платформи соціальної мережі. Побудований на **Node.js**, **Express**, **TypeScript**, **Prisma** та **PostgreSQL**. Підтримує обмін повідомленнями в реальному часі через **Socket.IO**, завантаження зображень через **Cloudinary** і **Multer**, JWT-автентифікацію, а також підключається до віддаленої бази даних PostgreSQL через SSH-тунель.

---

## Технологічний стек

| Рівень | Технологія |
|---|---|
| Runtime | Node.js |
| Мова | TypeScript |
| Фреймворк | Express 5 |
| ORM | Prisma 6 |
| База даних | PostgreSQL (розміщена на PythonAnywhere) |
| Реальний час | Socket.IO |
| Автентифікація | JWT (jsonwebtoken) + bcrypt |
| Зберігання файлів | Cloudinary + Multer + Sharp |
| Email | Nodemailer |
| Підключення до БД | SSH-тунель (tunnel-ssh) |

---

## Функціональність

- **Автентифікація** — реєстрація, вхід, код підтвердження email, відновлення паролю
- **Профілі користувачів** — аватар, псевдонім, підпис (текст або зображення), дата народження
- **Пости** — створення, редагування, видалення постів із зображеннями, тегами та посиланнями; пагінація; відстеження переглядів
- **Реакції** — лайки (👍) та серця (❤️) на пости
- **Друзі** — запити в друзі, прийняття/відхилення, рекомендовані люди
- **Чати** — особисті та групові чати, аватар групи, вихід/видалення групи
- **Повідомлення** — надсилання тексту та зображень, лічильник непрочитаних, позначення як прочитане
- **Альбоми** — фотоальбоми з керуванням видимістю для кожного альбому та фото
- **Теги** — прикріплення тегів до постів
- **Реальний час** — статус онлайн, нові повідомлення, події чату через Socket.IO

---

## Структура проєкту

```
src/
├── album/          # Альбоми та фотографії
├── chat/           # Чати (REST + Socket)
├── client/         # Singleton Prisma-клієнта
├── config/         # Cloudinary, SSH-тунель, шляхи
├── errors/         # Класи кастомних помилок
├── friends/        # Запити в друзі та рекомендації
├── message/        # Повідомлення (REST + Socket)
├── middlewares/    # Auth (JWT), завантаження файлів, Socket auth
├── post/           # Пости
├── postHearts/     # Реакції серця
├── postLikes/      # Реакції лайка
├── socket/         # Менеджер Socket.IO сервера
├── tag/            # Теги
├── user/           # Користувачі та профілі
└── server.ts       # Точка входу

prisma/
├── schema/         # Файли Prisma-моделей (розбиті за доменами)
├── migrations/     # SQL-міграції
└── schema.prisma   # Головний конфіг Prisma
```

Кожен доменний модуль побудований за єдиним патерном: `router → controller → service → repository`.

---

## Початок роботи

### Вимоги

- Node.js 18+
- npm
- Доступ до бази даних PostgreSQL (необхідні облікові дані для SSH-тунелю)

### Встановлення

```bash
git clone https://github.com/VashchenkoArtem/Social-Network-Backend.git
cd Social-Network-Backend
npm install
```

### Змінні середовища

Створіть файл `.env` у корені проєкту:

```env
# База даних
DATABASE_URL="postgresql://USER:PASSWORD@127.0.0.1:5433/DB_NAME"

# SSH-тунель (PythonAnywhere)
USER_PASSWORD=your_pythonanywhere_password

# JWT
JWT_SECRET=your_jwt_secret

# Email (для кодів підтвердження)
MAIL_USER=your@email.com
MAIL_PASS=your_email_password

# Cloudinary
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET_KEY=your_cloudinary_api_secret
```

### Запуск

```bash
npm start
```

Сервер запускається на порту **8000** і доступний за адресою `http://<local-ip>:8000`.

---

## Довідник API

Усі захищені маршрути потребують заголовка:
```
Authorization: Bearer <token>
```

### Автентифікація та користувачі

| Метод | Маршрут | Auth | Опис |
|--------|-------|------|-------------|
| POST | `/registration` | ❌ | Реєстрація нового користувача |
| POST | `/send-code` | ❌ | Надіслати код підтвердження на email |
| POST | `/login` | ❌ | Вхід, повертає JWT |
| POST | `/find-code` | ❌ | Отримати код для скидання паролю |
| GET | `/me` | ✅ | Отримати профіль поточного користувача |
| PATCH | `/update-user` | ✅ | Оновити профіль (завантаження аватара) |
| PATCH | `/update-password` | ✅ | Змінити пароль |
| PATCH | `/signature` | ✅ | Оновити підпис (завантаження зображення) |
| GET | `/users/:userId` | ✅ | Отримати користувача за ID |

### Пости

| Метод | Маршрут | Auth | Опис |
|--------|-------|------|-------------|
| GET | `/posts` | ✅ | Отримати всі пости (з пагінацією) |
| GET | `/posts/my` | ✅ | Отримати пости поточного користувача |
| GET | `/users/:userId/posts` | ✅ | Отримати пости за ID користувача |
| POST | `/posts` | ✅ | Створити пост (до 7 зображень) |
| PATCH | `/posts/:id` | ✅ | Оновити пост |
| DELETE | `/posts/:id` | ✅ | Видалити пост |
| POST | `/posts/:id/view` | ✅ | Позначити пост як переглянутий |

### Реакції

| Метод | Маршрут | Auth | Опис |
|--------|-------|------|-------------|
| POST/DELETE | `/posts/:id/like` | ✅ | Поставити/зняти лайк на пост |
| POST/DELETE | `/posts/:id/heart` | ✅ | Поставити/зняти серце на пост |

### Друзі

| Метод | Маршрут | Auth | Опис |
|--------|-------|------|-------------|
| GET | `/friends` | ✅ | Отримати список друзів |
| GET | `/requests` | ✅ | Отримати вхідні/вихідні запити |
| POST | `/requests` | ✅ | Надіслати запит у друзі |
| PATCH | `/requests` | ✅ | Прийняти або відхилити запит |
| DELETE | `/requests/:requestId` | ✅ | Скасувати запит |
| GET | `/recommended` | ✅ | Отримати рекомендованих людей |

### Чати

| Метод | Маршрут | Auth | Опис |
|--------|-------|------|-------------|
| GET | `/personal-chats` | ✅ | Отримати особисті чати |
| GET | `/group-chats` | ✅ | Отримати групові чати |
| GET | `/chat/:chatId` | ✅ | Отримати чат за ID |
| POST | `/chat` | ✅ | Створити чат (особистий або груповий) |
| PATCH | `/chat/:id` | ✅ | Оновити груповий чат |
| DELETE | `/group-chats/:id` | ✅ | Видалити груповий чат |
| DELETE | `/group-chats/:id/leave` | ✅ | Вийти з групового чату |

### Повідомлення

| Метод | Маршрут | Auth | Опис |
|--------|-------|------|-------------|
| GET | `/messages/chats/:chatId` | ✅ | Отримати повідомлення в чаті |
| POST | `/messages/chat/:chatId` | ✅ | Надіслати повідомлення (до 7 зображень) |
| GET | `/messages/unread` | ✅ | Отримати кількість непрочитаних повідомлень |
| GET | `/messages/unreadChat` | ✅ | Отримати непрочитані повідомлення за чатами |
| GET | `/messages/read/chat/:chatId` | ✅ | Позначити всі повідомлення в чаті як прочитані |

### Альбоми

| Метод | Маршрут | Auth | Опис |
|--------|-------|------|-------------|
| GET | `/albums/:userId` | ✅ | Отримати альбоми користувача |
| POST | `/albums` | ✅ | Створити альбом |
| PATCH | `/albums/:id` | ✅ | Оновити альбом |
| DELETE | `/albums/:id` | ✅ | Видалити альбом |
| PATCH | `/albums/:id/visibility` | ✅ | Перемкнути видимість альбому |
| POST | `/upload/:albumId` | ✅ | Завантажити фото в альбом (до 10) |
| DELETE | `/photo/:photoId` | ✅ | Видалити фото |
| PATCH | `/photo/:photoId/visibility` | ✅ | Перемкнути видимість фото |

---

## WebSocket події

Сервер використовує Socket.IO з JWT-автентифікацією при підключенні сокета.

| Подія | Напрямок | Опис |
|-------|-----------|-------------|
| `connection` | сервер | Користувач підключається та реєструється як онлайн |
| `disconnect` | сервер | Користувач іде в офлайн |
| `send_message` | клієнт → сервер | Надіслати нове повідомлення |
| `new_message` | сервер → клієнт | Отримати нове повідомлення |
| `join_chat` | клієнт → сервер | Приєднатися до кімнати чату |
| `leave_chat` | клієнт → сервер | Вийти з кімнати чату |

Підключення з токеном у полі `auth`:
```js
const socket = io("http://<host>:8000", {
  auth: { token: "Bearer <jwt_token>" }
});
```

---

## База даних

Схема PostgreSQL керується через Prisma. База даних розміщена на **PythonAnywhere** та підключається через SSH-тунель, який запускається автоматично при старті сервера.

Основні моделі: `user_app_user`, `profile_app_profile`, `post_app_post`, `chat_app_chat`, `chat_app_message`, `user_app_friendship`, `profile_app_album`.

Застосувати міграції:
```bash
npx prisma migrate deploy
```

Перегенерувати Prisma-клієнт після змін схеми:
```bash
npx prisma generate
```
