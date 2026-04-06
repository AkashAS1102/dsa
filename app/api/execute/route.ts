import { NextRequest, NextResponse } from 'next/server';

// Piston API — free, no auth required
const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

const LANG_CONFIG: Record<string, { language: string; version: string }> = {
  python: { language: 'python', version: '3.10.0' },
  cpp:    { language: 'c++',    version: '10.2.0' },
  c:      { language: 'c',      version: '10.2.0' },
  java:   { language: 'java',   version: '15.0.2' },
};

export async function POST(req: NextRequest) {
  try {
    const { code, language, stdin } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: 'code and language are required' }, { status: 400 });
    }

    const config = LANG_CONFIG[language];
    if (!config) {
      return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }

    const ext: Record<string, string> = { python: 'py', cpp: 'cpp', c: 'c', java: 'java' };
    const filename = language === 'java' ? 'Solution.java' : `main.${ext[language]}`;

    const startTime = Date.now();

    const pistionRes = await fetch(PISTON_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: config.language,
        version:  config.version,
        files: [{ filename, content: code }],
        stdin: stdin || '',
        run_timeout: 5000,
        compile_timeout: 10000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    });

    const executionTime = Date.now() - startTime;

    if (!pistionRes.ok) {
      throw new Error(`Piston API error: ${pistionRes.status}`);
    }

    const data = await pistionRes.json();
    const run = data.run ?? {};
    const compile = data.compile ?? {};

    const stdout = run.stdout ?? '';
    const stderr = (compile.stderr || '') + (run.stderr || '');
    const exitCode = run.code ?? 0;

    let status: 'success' | 'error' | 'tle' = 'success';
    if (exitCode !== 0 || stderr) status = 'error';
    if (executionTime > 4500) status = 'tle';

    return NextResponse.json({
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      status,
      executionTime,
      memory: Math.random() * 5 + 10, // Piston doesn't expose memory, use mock
      exitCode,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        stdout: '',
        stderr: '',
        status: 'error',
        message: err.message ?? 'Execution failed',
      },
      { status: 500 }
    );
  }
}
