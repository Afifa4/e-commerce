# Deploy e-commerce to Render

Use this guide to deploy [github.com/Afifa4/e-commerce](https://github.com/Afifa4/e-commerce) on Render with the account **464afifariaz@gmail.com**.

---

## 1. Push your code to GitHub

Make sure the latest code (including `render.yaml`) is pushed to:

**https://github.com/Afifa4/e-commerce**

```bash
git add .
git commit -m "Add Render config"
git push origin main
```

---

## 2. Create a MongoDB database (if you don’t have one)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a free cluster (or use an existing one).
3. **Database Access** → Add user (e.g. `render-user`) and note the password.
4. **Network Access** → Add IP **0.0.0.0/0** (allows Render to connect).
5. **Database** → Connect → **Drivers** → copy the connection string.  
   It looks like:  
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/DBNAME?retryWrites=true&w=majority`  
   Replace `USER`, `PASSWORD`, and `DBNAME` with your values.

---

## 3. Sign in to Render

1. Open [https://render.com](https://render.com).
2. Click **Get Started** or **Sign In**.
3. Sign in with the account **464afifariaz@gmail.com** (GitHub or email, depending on how you signed up).

---

## 4. Create a new Web Service from GitHub

1. In the Render dashboard, click **New +** → **Web Service**.
2. Connect **GitHub** if you haven’t already (use the same account that owns **Afifa4/e-commerce**).
3. Select the repo: **Afifa4/e-commerce**.
4. Use these settings:

   | Setting | Value |
   |--------|--------|
   | **Name** | `e-commerce` (or any name you like) |
   | **Region** | Oregon (or closest to you) |
   | **Branch** | `main` |
   | **Root Directory** | Leave empty (use repo root) |
   | **Runtime** | Node |
   | **Build Command** | See below |
   | **Start Command** | See below |

5. **Build Command** (paste as one block):

   ```bash
   cd client && npm install && npm run build && mkdir -p ../server/public && cp -r dist/* ../server/public/ && cd ../server && npm install
   ```

6. **Start Command**:

   ```bash
   cd server && node simple-server.js
   ```

7. Click **Advanced** and add **Environment Variables**:

   | Key | Value |
   |-----|--------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string from step 2 |
   | `PORT` | `3000` (Render sets this automatically; you can leave it or set 3000) |
   | `CLIENT_URL` | Leave empty for now; after first deploy it will be `https://YOUR-SERVICE-NAME.onrender.com` – you can add it later if needed for CORS |

8. Click **Create Web Service**.

Render will clone the repo, run the build, then start the server. The first deploy can take a few minutes.

---

## 5. Get your live URL

When the deploy finishes, Render shows a URL like:

**https://e-commerce-xxxx.onrender.com**

Open it in the browser. You should see:

- **/** – Home  
- **/admin** – Admin dashboard  
- **/listing** – Products  

---

## 6. (Optional) Use Blueprint instead of manual setup

If you prefer to use the `render.yaml` in the repo:

1. In Render: **New +** → **Blueprint**.
2. Connect **Afifa4/e-commerce** and select the repo.
3. Render will read `render.yaml` and create the Web Service. You still must add **MONGODB_URI** in the service’s **Environment** tab (and adjust **Build Command** / **Start Command** if your repo doesn’t copy `client/dist` into `server/public` – the commands in step 4 do that).

---

## Troubleshooting

- **Build fails**  
  Check the **Build logs** in Render. Often it’s a missing env (e.g. `MONGODB_URI`) or a typo in the build/start commands.

- **App shows “Cannot GET /” or blank page**  
  The build must copy the client build into `server/public`. Ensure the build command includes:  
  `mkdir -p ../server/public && cp -r dist/* ../server/public/`

- **Database connection error**  
  Check **MONGODB_URI** in Render Environment, and in Atlas that **Network Access** allows **0.0.0.0/0**.

- **404 for /assets/xxx.js**  
  Same as above: the frontend must be built and copied into `server/public` during the build step.

---

You have to complete these steps yourself in your Render account; no one can deploy from your **464afifariaz@gmail.com** account for you. If you hit a specific error (e.g. build log or a screenshot), share it and we can fix the next step.
