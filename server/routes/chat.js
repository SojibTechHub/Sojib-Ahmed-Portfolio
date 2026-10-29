const express = require('express');
const { chatRateLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

// Comprehensive System Prompt for Gemini AI
const SYSTEM_PROMPT = `You are "Sojib AI", the official intelligent AI assistant for Sojib Ahmed's portfolio website.
Your mission is to provide REAL, ACCURATE, TRUTHFUL, and SPECIFIC answers to whatever the user asks.

=== CORE DEVELOPER IDENTITY ===
- Name: Sojib Ahmed
- Title & Role: Full Stack Developer
- Location: Rangpur, Bangladesh
- Direct Contact / Phone / WhatsApp: +880 1942791004 (or 01942791004)
- Email: sojibahmedshorif998@gmail.com
- GitHub Profile: https://github.com/SojibTechHub
- Availability: Open to Full-time, Remote & Freelance engineering worldwide. Usually replies within minutes on WhatsApp or Email.

=== OFFICIALLY VERIFIED CREDENTIALS ===
1. FlyRank — Full Stack Web Development Appointment & Engineering Offer Letter (2026 Cohort, ID: FLYRANK-2026-ENG-SOJIB)
2. Programming Hero — Official Letter of Recommendation for the FoodFlow Team Project (Code Rangers vs 6), signed by Jhankar Mahbub & Ahmad Tarique Hasan (ID: RID: PH-R 1190)
3. Programming Hero — Complete Web Development Course Certificate of Excellence (Batch 13, ID: PH-BATCH13-2026-SOJIB)
4. Datheon AI Systems — Full Stack Systems & Engineering Internship Record (ID: DT-2026-33B1M)

=== 10 FLAGSHIP & PRODUCTION PROJECTS ===
1. ShopX BD Enterprise (Full-Stack Flagship): Hyperlocal multi-vendor ecommerce & DEX logistics platform with 4 isolated role portals (Customer, Seller, Super Admin with 2FA Email OTP, Delivery Rider with KYC approval), real-time Leaflet GPS telemetry, and Upstash Redis caching.
2. FoodFlow (Full-Stack Flagship / Team Project): AI-powered multi-vendor food delivery platform with Socket.IO bidirectional telemetry, Leaflet GIS mapping, Google Gemini AI meal recommendation pipelines, and Stripe payments.
3. SkillForge (Full-Stack Flagship): Full-stack AI learning, code sandbox, and ATS recruitment platform built with Next.js 16, React 19, Express, MongoDB Atlas, Docker, and CI/CD pipelines.
4. StartupForge (Full-Stack Flagship): AI startup ecosystem, WebRTC video interviews, and team matching ATS platform.
5. TypeMarket Store (Frontend): Custom mechanical keyboard e-commerce store with interactive 3D configurator, sound tester, and Stripe checkout.
6. InvestProp AI (Frontend): AI real estate analytics, property valuation, and ROI forecasting platform.
7. Issue Tracker Pro (Frontend): High-performance sprint management and bug tracking workflow platform.
8. Pet Adoption Platform API (Backend): Resilient pet rescue and adoption REST API with JWT auth and Cloudinary media processing.
9. Job Finder API Gateway (Backend): High-concurrency recruitment and application service with compound MongoDB indexing and rate-limiting.
10. Books Platform REST API (Backend): Digital library catalog and review aggregation engine.

=== TECHNICAL SKILLS ===
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL
- Frontend: React 19, Next.js 16, Tailwind CSS, Framer Motion, Three.js, Redux Toolkit, React Query
- Backend: Node.js, Express.js, RESTful APIs, WebSockets (Socket.IO), WebRTC
- Databases & Caching: MongoDB Atlas, Mongoose, PostgreSQL, Upstash Redis
- Security: JWT, OAuth, 2FA OTP, bcrypt, RBAC, Helmet, rate-limiting
- Cloud & DevOps: Docker, Vercel, Render, Netlify, Railway, GitHub Actions CI/CD
- AI Integration: Google Gemini AI API, OpenAI API, Prompt Engineering, RAG

=== RESPONSE RULES ===
1. Answer the EXACT question the user asks with real, truthful facts.
2. Language: If the user asks in Bengali or Banglish, answer naturally and fluently in Bengali / Banglish. If asked in English, answer in English.
3. If asked about contact info, phone, or WhatsApp, immediately provide: WhatsApp/Phone: +880 1942791004 and Email: sojibahmedshorif998@gmail.com.
4. If asked coding or technical questions, provide clear, accurate, high-quality programming answers like a skilled senior developer.
5. Format responses neatly with markdown (**bold**, bullet points, code blocks where appropriate). Keep answers direct and engaging.`;

// Intelligent Fallbacks
const FALLBACKS = {
  skills: "Sojib is an experienced **Full Stack Developer** specializing in:\n• **Frontend:** React 19, Next.js 16, TypeScript, Tailwind CSS, Framer Motion\n• **Backend:** Node.js, Express.js, REST APIs, Socket.IO, WebRTC\n• **Databases:** MongoDB Atlas, Upstash Redis, PostgreSQL\n• **DevOps & AI:** Docker, CI/CD, Google Gemini AI & OpenAI integration.",
  projects: "Sojib has engineered **10 production-grade projects**, including:\n• **ShopX BD Enterprise** — Multi-vendor ecommerce & DEX logistics\n• **FoodFlow** — AI food delivery with live GPS telemetry (Team Project)\n• **SkillForge** — AI learning sandbox & ATS recruitment\n• **StartupForge** — Startup ecosystem & WebRTC video interviews\n\nCheck out the Projects section on this page to explore full details and live demos!",
  whatsapp: "You can reach Sojib directly on **WhatsApp** at **+880 1942791004** (01942791004). You can also click the WhatsApp button right above this chat window to message him instantly!",
  available: "Yes! Sojib is **actively available** for:\n✓ Full-time engineering roles\n✓ Remote opportunities worldwide\n✓ Freelance & contract projects\n\nDirect WhatsApp: **+880 1942791004**\nEmail: **sojibahmedshorif998@gmail.com**",
  certificates: "Sojib holds 4 verified credentials:\n1. **FlyRank** — Full Stack Web Development Appointment Letter\n2. **Programming Hero** — Letter of Recommendation (FoodFlow, signed by Jhankar Mahbub & Ahmad Tarique Hasan)\n3. **Programming Hero** — Complete Web Development Course Certificate (Batch 13)\n4. **Datheon AI Systems** — Full Stack Systems Internship Record",
  default: "I'm Sojib AI! I can answer anything about Sojib Ahmed's **skills**, **projects**, **credentials**, **experience**, or connect you via **WhatsApp (+880 1942791004)**. What would you like to know?",
};

function getFallback(query) {
  const q = (query || '').toLowerCase();
  if (q.includes('whatsapp') || q.includes('number') || q.includes('phone') || q.includes('call') || q.includes('নাম্বার') || q.includes('হোয়াটসঅ্যাপ')) {
    return FALLBACKS.whatsapp;
  }
  if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('দক্ষতা')) {
    return FALLBACKS.skills;
  }
  if (q.includes('project') || q.includes('built') || q.includes('work') || q.includes('কাজ') || q.includes('প্রজেক্ট')) {
    return FALLBACKS.projects;
  }
  if (q.includes('certificate') || q.includes('recommendation') || q.includes('flyrank') || q.includes('programming hero') || q.includes('সার্টিফিকেট')) {
    return FALLBACKS.certificates;
  }
  if (q.includes('available') || q.includes('hire') || q.includes('job') || q.includes('freelance') || q.includes('হায়ার')) {
    return FALLBACKS.available;
  }
  return FALLBACKS.default;
}

// POST /api/chat
router.post('/', chatRateLimiter, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (message.length > 500) {
      return res.status(400).json({ success: false, message: 'Message too long (max 500 characters)' });
    }

    // Call Gemini API using modern gemini-3.5-flash-lite
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

        const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${message}\n\nAssistant Response:`;
        const result = await model.generateContent(prompt);
        const reply = result.response.text();
        
        // Log chat to DB if available
        try {
          const ChatLog = require('../models/ChatLog');
          await ChatLog.create({ message, reply, ip: req.ip });
        } catch {}

        return res.json({ success: true, reply });
      } catch (aiErr) {
        console.log('Gemini API call failed, falling back to intelligent response:', aiErr.message);
      }
    }

    // Intelligent Fallback response
    const reply = getFallback(message);
    try {
      const ChatLog = require('../models/ChatLog');
      await ChatLog.create({ message, reply, ip: req.ip });
    } catch {}

    res.json({ success: true, reply });
    
  } catch (error) {
    console.error('Chat route error:', error);
    res.json({ success: true, reply: getFallback(req.body?.message) });
  }
});

// GET /api/chat/logs (Admin only)
router.get('/logs', require('../middleware/auth'), async (req, res) => {
  try {
    const ChatLog = require('../models/ChatLog');
    const logs = await ChatLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: logs, total: logs.length });
  } catch (err) {
    res.json({ success: true, data: [], total: 0 });
  }
});

// DELETE /api/chat/logs/:id (Admin only)
router.delete('/logs/:id', require('../middleware/auth'), async (req, res) => {
  try {
    const ChatLog = require('../models/ChatLog');
    await ChatLog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Chat log deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
