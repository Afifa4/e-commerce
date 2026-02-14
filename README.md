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
# 1. Build the frontend first (creates client/dist with index.html and assets/)
cd client && npm run build

# 2. Run the backend (in production it will serve client/dist)
cd server && npm start
```

## Deployment: 404 for `/assets/index-xxx.js`

If after deploying you see **Failed to load resource: 404** for a file like `/assets/index-CzYLtchu.js`, the server cannot find the built frontend files.

**When the backend serves the frontend (single deploy, e.g. Render/Railway):**

1. **Build the client before or during deploy**  
   Your build step must run `cd client && npm run build` so that `client/dist` contains `index.html` and an `assets/` folder with the hashed JS/CSS files.

2. **Where the server looks for files**  
   The server serves from `client/dist` (relative to the server folder). So your repo on the server must have:
   - `server/` (with app, routes, etc.)
   - `client/dist/` (with `index.html` and `assets/`).

   If your deploy runs only from `server/` and never builds or copies the client, set **`CLIENT_DIST_PATH`** in the server env to the **absolute path** of the built frontend (e.g. `/app/client/dist` or wherever the build output is).

3. **Redeploy**  
   After fixing the build or path, redeploy so the server can serve `/assets/*` and `index.html` from that folder.

**When the frontend is on a subpath (e.g. `https://example.com/my-app/`):**

- Set **`VITE_BASE_PATH=/my-app/`** when building the client (e.g. in your build env or `.env`), then run `npm run build`. Asset URLs will then be `/my-app/assets/...` and will load correctly.
