'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import { PROBLEMS, TAGS, getFilteredProblems, type Difficulty } from '@/lib/mock-data';

const DIFFICULTY_OPTIONS: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard'];

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    Easy:   'bg-green-50 text-green-700 border border-green-200',
    Medium: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    Hard:   'bg-red-50 text-red-600 border border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
}

export default function ProblemsPage() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const filtered = getFilteredProblems({ difficulty, tag: selectedTag, search });

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Problems</h1>
          <p className="text-sm text-gray-500 mt-1">
            {PROBLEMS.length} curated coding challenges for college students
          </p>
        </div>
        <div className="flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-xl px-3 py-2">
          <CheckCircle2 className="w-4 h-4 text-brand-700" />
          <span className="text-sm font-semibold text-brand-800">29 / {PROBLEMS.length} solved</span>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl shadow-card ring-1 ring-gray-100 p-4 flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search problems…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="problems-search"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 bg-gray-50 placeholder:text-gray-400"
          />
        </div>

        {/* Difficulty */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-gray-400" />
          {DIFFICULTY_OPTIONS.map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              id={`filter-${d.toLowerCase()}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                difficulty === d
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Reset */}
        {(search || difficulty !== 'All' || selectedTag !== 'All') && (
          <button
            onClick={() => { setSearch(''); setDifficulty('All'); setSelectedTag('All'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag('All')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            selectedTag === 'All'
              ? 'bg-brand-900 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
          }`}
        >
          All Topics
        </button>
        {Object.values(TAGS).map(tag => (
          <button
            key={tag.id}
            onClick={() => setSelectedTag(selectedTag === tag.id ? 'All' : tag.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedTag === tag.id
                ? 'bg-brand-100 text-brand-800 border border-brand-300'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {/* Problems table */}
      <div className="bg-white rounded-2xl shadow-card ring-1 ring-gray-100 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="col-span-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</div>
          <div className="col-span-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Title</div>
          <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Difficulty</div>
          <div className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Tags</div>
          <div className="col-span-1 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Acc.</div>
        </div>

        {/* Table rows */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Circle className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No problems match your filters</p>
          </div>
        ) : (
          filtered.map((problem, idx) => {
            const isSolved = idx < 5; // mock: first 5 are "solved"
            return (
              <Link
                key={problem.id}
                href={`/problems/${problem.id}`}
                id={`problem-row-${problem.id}`}
                className="grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-gray-50 hover:bg-brand-50/40 transition-colors items-center group"
              >
                {/* Index + Status icon */}
                <div className="col-span-1 flex items-center gap-2">
                  {isSolved
                    ? <CheckCircle2 className="w-4 h-4 text-brand-700 flex-shrink-0" />
                    : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  }
                  <span className="text-sm text-gray-400 font-mono">{idx + 1}</span>
                </div>

                {/* Title */}
                <div className="col-span-5">
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 transition-colors">
                    {problem.title}
                  </span>
                </div>

                {/* Difficulty */}
                <div className="col-span-2">
                  <DifficultyBadge difficulty={problem.difficulty} />
                </div>

                {/* Tags */}
                <div className="col-span-3 flex flex-wrap gap-1">
                  {problem.tags.slice(0, 2).map(tag => (
                    <span key={tag.id} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      {tag.name}
                    </span>
                  ))}
                  {problem.tags.length > 2 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full">
                      +{problem.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* Acceptance Rate */}
                <div className="col-span-1 text-right">
                  <span className="text-xs font-semibold text-gray-400">
                    {problem.acceptanceRate}%
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Showing {filtered.length} of {PROBLEMS.length} problems
      </p>
    </div>
  );
}
