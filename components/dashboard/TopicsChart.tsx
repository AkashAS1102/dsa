'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { DEMO_USER } from '@/lib/mock-data';

export default function TopicsChart() {
  const data = DEMO_USER.topicsProgress.map((t) => ({
    topic: t.topic,
    solved: t.solved,
    total: t.total,
    pct: Math.round((t.solved / t.total) * 100),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-card-lg text-sm">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-gray-500">{d.solved} / {d.total} solved ({d.pct}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-card ring-1 ring-gray-100 p-5 h-full">
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">Topics Mastered</h2>
        <p className="text-xs text-gray-400 mt-0.5">Problems solved per topic area</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 72 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 20]} />
            <YAxis
              type="category"
              dataKey="topic"
              tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={72}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="solved" radius={[0, 6, 6, 0]} barSize={14}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.pct >= 70 ? '#046c4e' : entry.pct >= 40 ? '#0d9488' : '#99f6e0'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
