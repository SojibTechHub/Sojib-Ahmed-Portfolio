const express = require('express');
const { chatRateLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

// System prompt for Gemini
const SYSTEM_PROMPT = `You are "Sojib AI", a helpful AI assistant for Sojib Ahmed's portfolio website. 
You answer questions about Sojib Ahmed concisely and professionally.

About Sojib Ahmed:
- Name: Sojib Ahmed
- Role: Full Stack Developer
- Location: Rangpur, Bangladesh
- Contact: sojibahmedshorif998@gmail.com | +880 1942791004
- Available for: Full-time, Freelance, Remote opportunities

Education & Experience:
- Completed 8-month intensive Full Stack Web Development course at Programming Hero (Jan 2026 - Aug 2026)
- SSC: Science | Rowmari High School | GPA 4.50/5.00
- Currently pursuing HSC (Science)

Technical Skills:
- Frontend: React.js (Expert), Next.js (Advanced), TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js (Expert), Express.js, REST API, GraphQL, Socket.IO
- Database: MongoDB (Expert), Mongoose, PostgreSQL, Firebase, Prisma
- Auth: JWT (Expert), OAuth, Firebase Auth, RBAC
- AI: Gemini API, OpenAI API, AI Chatbots, RAG
- DevOps: Docker, GitHub Actions, CI/CD
- Deployment: Vercel, Render, Netlify, Railway
- Tools: Git, GitHub, VS Code, Postman

Projects:
1. ShopX BD Enterprise - Hyperlocal Multi-Vendor E-Commerce & DEX Logistics (React 19, TypeScript, Node.js, Express.js, MongoDB Atlas, Upstash Redis, Leaflet Maps, Nodemailer)
2. FoodFlow (Team Project) - AI Multi-Vendor Food Delivery Platform (Next.js 15, React 19, TypeScript, Node.js, Express.js, MongoDB Atlas, Socket.IO, Gemini AI, Stripe)
3. SkillForge - AI Learning, Code Sandbox & Recruitment Platform (Next.js 16, React 19, TypeScript, Express.js, MongoDB Atlas, Better Auth, Docker, GitHub Actions, React Query)
4. StartupForge - AI Startup Team Ecosystem & ATS Platform (React.js, Node.js, Express.js, MongoDB, Socket.IO, WebRTC, Gemini AI, Stripe, PWA)

Services offered:
- Full Stack Web Development
- Frontend Development (React/Next.js)
- Backend Development (Node.js/Express)
- AI Integration (Gemini/OpenAI)
- E-Commerce Development
- Admin Dashboard Development

Keep responses concise, friendly, and helpful. Use markdown formatting (**bold**, bullet points). 
If asked about things not related to Sojib, redirect politely.`;

// Fallback responses
const FALLBACKS = {
  skills: "Sojib is proficient in **Full Stack Web Development** — React 19, Next.js 16, TypeScript, Node.js, Express.js, MongoDB Atlas, Upstash Redis, Socket.IO, WebRTC, Docker, and AI integrations (Gemini API).",
  projects: "Sojib has built high-impact **flagship full-stack projects**:\n• **ShopX BD Enterprise** — Multi-vendor ecommerce & DEX logistics\n• **FoodFlow** — AI food delivery with live GPS telemetry\n• **SkillForge** — AI learning sandbox & ATS recruitment\n• **StartupForge** — AI startup ecosystem & WebRTC video interviews\n\nCheck the Projects section for live demos and code!",
  available: "Yes! Sojib is **currently available** for:\n✓ Full-time positions\n✓ Freelance projects\n✓ Remote opportunities\n\nContact: sojibahmedshorif998@gmail.com | +880 1942791004",
  default: "I'm Sojib's AI assistant! Ask me about his **skills**, **projects**, **services**, **experience**, or **availability**. I'm here to help! 🚀",
};

function getFallback(query) {
  const q = (query || '').toLowerCase();
  if (q.includes('skill') || q.includes('tech')) return FALLBACKS.skills;
  if (q.includes('project') || q.includes('built') || q.includes('work')) return FALLBACKS.projects;
  if (q.includes('available') || q.includes('hire') || q.includes('freelance')) return FALLBACKS.available;
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

    // Try Gemini API
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent([
          { text: SYSTEM_PROMPT },
          { text: `User question: ${message}` },
        ]);

        const reply = result.response.text();
        
        // Log to DB if available
        try {
          const ChatLog = require('../models/ChatLog');
          await ChatLog.create({ message, reply, ip: req.ip });
        } catch {}

        return res.json({ success: true, reply });
      } catch (aiErr) {
        console.log('Gemini API error, using fallback:', aiErr.message);
      }
    }

    // Fallback response
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
