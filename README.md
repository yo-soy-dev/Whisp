# Whisp — Real-Time Video Calling & Chat App

A production-ready real-time messaging and video calling application with modern tech stack and fully configured for **deployment on Render**.

---

## 🚀 Features

* **Real-Time Chat** (Socket.IO)
* **Video Calling** (WebRTC + Signaling)
* **Friends System**
* **JWT Authentication**
* **Onboarding Flow**
* **Protected Routes**
* **32 UI Themes**
* **Custom Hooks & Clean Architecture**
* **MongoDB + Express + React + TanStack Query**
* **API Testing Setup**
* **Deployment Ready for Render**

---

## 🛠️ Tech Stack

### **Frontend**

* React
* TanStack Query
* React Router
* Tailwind

### **Backend**

* Node.js / Express
* MongoDB / Mongoose
* Socket.IO
* JWT Auth

---

# 🔧 Local Setup

## 1. Clone Repo

```bash
git clone https://github.com/<your-user>/whisp.git
cd whisp
```

## 2. Install Dependencies

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd ../client
npm install
```

---

# ⚙️ Environment Variables

## Server `.env`

```
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_ACCESS_SECRET=<access-secret>
JWT_REFRESH_SECRET=<refresh-secret>
CLIENT_URL=https://<your-render-frontend-url>
NODE_ENV=production
```

## Client `.env`

```
VITE_API_URL=https://<your-render-backend-url>/api
VITE_SOCKET_URL=https://<your-render-backend-url>
```

---

# 🚀 Deploying WHISP on Render

Below are **step-by-step instructions** for deploying **backend and frontend**.

---

## 🟩 1. Deploy Backend (Node.js + Express + Socket.IO)

### **1. Create New Service**

* Go to **Render Dashboard** → *New → Web Service*
* Choose your **server** folder repo
* Select runtime **Node**
* Set **Build Command:**

```
npm install
```

* Set **Start Command:**

```
node src/index.js
```

### **2. Add Environment Variables**

In Render → *Environment* → Add all variables from the `.env` file:

* `MONGO_URI`
* `JWT_ACCESS_SECRET`
* `JWT_REFRESH_SECRET`
* `CLIENT_URL`
* `PORT=10000` (Render sets its own port variable)

### **3. Enable WebSockets**

* Go to the service → *Settings*
* Scroll to **WebSockets** → Enable

### **4. Save & Deploy**

Render builds and deploys automatically.

---

## 🟦 2. Deploy Frontend (React Vite App)

### **1. Create Static Site on Render**

* Dashboard → *New → Static Site*
* Select your **client** folder

### **2. Configure Settings**

* **Build Command:**

```
npm install && npm run build
```

* **Publish Directory:**

```
dist
```

### **3. Add ENV Vars**

Enable environment variables in Render for Vite:

```
VITE_API_URL=https://<your-backend-url>/api
VITE_SOCKET_URL=https://<your-backend-url>
```

### **4. Deploy**

Render auto-builds and deploys.

---

# 🔗 Connecting Frontend and Backend

Vite frontend will call the backend using:

```
import.meta.env.VITE_API_URL
import.meta.env.VITE_SOCKET_URL
```

Make sure CORS settings in backend allow:

```
https://your-render-frontend-url
```

---

# 📁 Recommended Project Structure

```
whisp/
  ├── server/
  │   ├── src/
  │   ├── package.json
  │   └── .env
  └── client/
      ├── src/
      ├── package.json
      └── .env
```

---

# 🧪 Testing

* Backend API Testing → **Jest + Supertest**
* Frontend Unit Tests → **Vitest + React Testing Library**

---

# 🛡️ Production Tips for Render

* Add "Health Checks" route → `/api/health`
* Use `helmet()` for security headers
* Enable CORS strictly
* Use MongoDB Atlas for DB
* Add a TURN server for stable video calling

---

# 👍 Deployment Complete!

Your **WHISP app** is now live on Render with real-time WebRTC calling + chat.

If you want, I can also add:

* A **Render.yaml** for fully automatic deploys
* Docker deployment version
* Postman documentation
* Example `.env.example` files

Just tell me!
