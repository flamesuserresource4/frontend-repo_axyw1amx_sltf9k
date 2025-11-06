import React from 'react';
import { Calendar, TrendingUp, PiggyBank, Receipt, Filter, ArrowRight } from 'lucide-react';

const Stat = ({ label, value, trend }) => (
  <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
    <div className="mt-2 flex items-end justify-between">
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      {trend && (
        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${trend > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'}`}>
          <TrendingUp className="h-3.5 w-3.5" />
          {trend > 0 ? `+${trend}%` : `${trend}%`}
        </div>
      )}
    </div>
  </div>
);

const DashboardPreview = () => {
  return (
    <section id="get-started" className="relative mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">A dashboard that makes sense</h2>
        <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:underline dark:text-white">
          See full demo <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Calendar className="h-4 w-4" /> September Summary
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Filter className="h-3.5 w-3.5" /> Filter
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="Total Spending" value="$1,240" trend={-8} />
              <Stat label="Net Savings" value="$560" trend={14} />
              <Stat label="Transactions" value="73" />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200/60 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-300">
                Pie & trend charts would render here using your local data.
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-300">
                Category vs Budget comparison with alerts.
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
            <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Quick Add</div>
            <div className="grid grid-cols-2 gap-3">
              <input className="col-span-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Amount e.g. 12.99" />
              <input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Category" />
              <input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Tags" />
              <button className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                <Receipt className="h-4 w-4" /> Add Expense
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <PiggyBank className="h-4 w-4" /> Budget Status
            </div>
            <div className="space-y-3">
              {[{name: 'Food', used: 62}, {name: 'Transport', used: 48}, {name: 'Entertainment', used: 85}].map((b) => (
                <div key={b.name}>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>{b.name}</span>
                    <span>{b.used}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className={`h-full ${b.used < 70 ? 'bg-emerald-500' : b.used < 90 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${b.used}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
