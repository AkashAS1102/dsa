'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { VisualizerState } from '@/lib/mock-data';

interface ArrayVisualizerProps {
  state: VisualizerState;
}

const BAR_COLORS = {
  normal:      '#e2e8f0',
  highlighted: '#14b8a6',
  swapping:    '#f59e0b',
  sorted:      '#10b981',
  pivot:       '#8b5cf6',
};

export default function ArrayVisualizer({ state }: ArrayVisualizerProps) {
  const arr = state.array ?? [];
  if (arr.length === 0) return <div className="flex items-center justify-center h-full text-gray-400 text-sm">No array data</div>;

  const absArr = arr.map(Math.abs);
  const max = Math.max(...absArr, 1);
  const highlighted = state.highlighted ?? [];
  const swapping: number[] = Array.isArray(state.swapping) ? state.swapping : [];
  const pointers = state.pointers ?? {};
  const sorted = (state as any).sorted ?? [];

  const getColor = (idx: number) => {
    if (swapping.includes(idx)) return BAR_COLORS.swapping;
    if (sorted.includes(idx)) return BAR_COLORS.sorted;
    if ((pointers as any).pivot === idx) return BAR_COLORS.pivot;
    if (highlighted.includes(idx)) return BAR_COLORS.highlighted;
    return BAR_COLORS.normal;
  };

  const barW = Math.max(28, Math.min(64, Math.floor(480 / arr.length)));

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Bars */}
      <div className="flex items-end justify-center gap-1 h-48 px-2">
        {arr.map((val, idx) => {
          const h = Math.max(8, (Math.abs(val) / max) * 160);
          const color = getColor(idx);
          const isNeg = val < 0;
          return (
            <motion.div
              key={idx}
              className="relative flex flex-col items-center flex-shrink-0"
              style={{ width: barW }}
              layout
            >
              {/* Pointer arrows above */}
              {Object.entries(pointers).map(([name, pIdx]) =>
                typeof pIdx === 'number' && pIdx === idx && name !== 'pivot' && name !== 'curr' && name !== 'max' && name !== 'coin' && name !== 'item' && name !== 'len' && name !== 'n' ? (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute flex flex-col items-center"
                    style={{ bottom: h + 22 }}
                  >
                    <span className="text-[9px] font-bold text-brand-700 bg-brand-50 border border-brand-200 rounded px-1 whitespace-nowrap">{name}</span>
                    <div className="w-px h-2 bg-brand-400" />
                    <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-brand-500" />
                  </motion.div>
                ) : null
              )}

              {/* Bar */}
              <motion.div
                className="w-full rounded-t-md shadow-sm"
                animate={{ height: h, backgroundColor: color }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              />

              {/* Value */}
              <span className={`text-[10px] font-bold mt-0.5 ${isNeg ? 'text-red-500' : 'text-gray-700'}`}>
                {val}
              </span>
              {/* Index */}
              <span className="text-[9px] text-gray-400 font-mono">[{idx}]</span>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {[
          { color: BAR_COLORS.highlighted, label: 'Comparing' },
          { color: BAR_COLORS.swapping,    label: 'Swapping' },
          { color: BAR_COLORS.sorted,      label: 'Sorted' },
          { color: BAR_COLORS.pivot,       label: 'Pivot' },
          { color: BAR_COLORS.normal,      label: 'Unsorted' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Variable values display */}
      {Object.keys(pointers).length > 0 && (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {Object.entries(pointers).map(([name, val]) => (
            <div key={name} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
              <span className="text-[10px] font-bold text-brand-700 font-mono">{name}</span>
              <span className="text-[10px] text-gray-400">=</span>
              <span className="text-[10px] font-bold text-gray-700 font-mono">{String(val)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
