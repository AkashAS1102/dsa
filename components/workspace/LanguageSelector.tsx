'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { Language } from '@/lib/mock-data';

const LANGUAGES: { id: Language; label: string; version: string; icon: string }[] = [
  { id: 'python', label: 'Python',  version: '3.10',  icon: '🐍' },
  { id: 'cpp',    label: 'C++',     version: 'GCC 10', icon: '⚙️' },
  { id: 'c',      label: 'C',       version: 'GCC 10', icon: '🔧' },
  { id: 'java',   label: 'Java',    version: '15',     icon: '☕' },
];

interface LanguageSelectorProps {
  value: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = LANGUAGES.find(l => l.id === value)!;

  return (
    <div className="relative" id="language-selector">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#252526] hover:bg-[#2d2d2d] border border-[#3e3e42] rounded-lg text-sm text-gray-300 transition-colors"
      >
        <span>{selected.icon}</span>
        <span className="font-medium">{selected.label}</span>
        <span className="text-xs text-gray-500">{selected.version}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-[#252526] border border-[#3e3e42] rounded-xl overflow-hidden shadow-xl z-50 min-w-[180px]">
          {LANGUAGES.map(lang => (
            <button
              key={lang.id}
              id={`lang-option-${lang.id}`}
              onClick={() => { onChange(lang.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                lang.id === value
                  ? 'bg-brand-900 text-white'
                  : 'text-gray-300 hover:bg-[#2d2d2d]'
              }`}
            >
              <span>{lang.icon}</span>
              <div>
                <p className="font-medium">{lang.label}</p>
                <p className="text-xs opacity-60">{lang.version}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
