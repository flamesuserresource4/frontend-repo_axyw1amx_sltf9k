import React, { useState } from 'react';
import { Home, Receipt, Tags, PiggyBank, Plus, Menu } from 'lucide-react';

const tabs = [
  { key: 'dashboard', label: 'Home', icon: Home },
  { key: 'expenses', label: 'Expenses', icon: Receipt },
  { key: 'categories', label: 'Categories', icon: Tags },
  { key: 'budgets', label: 'Budgets', icon: PiggyBank },
];

export default function MobileNav({ current, onChange, onQuickAdd }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/60 bg-white/95 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/90 md:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-2">
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          onClick={onQuickAdd}
          className="-mt-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
          aria-label="Quick Add"
        >
          <Plus className="h-6 w-6" />
        </button>
        <div className="flex gap-3">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`inline-flex flex-col items-center rounded-lg px-3 py-1.5 text-xs font-medium ${current === key ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </div>
      {open && (
        <div className="px-4 pb-3 text-center text-xs text-slate-500 dark:text-slate-400">Tap tabs to switch sections</div>
      )}
    </div>
  );
}
