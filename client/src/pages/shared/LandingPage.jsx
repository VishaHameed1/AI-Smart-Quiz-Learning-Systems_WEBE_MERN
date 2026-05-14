import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Play,
  TrendingUp,
  Shield,
  BookOpen,
  Rocket,
  Layers,
  Star,
} from 'lucide-react';
import ServiceCard from '../../components/shared/ServiceCard';

const services = [
  {
    title: 'Adaptive learning paths',
    description: 'Personalized journeys that evolve with every session.',
    color: 'bg-sky-100 text-sky-600',
    icon: <BarChart3 className="h-6 w-6" />,    
  },
  {
    title: 'Live coaching dashboard',
    description: 'Real-time session insights for instructors and teams.',
    color: 'bg-violet-100 text-violet-600',
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    title: 'Secure data flow',
    description: 'Built for elite educational experiences with enterprise trust.',
    color: 'bg-slate-100 text-slate-900',
    icon: <ShieldCheck className="h-6 w-6" />,
  },
  {
    title: 'Progress analytics',
    description: 'Insights and metrics that keep every team performance-driven.',
    color: 'bg-cyan-100 text-cyan-600',
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    title: 'Secure collaboration',
    description: 'Protected access for coaching, teams, and enterprise learning circles.',
    color: 'bg-indigo-100 text-indigo-600',
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: 'Smart resource hub',
    description: 'Curated lessons, templates, and modular workflows for fast growth.',
    color: 'bg-fuchsia-100 text-fuchsia-600',
    icon: <BookOpen className="h-6 w-6" />,
  },
];

const stats = [
  { label: 'Completion', value: '92%', icon: <Sparkles className="h-5 w-5 text-slate-900" /> },
  { label: 'Engagement', value: '7.4/10', icon: <BarChart3 className="h-5 w-5 text-slate-900" /> },
  { label: 'Satisfaction', value: '4.9/5', icon: <ShieldCheck className="h-5 w-5 text-slate-900" /> },
  { label: 'Sessions', value: '1.2K', icon: <ArrowRight className="h-5 w-5 text-slate-900" /> },
];

const highlights = [
  { title: 'Fast setup', description: 'Launch modern workflows in minutes.', icon: <Rocket className="h-5 w-5" /> },
  { title: 'Live coaching', description: 'Instant guidance matched to every learner.', icon: <Sparkles className="h-5 w-5" /> },
  { title: 'Secure access', description: 'Enterprise-ready controls and encryption.', icon: <Shield className="h-5 w-5" /> },
  { title: 'Analytics ready', description: 'Insights that keep performance visible.', icon: <BarChart3 className="h-5 w-5" /> },
];

const LandingPage = () => {
  useEffect(() => {
    const handleMove = (event) => {
      document.documentElement.style.setProperty('--spotlight-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--spotlight-y', `${event.clientY}px`);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="relative overflow-hidden px-6 pt-40 pb-16 sm:px-10 lg:px-16">
      <div className="hero-spotlight" aria-hidden="true" />
      <div className="absolute left-[-120px] top-20 h-[320px] w-[320px] rounded-full bg-sky-500/10 blur-3xl" aria-hidden="true" />
      <div className="absolute right-[-100px] top-10 h-[260px] w-[260px] rounded-full bg-violet-400/10 blur-3xl" aria-hidden="true" />
      <div className="mx-auto flex max-w-[1720px] flex-col gap-16">
        <section className="relative z-10 flex flex-col items-center gap-10 text-center">
          <div className="glass-card mx-auto max-w-5xl border-white/30 p-12 shadow-card">
            <div className="relative">
              <div className="absolute left-6 top-6 glass-card hero-card p-6 text-slate-900">
                <div className="flex items-center gap-3">
                  <div className="icon-pill bg-sky-100 text-sky-600">{<BarChart3 className="h-6 w-6" />}</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Progress</p>
                    <p className="mt-2 text-lg font-semibold">92% goal reach</p>
                  </div>
                </div>
              </div>
              <div className="absolute right-8 top-10 glass-card hero-card p-6 text-slate-900">
                <div className="flex items-center gap-3">
                  <div className="icon-pill bg-violet-100 text-violet-600">{<Sparkles className="h-6 w-6" />}</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Live Ignite</p>
                    <p className="mt-2 text-lg font-semibold">+24 active sessions</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Premium education suite</p>
                <h1 className="mt-4 text-5xl font-[800] leading-tight tracking-[-0.04em] text-slate-900 font-display sm:text-6xl">
                  Build clarity with a modern service system that feels bright, bold, and calm.
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                  Texture, white space and glassmorphic surfaces deliver a premium learning workspace for educators and professional teams.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link to="/register" className="glow-cta group inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-semibold">
                    Start free trial
                    <Play className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link to="/dashboard" className="cta-secondary inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-semibold shadow-sm">
                    <Play className="h-4 w-4" />
                    Watch demo
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {stats.map((item) => (
              <div key={item.label} className="glass-badge flex min-w-[180px] items-center gap-4 border-white/30 px-6 py-4 shadow-card">
                <div className="icon-pill bg-white text-slate-900">{item.icon}</div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </section>

        <section className="glass-card border-white/20 bg-slate-900/95 px-8 py-14 text-white shadow-card">
          <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr] xl:gap-16">
            <div className="space-y-8">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-200/80">Why premium matters</p>
              <h2 className="text-5xl font-[800] leading-tight text-white font-display sm:text-6xl">
                Designed for teams that want clarity, confidence, and measurable growth.
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item.title} className="group rounded-[32px] border border-white/20 bg-white/5 p-6 transition duration-500 hover:bg-white/10">
                    <div className="flex items-center gap-3 text-sky-200">
                      <div className="icon-pill bg-white/10 text-white">{item.icon}</div>
                      <p className="text-base font-semibold text-white">{item.title}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-500 to-violet-300 p-10 text-white shadow-card">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.35),_transparent_40%)]" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-white/80">
                  <Star className="h-5 w-5 text-white" />
                  <span>Trusted scale</span>
                </div>
                <p className="text-6xl font-[800] leading-none">4.2Cr+</p>
                <p className="max-w-sm text-sm leading-6 text-white/80">Monthly active professionals leveraging realtime feedback and analytics across every learning experience.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
