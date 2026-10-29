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
    <div className="chatbot-container flex flex-col items-end" role="region" aria-label="WhatsApp and AI Chat Assistant">
      {/* Chat Window Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="chat-bubble mb-3 flex flex-col shadow-2xl border border-white/15"
            style={{ width: 'min(380px, calc(100vw - 32px))', height: 520 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-[rgba(124,58,237,0.15)] bg-[var(--color-surface)]">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-[var(--color-text-primary)]">Sojib AI</div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                  <div className="status-dot" style={{ width: 5, height: 5 }} />
                  Real AI Assistant · {maxMessages - messageCount} left
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(124,58,237,0.08)] transition-all cursor-pointer"
                aria-label="Close chat"
              >
                <X size={15} />
              </motion.button>
            </div>

            {/* Messages Container */}
            <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-surface)]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5 shadow"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
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
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shadow"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                    <Sparkles size={11} className="text-white" />
                  </div>
                  <div className="chat-message-ai flex items-center gap-1.5 py-2">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay }}
                        className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested prompts (only when < 2 messages) */}
            {messages.length < 2 && (
              <div className="px-4 py-2 border-t border-[rgba(124,58,237,0.08)] bg-[var(--color-surface)]">
                <p className="text-[10px] text-[var(--color-text-secondary)] mb-1.5 font-medium">Suggested questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.slice(0, 3).map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-[10px] px-2.5 py-1 rounded-full transition-all hover:opacity-80 cursor-pointer"
                      style={{
                        background: 'rgba(124,58,237,0.08)',
                        border: '1px solid rgba(124,58,237,0.2)',
                        color: '#8B5CF6',
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <div className="p-3.5 border-t border-[rgba(124,58,237,0.15)] bg-[var(--color-surface)]">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask any question about Sojib..."
                  disabled={isTyping || messageCount >= maxMessages}
                  className="flex-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] outline-none focus:ring-1 focus:ring-[rgba(124,58,237,0.5)] disabled:opacity-50"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                  aria-label="Chat message input"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping || messageCount >= maxMessages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer shadow"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
                  aria-label="Send message"
                >
                  {isTyping ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons Stack: WhatsApp on top, AI Assistant below */}
      <div className="flex flex-col items-end gap-2.5">
        {/* WhatsApp Floating Action Button (Directly Above AI Button) */}
        <motion.a
          id="whatsapp-trigger"
          href="https://wa.me/8801942791004?text=Hello%20Sojib,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08, boxShadow: '0 8px 30px rgba(37,211,102,0.6)' }}
          whileTap={{ scale: 0.95 }}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white relative shadow-xl cursor-pointer group"
          style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
          aria-label="Chat with Sojib on WhatsApp (01942791004)"
          title="Chat on WhatsApp (+880 1942791004)"
        >
          <FaWhatsapp size={27} className="text-white drop-shadow group-hover:scale-110 transition-transform" />

          {/* Hover Tooltip Label */}
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#090e1d]/95 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none shadow-2xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366]" />
            <span>WhatsApp: 01942791004</span>
          </span>

          {/* Green online ping notification */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
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
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white relative shadow-xl cursor-pointer group"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
          aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
          aria-expanded={isOpen}
          title="Chat with Sojib AI"
        >
          {/* Hover Tooltip Label when closed */}
          {!isOpen && (
            <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#090e1d]/95 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none shadow-2xl flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#06B6D4]" />
              <span>Ask Sojib AI</span>
            </span>
          )}

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Sparkles size={22} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI online indicator dot */}
          {!isOpen && (
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#050508]"
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}
