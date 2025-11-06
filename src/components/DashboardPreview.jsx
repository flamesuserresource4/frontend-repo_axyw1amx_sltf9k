import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, TrendingUp, PiggyBank, Receipt, Filter, ArrowRight } from 'lucide-react';
import { LineChart, DonutChart } from './Charts';
import { addTransaction, listTransactions, listBudgets } from '../lib/localdb';
import MobileNav from './MobileNav';
import { DashboardScreen, ExpensesScreen, CategoriesScreen, BudgetsScreen } from './Screens';

const Stat = ({ label, value, trend }) => (
  <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
    <div className="mt-2 flex items-end justify-between">
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      {typeof trend === 'number' && (
        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${trend > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'}`}>
          <TrendingUp className="h-3.5 w-3.5" />
          {trend > 0 ? `+${trend}%` : `${trend}%`}
        </div>
      )}
    </div>
  </div>
);

const DashboardPreview = () => {
  // Local data
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // Quick add form
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');

  // Mobile prototype state
  const [tab, setTab] = useState('dashboard');

  useEffect(() => {
    (async () => {
      const [t, b] = await Promise.all([listTransactions(), listBudgets()]);
      setTransactions(t);
      setBudgets(b);
    })();
  }, []);

  const monthlyTotals = useMemo(() => {
    const map = new Map();
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, (map.get(key) || 0) + Number(t.amount || 0));
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([, v]) => v);
  }, [transactions]);

  const donut = useMemo(() => {
    const colorPool = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];
    const byCat = new Map();
    transactions.forEach((t) => byCat.set(t.category, (byCat.get(t.category) || 0) + Number(t.amount || 0)));
    const entries = Array.from(byCat.entries());
    const total = entries.reduce((a, [, v]) => a + v, 0) || 1;
    return entries.slice(0, 6).map(([name, val], i) => ({ label: name, value: val, percent: Math.round((val / total) * 100), color: colorPool[i % colorPool.length] }));
  }, [transactions]);

  const budgetUsage = useMemo(() => {
    // Sum spending by category this month and compare to budget limits
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
    const spendByCat = new Map();
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (key === monthKey) {
        spendByCat.set(t.category, (spendByCat.get(t.category) || 0) + Number(t.amount || 0));
      }
    });
    return budgets.map((b) => {
      const used = spendByCat.get(b.category) || 0;
      const pct = b.limit ? Math.min(100, Math.round((used / Number(b.limit)) * 100)) : 0;
      return { name: b.category, usedPct: pct };
    });
  }, [transactions, budgets]);

  async function onQuickAdd(e) {
    e.preventDefault();
    if (!amount) return;
    await addTransaction({ amount, category, tags });
    setAmount('');
    setTags('');
    setTransactions(await listTransactions());
  }

  return (
    <section id="get-started" className="relative mx-auto max-w-7xl px-6 pb-24">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">A dashboard that makes sense</h2>
        <a href="#prototype" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:underline dark:text-white">
          See prototype <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Calendar className="h-4 w-4" /> Monthly Overview
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Filter className="h-3.5 w-3.5" /> Filter
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="Total Spending" value={`$${monthlyTotals.reduce((a, v) => a + v, 0).toFixed(2)}`} trend={monthlyTotals.length > 1 ? Math.round(((monthlyTotals.at(-1) - monthlyTotals.at(-2)) / (monthlyTotals.at(-2) || 1)) * 100) : undefined} />
              <Stat label="Categories" value={String(donut.length || 0)} />
              <Stat label="Transactions" value={String(transactions.length)} />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200/60 p-4 dark:border-slate-700/60">
                <div className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">Spending Trend</div>
                <LineChart data={monthlyTotals} />
              </div>
              <div className="rounded-xl border border-slate-200/60 p-4 dark:border-slate-700/60">
                <div className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">Top Categories</div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <DonutChart slices={donut} />
                  <ul className="space-y-2 text-sm">
                    {donut.map((s) => (
                      <li key={s.label} className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.label}</span>
                        <span className="font-medium">{s.percent}%</span>
                      </li>
                    ))}
                    {!donut.length && <li className="text-slate-500">No data yet</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
            <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Quick Add</div>
            <form onSubmit={onQuickAdd} className="grid grid-cols-2 gap-3">
              <input value={amount} onChange={(e)=>setAmount(e.target.value)} required className="col-span-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Amount e.g. 12.99" />
              <input value={category} onChange={(e)=>setCategory(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Category" />
              <input value={tags} onChange={(e)=>setTags(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Tags" />
              <button className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                <Receipt className="h-4 w-4" /> Add Expense
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <PiggyBank className="h-4 w-4" /> Budget Status
            </div>
            <div className="space-y-3">
              {budgetUsage.length ? budgetUsage.map((b) => (
                <div key={b.name}>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>{b.name}</span>
                    <span>{b.usedPct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className={`h-full ${b.usedPct < 70 ? 'bg-emerald-500' : b.usedPct < 90 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${b.usedPct}%` }} />
                  </div>
                </div>
              )) : (
                <div className="text-sm text-slate-500">No budgets yet. Add some in the prototype below.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile prototype */}
      <div id="prototype" className="mx-auto mt-12 grid place-items-center">
        <div className="relative w-full max-w-sm rounded-[2rem] border border-slate-200/60 bg-white p-4 pb-20 shadow-xl dark:border-slate-700/60 dark:bg-slate-900">
          {tab === 'dashboard' && <DashboardScreen />}
          {tab === 'expenses' && <ExpensesScreen />}
          {tab === 'categories' && <CategoriesScreen />}
          {tab === 'budgets' && <BudgetsScreen />}
          <MobileNav current={tab} onChange={setTab} onQuickAdd={(e)=>{setTab('expenses');}} />
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
