'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { Language } from '@/lib/mock-data';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANG_MAP: Record<Language, string> = {
  python: 'python',
  cpp:    'cpp',
  c:      'c',
  java:   'java',
};

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  language: Language;
}

export default function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] rounded-b-2xl overflow-hidden">
      <MonacoEditor
        height="100%"
        language={LANG_MAP[language]}
        value={value}
        theme="vs-dark"
        onChange={(val) => onChange(val ?? '')}
        options={{
          fontSize: 14,
          fontFamily: '"JetBrains Mono", "Cascadia Code", "Fira Code", monospace',
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderLineHighlight: 'gutter',
          tabSize: 4,
          wordWrap: 'on',
          automaticLayout: true,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          formatOnPaste: true,
          suggestOnTriggerCharacters: true,
          padding: { top: 16, bottom: 16 },
          lineDecorationsWidth: 0,
          glyphMargin: false,
          folding: true,
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
}
