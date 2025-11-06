import React, { useEffect, useMemo, useState } from 'react';
import { addTransaction, listTransactions, addCategory, listCategories, addBudget, listBudgets } from '../lib/localdb';
import { Receipt, Tag, Calendar, PlusCircle } from 'lucide-react';
import { LineChart, DonutChart } from './Charts';

export function DashboardScreen() {
  const [tx, setTx] = useState([]);
  const [cats, setCats] = useState([]);
  useEffect(() => {
    (async () => {
      const [t, c] = await Promise.all([listTransactions(), listCategories()]);
      setTx(t);
      setCats(c);
    })();
  }, []);

  const monthlyTotals = useMemo(() => {
    const map = new Map();
    tx.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      map.set(key, (map.get(key) || 0) + Number(t.amount || 0));
    });
    return Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0])).map(([,v])=>v);
  }, [tx]);

  const donut = useMemo(() => {
    const colorPool = ['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#14b8a6'];
    const byCat = new Map();
    tx.forEach(t => byCat.set(t.category, (byCat.get(t.category)||0) + Number(t.amount||0)));
    const entries = Array.from(byCat.entries());
    const total = entries.reduce((a,[,v])=>a+v,0) || 1;
    return entries.slice(0,6).map(([name,val],i)=>({ label: name, value: val, percent: Math.round((val/total)*100), color: colorPool[i%colorPool.length] }));
  }, [tx]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 dark:border-slate-700/60 dark:bg-slate-900">
        <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <Calendar className="h-4 w-4" /> Spending Trend
        </div>
        <LineChart data={monthlyTotals} />
      </div>

      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 dark:border-slate-700/60 dark:bg-slate-900">
        <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <Tag className="h-4 w-4" /> Top Categories
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <DonutChart slices={donut} />
          <ul className="space-y-2 text-sm">
            {donut.map(s => (
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
  );
}

export function ExpensesScreen() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');
  const [tx, setTx] = useState([]);
  useEffect(() => { listTransactions().then(setTx); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await addTransaction({ amount, category, tags });
    setAmount(''); setTags('');
    setTx(await listTransactions());
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200/60 bg-white p-5 dark:border-slate-700/60 dark:bg-slate-900">
        <div className="col-span-2 text-sm font-semibold">Add Expense</div>
        <input value={amount} onChange={e=>setAmount(e.target.value)} required placeholder="Amount" className="col-span-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
        <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
        <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="Tags (comma separated)" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
        <button className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"><PlusCircle className="h-4 w-4"/> Save</button>
      </form>

      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 dark:border-slate-700/60 dark:bg-slate-900">
        <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold"><Receipt className="h-4 w-4"/> Recent</div>
        <ul className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
          {tx.map(t => (
            <li key={t.id} className="flex items-center justify-between py-2">
              <span className="text-slate-600 dark:text-slate-300">{t.category}</span>
              <span className="font-medium">${Number(t.amount).toFixed(2)}</span>
            </li>
          ))}
          {!tx.length && <li className="py-2 text-slate-500">No transactions yet</li>}
        </ul>
      </div>
    </div>
  );
}

export function CategoriesScreen() {
  const [name, setName] = useState('Food');
  const [color, setColor] = useState('#10b981');
  const [cats, setCats] = useState([]);
  useEffect(() => { listCategories().then(setCats); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await addCategory({ name, color });
    setCats(await listCategories());
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-200/60 bg-white p-5 dark:border-slate-700/60 dark:bg-slate-900">
        <div className="text-sm font-semibold">New Category</div>
        <input value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
        <div className="flex items-center gap-3">
          <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="h-9 w-16 rounded" />
          <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">Add</button>
        </div>
      </form>
      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 dark:border-slate-700/60 dark:bg-slate-900">
        <div className="mb-3 text-sm font-semibold">Categories</div>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {cats.map(c => (
            <li key={c.id} className="flex items-center gap-2 rounded-lg border border-slate-200/60 p-2 dark:border-slate-700/60">
              <span className="h-3 w-3 rounded-full" style={{ background: c.color }} /> {c.name}
            </li>
          ))}
          {!cats.length && <li className="text-slate-500">No categories yet</li>}
        </ul>
      </div>
    </div>
  );
}

export function BudgetsScreen() {
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('200');
  const [period, setPeriod] = useState('monthly');
  const [budgets, setBudgets] = useState([]);
  useEffect(() => { listBudgets().then(setBudgets); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await addBudget({ category, limit, period });
    setBudgets(await listBudgets());
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-200/60 bg-white p-5 dark:border-slate-700/60 dark:bg-slate-900">
        <div className="text-sm font-semibold">New Budget</div>
        <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
        <input value={limit} onChange={e=>setLimit(e.target.value)} placeholder="Limit" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
        <select value={period} onChange={e=>setPeriod(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">Add</button>
      </form>

      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 dark:border-slate-700/60 dark:bg-slate-900">
        <div className="mb-3 text-sm font-semibold">Budgets</div>
        <ul className="space-y-2 text-sm">
          {budgets.map(b => (
            <li key={b.id} className="rounded-lg border border-slate-200/60 p-3 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">{b.category} • {b.period}</span>
                <span className="font-semibold">${Number(b.limit).toFixed(2)}</span>
              </div>
            </li>
          ))}
          {!budgets.length && <li className="text-slate-500">No budgets yet</li>}
        </ul>
      </div>
    </div>
  );
}
