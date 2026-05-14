import React from 'react';
import { Star } from 'lucide-react';

const AssessmentCard = ({ question }) => {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{question.category}</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">{question.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{question.description}</p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          <Star className="h-4 w-4 text-[#fbbf24]" />
          {question.rating} Stars
        </div>
      </div>

      <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Core Points</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {question.corePoints.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Criteria</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {question.criteria.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssessmentCard;
