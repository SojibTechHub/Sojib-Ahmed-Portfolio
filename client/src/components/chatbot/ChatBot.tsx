import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { useChatBot } from '../../hooks/useChatBot';

const SUGGESTED_PROMPTS = [
  "What is Sojib's WhatsApp number?",
  "Show me his top full-stack projects",
  "Is he available for hire?",
  "What verified credentials does he have?",
  "What technologies does Sojib master?",
  "How can I contact him directly?",
];

function renderMarkdown(text: string) {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
    .replace(/•/g, '•');
  
  // Basic sanitization - escape HTML tags except our formatting tags
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;(strong|em|br)&gt;/g, '<$1>')
    .replace(/&lt;\/(strong|em)&gt;/g, '</$1>');
}

export default function ChatBot() {
  const { isOpen, setIsOpen, messages, isTyping, sendMessage, messageCount, maxMessages } = useChatBot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    sendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div role="region" aria-label="WhatsApp and AI Chat Assistant">
      {/* Chat Window Dialog - Positioned perfectly on all mobile & desktop screens */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-24 z-[9999] w-auto sm:w-[380px] max-h-[calc(100dvh-24px)] h-[min(520px,calc(100dvh-28px))] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden bg-[#0B1120]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-3.5 sm:p-4 border-b border-white/10 bg-[#080E1E] flex-shrink-0">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
              >
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">Sojib AI</div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="truncate">Active · {maxMessages - messageCount} left</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer flex-shrink-0"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages Container */}
            <div className="chat-messages flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-[#0B1120]/95">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
                    >
                      <Sparkles size={11} className="text-white" />
                    </div>
                  )}
                  <div
                    className={msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
                  >
                    <Sparkles size={11} className="text-white" />
                  </div>
                  <div className="chat-message-ai flex items-center gap-1.5 py-2">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay }}
                        className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested prompts (only when few messages) */}
            {messages.length < 2 && (
              <div className="px-3.5 py-2 border-t border-white/5 bg-[#080E1E] flex-shrink-0">
                <p className="text-[10px] text-gray-400 mb-1 font-medium">Suggested questions:</p>
                <div className="flex flex-wrap gap-1">
                  {SUGGESTED_PROMPTS.slice(0, 3).map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-[10px] px-2.5 py-1 rounded-full transition-all hover:opacity-90 cursor-pointer bg-white/5 hover:bg-[#06B6D4]/15 border border-white/10 hover:border-[#06B6D4]/40 text-[#38BDF8]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <div className="p-3 border-t border-white/10 bg-[#080E1E] flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask any question about Sojib..."
                  disabled={isTyping || messageCount >= maxMessages}
                  className="flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 outline-none bg-black/40 border border-white/10 focus:border-[#06B6D4] disabled:opacity-50"
                  aria-label="Chat message input"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping || messageCount >= maxMessages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer shadow-md transition-transform hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
                  aria-label="Send message"
                >
                  {isTyping ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons Stack: WhatsApp on top, AI Assistant below */}
      <div
        className={`fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[9000] ${
          isOpen ? 'hidden sm:flex' : 'flex'
        } flex-col items-end gap-2.5`}
      >
        {/* WhatsApp Floating Action Button */}
        <motion.a
          id="whatsapp-trigger"
          href="https://wa.me/8801942791004?text=Hello%20Sojib,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08, boxShadow: '0 8px 30px rgba(37,211,102,0.6)' }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white relative shadow-2xl cursor-pointer group"
          style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
          aria-label="Chat with Sojib on WhatsApp (01942791004)"
          title="Chat on WhatsApp (+880 1942791004)"
        >
          <FaWhatsapp size={25} className="text-white drop-shadow group-hover:scale-110 transition-transform" />

          {/* Desktop Hover Tooltip Label */}
          <span className="hidden sm:flex absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#090e1d]/95 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none shadow-2xl items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366]" />
            <span>WhatsApp: 01942791004</span>
          </span>

          {/* Green online ping notification */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#25D366] border-2 border-[#050508]"></span>
          </span>
        </motion.a>

        {/* AI Chatbot Floating Action Button */}
        <motion.button
          id="chatbot-trigger"
          whileHover={{ scale: 1.08, boxShadow: '0 8px 30px rgba(124,58,237,0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white relative shadow-2xl cursor-pointer group"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
          aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
          aria-expanded={isOpen}
          title="Chat with Sojib AI"
        >
          {/* Desktop Hover Tooltip Label */}
          {!isOpen && (
            <span className="hidden sm:flex absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#090e1d]/95 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none shadow-2xl items-center gap-1.5">
              <Sparkles size={12} className="text-[#06B6D4]" />
              <span>Ask Sojib AI</span>
            </span>
          )}

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Sparkles size={20} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI online indicator dot */}
          {!isOpen && (
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#050508] pointer-events-none"
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}
