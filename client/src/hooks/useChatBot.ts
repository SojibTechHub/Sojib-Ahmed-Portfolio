import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const FALLBACK_RESPONSES: Record<string, string> = {
  whatsapp: "You can chat with Sojib directly on **WhatsApp** at **+880 1942791004** (01942791004), or tap the WhatsApp button right above this chat window! He typically responds within minutes.",
  skills: "Sojib is proficient in **Full Stack Web Development**:\n• **Frontend:** React 19, Next.js 16, TypeScript, Tailwind CSS, Framer Motion\n• **Backend:** Node.js, Express.js, REST APIs, Socket.IO, WebRTC\n• **Databases:** MongoDB Atlas, PostgreSQL, Upstash Redis\n• **Cloud & AI:** Docker, CI/CD, Google Gemini AI & OpenAI integration.",
  projects: "Sojib has built **10 production & flagship projects**:\n1. **ShopX BD Enterprise** — Hyperlocal Multi-Vendor E-Commerce & DEX Logistics (React 19, Node.js, Redis, Leaflet)\n2. **FoodFlow** — AI-Powered Multi-Vendor Food Delivery (Next.js 15, Socket.IO, Gemini AI, Stripe)\n3. **SkillForge** — AI Learning, Code Sandbox & ATS Platform\n4. **StartupForge** — Startup Ecosystem & WebRTC Video Interviews\n...and 6 more! Check out the Projects section for full details and live demos.",
  services: "Sojib offers production engineering services:\n• **Full Stack Web Applications** (MERN & Next.js)\n• **High-Performance APIs & Microservices** (Node.js/Express)\n• **Frontend UI/UX Systems** (React 19, Tailwind, 3D)\n• **AI Integrations & Automation** (Gemini AI, Chatbots)",
  available: "Yes! Sojib is **actively available** for:\n✓ Full-time engineering roles\n✓ Remote opportunities worldwide\n✓ Freelance & contract projects\n\nReach him directly at **+880 1942791004** (WhatsApp/Call) or **sojibahmedshorif998@gmail.com**.",
  experience: "Sojib is a dedicated Full Stack Developer with verified production appointments and achievements:\n• **FlyRank** — Full Stack Web Development Appointment Letter\n• **Programming Hero** — Letter of Recommendation (FoodFlow Project, Code Rangers vs 6)\n• **Programming Hero** — Complete Web Development Course (Batch 13)\n• **Datheon AI Systems** — Full Stack Systems Internship Record",
  contact: "You can reach Sojib at:\n📱 **WhatsApp / Phone:** +880 1942791004 (01942791004)\n📧 **Email:** sojibahmedshorif998@gmail.com\n🐙 **GitHub:** https://github.com/SojibTechHub\n📍 **Location:** Rangpur, Bangladesh",
};

function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('whatsapp') || q.includes('number') || q.includes('phone') || q.includes('call') || q.includes('হোয়াটসঅ্যাপ') || q.includes('নাম্বার')) {
    return FALLBACK_RESPONSES.whatsapp;
  }
  if (q.includes('skill') || q.includes('tech') || q.includes('language') || q.includes('know') || q.includes('দক্ষতা') || q.includes('স্ট্যাক')) {
    return FALLBACK_RESPONSES.skills;
  }
  if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('built') || q.includes('প্রজেক্ট') || q.includes('কাজ')) {
    return FALLBACK_RESPONSES.projects;
  }
  if (q.includes('service') || q.includes('offer') || q.includes('do for') || q.includes('সার্ভিস')) {
    return FALLBACK_RESPONSES.services;
  }
  if (q.includes('available') || q.includes('hire') || q.includes('freelance') || q.includes('job') || q.includes('হায়ার')) {
    return FALLBACK_RESPONSES.available;
  }
  if (q.includes('experience') || q.includes('background') || q.includes('certificate') || q.includes('recommendation') || q.includes('সার্টিফিকেট')) {
    return FALLBACK_RESPONSES.experience;
  }
  if (q.includes('contact') || q.includes('reach') || q.includes('email') || q.includes('jogajog') || q.includes('যোগাযোগ')) {
    return FALLBACK_RESPONSES.contact;
  }
  return "I'm Sojib AI! I can give you real and accurate answers about Sojib's **skills**, **projects**, **credentials**, **services**, or connect you directly with him on **WhatsApp (+880 1942791004)**. What would you like to know?";
}

export function useChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm **Sojib AI** 👋 Ask me anything about Sojib Ahmed — his skills, projects, credentials, or hire him for your team! How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const maxMessages = 25;

  const sendMessage = async (content: string) => {
    if (messageCount >= maxMessages) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "You've reached the current session limit. You can message Sojib directly on **WhatsApp (+880 1942791004)** or refresh the page to start a new chat!",
        timestamp: new Date(),
      }]);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setMessageCount(prev => prev + 1);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || getFallbackResponse(content),
        timestamp: new Date(),
      }]);
    } catch {
      // Fallback to predefined intelligent responses
      await new Promise(resolve => setTimeout(resolve, 600));
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getFallbackResponse(content),
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return { isOpen, setIsOpen, messages, isTyping, sendMessage, messageCount, maxMessages };
}
