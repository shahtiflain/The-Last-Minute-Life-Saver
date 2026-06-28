import { motion, useInView } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { 
  Sparkles, Target, LineChart, Trophy, 
  ArrowRight, Brain, Clock, Zap, Shield, Globe,
  CheckCircle2, Calendar, Activity, BarChart3
} from 'lucide-react';
import customLogo from '../assets/hustler_word_logo_transparent.png';

/* ── Reusable scroll-triggered fade ─────────────────────────── */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Data ───────────────────────────────────────────────────── */
const features = [
  {
    title: 'Global AI Copilot',
    description: 'Chat with your AI assistant from anywhere in the app to instantly schedule tasks, break down complex goals, and get intelligent productivity insights.',
    icon: Sparkles,
    accent: '#818CF8',
  },
  {
    title: 'Deep Focus Mode',
    description: 'Enter a distraction-free environment with a built-in Pomodoro timer. Track your deep work sessions and watch your productivity soar.',
    icon: Target,
    accent: '#F59E0B',
  },
  {
    title: 'Advanced Analytics',
    description: 'Visualize your progress with stunning, real-time charts. Track your task completion rates, habit streaks, and overall productivity score.',
    icon: LineChart,
    accent: '#10B981',
  },
  {
    title: 'Gamified Progression',
    description: 'Earn XP, level up your rank, and unlock unique badges by completing tasks and maintaining your daily habit streaks.',
    icon: Trophy,
    accent: '#F43F5E',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Capture Everything',
    description: 'Dump your tasks, goals, and deadlines into Hustlr. Our AI instantly categorizes and prioritizes them for you.',
    icon: CheckCircle2,
  },
  {
    step: '02',
    title: 'AI Plans Your Day',
    description: 'The Planner Agent builds an optimized schedule from your calendar, deadlines, and energy patterns.',
    icon: Brain,
  },
  {
    step: '03',
    title: 'Enter Deep Focus',
    description: 'Work through focused Pomodoro blocks. Hustlr silences distractions and tracks your flow state automatically.',
    icon: Clock,
  },
  {
    step: '04',
    title: 'Level Up',
    description: 'Complete tasks, maintain streaks, and earn XP. Watch your productivity rank climb as you build momentum.',
    icon: Zap,
  },
];

const stats = [
  { value: '3.2×', label: 'More tasks completed' },
  { value: '47%', label: 'Less time planning' },
  { value: '89%', label: 'Habit streak retention' },
  { value: '5', label: 'AI agents working for you' },
];

/* ── Component ──────────────────────────────────────────────── */
export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#818CF8]/30 font-sans overflow-x-hidden">
      
      {/* ─── Navigation ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={customLogo} alt="Hustlr" className="h-10 sm:h-11 object-contain" />
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:flex text-gray-400 hover:text-white text-[13px] font-medium h-9 px-4" onClick={() => navigate('/dashboard')}>
              Sign In
            </Button>
            <Button variant="primary" className="rounded-full font-medium text-[13px] h-9 px-5 bg-[#818CF8] hover:bg-[#6366F1] border-0 shadow-[0_0_20px_rgba(129,140,248,0.25)]" onClick={() => navigate('/dashboard')}>
              Explore Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ───────────────────────────────────── */}
      <main className="pt-40 sm:pt-48 pb-8 px-6 relative">
        {/* Ambient glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#818CF8]/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-40 left-1/3 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-400 text-xs font-medium mb-8">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#818CF8] animate-pulse" />
              AI-powered productivity platform
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-[-0.04em] leading-[1.05] mb-6">
              Work at the{' '}
              <br className="hidden sm:block" />
              speed of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] via-purple-400 to-[#818CF8]">
                thought.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed mb-10">
              Hustlr combines an intelligent AI Copilot with Deep Focus mechanics and Gamified progression to make productivity feel effortless.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="primary" 
                className="w-full sm:w-auto text-sm h-12 px-8 bg-[#818CF8] hover:bg-[#6366F1] border-0 rounded-xl shadow-[0_0_40px_rgba(129,140,248,0.3)] hover:shadow-[0_0_50px_rgba(129,140,248,0.45)] transition-all" 
                onClick={() => navigate('/dashboard')}
              >
                Explore Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full sm:w-auto text-sm h-12 px-8 text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See How It Works
              </Button>
            </div>
          </motion.div>
        </div>

        {/* ─── Dashboard Preview ──────────────────────────────── */}
        <motion.div 
          className="max-w-5xl mx-auto mt-20 sm:mt-28 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Backglow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#818CF8]/15 via-purple-900/5 to-transparent blur-[80px] -z-10 scale-110" />
          
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0D]/90 backdrop-blur-2xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Window chrome */}
            <div className="h-11 border-b border-white/[0.06] flex items-center px-4 gap-2 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]/80" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/80" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-5 w-48 bg-white/[0.04] rounded-md" />
              </div>
            </div>
            
            {/* Dashboard mockup */}
            <div className="flex p-4 sm:p-5 gap-4 sm:gap-5 min-h-[280px] sm:min-h-[380px]">
              {/* Sidebar skeleton */}
              <div className="w-36 hidden sm:flex flex-col gap-2.5 py-1">
                <div className="h-7 bg-white/[0.06] rounded-lg w-2/3 mb-3" />
                <div className="h-9 bg-[#818CF8]/15 border border-[#818CF8]/20 rounded-lg" />
                <div className="h-9 bg-white/[0.03] rounded-lg" />
                <div className="h-9 bg-white/[0.03] rounded-lg" />
                <div className="h-9 bg-white/[0.03] rounded-lg" />
                <div className="mt-auto h-9 bg-white/[0.03] rounded-lg" />
              </div>
              
              {/* Content area */}
              <div className="flex-1 flex flex-col gap-4 sm:gap-5">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { glow: true, barColor: 'bg-[#818CF8]/60' },
                    { glow: false, barColor: 'bg-emerald-500/50' },
                    { glow: false, barColor: 'bg-amber-500/50' },
                  ].map((card, i) => (
                    <div key={i} className={`bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden ${card.glow ? '' : ''}`}>
                      {card.glow && <div className="absolute -right-6 -top-6 w-20 h-20 bg-[#818CF8]/15 rounded-full blur-2xl" />}
                      <div className="h-3 w-12 bg-white/10 rounded mb-3" />
                      <div className="h-7 w-16 bg-white/60 rounded" />
                    </div>
                  ))}
                </div>
                
                {/* Main content row */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Task list */}
                  <div className="sm:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
                    <div className="h-5 w-24 bg-white/10 rounded mb-1" />
                    {[0.5, 0.7, 0.4].map((w, i) => (
                      <div key={i} className={`h-12 rounded-lg flex items-center px-3 gap-3 ${i === 1 ? 'bg-[#818CF8]/10 border border-[#818CF8]/20' : 'bg-white/[0.04] border border-white/[0.04]'}`}>
                        {i === 1 && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#818CF8] rounded-r" />}
                        <div className={`w-4 h-4 rounded ${i === 1 ? 'bg-[#818CF8]/40 border border-[#818CF8]/60' : 'border border-white/20'}`} />
                        <div className="h-3 bg-white/30 rounded" style={{ width: `${w * 100}%` }} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Progress ring */}
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex flex-col items-center justify-center gap-4">
                    <div className="w-28 h-28 rounded-full border-[12px] border-white/[0.06] relative">
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="44" fill="none" stroke="#818CF8" strokeWidth="12" strokeDasharray="207" strokeDashoffset="55" strokeLinecap="round" opacity="0.7" />
                      </svg>
                    </div>
                    <div className="h-3 w-16 bg-white/10 rounded" />
                  </div>
                </div>
              </div>

              {/* AI Copilot FAB */}
              <div className="absolute bottom-8 right-8 w-12 h-12 bg-[#818CF8] rounded-full shadow-[0_0_24px_rgba(129,140,248,0.4)] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ─── Stats Bar ──────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-6 border-t border-white/[0.04]">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Features Grid ──────────────────────────────────── */}
      <section id="features" className="py-24 sm:py-32 px-6 relative z-10">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-16 sm:mb-20">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#818CF8] mb-4">Capabilities</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-5">Everything you need.</h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              The most powerful productivity techniques, unified in a single AI-native workspace.
            </p>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {features.map((feature, idx) => (
              <FadeIn key={idx} delay={idx * 0.08}>
                <div className="group p-7 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border transition-transform duration-300 group-hover:scale-110"
                    style={{ 
                      backgroundColor: `${feature.accent}15`,
                      borderColor: `${feature.accent}25`,
                    }}
                  >
                    <feature.icon className="w-5 h-5" style={{ color: feature.accent }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────────── */}
      <section id="how-it-works" className="py-24 sm:py-32 px-6 border-t border-white/[0.04]">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-16 sm:mb-20">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#818CF8] mb-4">Workflow</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-5">How Hustlr works.</h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              From capture to completion — four steps to a more productive you.
            </p>
          </FadeIn>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {howItWorks.map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="relative p-6 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] group hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
                  <div className="text-[#818CF8]/30 text-5xl font-black mb-4 leading-none tracking-tighter">{item.step}</div>
                  <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-5 h-5 text-gray-300" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI Agents Section ──────────────────────────────── */}
      <section className="py-24 sm:py-32 px-6 border-t border-white/[0.04]">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-16 sm:mb-20">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#818CF8] mb-4">Under The Hood</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-5">5 AI agents, one mission.</h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              A multi-agent system that plans, schedules, analyzes, monitors, and coaches — so you can focus on what matters.
            </p>
          </FadeIn>

          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: 'Planner', desc: 'Breaks goals into actionable tasks', icon: Brain },
                { name: 'Scheduler', desc: 'Builds your optimal daily schedule', icon: Calendar },
                { name: 'Analyzer', desc: 'Detects risks and conflicts', icon: BarChart3 },
                { name: 'Watcher', desc: 'Monitors progress & sends alerts', icon: Activity },
                { name: 'Coach', desc: 'Your personal AI productivity mentor', icon: Sparkles },
              ].map((agent, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center group hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[#818CF8]/10 border border-[#818CF8]/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <agent.icon className="w-5 h-5 text-[#818CF8]" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{agent.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{agent.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA Section ────────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-6">
        <FadeIn>
          <div className="max-w-[700px] mx-auto text-center relative">
            {/* Backglow */}
            <div className="absolute inset-0 bg-[#818CF8]/10 blur-[100px] rounded-full -z-10 scale-150" />
            
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-5">
              Ready to work <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] to-purple-400">smarter</span>?
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-10">
              Join the next generation of productive people. No credit card required.
            </p>
            <Button 
              size="lg" 
              variant="primary" 
              className="text-sm h-12 px-10 bg-[#818CF8] hover:bg-[#6366F1] border-0 rounded-xl shadow-[0_0_40px_rgba(129,140,248,0.3)] hover:shadow-[0_0_60px_rgba(129,140,248,0.5)] transition-all"
              onClick={() => navigate('/dashboard')}
            >
              Get Started — It's Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* ─── Trust Bar ──────────────────────────────────────── */}
      <section className="py-12 px-6 border-t border-white/[0.04]">
        <div className="max-w-[800px] mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs text-gray-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            End-to-end encrypted
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            99.9% uptime
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            Works everywhere
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            SOC 2 compliant
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-10 px-6 bg-[#050505]">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 opacity-60 hover:opacity-90 transition-opacity">
            <img src={customLogo} alt="Hustlr" className="h-8 object-contain" />
          </div>
          <div className="flex gap-6 text-gray-600 font-medium text-xs">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
