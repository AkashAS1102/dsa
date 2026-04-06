'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import {
  Play, Send, ChevronRight, Lightbulb, BookOpen,
  Layers, CheckCircle2, Clock, AlertCircle,
} from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { getProblemById, type Language } from '@/lib/mock-data';
import CodeEditor from '@/components/workspace/CodeEditor';
import OutputTerminal, { type ExecutionResult } from '@/components/workspace/OutputTerminal';
import LanguageSelector from '@/components/workspace/LanguageSelector';

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    Easy:   'bg-green-100 text-green-700 ring-1 ring-green-300',
    Medium: 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-300',
    Hard:   'bg-red-100 text-red-600 ring-1 ring-red-300',
  };
  return (
    <span className={`inline-flex px-3 py-0.5 rounded-full text-xs font-bold ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
}

export default function ProblemWorkspacePage({ params }: { params: { id: string } }) {
  const problem = getProblemById(params.id);
  if (!problem) notFound();

  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(problem.starterCode.python);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'hints'>('description');
  const [submitResult, setSubmitResult] = useState<'accepted' | 'wrong' | null>(null);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(problem.starterCode[lang]);
    setResult(null);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);
    setSubmitResult(null);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, stdin: problem.testCases[0]?.input || '' }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: 'error', stdout: '', stderr: 'Network error — could not reach execution engine.', message: '' });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);
    // Simulate submission for demo
    await new Promise(r => setTimeout(r, 1800));
    const accepted = Math.random() > 0.3; // 70% acceptance for demo
    setSubmitResult(accepted ? 'accepted' : 'wrong');
    setResult({
      status: accepted ? 'success' : 'error',
      stdout: accepted ? problem.testCases[0]?.expectedOutput || 'Correct!' : 'Wrong answer on test case 3',
      stderr: '',
      executionTime: Math.floor(Math.random() * 80 + 20),
      memory: Math.random() * 5 + 10,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="h-[calc(100vh-64px)] -m-6 lg:-m-8 flex flex-col">
      {/* Workspace header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Problems</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="font-semibold text-gray-800">{problem.title}</span>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <div className="flex items-center gap-2">
          {submitResult === 'accepted' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-xs font-bold text-green-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
            </div>
          )}
          {submitResult === 'wrong' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-red-600">
              <AlertCircle className="w-3.5 h-3.5" /> Wrong Answer
            </div>
          )}
        </div>
      </div>

      {/* Main split panels */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* LEFT: Problem description */}
          <Panel defaultSize={38} minSize={28}>
            <div className="h-full bg-white overflow-hidden flex flex-col border-r border-gray-100">
              {/* Tabs */}
              <div className="flex border-b border-gray-100 px-4 flex-shrink-0">
                {(['description', 'hints'] as const).map(tab => (
                  <button
                    key={tab}
                    id={`tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px capitalize ${
                      activeTab === tab
                        ? 'border-brand-700 text-brand-700'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'description' ? <BookOpen className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-auto p-5 scrollbar-thin">
                {activeTab === 'description' ? (
                  <div className="space-y-5">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {problem.tags.map(tag => (
                        <span key={tag.id} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          {tag.name}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                      <p className="whitespace-pre-line">{problem.description}</p>
                    </div>

                    {/* Examples */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-brand-700" /> Examples
                      </h3>
                      {problem.examples.map((ex, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 mb-2">Example {i + 1}</p>
                          <div className="space-y-1 font-mono text-xs">
                            <div className="flex gap-2">
                              <span className="text-gray-400 w-16">Input:</span>
                              <span className="text-gray-800">{ex.input}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-gray-400 w-16">Output:</span>
                              <span className="text-brand-700 font-bold">{ex.output}</span>
                            </div>
                            {ex.explanation && (
                              <div className="flex gap-2">
                                <span className="text-gray-400 w-16">Explain:</span>
                                <span className="text-gray-600 font-sans">{ex.explanation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Constraints */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2">Constraints</h3>
                      <ul className="space-y-1.5">
                        {problem.constraints.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="text-brand-600 mt-0.5">•</span>
                            <code className="font-mono">{c}</code>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-400">Acceptance</p>
                        <p className="text-sm font-bold text-gray-700">{problem.acceptanceRate}%</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-400">Submissions</p>
                        <p className="text-sm font-bold text-gray-700">{(problem.totalSubmissions / 1e6).toFixed(1)}M</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">Hints to guide you without spoiling the solution.</p>
                    {problem.hints.map((hint, i) => (
                      <details key={i} className="group bg-yellow-50 border border-yellow-100 rounded-xl overflow-hidden">
                        <summary className="px-4 py-3 text-sm font-semibold text-yellow-800 cursor-pointer flex items-center gap-2 select-none">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          Hint {i + 1}
                          <span className="ml-auto text-yellow-400 text-xs group-open:hidden">Click to reveal</span>
                        </summary>
                        <div className="px-4 pb-3 text-sm text-yellow-700 leading-relaxed">
                          {hint}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-gray-100 hover:bg-brand-200 transition-colors cursor-col-resize" />

          {/* RIGHT: Editor + Terminal */}
          <Panel defaultSize={62} minSize={40}>
            <PanelGroup direction="vertical" className="h-full">
              {/* Editor panel */}
              <Panel defaultSize={65} minSize={40}>
                <div className="h-full flex flex-col bg-[#1e1e1e]">
                  {/* Editor toolbar */}
                  <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#3e3e42] flex-shrink-0">
                    <LanguageSelector value={language} onChange={handleLanguageChange} />
                    <div className="flex items-center gap-2">
                      <button
                        id="run-code-btn"
                        onClick={handleRun}
                        disabled={isRunning || isSubmitting}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0d9488] hover:bg-[#0f766e] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" fill="currentColor" />
                        {isRunning ? 'Running…' : 'Run'}
                      </button>
                      <button
                        id="submit-code-btn"
                        onClick={handleSubmit}
                        disabled={isRunning || isSubmitting}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#046c4e] hover:bg-[#035c41] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isSubmitting ? 'Submitting…' : 'Submit'}
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <CodeEditor value={code} onChange={setCode} language={language} />
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-1.5 bg-[#252526] hover:bg-[#0d9488] transition-colors cursor-row-resize" />

              {/* Output terminal */}
              <Panel defaultSize={35} minSize={20}>
                <div className="h-full p-2 bg-[#1e1e1e]">
                  <OutputTerminal result={result} isLoading={isRunning || isSubmitting} />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
