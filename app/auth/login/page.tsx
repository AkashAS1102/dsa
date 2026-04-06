'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Github, Chrome, ArrowRight, Code2, GitGraph, Trophy } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDemoLogin = async () => {
    setIsLoading('demo');
    await new Promise(r => setTimeout(r, 800));
    router.push('/dashboard');
  };

  const features = [
    { icon: Code2,    label: 'Code in C, C++, Java, Python', color: 'text-brand-600' },
    { icon: GitGraph, label: 'Visualize algorithms step-by-step', color: 'text-violet-600' },
    { icon: Trophy,   label: 'Compete on the leaderboard', color: 'text-yellow-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-900/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-900/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Branding */}
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
            A production-ready LeetCode clone built for college students — practice real-world coding challenges with instant execution and visual learning.
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

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <img
                  key={i}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                  alt=""
                  className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800"
                />
              ))}
            </div>
            <p className="text-slate-400 text-sm">
              <span className="text-white font-semibold">2,400+</span> students solving problems
            </p>
          </div>
        </div>

        {/* Right: Login card */}
        <div className="bg-white rounded-3xl p-7 shadow-2xl">
          {/* Logo (mobile) */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-teal flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="text-lg font-extrabold text-gray-900">CodeForge</span>
          </div>

          <h2 className="text-xl font-extrabold text-gray-900 mb-1">Welcome back 👋</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to continue your coding journey</p>

          {/* OAuth buttons */}
          <div className="space-y-3 mb-5">
            <button
              id="login-google"
              disabled={!!isLoading}
              onClick={() => setIsLoading('google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              id="login-github"
              disabled={!!isLoading}
              onClick={() => setIsLoading('github')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400 font-medium">or</span>
            </div>
          </div>

          {/* Demo mode */}
          <button
            id="demo-login-btn"
            onClick={handleDemoLogin}
            disabled={!!isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 gradient-teal text-white rounded-2xl text-sm font-bold shadow-glow-teal hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading === 'demo' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Loading demo…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" fill="currentColor" />
                Try Demo Mode (No Login)
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">
            Demo mode lets you explore all features with mock data — perfect for hackathon demos!
          </p>

          <p className="text-center text-[11px] text-gray-400 mt-6">
            By continuing, you agree to our{' '}
            <span className="text-brand-600 cursor-pointer hover:underline">Terms of Service</span>
            {' '}and{' '}
            <span className="text-brand-600 cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
