<div align="center">

# RealTimeDocs

### Real-Time Collaborative Document Platform

_Create, edit, and collaborate on documents — simultaneously, seamlessly, securely._

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socket.io&logoColor=white)](https://socket.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## What is RealTimeDocs?

RealTimeDocs is a full-stack, real-time collaborative document management platform inspired by Google Docs. It allows multiple users to work on the same document simultaneously, with live cursor tracking, instant content sync, granular access control, and a rich text editing experience — all secured with JWT authentication and email verification.

---

## Features

| Category                    | Details                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| **Real-Time Collaboration** | Multiple users edit the same document simultaneously via Socket.IO with live cursor presence |
| **Rich Text Editor**        | Powered by Quill v2 with `quill-cursors` for per-user cursor colors and positions            |
| **Document Management**     | Create, rename, update, and delete documents with auto-save                                  |
| **Granular Sharing**        | Share documents with specific users granting either `VIEW` or `EDIT` permission              |
| **Collaborator Visibility** | See who is currently active inside a document in real time                                   |
| **Secure Authentication**   | JWT-based auth with `bcrypt` password hashing; tokens validated on every Socket connection   |
| **Email Verification**      | New accounts require email verification via SendGrid / Nodemailer before access is granted   |
| **Forgot Password Flow**    | Secure password-reset link delivered by email with time-limited token                        |
| **Input Validation**        | All API inputs validated server-side with Zod schemas                                        |
| **State Management**        | Client-side global state handled by Zustand                                                  |

---

## Tech Stack

### Frontend (`/client`)

- **React 19** + **TypeScript 5.8** — component-based UI
- **Vite 7** — lightning-fast dev server and bundler
- **Tailwind CSS 4** — utility-first styling
- **Quill 2** + **quill-cursors** — rich text editing with multi-user cursor support
- **Socket.IO Client 4.8** — real-time WebSocket communication
- **Zustand 5** — lightweight global state management
- **Axios** — HTTP client for REST API calls
- **React Router DOM 7** — client-side routing
- **jwt-decode** — client-side JWT parsing

### Backend (`/server`)

- **Node.js** + **Express 5** + **TypeScript 5.8** — REST API server
- **Socket.IO 4.8** — WebSocket server with JWT-authenticated connections
- **Prisma 6** — type-safe ORM for PostgreSQL
- **PostgreSQL** — relational database
- **JSON Web Tokens** — stateless authentication
- **bcrypt** — secure password hashing
- **Zod 3** — schema-based request validation
- **SendGrid / Nodemailer** — transactional emails
- **ts-node-dev** — hot-reload TypeScript development server

---

## Database Schema

```
User ──< Document          (one user owns many documents)
User ──< Documentuser      (many-to-many: users ↔ shared documents)
Document ──< Documentuser  (cascade delete on document removal)

Permission: VIEW | EDIT
```

---

## API Overview

### User Routes — `/api/v1/user`

| Method | Endpoint                 | Description                    |
| ------ | ------------------------ | ------------------------------ |
| `POST` | `/signup`                | Register a new account         |
| `POST` | `/signin`                | Sign in and receive a JWT      |
| `PUT`  | `/verifyemail/:token`    | Verify email address           |
| `POST` | `/forgotpassword`        | Request a password-reset email |
| `POST` | `/forgotpassword/:token` | Validate reset token           |
| `POST` | `/resetpassword`         | Set a new password             |
| `GET`  | `/`                      | Get authenticated user info    |

### Document Routes — `/api/v1/document` _(requires JWT)_

| Method   | Endpoint                        | Description                   |
| -------- | ------------------------------- | ----------------------------- |
| `POST`   | `/`                             | Create a new document         |
| `GET`    | `/`                             | List all accessible documents |
| `GET`    | `/:documentId`                  | Fetch a single document       |
| `PUT`    | `/update/:documentId`           | Update title or content       |
| `DELETE` | `/delete/:documentId`           | Delete a document             |
| `POST`   | `/share/:documentId`            | Share with a user (VIEW/EDIT) |
| `GET`    | `/getcollaborators/:documentId` | List document collaborators   |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database
- SendGrid API key (or SMTP credentials for Nodemailer)

### 1 — Clone the repository

```bash
git clone https://github.com/anujsolania/RealTimeDocs
cd RealTimeDocs
```

### 2 — Install dependencies

```bash
# Frontend
cd client && npm install

# Backend
cd ../server && npm install
```

### 3 — Configure environment variables

**`server/.env`**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/realtimedocs
JWT_KEY=your_jwt_secret
LINK=http://localhost:5173
SENDGRID_API_KEY=your_sendgrid_key   # or configure Nodemailer
```

**`client/.env`**

```env
VITE_API_URL=http://localhost:3000
```

### 4 — Set up the database

```bash
cd server
npx prisma migrate deploy
npx prisma generate
```

### 5 — Start development servers

```bash
# Backend (from /server)
npm run dev

# Frontend (from /client)
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## Project Structure

```
RealTimeDocs/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── components/      # Reusable UI components (Navbar, Editor, etc.)
│       ├── pages/           # Route-level pages (Home, Document, Auth flows)
│       ├── services/        # Axios API service layer
│       ├── store/           # Zustand state + active-user logic
│       └── interfaces/      # TypeScript type definitions
│
└── server/                  # Express + Socket.IO backend
    └── src/
        ├── actions/         # Controller logic (user & document handlers)
        ├── routes/          # Express route definitions
        ├── middleware/       # JWT authentication & authorization
        ├── validate/         # Zod validation schemas
        └── prisma/          # Database schema & migrations
```

---

## License

This project is open-source and available under the [MIT License](LICENSE).
