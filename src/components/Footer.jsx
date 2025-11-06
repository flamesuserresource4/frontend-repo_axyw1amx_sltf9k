import React from 'react';
import { Github, Shield, Smartphone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/60 bg-white py-10 dark:border-slate-800/60 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <div className="text-base font-semibold text-slate-900 dark:text-white">Spendlite</div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Offline personal finance — track, budget, own your data.</p>
        </div>
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
          <a href="#" className="inline-flex items-center gap-2 hover:text-slate-900 dark:hover:text-white">
            <Github className="h-5 w-5" />
            <span className="hidden sm:inline text-sm">Source</span>
          </a>
          <a href="#" className="inline-flex items-center gap-2 hover:text-slate-900 dark:hover:text-white">
            <Shield className="h-5 w-5" />
            <span className="hidden sm:inline text-sm">Privacy</span>
          </a>
          <a href="#" className="inline-flex items-center gap-2 hover:text-slate-900 dark:hover:text-white">
            <Smartphone className="h-5 w-5" />
            <span className="hidden sm:inline text-sm">Apps</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
