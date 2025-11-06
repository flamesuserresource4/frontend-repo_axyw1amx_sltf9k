// Lightweight IndexedDB helper for Spendlite (no external deps)
// Stores: transactions, categories, budgets

const DB_NAME = 'spendlite';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains('transactions')) {
        const store = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
        store.createIndex('by_date', 'date');
        store.createIndex('by_category', 'category');
      }
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('budgets')) {
        db.createObjectStore('budgets', { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx(db, storeNames, mode = 'readonly') {
  return db.transaction(storeNames, mode);
}

export async function addTransaction(data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = tx(db, ['transactions'], 'readwrite');
    const store = t.objectStore('transactions');
    const now = new Date();
    const payload = {
      amount: Number(data.amount) || 0,
      category: data.category || 'Uncategorized',
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? String(data.tags).split(',').map(s => s.trim()).filter(Boolean) : []),
      date: data.date || now.toISOString(),
      note: data.note || ''
    };
    const req = store.add(payload);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function listTransactions(limit = 1000) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const out = [];
    const t = tx(db, ['transactions']);
    const store = t.objectStore('transactions');
    const req = store.openCursor(null, 'prev');
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor && out.length < limit) {
        out.push({ id: cursor.key, ...cursor.value });
        cursor.continue();
      } else {
        resolve(out);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function addCategory(data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = tx(db, ['categories'], 'readwrite');
    const store = t.objectStore('categories');
    const payload = { name: data.name, color: data.color || '#64748b' };
    const req = store.add(payload);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function listCategories() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const out = [];
    const t = tx(db, ['categories']);
    const store = t.objectStore('categories');
    const req = store.openCursor();
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        out.push({ id: cursor.key, ...cursor.value });
        cursor.continue();
      } else {
        resolve(out);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function addBudget(data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = tx(db, ['budgets'], 'readwrite');
    const store = t.objectStore('budgets');
    const payload = { category: data.category, limit: Number(data.limit) || 0, period: data.period || 'monthly' };
    const req = store.add(payload);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function listBudgets() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const out = [];
    const t = tx(db, ['budgets']);
    const store = t.objectStore('budgets');
    const req = store.openCursor();
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        out.push({ id: cursor.key, ...cursor.value });
        cursor.continue();
      } else {
        resolve(out);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function exportAll() {
  const [transactions, categories, budgets] = await Promise.all([
    listTransactions(),
    listCategories(),
    listBudgets(),
  ]);
  return { transactions, categories, budgets };
}

export async function importAll(payload) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = tx(db, ['transactions', 'categories', 'budgets'], 'readwrite');
    const putAll = (storeName, items) => {
      const store = t.objectStore(storeName);
      items.forEach((item) => store.add(item));
    };
    try {
      if (payload.transactions) putAll('transactions', payload.transactions);
      if (payload.categories) putAll('categories', payload.categories);
      if (payload.budgets) putAll('budgets', payload.budgets);
    } catch (e) {
      reject(e);
    }
    t.oncomplete = () => resolve(true);
    t.onerror = () => reject(t.error);
  });
}
