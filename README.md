# e-commerce

Full-stack e-commerce app: React frontend + Node/Express backend, with admin panel and shopping storefront.

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), Multer, Cloudinary (optional)

## Prerequisites

- Node.js (v18+)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## Installation

bash
cd server
npm install
cp .env.example .env

# Edit .env and set MONGODB_URI (and optional Cloudinary vars)

# Frontend

cd client
npm install
cp .env.example .env

# Optional: set VITE_API_URL if not using default (e.g. http://localhost:3000)

````

## How to run

**Terminal 1 – backend**

```bash
cd server
npm run dev
````

Runs at `http://localhost:3000`.

**Terminal 2 – frontend**

```bash
cd client
npm run dev
```

Runs at `http://localhost:5173`. Open this URL in the browser.

## Routes

### Admin

| Route             | Description                         |
| ----------------- | ----------------------------------- |
| `/admin`          | Admin dashboard                     |
| `/admin/products` | Manage products (add, edit, delete) |
| `/admin/orders`   | View orders                         |

### Shopping

Route -Description
`/` -Home
`/listing` - All products
`/checkout` -Cart
`/account` -My account

## Environment variables

**Server (`server/.env`)**

- `MONGODB_URI` – MongoDB connection string (required)
- `PORT` – default 3000
- `CLIENT_URL` – frontend URL, e.g. `http://localhost:5173`
- `CLOUDINARY_*` – optional, for image uploads

**Client (`client/.env`)**

- `VITE_API_URL` – backend URL (optional in dev; Vite can proxy to `http://localhost:3000`)

## Build for production

```bash
# Frontend
cd client && npm run build
# Output in client/dist

# Backend: run with
cd server && npm start
```
