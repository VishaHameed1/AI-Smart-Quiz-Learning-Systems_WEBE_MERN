import React from 'react';
import { Link } from 'react-router-dom';
import GlassTiltCard from '../../components/shared/GlassTiltCard';
import Pipeline from '../../components/shared/Pipeline';
import FloatingSnippet from '../../components/shared/FloatingSnippet';

const Showcase = () => {
  return (
    <div className="min-h-screen bg-deep-grid text-white pb-24">
      <div className="pt-28">
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-7">
              <div className="inline-flex items-center gap-3 glass-card border-white/10 px-4 py-2 rounded-full mb-6">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] uppercase tracking-[0.3em] text-cyan-300 font-semibold">AI-POWERED</span>
              </div>
              <h1 className="text-6xl font-black leading-tight tracking-[-0.04em] max-w-3xl">
                Master Any Subject with{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">AI Smart Quiz</span>
              </h1>
              <p className="mt-6 max-w-2xl text-slate-300 text-lg leading-8">
                Personalized learning, adaptive quizzes, and spaced repetition to help you learn faster and remember longer.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/login">
                  <button className="bg-[#00f2ff] text-[#030712] font-semibold px-6 py-3 rounded-full hover:brightness-110 transition shadow-[0_0_20px_rgba(0,242,255,0.3)]">
                    Get Started →
                  </button>
                </Link>
                <Link to="/login">
                  <button className="glass-card border-white/10 px-6 py-3 rounded-full text-slate-300 hover:bg-white/5 transition">
                    Learn More
                  </button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Web Development', 'Machine Learning', 'AI Quiz', 'Data Science'].map((pill) => (
                  <span key={pill} className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-span-5 relative">
              <div className="glass-card p-8 rounded-[32px] overflow-hidden relative">
                <div className="absolute inset-x-4 top-4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70" />
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-cyan-200 uppercase tracking-[0.2em]">Continue Learning</div>
                    <h2 className="text-2xl font-semibold mt-2">Resume your flow</h2>
                  </div>
                  <div className="rounded-3xl bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-200">Live</div>
                </div>
                <div className="bg-slate-950/80 border border-white/10 rounded-[28px] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-slate-400">Progress</p>
                      <h3 className="text-3xl font-bold text-white">58%</h3>
                    </div>
                    <div className="w-14 h-14 bg-cyan-400/10 rounded-3xl flex items-center justify-center text-cyan-300">📘</div>
                  </div>
                  <div className="progress-track h-3 rounded-full overflow-hidden">
                    <div className="progress-fill" style={{ width: '58%' }} />
                  </div>
                  <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                    <span>Next task in 23m</span>
                    <Link to="/login">
                      <button className="bg-[#00f2ff] text-[#030712] text-xs px-4 py-2 rounded-full">Resume</button>
                    </Link>
                  </div>
                </div>
                <div className="mt-6 text-slate-400 text-sm border-t border-white/10 pt-4">
                  Next up: Build an adaptive assessment flow with Gemini-powered prompts.
                </div>
              </div>

              <FloatingSnippet title="JSON" className="top-0 right-0 translate-x-8 -translate-y-8">
                {`"quiz": "AI Basics"`}
              </FloatingSnippet>
              <FloatingSnippet title="SQL" className="bottom-0 left-10 translate-y-10">
                {`SELECT * FROM quizzes`}
              </FloatingSnippet>
              <FloatingSnippet title="Snippet" className="-bottom-8 right-6 translate-x-4">
                {`use quizEngine(config)`}
              </FloatingSnippet>
            </div>
          </div>
        </section>

        <section className="sticky top-28 z-40">
          <div className="glass-card border-white/10 mx-auto max-w-[1280px] px-6 py-4 rounded-[32px] backdrop-blur-xl shadow-soft mb-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/" className="nav-link text-sm font-medium text-slate-300">Home</Link>
                <Link to="/quizzes" className="nav-link text-sm font-medium text-slate-300">Quizzes</Link>
                <Link to="/leaderboard" className="nav-link text-sm font-medium text-slate-300">Leaderboard</Link>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full max-w-[420px]">
                 <input type="search" placeholder="Search quizzes..." className="w-full rounded-full border border-white/10 bg-slate-950/80 pl-10 pr-5 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
<span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300">🔍</span>
                </div>
                <Link to="/login">
                  <button className="glass-card border-white/10 px-5 py-3 rounded-full text-slate-100 hover:bg-white/5 transition">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 grid gap-8 lg:grid-cols-2">
          <div className="glass-card p-8 rounded-[32px]"> 
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">AI Generator</p>
                <h2 className="text-2xl font-bold mt-3">Generate Questions</h2>
              </div>
              <div className="flex gap-2 items-center text-xs text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Active
              </div>
            </div>
            <div className="bg-slate-950 rounded-[28px] border border-white/10 p-5 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                {['#f97316','#fff','#22d3ee'].map((color) => (
                  <span key={color} className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
              <pre className="text-sm leading-6 font-mono text-slate-200 overflow-x-auto">
                <code>
{`{
  "quiz": {
    "title": "AI Smart Quiz",
    "difficulty": "medium",
    "questions": 12
  }
}`}
                </code>
              </pre>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[32px] relative overflow-hidden">
            <div className="absolute inset-x-6 bottom-6 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70" />
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Live Preview</p>
                <h2 className="text-2xl font-bold mt-3">Run the UI</h2>
              </div>
              <div className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-300">GEN AI ACTIVE</div>
            </div>
            <div className="h-[320px] bg-slate-950/90 rounded-[28px] border border-white/10 p-6">
              <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 h-full p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between text-sm text-slate-400 mb-6">
                  <span>Quiz Preview</span>
                  <span>Live</span>
                </div>
                <div className="flex-1 rounded-3xl bg-slate-800/80 p-5 text-slate-100">
                  <div className="text-lg font-semibold mb-3">AI Smart Quiz</div>
                  <div className="grid gap-3 text-sm text-slate-300">
                    <div className="rounded-3xl bg-white/5 p-4">Adaptive difficulty</div>
                    <div className="rounded-3xl bg-white/5 p-4">Score tracking</div>
                    <div className="rounded-3xl bg-white/5 p-4">Instant feedback</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <GlassTiltCard 
              title="Smart Quizzes" 
              body="AI-powered adaptive quizzes that adjust to your skill level." 
              icon={<span>🎯</span>} 
            />
            <GlassTiltCard 
              title="Spaced Repetition" 
              body="Science-based review system for better retention." 
              icon={<span>🧠</span>} 
            />
            <GlassTiltCard 
              title="Gamification" 
              body="Earn XP, badges, and compete on leaderboards." 
              icon={<span>🏆</span>} 
            />
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
          <div className="glass-card p-8 rounded-[32px]">
            <Pipeline />
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-10 mt-10">
          <div className="glass-card p-8 rounded-[32px] text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Learning?</h3>
            <p className="text-slate-400 mb-6">Join thousands of learners using AI Smart Quiz</p>
            <Link to="/login">
              <button className="bg-[#00f2ff] text-[#030712] font-semibold px-8 py-3 rounded-full hover:brightness-110 transition shadow-[0_0_20px_rgba(0,242,255,0.3)]">
                Get Started Free →
              </button>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Showcase;