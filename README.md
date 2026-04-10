# Secure Authentication Service  (JWT + Refresh Token Rotation)

A production-ready authentication system built with addvanced security features like JWT access tokens, refresh token rotation, Google OAuth integration, email verification, and rate limiting. The backend is implemented with Node.js, Express, MongoDB, and Mongoose, while the frontend is scaffolded with React and Vite.

## Project overview

This repository contains a full-stack authentication system split into two folders: a Node.js/Express backend (MongoDB + Mongoose) and a React frontend scaffold. The backend implements JWT access tokens, refresh token rotation, Google OAuth ID-token verification, email verification, password reset flows, and rate limiting for sensitive auth routes.

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

- Backend: Node.js, Express, MongoDB, Mongoose, JSON Web Tokens`
- Frontend: React, Vite (scaffold)
- Other: Google OAuth (google-auth-library), express-rate-limit, nodemailer

## Folder structure

- `/backend` — Express server and API implementation
	- `server.js` — app entry
	- `src/controllers` — auth logic (`auth.controller.js`)
	- `src/routes/auth.routes.js` — auth endpoints
	- `src/middlewares` — auth middleware, rate limiter
	- `src/models` — `user.model.js`, `refreshToken.model.js`
- `/frontend` — React app scaffold (development in progress)

## API overview (auth)

Primary endpoints (see `/backend/src/routes/auth.routes.js`):

- `POST /api/auth/register` — create account (email verification begins)
- `POST /api/auth/login` — credentials login (returns access token, sets refresh cookie)
- `POST /api/auth/google` — login/register via Google ID token
- `POST /api/auth/refresh-token` — rotate and return new access token
- `POST /api/auth/logout` — clear refresh cookie and invalidate token
- `GET /api/auth/verify-email` — verify account by token
- `POST /api/auth/resend-verification` — resend verification email
- `POST /api/auth/forgot-password` — request password reset email
- `POST /api/auth/reset-password` — complete password reset with token
- `GET /api/auth/profile` — example protected route (requires auth middleware)

Notes: rate limiting (`authLimiter` / `apiLimiter`) is applied to sensitive endpoints (login, forgot/reset password, verification).

## Setup

Prerequisites: Node.js 18+, npm, a MongoDB instance, and a configured email provider (SMTP) for verification/reset emails.

Backend (development):

1. cd into the backend folder
2. Install dependencies and run

```bash
cd backend
npm install
npm run dev
```

Frontend (development):

```bash
cd frontend
npm install
npm run dev
```

API base: by default the backend serves on the configured `PORT` (see env variables). The frontend is expected to call the API at your `CLIENT_URL` or proxied path depending on local setup.

## Environment variables

Create a `.env` in `/backend` with the following keys (do not commit secrets):

- `MONGODB_URI` — MongoDB connection string
- `PORT` — backend port (e.g. 4000)
- `JWT_SECRET` — secret for access tokens
- `REFRESH_TOKEN_SECRET` — secret for refresh tokens
- `ACCESS_TOKEN_EXPIRY` — access token lifetime (e.g. `15m`)
- `REFRESH_TOKEN_EXPIRY` — refresh token lifetime (database rotation still applies)
- `GOOGLE_CLIENT_ID` — Google OAuth client ID (verify ID tokens server-side)
- `EMAIL_SMTP_HOST` / `EMAIL_SMTP_PORT` — SMTP settings
- `EMAIL_USER` / `EMAIL_PASS` — SMTP credentials
- `CLIENT_URL` — frontend origin for email links (verification/reset)
- `COOKIE_DOMAIN` — (optional) domain for refresh cookie
- `NODE_ENV` — `development` or `production`

## Security notes (what makes this strong)

- Refresh tokens are stored and rotated in the database, preventing reuse of a stolen token.
- Refresh cookies are `HttpOnly` (and should be `Secure` in production) to mitigate XSS.
- Rate limiting protects login and recovery endpoints from brute-force attempts.
- Google ID tokens are verified server-side using `google-auth-library` to prevent token spoofing.
- Helmet for secure HTTP headers
- CORS configured with credentials support for cookie-based auth 

## Future improvements

- Add integration tests for auth flows and token rotation
- Harden cookie settings for multi-domain deployments
- Implement device/session management UI (revoke tokens per device)
- Add OAuth for other providers (GitHub, LinkedIn)
- Move email templates and queueing to a worker for scale

## Quick notes for reviewers

- Backend dev script: `npm run dev` (uses `nodemon server.js`) — see `/backend/package.json`.
- Frontend scaffold uses Vite — start with `npm run dev` in `/frontend`.
- Auth routes and middleware are implemented under `/backend/src` and demonstrate secure patterns appropriate for production-ready systems.

## Why this project?
This project focuses on building a secure and scalable authentication system using real-world practices such as token rotation,seacure cookies and rate limiting. goinng beyond basic JWT implementation.

---

