<div align="center">

# 🚀 Sojib Ahmed — Portfolio

### *A Cinematic Full-Stack Portfolio Experience*

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://sojib-ahmed-portfolio.vercel.app)
[![Server API](https://img.shields.io/badge/Server_API-Render-4D6E4F?style=for-the-badge&logo=render&logoColor=white)](https://sojib-ahmed-portfolio-server.onrender.com)

</div>

---

## 📖 Overview

A **premium full-stack portfolio website** built with the MERN stack, featuring a cinematic dark theme, AI-powered chatbot, admin dashboard, and stunning animations powered by GSAP, Framer Motion, and Three.js. This isn't just a portfolio — it's an interactive experience.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chatbot** | Google Gemini-powered conversational assistant |
| 🎬 **Cinematic Animations** | GSAP, Framer Motion & Three.js 3D effects |
| 📊 **Admin Dashboard** | Analytics, project management & insights |
| 📧 **Contact System** | Email notifications via Nodemailer |
| 🔗 **GitHub Integration** | Live GitHub stats & project sync |
| 🌙 **Dark / Light Mode** | Seamless theme switching |
| 📱 **Fully Responsive** | Pixel-perfect on every device |
| ⚡ **Blazing Fast** | Vite + React 19 for instant load |

---

## 🛠️ Tech Stack

### Client

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library with latest features |
| **Vite** | Lightning-fast build tool |
| **TypeScript** | Type-safe development |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** | Declarative animations |
| **GSAP** | Professional-grade animations |
| **Three.js** | 3D graphics & effects |
| **Zustand** | Lightweight state management |
| **React Hook Form + Zod** | Form handling & validation |
| **Axios** | HTTP client |
| **Swiper** | Touch-enabled carousels |
| **Recharts** | Beautiful data visualizations |
| **Lenis** | Smooth scroll experience |

### Server

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Secure authentication |
| **Nodemailer** | Email service |
| **Google Gemini API** | AI chatbot intelligence |

---

## 📁 Project Structure

```
Sojib-Ahmed-Portfolio/
├── client/                          # 🎨 React + Vite Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Chatbot.tsx          # Gemini AI Chatbot
│   │   │   ├── Footer.tsx
│   │   │   └── ui/                  # shadcn-style primitives
│   │   ├── pages/                   # Route pages
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── store/                   # Zustand state
│   │   ├── lib/                     # Utilities
│   │   ├── types/                   # TypeScript types
│   │   ├── App.tsx                  # Root component
│   │   └── main.tsx                 # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── server/                          # ⚙️ Express.js Backend
│   ├── src/
│   │   ├── config/                  # DB & env configuration
│   │   ├── controllers/             # Route handlers
│   │   ├── middleware/               # Auth & error middleware
│   │   ├── models/                  # Mongoose schemas
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Business logic
│   │   └── utils/                   # Helpers
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0
- **MongoDB** (local or Atlas)
- **Google Gemini API Key**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SojibTechHub/Sojib-Ahmed-Portfolio.git

# 2. Install Client Dependencies
cd client
npm install

# 3. Install Server Dependencies
cd ../server
npm install

# 4. Configure Environment Variables
cp .env.example .env
```

### Environment Variables

```env
# Server
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Client
VITE_API_URL=http://localhost:5000
```

### Run Development

```bash
# Terminal 1 — Client
cd client
npm run dev

# Terminal 2 — Server
cd server
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project (admin) |
| POST | `/api/contact` | Send contact email |
| POST | `/api/chat` | Chat with AI bot |

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | **Vercel** | [sojib-ahmed-portfolio.vercel.app](https://sojib-ahmed-portfolio.vercel.app) |
| Backend | **Render** | [sojib-ahmed-portfolio-server.onrender.com](https://sojib-ahmed-portfolio-server.onrender.com) |
| Database | **MongoDB Atlas** | Cloud |

---

## 👨‍💻 Author

**Sojib Ahmed**

[![GitHub](https://img.shields.io/badge/GitHub-SojibTechHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SojibTechHub)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sojib_Ahmed-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sojib-ahmed-shorif)
[![Portfolio](https://img.shields.io/badge/Portfolio-Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://my-portfolio-inky-two-40.vercel.app)

---

<div align="center">

**⭐ If you found this project helpful, give it a star!**

</div>
