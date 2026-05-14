import React from 'react';
import { Heart } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: ['Features', 'Integrations', 'Security', 'Enterprise'],
  },
  {
    title: 'Resources',
    links: ['Blog', 'Guides', 'Help Center', 'Community'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Press', 'Contact'],
  },
  {
    title: 'Support',
    links: ['Documentation', 'API Reference', 'Status', 'Privacy'],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-700/40 bg-slate-900/95 px-6 py-12 text-slate-200 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1720px] gap-10 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-gradient-to-br from-sky-500 to-violet-300 text-white shadow-glow">
              <span className="text-lg font-semibold">Q</span>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white">AI Quiz</p>
              <p className="text-sm text-slate-400">Adaptive learning and quiz analytics for students and teachers.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {['F', 'T', 'I'].map((icon) => (
              <div key={icon} className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50/10 text-slate-200 transition hover:bg-slate-50/20">
                {icon}
              </div>
            ))}
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">{column.title}</p>
            <div className="space-y-3 text-sm text-slate-300">
              {column.links.map((link) => (
                <a key={link} href="#" className="block footer-link transition hover:text-white">
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}

        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Legal</p>
          <div className="space-y-3 text-sm text-slate-300">
            <a href="#" className="block footer-link">Terms</a>
            <a href="#" className="block footer-link">Privacy</a>
            <a href="#" className="block footer-link">Cookies</a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-700/40 pt-6 text-sm text-slate-400">
        Built with <span className="text-sky-300 font-semibold"><Heart className="inline h-4 w-4 align-middle" /></span> for modern education experiences.
      </div>
    </footer>
  );
};

export default Footer;
