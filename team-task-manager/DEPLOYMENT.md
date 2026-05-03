# Deployment Guide: Team Task Manager

## 1. Database: MongoDB Atlas
*   You are already connected to MongoDB Atlas! Your `MONGO_URI` is stored in the `.env` file. 
*   Ensure that **Network Access** in Atlas allows connections from `0.0.0.0/0` (universal access) so that Render/Vercel can connect.

---

## 2. Backend: Render / Railway
1.  **Repository**: Push your code to GitHub.
2.  **Create Web Service**: Connect your GitHub repo.
3.  **Root Directory**: Set to `backend`.
4.  **Build Command**: `npm install`
5.  **Start Command**: `npm start`
6.  **Environment Variables**:
    *   `MONGO_URI`: (Your Atlas connection string)
    *   `JWT_SECRET`: (Your secret key)
    *   `PORT`: `10000` (Render default)

---

## 3. Frontend: Vercel
1.  **Repository**: Connect the same GitHub repo.
2.  **Root Directory**: Set to `frontend`.
3.  **Framework Preset**: Vite.
4.  **Build Command**: `npm run build`
5.  **Output Directory**: `dist`
6.  **Environment Variables**:
    *   `VITE_API_URL`: `https://your-backend-url.onrender.com/api`

---

## 4. Final Steps
*   Once both are deployed, update the `VITE_API_URL` in Vercel to point to your live Render URL.
*   Test the Login and Dashboard flows to ensure data is persisting in Atlas.
