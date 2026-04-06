'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, Code2, GitGraph, Trophy, Mail, Lock, Loader2 } from 'lucide-react';

const COOKIE_NAME = 'codeforge-session';

function createSession(email: string) {
  const name = email.split('@')[0] || 'Demo User';
  const session = { email, name };
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  return session;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const hasSession = document.cookie.includes(`${COOKIE_NAME}=`);
    if (hasSession) {
      router.replace('/dashboard');
    }
  }, [router]);

  const goInside = async (userEmail: string) => {
    createSession(userEmail);
    router.push('/dashboard');
    router.refresh();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading('auth');
    await new Promise((r) => setTimeout(r, 400));
    await goInside(email || 'demo@codeforge.dev');
  };

  const handleDemoLogin = async () => {
    setIsLoading('demo');
    await new Promise((r) => setTimeout(r, 400));
    await goInside('demo@codeforge.dev');
  };

  const features = [
    { icon: Code2, label: 'Code in C, C++, Java, Python', color: 'text-brand-600' },
    { icon: GitGraph, label: 'Visualize algorithms step-by-step', color: 'text-violet-600' },
    { icon: Trophy, label: 'Compete on the leaderboard', color: 'text-yellow-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-900/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-900/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="text-white hidden lg:block">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl gradient-teal flex items-center justify-center shadow-glow-teal">
              <Zap className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">CodeForge</h1>
              <p className="text-slate-400 text-sm">College Coding Platform</p>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Master DSA.
            <br />
            <span className="text-gradient-teal">Crush Placements.</span>
          </h2>

          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Practice coding challenges with instant execution and visual learning.
          </p>

          <div className="space-y-3">
            {features.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className="text-slate-300 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-7 shadow-2xl">
          <h2 className="text-xl font-extrabold text-gray-900 mb-1">Login</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter any email and password to continue.
          </p>

          <form onSubmit={handleAuth} className="space-y-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl outline-none text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl outline-none text-sm"
                  placeholder="Enter any password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!!isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {isLoading === 'auth' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={!!isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 gradient-teal text-white rounded-xl text-sm font-bold disabled:opacity-60"
          >
            {isLoading === 'demo' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Zap className="w-4 h-4" fill="currentColor" />
                Enter Demo
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
