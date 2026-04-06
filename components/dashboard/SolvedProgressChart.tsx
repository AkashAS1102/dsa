'use client';

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { DEMO_USER } from '@/lib/mock-data';

const COLORS = ['#16a34a', '#ca8a04', '#dc2626'];

export default function SolvedProgressChart() {
  const data = [
    { name: 'Easy',   value: DEMO_USER.solvedEasy,   total: 48, color: '#16a34a' },
    { name: 'Medium', value: DEMO_USER.solvedMedium, total: 38, color: '#ca8a04' },
    { name: 'Hard',   value: DEMO_USER.solvedHard,   total: 20, color: '#dc2626' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-card-lg text-sm">
          <p className="font-semibold" style={{ color: d.color }}>{d.name}</p>
          <p className="text-gray-600">{d.value} / {d.total} solved</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-card ring-1 ring-gray-100 p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Solved Progress</h2>
          <p className="text-xs text-gray-400 mt-0.5">Problems completed by difficulty</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-gradient-teal">{DEMO_USER.totalSolved}</p>
          <p className="text-xs text-gray-400">Total Solved</p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        {data.map((d) => (
          <div key={d.name} className="text-center p-2 rounded-xl" style={{ backgroundColor: d.color + '15' }}>
            <p className="text-lg font-bold" style={{ color: d.color }}>{d.value}</p>
            <p className="text-xs font-medium text-gray-500">{d.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
