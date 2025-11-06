import React from 'react';
import { PieChart, BarChart3, Wallet, ShieldCheck, CloudOff, Tags, Brain, Download } from 'lucide-react';

const features = [
  {
    icon: Wallet,
    title: 'Expense & Budgeting',
    desc: 'Fast entry, edit, categorize, and tag. Set monthly or custom category budgets with alerts.'
  },
  {
    icon: PieChart,
    title: 'Rich Visualizations',
    desc: 'Pie, bar and line charts reveal spending patterns, trends and savings across time.'
  },
  {
    icon: Tags,
    title: 'Categories & Tags',
    desc: 'Create colorful categories and flexible tags. Filter by any combination.'
  },
  {
    icon: BarChart3,
    title: 'Insights & Reports',
    desc: 'Monthly summaries, top categories, averages, and budget vs actual comparisons.'
  },
  {
    icon: CloudOff,
    title: 'Offline-first',
    desc: 'All data stays on your device with local SQLite. No sign-in, no cloud.'
  },
  {
    icon: ShieldCheck,
    title: 'Private by Design',
    desc: 'Secure local storage with export/import to CSV or JSON for backups.'
  },
  {
    icon: Brain,
    title: 'Smart Alerts',
    desc: 'Get notified when you approach category limits and spot unusual spikes.'
  },
  {
    icon: Download,
    title: 'Backup & Restore',
    desc: 'One-tap export of your transactions and budgets. Import on a new device.'
  }
];

const FeatureGrid = () => {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Everything you need for personal finance
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Designed to be fast, offline, and delightful.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-900 transition group-hover:scale-105 dark:bg-slate-800 dark:text-white">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;
