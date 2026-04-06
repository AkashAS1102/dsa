'use client';

import { Play, Pause, SkipBack, SkipForward, ChevronFirst, ChevronLast } from 'lucide-react';

interface PlaybackControlsProps {
  step: number;
  total: number;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onFirst: () => void;
  onLast: () => void;
  onSpeedChange: (s: number) => void;
}

const SPEEDS = [0.5, 1, 1.5, 2, 3];

export default function PlaybackControls({
  step, total, isPlaying, speed,
  onPlay, onPause, onNext, onPrev, onFirst, onLast, onSpeedChange,
}: PlaybackControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-gray-400 w-12 text-right">
          {step + 1}/{total}
        </span>
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-700 rounded-full transition-all duration-200"
            style={{ width: total > 1 ? `${(step / (total - 1)) * 100}%` : '0%' }}
          />
        </div>
        <span className="text-xs text-gray-400 w-12">
          {Math.round(total > 1 ? (step / (total - 1)) * 100 : 0)}%
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          id="playback-first"
          onClick={onFirst}
          disabled={step === 0}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="First step"
        >
          <ChevronFirst className="w-4 h-4 text-gray-600" />
        </button>

        <button
          id="playback-prev"
          onClick={onPrev}
          disabled={step === 0}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous step"
        >
          <SkipBack className="w-4 h-4 text-gray-600" />
        </button>

        <button
          id="playback-play-pause"
          onClick={isPlaying ? onPause : onPlay}
          className="p-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white shadow-glow-teal transition-all"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying
            ? <Pause className="w-5 h-5" fill="currentColor" />
            : <Play className="w-5 h-5" fill="currentColor" />
          }
        </button>

        <button
          id="playback-next"
          onClick={onNext}
          disabled={step >= total - 1}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next step"
        >
          <SkipForward className="w-4 h-4 text-gray-600" />
        </button>

        <button
          id="playback-last"
          onClick={onLast}
          disabled={step >= total - 1}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Last step"
        >
          <ChevronLast className="w-4 h-4 text-gray-600" />
        </button>

        {/* Speed selector */}
        <div className="ml-3 flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {SPEEDS.map(s => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors ${
                speed === s ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
