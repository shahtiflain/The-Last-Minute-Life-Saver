import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../services/api';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export function AiCopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'ai', content: 'Hello! I am your AI Copilot. How can I help you organize your tasks or schedule today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const oauthToken = localStorage.getItem('google_oauth_token');
      const calendarTokens = oauthToken ? { token: oauthToken } : undefined;

      const response = await api.post('/api/ai/orchestrate', {
        intent: userMessage.content,
        calendarTokens
      });

      const { agent_responses } = response.data;
      
      let aiContent = "I've processed your request!";
      if (agent_responses && agent_responses.length > 0) {
        aiContent = agent_responses.join('\n\n');
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['goals'] });
        queryClient.invalidateQueries({ queryKey: ['analytics'] });
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: aiContent }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'Sorry, I encountered an error processing your request.' }]);
      toast.error('AI Orchestration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.5)] flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-h-[85vh] max-w-[calc(100vw-3rem)] rounded-[24px] bg-bg-surface/80 backdrop-blur-2xl border border-border-color/60 shadow-2xl flex flex-col overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-color/50 bg-bg-surface/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary text-sm">AI Copilot</h3>
                  <p className="text-xs text-text-tertiary font-medium">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-tertiary hover:bg-bg-surface-hover hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 premium-scrollbar">
              {messages.map(msg => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-secondary/20' : 'bg-primary/20'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-secondary" /> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl max-w-[75%] text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-secondary/10 text-text-primary border border-secondary/20 rounded-tr-sm' 
                      : 'bg-bg-surface-hover border border-border-color/60 text-text-secondary rounded-tl-sm'
                  }`}>
                    {msg.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i !== msg.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-bg-surface-hover border border-border-color/60 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border-color/50 bg-bg-surface/50">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me to schedule a task..."
                  className="w-full bg-bg-surface border border-border-color/60 rounded-xl pl-4 pr-12 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary/50 transition-colors shadow-inner"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 w-8 h-8 rounded-lg flex items-center justify-center text-primary disabled:text-text-tertiary disabled:opacity-50 hover:bg-primary/10 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
