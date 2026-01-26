
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const LifestyleView: React.FC = () => {
  const spendingData = [
    { category: 'Travel', value: 45000 },
    { category: 'Dining', value: 12000 },
    { category: 'Events', value: 8500 },
    { category: 'Shopping', value: 28000 },
    { category: 'Concierge', value: 5000 },
  ];

  const allocationData = [
    { name: 'Hospitality', value: 40, color: '#b45309' },
    { name: 'Assets', value: 30, color: '#78350f' },
    { name: 'Leisure', value: 20, color: '#f59e0b' },
    { name: 'Bespoke', value: 10, color: '#fbbf24' },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="serif text-4xl gold-text mb-2">Lifestyle Insights</h1>
        <p className="text-slate-400">Analysis of your global activities and membership engagement.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="glass p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <h3 className="serif text-2xl text-amber-100 mb-8">Quarterly Engagement (USD)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="category" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fbbf24' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {spendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#d97706' : '#451a03'} className="hover:fill-amber-500 transition-all duration-300" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center">
          <h3 className="serif text-2xl text-amber-100 mb-8 self-start">Portfolio Allocation</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            {allocationData.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-slate-400">{item.name}</span>
                <span className="text-sm font-bold text-slate-200">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Member Tier', value: 'Platinum', detail: 'Est. 2021' },
          { label: 'Reward Points', value: '1,240,500', detail: '+12% this month' },
          { label: 'Concierge Calls', value: '142', detail: '98% Resolution' },
          { label: 'Next Trip', value: 'Monaco', detail: 'In 12 days' }
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-amber-900/10 shadow-lg text-center">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">{stat.label}</p>
            <p className="serif text-3xl gold-text font-bold mb-1">{stat.value}</p>
            <p className="text-[10px] text-amber-500/50 uppercase">{stat.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LifestyleView;
