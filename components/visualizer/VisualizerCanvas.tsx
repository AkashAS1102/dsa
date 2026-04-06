'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ArrayVisualizer from './ArrayVisualizer';
import TreeVisualizer from './TreeVisualizer';
import PlaybackControls from './PlaybackControls';
import type { VisualizerState } from '@/lib/mock-data';

interface VisualizerCanvasProps {
  stateTimeline: VisualizerState[];
  type: 'array' | 'tree';
  title?: string;
}

export default function VisualizerCanvas({ stateTimeline, type, title }: VisualizerCanvasProps) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = stateTimeline.length;
  const currentState = stateTimeline[step] ?? stateTimeline[0];

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (step >= total - 1) setStep(0);
    setIsPlaying(true);
  }, [step, total]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    if (isPlaying) {
      clearTimer();
      intervalRef.current = setInterval(() => {
        setStep(s => {
          if (s >= total - 1) {
            setIsPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, Math.round(1000 / speed));
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [isPlaying, speed, total, clearTimer]);

  // Reset on timeline change
  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [stateTimeline]);

  return (
    <div className="bg-white rounded-2xl shadow-card ring-1 ring-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-800">{title ?? 'Algorithm Visualizer'}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Step {step + 1} of {total}
          </p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          type === 'array'
            ? 'bg-brand-50 text-brand-700 border border-brand-200'
            : 'bg-violet-50 text-violet-700 border border-violet-200'
        }`}>
          {type === 'array' ? '📊 Array' : '🌳 Tree/Graph'}
        </span>
      </div>

      {/* Step label */}
      <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-700">
          <span className="text-brand-600 font-bold">Step {step + 1}: </span>
          {currentState?.label ?? '—'}
        </p>
      </div>

      {/* Canvas */}
      <div className="h-72 px-4 py-6 flex items-center justify-center overflow-hidden">
        {type === 'array'
          ? <ArrayVisualizer state={currentState} />
          : <TreeVisualizer state={currentState} />
        }
      </div>

      {/* Controls */}
      <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
        <PlaybackControls
          step={step}
          total={total}
          isPlaying={isPlaying}
          speed={speed}
          onPlay={play}
          onPause={pause}
          onNext={() => setStep(s => Math.min(s + 1, total - 1))}
          onPrev={() => setStep(s => Math.max(s - 1, 0))}
          onFirst={() => { setIsPlaying(false); setStep(0); }}
          onLast={() => { setIsPlaying(false); setStep(total - 1); }}
          onSpeedChange={setSpeed}
        />
      </div>
    </div>
  );
}
