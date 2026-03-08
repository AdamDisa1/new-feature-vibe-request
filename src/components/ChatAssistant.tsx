import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Clock,
  MoreHorizontal,
  Plus,
  Mic,
  AudioLines,
  Send,
  X,
  Bot,
  LayoutGrid,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

const SUGGESTIONS = [
  'Get more visitors',
  'Set up analytics',
  'Plan my first offer',
];

interface ChatAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
  generateAppMode?: boolean;
  onExitGenerateApp?: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen = true, onClose, generateAppMode, onExitGenerateApp }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasConversation = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Activate Generate App mode
  useEffect(() => {
    if (generateAppMode) {
      setMessages([{
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: 'What would you like me to build for you today?',
      }]);
    }
  }, [generateAppMode]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(36).slice(2),
      role: 'user',
      content: text.trim(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      const reply: Message = {
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: getReply(text.trim()),
      };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 1200);
  };

  const getReply = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes('visitor') || lower.includes('traffic'))
      return "To get more visitors, I'd recommend starting with SEO basics — make sure your site title, descriptions, and content include keywords your audience searches for. You can also connect Google Search Console from your Marketing tools.";
    if (lower.includes('analytics'))
      return "You can set up analytics by going to Analytics in the left sidebar. I recommend connecting Google Analytics for deeper insights. Want me to walk you through it?";
    if (lower.includes('offer') || lower.includes('promotion'))
      return "A great first offer could be a limited-time discount or free shipping. Head to Marketing > Coupons to create one. Would you like help crafting the perfect offer?";
    return "I can help you with that! Could you tell me a bit more about what you're looking for? I'm here to assist with your site design, marketing, and business growth.";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="flex flex-col flex-shrink-0 border-l"
      style={{
        width: 320,
        background: '#ffffff',
        borderColor: '#e5e8ef',
        height: '100%',
      }}
    >
      {/* ── Header ────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 flex-shrink-0"
        style={{ height: 52, borderBottom: '1px solid #e5e8ef' }}
      >
        <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
          Aria
        </span>
        <div className="flex items-center gap-1">
          {[MessageCircle, Clock, MoreHorizontal].map((Icon, i) => (
            <button
              key={i}
              className="p-1.5 rounded-md transition-colors"
              style={{ color: '#6b7280' }}
              onMouseEnter={e =>
                ((e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa')
              }
              onMouseLeave={e =>
                ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
              }
            >
              <Icon size={16} />
            </button>
          ))}
          <button
            onClick={onClose}
            className="p-1.5 rounded-md transition-colors ml-1"
            style={{ color: '#6b7280' }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa')
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
            }
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-none">
        {!hasConversation ? (
          /* ── Welcome state ── */
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
              style={{ background: '#1a1a2e' }}
            >
              <Bot size={28} color="#fff" />
            </div>

            {/* Greeting */}
            <h2
              className="text-lg font-bold leading-snug mb-1"
              style={{ color: '#1a1a2e' }}
            >
              Hi, I'm Aria, your business
              <br />
              and web design expert.
            </h2>

            {/* Suggestions label */}
            <p
              className="text-xs mt-4 mb-3"
              style={{ color: '#9098a9' }}
            >
              Suggestions for today:
            </p>

            {/* Suggestion cards */}
            <div className="flex flex-col gap-2 w-full">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="flex items-center gap-2.5 w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors"
                  style={{
                    color: '#1a1a2e',
                    background: '#ffffff',
                    border: '1px solid #e5e8ef',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#d0d5dd';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e8ef';
                  }}
                >
                  <Plus
                    size={16}
                    style={{ color: '#116dff', flexShrink: 0 }}
                  />
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Conversation ── */
          <div className="flex flex-col gap-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                    style={{ background: '#1a1a2e' }}
                  >
                    <Bot size={14} color="#fff" />
                  </div>
                )}
                <div
                  className="rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed max-w-[85%]"
                  style={
                    msg.role === 'user'
                      ? {
                          background: '#116dff',
                          color: '#ffffff',
                          borderBottomRightRadius: 4,
                        }
                      : {
                          background: '#f7f8fa',
                          color: '#1a1a2e',
                          borderBottomLeftRadius: 4,
                        }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2"
                  style={{ background: '#1a1a2e' }}
                >
                  <Bot size={14} color="#fff" />
                </div>
                <div
                  className="rounded-xl px-3.5 py-2.5 text-[13px]"
                  style={{ background: '#f7f8fa', color: '#9098a9' }}
                >
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input area ────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pb-3 pt-2">
        <div
          className="flex flex-col gap-2 rounded-xl px-3 py-2"
          style={{ border: '1px solid #e5e8ef', background: '#ffffff' }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={generateAppMode ? 'Describe your app...' : 'Ask me anything'}
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: '#1a1a2e' }}
          />
          <div className="flex items-center justify-between">
            {/* Mode chip */}
            <div className="flex items-center">
              {generateAppMode && (
                <button
                  onClick={onExitGenerateApp}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
                  style={{
                    background: '#f0e6ff',
                    color: '#6b2fa0',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#e4d4fc';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#f0e6ff';
                  }}
                >
                  <LayoutGrid size={12} />
                  Generate App
                  <X size={10} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-0.5">
              <button
                className="p-1.5 rounded-md transition-colors"
                style={{ color: '#6b7280' }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLButtonElement).style.color = '#1a1a2e')
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLButtonElement).style.color = '#6b7280')
                }
              >
                <Plus size={16} />
              </button>
              {input.trim() ? (
                <button
                  onClick={() => sendMessage(input)}
                  className="p-1.5 rounded-md transition-colors"
                  style={{ color: '#116dff' }}
                >
                  <Send size={16} />
                </button>
              ) : (
                <button
                  className="p-1.5 rounded-md transition-colors"
                  style={{ color: '#6b7280' }}
                  onMouseEnter={e =>
                    ((e.currentTarget as HTMLButtonElement).style.color = '#1a1a2e')
                  }
                  onMouseLeave={e =>
                    ((e.currentTarget as HTMLButtonElement).style.color = '#6b7280')
                  }
                >
                  <AudioLines size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p
          className="text-center mt-2 text-[10px]"
          style={{ color: '#9098a9' }}
        >
          AI can make mistakes. Double check the results.
        </p>
      </div>
    </div>
  );
};

export default ChatAssistant;
