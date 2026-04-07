'use client';

import { useEffect, useMemo, useState } from 'react';
import { notFound } from 'next/navigation';
import {
  Play, Send, ChevronRight, Lightbulb, BookOpen,
  Layers, CheckCircle2, Clock, AlertCircle, Eye, Star,
} from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { getProblemById, type Language } from '@/lib/mock-data';
import { getPointsForDifficulty, useDemoAppState } from '@/lib/demo-state';
import CodeEditor from '@/components/workspace/CodeEditor';
import OutputTerminal, { type ExecutionResult } from '@/components/workspace/OutputTerminal';
import LanguageSelector from '@/components/workspace/LanguageSelector';

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    Easy: 'bg-green-100 text-green-700 ring-1 ring-green-300',
    Medium: 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-300',
    Hard: 'bg-red-100 text-red-600 ring-1 ring-red-300',
  };

  return (
    <span className={`inline-flex px-3 py-0.5 rounded-full text-xs font-bold ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
}

function getPracticeTemplate(language: Language, starterCode: Record<Language, string>) {
  const source = starterCode[language] || '';
  const lines = source.split('\n');

  if (language === 'python') {
    return lines.slice(0, 2).join('\n');
  }

  if (language === 'java') {
    return lines.slice(0, 4).join('\n');
  }

  return lines.slice(0, 4).join('\n');
}

function isVerifiedAnswerCode(code: string) {
  const placeholderPatterns = [
    'Write your solution here',
    'add params',
    'Your code here',
    'UnsupportedOperationException',
    'Implement:',
    'throw new UnsupportedOperationException',
  ];

  return !placeholderPatterns.some((pattern) => code.includes(pattern));
}

function getEditorValue(language: Language, answerViewed: boolean, starterCode: Record<Language, string>) {
  return answerViewed ? starterCode[language] : getPracticeTemplate(language, starterCode);
}

function normalizeOutput(value: string | undefined) {
  return (value || '').replace(/\s+/g, ' ').trim();
}

export default function ProblemWorkspacePage({ params }: { params: { id: string } }) {
  const problem = getProblemById(params.id);
  if (!problem) notFound();

  const { getProblemProgress, incrementAttempts, revealAnswer, markSolved } = useDemoAppState();
  const progress = getProblemProgress(problem.id);

  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(getEditorValue('python', progress.answerViewed, problem.starterCode));
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'hints'>('description');
  const [submitResult, setSubmitResult] = useState<'accepted' | 'wrong' | null>(null);
  const [submissionNote, setSubmissionNote] = useState<string | null>(null);

  const answerUnlocked = true;
  const problemPoints = useMemo(() => getPointsForDifficulty(problem.difficulty), [problem.difficulty]);
  const hasVerifiedAnswer = useMemo(
    () => isVerifiedAnswerCode(problem.starterCode[language]),
    [language, problem.starterCode]
  );

  useEffect(() => {
    setCode((currentCode) => {
      const solution = problem.starterCode[language];
      const practiceTemplate = getPracticeTemplate(language, problem.starterCode);

      if (progress.answerViewed) {
        return solution;
      }

      return currentCode === solution ? practiceTemplate : currentCode;
    });
  }, [progress.answerViewed, language, problem.starterCode]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(getEditorValue(lang, progress.answerViewed, problem.starterCode));
    setResult(null);
    setSubmitResult(null);
  };

  const executeCode = async () => {
    const res = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language, stdin: problem.testCases[0]?.input || '' }),
    });

    return res.json();
  };

  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);
    setSubmitResult(null);
    try {
      const data = await executeCode();
      setResult(data);
    } catch {
      setResult({ status: 'error', stdout: '', stderr: 'Network error - could not reach execution engine.', message: '' });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);
    setSubmissionNote(null);

    const updatedProgress = incrementAttempts(problem.id);

    try {
      const data = await executeCode();
      setResult(data);

      const expectedOutput = normalizeOutput(problem.testCases[0]?.expectedOutput);
      const actualOutput = normalizeOutput(data.stdout);
      const isAccepted = updatedProgress.answerViewed || (
        data.status === 'success' &&
        actualOutput.length > 0 &&
        actualOutput === expectedOutput
      );

      setSubmitResult(isAccepted ? 'accepted' : 'wrong');

      if (isAccepted) {
        const solveResult = markSolved(problem.id, problem.difficulty);
        if (solveResult.earnedPoints) {
          setSubmissionNote(`Accepted. You earned ${solveResult.awardedPoints} points.`);
        } else if (updatedProgress.answerViewed) {
          setSubmissionNote('Accepted. No points awarded because Show Answer was used.');
        } else {
          setSubmissionNote('Accepted. Points were already awarded for this problem.');
        }
      } else {
        setSubmissionNote('Wrong answer. Your code must run successfully and match the expected output.');
      }
    } catch {
      setResult({ status: 'error', stdout: '', stderr: 'Network error - could not reach execution engine.', message: '' });
      setSubmitResult('wrong');
      setSubmissionNote('Submission failed because the execution service could not be reached.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] -m-6 lg:-m-8 flex flex-col">
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-700">
            <Clock className="w-3.5 h-3.5" /> {progress.attempts} attempts
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          <Panel defaultSize={38} minSize={28}>
            <div className="h-full bg-white overflow-hidden flex flex-col border-r border-gray-100">
              <div className="flex border-b border-gray-100 px-4 flex-shrink-0">
                {(['description', 'hints'] as const).map((tab) => (
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
                    <div className="flex flex-wrap gap-1.5">
                      {problem.tags.map((tag) => (
                        <span key={tag.id} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          {tag.name}
                        </span>
                      ))}
                    </div>

                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                      <p className="whitespace-pre-line">{problem.description}</p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-brand-700" /> Examples
                      </h3>
                      {problem.examples.map((example, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 mb-2">Example {index + 1}</p>
                          <div className="space-y-1 font-mono text-xs">
                            <div className="flex gap-2">
                              <span className="text-gray-400 w-16">Input:</span>
                              <span className="text-gray-800">{example.input}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-gray-400 w-16">Output:</span>
                              <span className="text-brand-700 font-bold">{example.output}</span>
                            </div>
                            {example.explanation && (
                              <div className="flex gap-2">
                                <span className="text-gray-400 w-16">Explain:</span>
                                <span className="text-gray-600 font-sans">{example.explanation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2">Constraints</h3>
                      <ul className="space-y-1.5">
                        {problem.constraints.map((constraint, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="text-brand-600 mt-0.5">-</span>
                            <code className="font-mono">{constraint}</code>
                          </li>
                        ))}
                      </ul>
                    </div>

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

                    <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-brand-900">
                        <Eye className="w-4 h-4" />
                        Show Answer
                      </div>
                      <p className="text-sm text-brand-800">
                        The editor stays in practice mode with the opening template only. Click Show Answer any time to reveal the full solution code for the current language.
                      </p>
                      {!hasVerifiedAnswer && (
                        <p className="text-sm text-amber-700">
                          This problem does not have a verified answer in the current dataset yet, so Show Answer will stay in practice mode for this language.
                        </p>
                      )}
                      <p className="text-sm text-brand-800">
                        If you use Show Answer, accepted submissions for this problem will give 0 points.
                      </p>
                      <div className="flex items-center justify-between text-xs text-brand-700">
                        <span>{progress.attempts} attempts used</span>
                        <span>{problemPoints} points available before reveal</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">Hints to guide you without spoiling the solution.</p>
                    {problem.hints.map((hint, index) => (
                      <details key={index} className="group bg-yellow-50 border border-yellow-100 rounded-xl overflow-hidden">
                        <summary className="px-4 py-3 text-sm font-semibold text-yellow-800 cursor-pointer flex items-center gap-2 select-none">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          Hint {index + 1}
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

          <Panel defaultSize={62} minSize={40}>
            <PanelGroup direction="vertical" className="h-full">
              <Panel defaultSize={65} minSize={40}>
                <div className="h-full flex flex-col bg-[#1e1e1e]">
                  <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#3e3e42] flex-shrink-0">
                    <LanguageSelector value={language} onChange={handleLanguageChange} />
                    <div className="flex items-center gap-2">
                      <button
                        id="show-answer-btn"
                        onClick={() => {
                          if (!answerUnlocked) return;
                          if (!hasVerifiedAnswer) {
                            setSubmissionNote('A verified answer is not available for this problem in the current dataset yet.');
                            return;
                          }
                          revealAnswer(problem.id);
                          setCode(problem.starterCode[language]);
                          setResult(null);
                          setSubmitResult(null);
                          setSubmissionNote('Show Answer used. Full solution code has been revealed, and this problem will no longer award points.');
                        }}
                        disabled={isRunning || isSubmitting}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#374151] hover:bg-[#4b5563] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Show Answer
                      </button>
                      <button
                        id="run-code-btn"
                        onClick={handleRun}
                        disabled={isRunning || isSubmitting}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0d9488] hover:bg-[#0f766e] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" fill="currentColor" />
                        {isRunning ? 'Running...' : 'Run'}
                      </button>
                      <button
                        id="submit-code-btn"
                        onClick={handleSubmit}
                        disabled={isRunning || isSubmitting}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#046c4e] hover:bg-[#035c41] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                    </div>
                  </div>
                  {submissionNote && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#111827] border-b border-[#1f2937] text-xs text-slate-200">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>{submissionNote}</span>
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <CodeEditor value={code} onChange={setCode} language={language} />
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-1.5 bg-[#252526] hover:bg-[#0d9488] transition-colors cursor-row-resize" />

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
