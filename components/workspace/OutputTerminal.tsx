'use client';

import { CheckCircle2, XCircle, AlertTriangle, Clock, Cpu, Loader2 } from 'lucide-react';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  status: 'success' | 'error' | 'tle' | 'idle';
  executionTime?: number;
  memory?: number;
  message?: string;
}

interface OutputTerminalProps {
  result: ExecutionResult | null;
  isLoading: boolean;
}

export default function OutputTerminal({ result, isLoading }: OutputTerminalProps) {
  return (
    <div className="h-full flex flex-col bg-[#0d1117] rounded-2xl overflow-hidden border border-gray-800">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-gray-800">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-gray-500 font-mono">output</span>
        </div>
        <div className="flex items-center gap-3">
          {result?.executionTime !== undefined && (
            <span className="flex items-center gap-1 text-xs text-gray-500 font-mono">
              <Clock className="w-3 h-3" /> {result.executionTime}ms
            </span>
          )}
          {result?.memory !== undefined && (
            <span className="flex items-center gap-1 text-xs text-gray-500 font-mono">
              <Cpu className="w-3 h-3" /> {result.memory.toFixed(1)} MB
            </span>
          )}
        </div>
      </div>

      {/* Terminal body */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm scrollbar-thin">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            <p className="text-gray-500 text-xs">Executing code via Piston API…</p>
          </div>
        ) : !result || result.status === 'idle' ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 opacity-40">
            <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-lg">▶</span>
            </div>
            <p className="text-gray-500 text-xs">Run your code to see output</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Status banner */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
              result.status === 'success'
                ? 'bg-green-950 text-green-400 border border-green-800'
                : result.status === 'tle'
                ? 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                : 'bg-red-950 text-red-400 border border-red-800'
            }`}>
              {result.status === 'success'
                ? <CheckCircle2 className="w-4 h-4" />
                : result.status === 'tle'
                ? <AlertTriangle className="w-4 h-4" />
                : <XCircle className="w-4 h-4" />
              }
              {result.status === 'success'
                ? 'Code executed successfully'
                : result.status === 'tle'
                ? 'Time Limit Exceeded'
                : 'Runtime Error'
              }
            </div>

            {/* stdout */}
            {result.stdout && (
              <div>
                <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">stdout</p>
                <pre className="text-green-400 whitespace-pre-wrap break-all leading-relaxed bg-black/30 rounded-lg p-3 text-xs">
                  {result.stdout}
                </pre>
              </div>
            )}

            {/* stderr */}
            {result.stderr && (
              <div>
                <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">stderr</p>
                <pre className="text-red-400 whitespace-pre-wrap break-all leading-relaxed bg-black/30 rounded-lg p-3 text-xs">
                  {result.stderr}
                </pre>
              </div>
            )}

            {/* message */}
            {result.message && !result.stdout && !result.stderr && (
              <pre className="text-gray-400 whitespace-pre-wrap text-xs">{result.message}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
