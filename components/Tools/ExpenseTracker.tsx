import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense } from '../../types';

const COLORS = {
  food: '#eab308',     // yellow-500
  transport: '#3b82f6', // blue-500
  shopping: '#ec4899',  // pink-500
  stay: '#a855f7',      // purple-500
  other: '#78716c'      // stone-500
};

const CATEGORY_LABELS = {
  food: '飲食',
  transport: '交通',
  shopping: '購物',
  stay: '住宿',
  other: '其他'
};

export const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'TWD' | 'JPY'>('JPY');
  const [category, setCategory] = useState<Expense['category']>('food');
  const [note, setNote] = useState('');
  
  // Exchange Rate State
  const [exchangeRate, setExchangeRate] = useState(0.215); // Default fallback
  const [isRateLoading, setIsRateLoading] = useState(true);

  // Fetch Exchange Rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
        if (response.ok) {
          const data = await response.json();
          if (data.rates && data.rates.TWD) {
            setExchangeRate(data.rates.TWD);
          }
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
      } finally {
        setIsRateLoading(false);
      }
    };

    fetchRate();
  }, []);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('okinawa_expenses');
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load expenses", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('okinawa_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      currency,
      category,
      note,
      date: Date.now()
    };

    setExpenses(prev => [newExpense, ...prev]);
    setAmount('');
    setNote('');
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('確定刪除此筆紀錄？')) {
      setExpenses(prev => prev.filter(item => item.id !== id));
    }
  };

  const totalTWD = useMemo(() => {
    return expenses.reduce((acc, curr) => {
      const val = curr.currency === 'JPY' ? curr.amount * exchangeRate : curr.amount;
      return acc + val;
    }, 0);
  }, [expenses, exchangeRate]);

  const chartData = useMemo(() => {
    const map = new Map();
    expenses.forEach(e => {
      const val = e.currency === 'JPY' ? e.amount * exchangeRate : e.amount;
      map.set(e.category, (map.get(e.category) || 0) + val);
    });
    return Array.from(map.entries()).map(([key, value]) => ({
      name: CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS],
      value: Math.round(value),
      key
    }));
  }, [expenses, exchangeRate]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="serif text-xl font-bold text-stone-800">旅費記帳</h3>
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-stone-800 text-white px-4 py-2 rounded-sm text-sm tracking-wide active:scale-95 transition-transform"
        >
          + 新增
        </button>
      </div>

      <div className="mb-6 flex items-center justify-between bg-stone-50 p-3 rounded">
        <div>
          <span className="text-stone-500 text-xs block">總支出 (約台幣)</span>
          <span className="serif text-2xl font-bold text-stone-900">
            NT$ {Math.round(totalTWD).toLocaleString()}
          </span>
        </div>
        <div className="text-right">
          <span className="text-stone-400 text-[10px] block">
            {isRateLoading ? '匯率更新中...' : '即時匯率 (JPY→TWD)'}
          </span>
          <span className="font-mono text-stone-600 font-bold text-sm">
            {exchangeRate.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Chart */}
      {expenses.length > 0 ? (
        <div className="h-48 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.key as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `NT$ ${value}`} />
              <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" iconSize={8} wrapperStyle={{fontSize: '10px'}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-stone-400 py-8 text-sm">尚未有記帳資料</div>
      )}

      {/* Recent List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Recent</h4>
        {expenses.length === 0 && <p className="text-xs text-stone-300 italic">點擊右上方新增第一筆消費</p>}
        {expenses.slice(0, 5).map(expense => {
          const isJPY = expense.currency === 'JPY';
          // Calculate secondary amount based on exchange rate
          const secondaryValue = isJPY 
            ? Math.round(expense.amount * exchangeRate) 
            : Math.round(expense.amount / exchangeRate);

          return (
            <div key={expense.id} className="flex justify-between items-center border-b border-stone-100 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[expense.category] }}></div>
                <div>
                  <div className="text-sm font-medium text-stone-800">{expense.note || CATEGORY_LABELS[expense.category]}</div>
                  <div className="text-[10px] text-stone-400">{new Date(expense.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                 <div className="flex flex-col items-end">
                   <div className="text-sm font-bold text-stone-700">
                     {isJPY ? '¥' : 'NT$'} {expense.amount.toLocaleString()}
                   </div>
                   <div className="text-[10px] text-stone-400">
                     ≈ {isJPY ? 'NT$' : '¥'} {secondaryValue.toLocaleString()}
                   </div>
                 </div>
                 <button 
                  type="button"
                  onClick={(e) => handleDelete(e, expense.id)} 
                  className="text-stone-300 hover:text-red-500 hover:bg-stone-50 p-2 rounded transition-colors"
                  aria-label="Delete expense"
                 >
                   ✕
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white w-full sm:w-96 p-6 rounded-t-2xl sm:rounded-2xl shadow-xl animate-slide-up">
            <h3 className="serif text-lg font-bold mb-4">新增支出</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-stone-500 block mb-1">金額</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full text-2xl font-bold border-b border-stone-300 pb-1 focus:outline-none focus:border-stone-800"
                    placeholder="0"
                    autoFocus
                    required
                  />
                </div>
                <div className="w-24">
                   <label className="text-xs text-stone-500 block mb-1">幣別</label>
                   <div className="flex bg-stone-100 rounded p-1">
                      <button type="button" onClick={() => setCurrency('JPY')} className={`flex-1 text-xs py-1 rounded ${currency === 'JPY' ? 'bg-white shadow' : 'text-stone-400'}`}>JPY</button>
                      <button type="button" onClick={() => setCurrency('TWD')} className={`flex-1 text-xs py-1 rounded ${currency === 'TWD' ? 'bg-white shadow' : 'text-stone-400'}`}>TWD</button>
                   </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1">類別</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${category === cat ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-200 text-stone-600'}`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1">備註</label>
                <input 
                  type="text" 
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full text-sm border-b border-stone-300 pb-1 focus:outline-none focus:border-stone-800"
                  placeholder="例如：便利商店"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 text-stone-500 text-sm">取消</button>
                <button type="submit" className="flex-1 py-3 bg-stone-800 text-white text-sm font-bold rounded-sm shadow-lg">儲存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};