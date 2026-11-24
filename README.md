# Dorm Mart — Master System

**Dorm Mart** is a privacy-first, community-driven marketplace built exclusively for university dormitory residents. It acts as a **product discovery and listing platform** where students can browse, search, and list second-hand or everyday items and connect directly with sellers.

> **Core Philosophy:** Dorm Mart does **NOT** process payments, collect fees, charge commissions, or handle deliveries. Buyers and sellers communicate directly via external apps (Zalo, Telegram, Messenger) and arrange physical handovers independently.

---

## 🚀 Technology Stack

* **Frontend (`client/`):** React 18, Vite, Tailwind CSS, Lucide React, React Router v6, Axios, `@react-oauth/google`.
* **Backend (`server/`):** Node.js, Express.js, Mongoose.
* **Database:** MongoDB Atlas (6 models: `User`, `Product`, `Category`, `Favorite`, `Report`, `AdminLog`).
* **Authentication:** Google OAuth 2.0 (with development demo mode).
* **Image Hosting:** Cloudinary (with automatic local storage fallback for dev).
* **Deployment:** Netlify (`netlify.toml` included).

---

## 📁 Project Structure

```text
DormMart/
│
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/          # Navbar, Footer, ProductCard, ContactModal
│   │   ├── context/             # AuthContext, FavoritesContext
│   │   ├── pages/               # Home, Marketplace, ProductDetail, CreateListing,
│   │   │                        # MyListings, Favorites, Profile, Login, AdminDashboard
│   │   ├── services/            # Axios API client
│   │   ├── App.jsx              # Routing & Route Protection
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                      # Node.js + Express Backend
│   ├── config/                  # MongoDB connection & Cloudinary uploader
│   ├── controllers/             # Auth, Product, Category, Favorite, Report, Admin
│   ├── middleware/              # Auth & Role verification (RBAC)
│   ├── models/                  # User, Product, Category, Favorite, Report, AdminLog
│   ├── routes/                  # Express route definitions
│   ├── seed/                    # Seed script for 9 blueprint categories
│   ├── app.js                   # Express application setup
│   ├── server.js                # Server entrypoint
│   └── package.json
│
├── netlify.toml                 # Netlify deployment configuration
├── .env.example                 # Environment variables template
└── README.md
```

---

## ⚙️ Environment Configuration

Create a `.env` file inside the `server/` directory (or use `.env.example` as a template):

```env
PORT=5000
NODE_ENV=development

# 1. MongoDB Atlas
# Replace with your connection string from MongoDB Atlas:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dormmart?retryWrites=true&w=majority

# 2. JWT Authentication
JWT_SECRET=your_jwt_secret_key_here

# 3. Google OAuth (Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# 4. Cloudinary Image Storage (Free Tier)
# If left empty, images will save to local server/uploads/ for testing
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# 5. Client URL
CLIENT_URL=http://localhost:5173
```

For the client, create `client/.env`:
```env
VITE_API_URL=/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 🛠️ Local Development

### 1. Start the Server
```bash
cd server
npm install
npm run seed       # Seeds the 9 blueprint categories to MongoDB
npm run dev        # Starts server on http://localhost:5000
```

### 2. Start the Frontend
In a separate terminal window:
```bash
cd client
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🔒 Privacy & Safety Implementation

1. **No Student IDs or School Credentials:** Dorm Mart strictly prohibits collecting student cards, school IDs, university emails, or academic verification documents.
2. **Contact Privacy:** Gmail addresses and private handles are never returned in public listing cards or profiles.
3. **Intentional "Contact Seller" Interaction:** External contact options (Zalo, Telegram, Messenger, Phone) are only revealed when a user intentionally clicks **"Contact Seller"**.
4. **General Meeting Spots:** Location is strictly an optional, general public meeting point (e.g., *"Building A lobby"* or *"Near main entrance"*). Exact room numbers are never stored.

---

## ☁️ Netlify Deployment Guide

1. Push your repository to **GitHub**.
2. Log into **[Netlify](https://www.netlify.com/)** and select **"Add new site" > "Import an existing project"**.
3. Choose your GitHub repository.
4. Netlify will automatically detect `netlify.toml`:
   * **Base directory:** `client`
   * **Build command:** `npm run build`
   * **Publish directory:** `client/dist`
5. Host your backend `server/` on **Render**, **Railway**, or **Fly.io** (free/affordable Node.js hosting with continuous uptime).
6. In `netlify.toml`, update the API redirect URL to your deployed server:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://your-backend.onrender.com/api/:splat"
     status = 200
   ```
7. Add your `VITE_GOOGLE_CLIENT_ID` in the Netlify Site Settings > Environment Variables.
