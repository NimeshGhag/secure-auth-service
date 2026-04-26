# Secure Authentication Service (JWT + Refresh Token Rotation)

## 🌐 Live Demo
👉 https://secure-auth-service-hfhg.onrender.com

A production-ready authentication system demonstrating secure patterns: short-lived JWT access tokens, refresh token rotation, Google OAuth integration, email verification, and rate limiting. The backend is implemented with Node.js/Express and MongoDB, while the frontend is a fully integrated React + Vite application with protected routes, Google OAuth UI, and complete authentication flows.

## Project overview

This repository contains a full-stack authentication system split into two folders: a Node.js/Express backend (`/backend`) and a React frontend (`/frontend`). The backend implements JWT access tokens, refresh-token rotation, Google OAuth ID-token verification, email verification and password reset flows, and rate limiting for sensitive auth routes.

## 💡 Why this project?

Authentication is the foundation of every application.
Instead of building basic login systems repeatedly, this project focuses on creating a **reusable, production-ready authentication service** with real-world security practices like refresh token rotation, HTTP-only cookies, and OAuth integration.
This project demonstrates how authentication works in real production environments — not just tutorials.

## Key features

- **JWT-based authentication:** Short-lived access tokens and long-lived refresh tokens.
- **Refresh token rotation:** Refresh tokens are stored in the database and rotated on use to prevent reuse.
- **HTTP-only cookies:** Refresh tokens delivered in secure, HTTP-only cookies to mitigate XSS.
- **Google OAuth login:** Verify Google ID tokens server-side for secure federated login.
- **Secure logout:** Clears cookies and invalidates refresh tokens in the DB.
- **Email verification & password reset:** Tokenized email flows with one-time use links.
- **Rate limiting:** `express-rate-limit` applied to auth endpoints to reduce brute-force risk.
- **Auth middleware:** Protect routes with token validation.
- **Robust error handling:** Centralized responses and status codes for predictable client behavior.

## Tech stack

- Backend: Node.js, Express, MongoDB, Mongoose, JSON Web Tokens
- Frontend: React, Vite, React Router, React Hook Form, Tailwind CSS, Axios
- Other: Google OAuth, Nodemailer, express-rate-limit

## Folder structure (high level)

- `/backend` — Express server and API implementation
	- `server.js` — app entry
	- `src/controllers` — auth logic (`auth.controller.js`)
	- `src/routes/auth.routes.js` — auth endpoints
	- `src/middlewares` — auth middleware, rate limiter
	- `src/models` — `user.model.js`, `refreshToken.model.js`
- `/frontend` — React app (Vite)
	- `src/main.jsx` — app bootstrap
	- `src/App.jsx` — app root
	- `src/pages` — `Login`, `Register`, `Profile`, `ForgotPassword`, `ResetPassword`, `PageNotFound`
	- `src/components` — UI components and `ProtectedRoute`, `PublicRoute`
	- `src/context` — `AuthContext.jsx` for auth state
	- `src/api/axios.config.js` — axios instance; uses `VITE_API_BASE_URL` env var

## Frontend — Setup & run

Prereqs: Node.js 18+, npm (or yarn).

Install and run locally:

```bash
cd frontend
npm install
npm run dev
```

Useful scripts (from `/frontend/package.json`):

- `npm run dev` — start Vite dev server
- `npm run build` — produce production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

Frontend config notes:

- API base URL is read from `import.meta.env.VITE_API_BASE_URL` in `src/api/axios.config.js`.
- Create a `.env` file in `/frontend` for local development with a variable like:

```
VITE_API_BASE_URL=http://localhost:4000
```

Set `VITE_API_BASE_URL` to your backend origin (do not include trailing `/api` unless you want it as the base).

The frontend uses `withCredentials: true` on axios requests to allow cookie-based refresh tokens. When running locally, ensure the backend sets appropriate CORS and cookie options (`CLIENT_URL` / `VITE_API_BASE_URL`) so cookies are accepted by the browser.

## Backend — Setup & run

Prereqs: Node.js 18+, npm, MongoDB, SMTP credentials for email flows.

```bash
cd backend
npm install
npm run dev
```

Create `/backend/.env` with at least the following keys (do not commit secrets):

- `MONGODB_URI` — MongoDB connection string
- `PORT` — backend port (e.g. `4000`)
- `JWT_SECRET` — secret for access tokens
- `REFRESH_TOKEN_SECRET` — secret for refresh tokens
- `ACCESS_TOKEN_EXPIRY` — e.g. `15m`
- `REFRESH_TOKEN_EXPIRY` — e.g. `7d`
- `GOOGLE_CLIENT_ID` — for Google ID-token verification
- `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_USER`, `EMAIL_PASS` — SMTP config
- `CLIENT_URL` — frontend origin used in email links (e.g. `http://localhost:5173`)
- `COOKIE_DOMAIN` — optional cookie domain
- `NODE_ENV` — `development` or `production`

## API overview (auth)

Primary endpoints (see `/backend/src/routes/auth.routes.js`):

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`
- `GET /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/profile` (protected)

Rate limiting is applied to sensitive endpoints (login, password recovery, verification).

## Security notes

- Refresh tokens are rotated and stored server-side to reduce risk of token reuse.
- Refresh cookies are `HttpOnly` and must be `Secure` in production deployments.
- Server-side verification of Google ID tokens prevents client-side spoofing.

## Development tips

- Run backend on `http://localhost:3000` and frontend on Vite default (e.g. `http://localhost:5173`).
- Ensure `VITE_API_BASE_URL` matches the backend origin used by the browser.
- Use the `AuthContext` and provided `ProtectedRoute`/`PublicRoute` to manage route access in the frontend.

## 🚀 Deployment

- Frontend is built using Vite and served via Express backend
- Single server deployment (Render)
- SPA routing handled using Express fallback middleware
- Secure cookies configured for cross-origin authentication


## 💼 What this project demonstrates

- Building production-ready authentication systems
- Secure token handling (JWT + Refresh Tokens)
- Full-stack integration (React + Express)
- Debugging real-world deployment issues (CSP, OAuth, routing)
- Writing reusable and scalable backend modules

## Future improvements

- Add integration and E2E tests for core auth flows.
- Improve cookie settings and multi-domain deployment support.
- Add device/session management UI to allow revoking refresh tokens per device.

---

