import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, User, Sparkles, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

/* ─── Types ─── */
interface TimelineStep {
  step: string;
  description: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  reasoning?: string;
  timelineSteps?: TimelineStep[];
  timestamp: Date;
}

/* ─── Hooks ─── */
function useTypewriter(text: string, speed = 16, enabled = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) { setDisplayed(text); setDone(true); return; }
    setDisplayed('');
    setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, enabled]);

  return { displayed, done };
}

/* ─── Markdown renderer (simple inline) ─── */
function renderMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/```([\s\S]*?)```|(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (i > 0 && parts[i - 1] === undefined) return null; // skip undefined splits
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-text-primary">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-[0.85em] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md border border-primary/20">
          {part.slice(1, -1)}
        </code>
      );
    }
    // Render newlines
    return <span key={i}>{part.split('\n').map((line, j) => (
      <span key={j}>{line}{j < part.split('\n').length - 1 && <br />}</span>
    ))}</span>;
  });
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 rounded-xl border border-border-color/50 overflow-hidden bg-bg-base">
      <div className="flex items-center justify-between px-4 py-2 bg-bg-surface-hover border-b border-border-color/50">
        <span className="text-xs font-mono font-semibold text-text-tertiary">code</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-primary transition-colors">
          {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-text-primary overflow-x-auto premium-scrollbar leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ─── Confidence badge ─── */
function ConfidenceBadge({ confidence }: { confidence: number }) {
  const level = confidence >= 80 ? 'high' : confidence >= 55 ? 'medium' : 'low';
  const labels = { high: 'High confidence', medium: 'Medium confidence', low: 'Low confidence' };
  const styles = {
    high: 'bg-success/10 text-success border-success/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    low: 'bg-danger/10 text-danger border-danger/20',
  };
  return (
    <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border mt-2', styles[level])}>
      <div className="w-1 h-1 rounded-full bg-current" />
      {confidence}% · {labels[level]}
    </div>
  );
}

/* ─── Timeline reasoning ─── */
function ReasoningTimeline({ steps }: { steps: TimelineStep[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors font-medium"
      >
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        View reasoning ({steps.length} steps)
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 pl-4 border-l-2 border-primary/20 space-y-3">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-primary">{s.step}</div>
                    <div className="text-xs text-text-secondary mt-0.5">{s.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Thinking indicator ─── */
function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut', delay: i * 0.15 }}
            className="w-2 h-2 rounded-full bg-primary/60"
          />
        ))}
      </div>
      <motion.span
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-xs text-text-tertiary font-medium"
      >
        Analyzing your context...
      </motion.span>
    </div>
  );
}

/* ─── Single message bubble ─── */
function MessageBubble({ msg, isLatest }: { msg: Message; isLatest: boolean }) {
  const isUser = msg.role === 'user';
  const { displayed, done } = useTypewriter(
    msg.content,
    14,
    !isUser && isLatest
  );

  // Split content by code blocks
  const parts = msg.content.split(/(```[\s\S]*?```)/g);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row', 'max-w-[90%]', isUser ? 'ml-auto' : 'mr-auto')}
    >
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm mt-1',
        isUser
          ? 'bg-bg-surface-hover border border-border-color/50 text-text-secondary'
          : 'bg-gradient-to-tr from-primary to-secondary text-white'
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div className={cn(
        'rounded-2xl px-4 py-3 text-sm shadow-sm',
        isUser
          ? 'bg-bg-surface border border-border-color/50 text-text-primary rounded-tr-sm'
          : 'bg-primary/8 border border-primary/15 text-text-primary rounded-tl-sm',
      )}>
        {isUser ? (
          <p className="leading-relaxed">{msg.content}</p>
        ) : (
          <>
            {/* Streaming / rendered content */}
            {parts.map((part, i) => {
              if (part.startsWith('```') && part.endsWith('```')) {
                const code = part.slice(3, -3).replace(/^\w+\n/, '');
                return <CodeBlock key={i} code={code} />;
              }
              // Display typewriter or full text depending on isLatest
              const textToRender = isLatest && !done ? displayed : part;
              return (
                <p key={i} className={cn('leading-relaxed', !done && isLatest && i === parts.length - 1 && 'typing-cursor')}>
                  {renderMarkdown(textToRender)}
                </p>
              );
            })}

            {/* Confidence badge */}
            {msg.confidence !== undefined && done && (
              <ConfidenceBadge confidence={msg.confidence} />
            )}

            {/* Timeline reasoning */}
            {msg.timelineSteps && done && (
              <ReasoningTimeline steps={msg.timelineSteps} />
            )}

            {/* Timestamp */}
            <div className="text-[10px] text-text-tertiary mt-2">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Mock AI response generator ─── */
function generateMockResponse(userInput: string): Omit<Message, 'id' | 'timestamp' | 'role'> {
  const lower = userInput.toLowerCase();

  if (lower.includes('task') || lower.includes('todo') || lower.includes('work')) {
    return {
      content: "I've analyzed your current task load. Here's what I recommend:\n\n**Priority breakdown:**\n1. Focus on `HIGH` priority tasks before noon — your cognitive peak\n2. Batch similar tasks together to reduce context-switching overhead\n3. Leave buffer time (15%) for unexpected work\n\nWould you like me to generate an optimized schedule for today?",
      confidence: 87,
      timelineSteps: [
        { step: 'Task Analysis', description: 'Scanned 12 active tasks across 4 categories' },
        { step: 'Priority Scoring', description: 'Applied urgency × impact matrix to rank items' },
        { step: 'Schedule Optimization', description: 'Matched tasks to your peak productivity windows' },
      ],
    };
  }

  if (lower.includes('goal') || lower.includes('objective')) {
    return {
      content: "Based on your goals, I can see you're working toward several objectives. Let me break this down:\n\n**Goal health check:**\n- 🟢 On track: 2 goals\n- 🟡 At risk: 1 goal (deadline pressure)\n- 🔴 Behind: 0 goals\n\nI'd recommend scheduling a **dedicated 2-hour review block** this week to address the at-risk goal.",
      confidence: 92,
      reasoning: 'Analyzed deadline proximity, current progress rate, and historical completion patterns.',
    };
  }

  if (lower.includes('habit') || lower.includes('streak')) {
    return {
      content: "Your habit streaks are showing great momentum! Here's the insight:\n\n```\nHabit Performance (last 7 days)\n━━━━━━━━━━━━━━━━━━━━━━\nMeditation    ████████  6/7 days\nExercise      ██████    5/7 days  \nReading       ████████  7/7 days ✓\n━━━━━━━━━━━━━━━━━━━━━━\nOverall: 84% completion rate\n```\n\nYou're close to a **personal record**. Keep it up!",
      confidence: 95,
    };
  }

  return {
    content: "I understand. Based on your current data and patterns, here's my analysis:\n\n**Key insight:** Your productivity follows a clear rhythm. You perform best when you protect your morning hours for deep work and use afternoons for collaboration and admin.\n\nWould you like me to:\n1. Create a focus schedule for tomorrow\n2. Analyze your task completion patterns\n3. Suggest habit improvements\n\nJust let me know what would be most helpful!",
    confidence: 78,
    timelineSteps: [
      { step: 'Context Loading', description: 'Retrieved your tasks, goals, and habit data' },
      { step: 'Pattern Recognition', description: 'Identified productivity patterns from recent activity' },
      { step: 'Response Generation', description: 'Formulated personalized recommendations' },
    ],
  };
}

/* ─── Quick prompts ─── */
const QUICK_PROMPTS = [
  'What should I focus on today?',
  'How are my habits trending?',
  'Review my goal progress',
  'Help me plan my week',
];

/* ─── Main component ─── */
const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    role: 'assistant',
    content: "Hello! I'm your **AI Productivity Coach**. I have full context of your tasks, goals, and habits.\n\nI can help you:\n- **Plan and prioritize** your work\n- **Analyze patterns** in your productivity\n- **Optimize your schedule** based on your energy levels\n- **Provide accountability** and coaching\n\nWhat would you like to work on today?",
    confidence: 100,
    timestamp: new Date(),
  },
];

export function AiCoach() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isThinking]);

  const handleSubmit = useCallback((text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isThinking) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const thinkingTime = 1200 + Math.random() * 800;
    setTimeout(() => {
      const response = generateMockResponse(content);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        timestamp: new Date(),
        ...response,
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, thinkingTime);
  }, [input, isThinking]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-premium">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-bg-base flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">AI Coach</h1>
          <p className="text-text-secondary text-sm mt-0.5">Powered by context-aware intelligence · {messages.length - 1} messages</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-bg-surface border border-border-color rounded-xl text-xs text-text-tertiary shadow-sm">
          <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
          Context loaded
        </div>
      </div>

      {/* Chat container */}
      <div className="flex-1 rounded-2xl border border-border-color bg-bg-surface/50 backdrop-blur-sm shadow-sm flex flex-col overflow-hidden relative">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 premium-scrollbar relative z-10">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <MessageBubble key={msg.id} msg={msg} isLatest={idx === messages.length - 1} />
            ))}

            {isThinking && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 max-w-[90%]"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-sm mt-1 flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-primary/8 border border-primary/15 shadow-sm">
                  <ThinkingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="px-5 pb-2 flex flex-wrap gap-2 relative z-10">
            {QUICK_PROMPTS.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSubmit(prompt)}
                className="text-xs px-3 py-1.5 bg-bg-surface border border-border-color rounded-lg text-text-secondary hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="p-4 bg-bg-surface/80 backdrop-blur-md border-t border-border-color/50 relative z-10">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your tasks, goals, habits..."
                className="w-full px-4 py-3 text-sm bg-bg-base border border-border-color rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors resize-none min-h-[44px] max-h-[120px] premium-scrollbar"
                rows={1}
                style={{ height: 'auto' }}
                onInput={e => {
                  const el = e.target as HTMLTextAreaElement;
                  el.style.height = 'auto';
                  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
                }}
              />
              <div className="absolute right-3 bottom-2.5 text-[10px] text-text-tertiary">
                Shift+Enter for newline
              </div>
            </div>
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isThinking}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-premium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center mt-2 text-[10px] text-text-tertiary">
            AI responses are for productivity guidance · Always verify critical decisions
          </p>
        </div>
      </div>
    </motion.div>
  );
}
