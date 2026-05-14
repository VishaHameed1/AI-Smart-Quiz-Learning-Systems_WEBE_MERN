import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ChevronRight } from 'lucide-react';
import CandidateQueue from '../components/dashboard/CandidateQueue';
import ProfileSwitcher from '../components/dashboard/ProfileSwitcher';
import AssessmentCard from '../components/dashboard/AssessmentCard';
import SessionTimer from '../components/dashboard/SessionTimer';
import ProgressTimeline from '../components/dashboard/ProgressTimeline';
import SkillSlider from '../components/dashboard/SkillSlider';

const navLinks = [
  { label: 'Candidate list', active: true },
  { label: 'Interview briefs' },
  { label: 'Live sessions' },
  { label: 'Historical notes' },
];

const queue = [
  { id: '1', name: 'Maya Patel', role: 'Frontend Engineer' },
  { id: '2', name: 'Jordan Chase', role: 'Backend Engineer' },
  { id: '3', name: 'Harper Lee', role: 'Data Scientist' },
];

const question = {
  category: 'Assessment question',
  title: 'Design a scalable interview platform',
  description:
    'Outline the architecture for a distributed technical interview application that supports real-time candidate sessions, live scoring, and coach collaboration.',
  rating: '4.8',
  corePoints: [
    'Identify principal components',
    'Design for high availability',
    'Explain data flow and state',
  ],
  criteria: [
    'Clarity of architecture',
    'Operational resilience',
    'Realtime collaboration support',
  ],
};

const steps = [
  { title: 'Candidate queued', subtitle: 'Waiting for interviewer', status: 'completed' },
  { title: 'Profile review', subtitle: 'Review resume and skills', status: 'completed' },
  { title: 'Live session', subtitle: 'In progress now', status: 'active' },
  { title: 'Feedback sent', subtitle: 'Pending summary', status: 'upcoming' },
];

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1720px] space-y-6">
        <header className="flex h-16 items-center justify-between rounded-[28px] border border-slate-200 bg-white px-6 shadow-card">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Live interview operations</p>
            <h1 className="text-lg font-bold text-slate-900">Session control dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              Manage queue
            </button>
            <button className="rounded-full bg-[#2563eb] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8]">
              Start session
            </button>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[352px_minmax(0,1fr)_320px]">
          <aside className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-card">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Navigation</p>
              <div className="mt-5 space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    className={`flex w-full items-center justify-between rounded-3xl px-4 py-3 text-left text-sm font-semibold transition ${
                      link.active
                        ? 'bg-[#eff6ff] text-[#2563eb]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                    {link.active && <ChevronRight className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            <CandidateQueue queue={queue} />
            <ProfileSwitcher user={user} />
          </aside>

          <section className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-card">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex h-[112px] w-[112px] items-center justify-center rounded-[3xl] bg-slate-100 shadow-card">
                    <span className="text-4xl font-black text-slate-900">{user?.name?.charAt(0) || 'A'}</span>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Candidate profile</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">{user?.name || 'Alex Nguyen'}</h2>
                    <p className="mt-2 text-sm text-slate-500">Full-stack interview coordination lead</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {['React', 'Node.js', 'System Design'].map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <AssessmentCard question={question} />

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 shadow-card">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Guidelines</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                    <li>• Keep responses concise and structured.</li>
                    <li>• Highlight architecture, data flow, and scalability.</li>
                    <li>• Reference team collaboration and monitoring.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Success criteria</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                    <li>• Clear component boundaries.</li>
                    <li>• Resilience for high concurrency.</li>
                    <li>• Real-time signal delivery and feedback.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <SkillSlider label="Technical depth" value={78} minLabel="Junior" midLabel="Mid" maxLabel="Expert" />
              <SkillSlider label="Communication" value={64} minLabel="Junior" midLabel="Mid" maxLabel="Expert" />
              <SkillSlider label="Leadership" value={86} minLabel="Junior" midLabel="Mid" maxLabel="Expert" />
            </div>
          </section>

          <aside className="space-y-6">
            <SessionTimer hours="01" minutes="24" seconds="08" />
            <ProgressTimeline steps={steps} />
            <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 shadow-card">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Alert</p>
              <p className="mt-4 text-sm leading-6 text-slate-700">
                Live candidate session is in progress. Keep the feedback aligned with the rubric and submit notes within 10 minutes.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
