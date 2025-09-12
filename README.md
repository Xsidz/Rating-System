## Rating System — Monorepo (Backend + Frontend)

A full‑stack rating system with a Node/Express + MySQL backend and a React (Vite) frontend using Zustand for state management. The backend auto‑creates the database/tables if they do not exist.

### Repo Structure
- `backend/`: Express API, authentication, MySQL schema and models
- `frontend/`: React app (Vite) with routing, dashboards, and rating UI

### Prerequisites
- Node.js 18+
- npm 9+
- MySQL 8+ (server running locally)

### Environment Variables
Create a `.env` file inside `backend/` with:
```
PORT=5500
NODE_ENV=development

DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=rating_system

JWT_SECRET=replace_with_a_strong_secret
```
Notes:
- The backend will connect to MySQL and, if the database does not exist, create it and required tables automatically.
- Cookies use `secure: NODE_ENV !== "development"`. For local testing keep `NODE_ENV=development`.
- CORS is configured for `http://localhost:5173` by default.

### Install Dependencies
Run these commands at the repo root (two terminals recommended):

Backend
```
cd backend
npm install
```

Frontend
```
cd frontend
npm install
```

### Start the Apps (Local Development)
Backend (Express on port 5500)
```
cd backend
npm run dev
```
This starts the API and connects to MySQL. On first run it creates the schema, tables, and default demo data.

Frontend (Vite on port 5173)
```
cd frontend
npm run dev
```
Open the printed URL (usually `http://localhost:5173`).

### Frontend Configuration
- Axios base URL: `frontend/src/lib/axios.js` defaults to `http://localhost:5500/` and `withCredentials: true`.
- Routing and protected routes are configured in `frontend/src/App.jsx` and `frontend/src/components/ProtectedRoute.jsx`.

### Default Demo Data
On first run, the system automatically creates:

**Default Users:**
- **User**: `Roxiller@user.com` / `Roxiller@2025`
- **Store Owner**: `Roxiller@store_Owner.com` / `Roxiller@2025`
- **Admin**: `Roxiller@admin.com` / `Roxiller@2025`

**Default Store:**
- **Name**: "Roxiller Systems Store"
- **Email**: `Roxiller@store.com`
- **Owner**: Roxiller Systems Store Owner
- **Address**: VCC Vantage 9, Pashan Hwy Side Rd, Baner, Pune, Maharashtra 411069


### Auth & Roles
- Signup creates users with role `user` by default.
- Default demo accounts are ready to use immediately for testing all features.

### Key Scripts
- Backend: `npm run dev` (nodemon)
- Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`



### API Overview (High Level)
- Auth: `/auth/signup`, `/auth/login`, `/auth/logout`, `/auth/check`
- Users: `/api/users/...`
- Stores: `/api/stores/stores` (GET/POST)
- Ratings: `/api/ratings` (POST), `/api/ratings/:id` (PUT), `/api/ratings/stores/:storeId` (GET), `/api/ratings/user` (GET)
- Dashboard: `/api/dashboard`

All endpoints expect/return JSON; cookies carry JWT tokens. The backend sets an HTTP‑only `jwt` cookie on successful login/signup.



### Tech Stack
- Backend: Node.js, Express, mysql2, JWT, cookie‑parser, CORS, dotenv
- Frontend: React (Vite), React Router, Zustand, Axios, Tailwind (via PostCSS plugin)




