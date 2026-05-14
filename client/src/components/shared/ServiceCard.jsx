import React from 'react';
import { ArrowRight } from 'lucide-react';

const ServiceCard = ({ title, description, color, icon }) => {
  return (
    <article className="glass-card group p-8 transition-all duration-500">
      <div className={`icon-pill ${color} mb-6 inline-flex items-center justify-center`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
      <button className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-all duration-500 group-hover:translate-x-1">
        Learn More <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
};

export default ServiceCard;
