# ShopWave — E-Commerce Marketplace

A full-stack web marketplace where users can buy and sell products, featuring search, categories, a shopping cart, JWT authentication, PayPal payments, and order tracking.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, React Router v6, Axios |
| Backend | Node.js, Express 4, Morgan |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Payments | PayPal REST SDK (@paypal/react-paypal-js) |
| Validation | express-validator |
| Deployment | Render (backend) + Vercel (frontend) |

## Features

- **Browse & Search** — keyword search with category filtering and pagination
- **Product Listings** — create, read, update, delete products (CRUD)
- **Shopping Cart** — persistent cart with quantity controls, subtotal, and shipping estimate
- **Checkout Flow** — shipping address → order review → PayPal payment
- **Order History** — view all past orders with payment/delivery status
- **Reviews** — authenticated users can leave star ratings and comments
- **Auth** — register/login with JWT; protected routes on both client and server
- **Profile** — update name, email, and password

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- PayPal Developer account (for sandbox payments)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd <repo>
bash scripts/setup.sh
```

### 2. Configure backend

```bash
cp project/backend/.env.example project/backend/.env
```

Edit `project/backend/.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/shopwave
JWT_SECRET=some_long_random_string
NODE_ENV=development
PAYPAL_CLIENT_ID=your_sandbox_client_id
```

### 3. Configure frontend

```bash
cp project/frontend/.env.example project/frontend/.env
```

`project/frontend/.env` defaults to `/api` (proxied via Vite) and works out of the box for local dev. No change needed unless running frontend and backend on different ports without the proxy.

### 4. Run

```bash
# Terminal 1 — backend
cd project/backend && npm run dev

# Terminal 2 — frontend
cd project/frontend && npm run dev
```

Open **http://localhost:5173**

## Environment Variables

### Backend (`project/backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port for Express server (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `NODE_ENV` | `development` or `production` |
| `PAYPAL_CLIENT_ID` | PayPal sandbox/live client ID |
| `FRONTEND_URL` | Frontend origin for CORS (production only) |

### Frontend (`project/frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `https://your-api.onrender.com/api`) |

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✓ | Get current user |
| GET | `/api/products` | — | List/search products |
| GET | `/api/products/:id` | — | Get product by ID |
| POST | `/api/products` | ✓ | Create product |
| PUT | `/api/products/:id` | ✓ owner | Update product |
| DELETE | `/api/products/:id` | ✓ owner | Delete product |
| POST | `/api/products/:id/reviews` | ✓ | Add review |
| POST | `/api/orders` | ✓ | Place order |
| GET | `/api/orders/myorders` | ✓ | Get user's orders |
| GET | `/api/orders/:id` | ✓ | Get order by ID |
| PUT | `/api/orders/:id/pay` | ✓ | Mark order paid |
| PUT | `/api/users/profile` | ✓ | Update profile |
| GET | `/api/users/paypal-config` | — | Get PayPal client ID |

## Deployment

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Root directory: `project/backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables from the table above

### Frontend → Vercel

1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `project/frontend`
3. Framework preset: **Vite**
4. Add env var: `VITE_API_URL=https://your-render-service.onrender.com/api`

## Demo

- **Live App:** https://cosi152a-final-project.vercel.app/
- **Demo Video:** https://drive.google.com/file/d/1MytmWB5V_aJ9DWUd070UXyNZLFKjJvi9/view?usp=sharing

## Author

Built by Baaree Siddiqi for COSI 152A, Brandeis University.
