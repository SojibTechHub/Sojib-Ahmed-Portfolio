import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const FALLBACK_RESPONSES: Record<string, string> = {
  skills: "Sojib is proficient in full stack web development — React.js, Next.js, Node.js, Express.js, MongoDB, TypeScript, Tailwind CSS, JWT, Firebase, Socket.IO, and AI integration with Gemini/OpenAI APIs. He has 15+ technologies in his arsenal!",
  projects: "Sojib has architected flagship production systems including:\n• **InvestProp AI** – AI-powered real estate platform\n• **Job Finder** – Full-stack job board\n• **Pet Adoption Platform** – Community website\n• **E-Commerce Platform** – With Stripe payments\n...and more! Check the Projects section for details.",
  services: "Sojib offers:\n• **Full Stack Web Development**\n• **Frontend Development** (React/Next.js)\n• **Backend Development** (Node.js/Express)\n• **AI Integration** (Gemini/OpenAI)\n• **E-Commerce Development**\n• **Admin Dashboards**",
  available: "Yes! Sojib is **currently available** for:\n✓ Full-time positions\n✓ Freelance projects\n✓ Remote work\n\nHe typically replies within 15 minutes. Reach him at sojibahmedshorif998@gmail.com or +880 1942791004.",
  experience: "Sojib completed an **8-month intensive full-stack program** at Programming Hero (Jan–Aug 2026). His journey:\n• Feb 2026: HTML, CSS, JavaScript\n• Mar 2026: React.js\n• Apr 2026: Node.js & Express\n• May 2026: MongoDB\n• Jun–Aug 2026: Full Stack + AI Integration",
  contact: "You can reach Sojib at:\n📧 **Email:** sojibahmedshorif998@gmail.com\n📱 **Phone:** +880 1942791004\n📍 **Location:** Rangpur, Bangladesh\n\nOr use the **Contact form** on this page!",
};

function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('skill') || q.includes('tech') || q.includes('language') || q.includes('know')) return FALLBACK_RESPONSES.skills;
  if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('built')) return FALLBACK_RESPONSES.projects;
  if (q.includes('service') || q.includes('offer') || q.includes('do for')) return FALLBACK_RESPONSES.services;
  if (q.includes('available') || q.includes('hire') || q.includes('freelance') || q.includes('job')) return FALLBACK_RESPONSES.available;
  if (q.includes('experience') || q.includes('background') || q.includes('learn') || q.includes('journey')) return FALLBACK_RESPONSES.experience;
  if (q.includes('contact') || q.includes('reach') || q.includes('email') || q.includes('phone')) return FALLBACK_RESPONSES.contact;
  return "I'm Sojib's AI assistant! I can tell you about his:\n• **Skills & Technologies**\n• **Projects**\n• **Services**\n• **Availability**\n• **Experience**\n• **Contact details**\n\nWhat would you like to know?";
}

export function useChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm **Sojib AI** 👋 I'm here to tell you about Sojib Ahmed — his skills, projects, services, and availability. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const maxMessages = 10;

  const sendMessage = async (content: string) => {
    if (messageCount >= maxMessages) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "You've reached the session limit (10 messages). Please refresh to start a new chat, or contact Sojib directly at sojibahmedshorif998@gmail.com.",
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
        content: data.reply,
        timestamp: new Date(),
      }]);
    } catch {
      // Fallback to predefined responses
      await new Promise(resolve => setTimeout(resolve, 800));
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
