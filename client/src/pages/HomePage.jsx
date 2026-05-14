import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_18%),radial-gradient(circle_at_top_right,_rgba(167,139,250,0.12),_transparent_22%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.08),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(167,139,250,0.08),_transparent_18%),#f8fbff] text-slate-900">
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-8">
        <div className="glass-panel overflow-hidden p-8 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Learning reimagined</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Master every subject with <span className="hero-gradient">AI-guided learning</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Personalized pathways, smart quizzes, and spaced repetition wrapped in a calm glassmorphic experience.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="glass-button inline-flex items-center justify-center">
                  Start learning
                </Link>
                <Link to="/quizzes" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-white">
                  Browse quizzes
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-slate-950/5 p-8 shadow-card">
              <div className="hero-spotlight" />
              <div className="relative space-y-6">
                <div className="glass-card p-6">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Study with confidence</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">Adaptive questions that evolve as you learn</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { emoji: '🎯', title: 'Smart quizzing' },
                    { emoji: '🧠', title: 'Better retention' },
                    { emoji: '🏆', title: 'Earn rewards' },
                    { emoji: '⚡', title: 'Fast feedback' },
                  ].map((item) => (
                    <div key={item.title} className="glass-card p-5 text-center">
                      <div className="text-4xl">{item.emoji}</div>
                      <p className="mt-4 text-lg font-semibold text-slate-900">{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { title: 'Smart Quizzes', description: 'AI-powered questions that adapt to your level.' },
            { title: 'Spaced Review', description: 'Built-in repetition to help you remember longer.' },
            { title: 'Progress Tracking', description: 'Visual reports to help you stay focused.' },
          ].map((card) => (
            <div key={card.title} className="glass-card p-7">
              <h3 className="text-xl font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-slate-600">{card.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default HomePage;
