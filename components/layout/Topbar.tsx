'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Search, Flame, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useDemoAppState } from '@/lib/demo-state';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':   'Dashboard',
  '/problems':    'Problems',
  '/visualizer':  'Visualizer',
  '/leaderboard': 'Leaderboard',
  '/profile':     'Profile',
};

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { summary, signOut } = useDemoAppState();

  const getTitle = () => {
    for (const [key, val] of Object.entries(PAGE_TITLES)) {
      if (pathname.startsWith(key)) return val;
    }
    return 'CodeForge';
  };

  return (
    <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-bold text-gray-900" id="topbar-page-title">{getTitle()}</h1>
        <p className="text-xs text-gray-400 font-medium">CodeForge Platform</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          className={`relative flex items-center transition-all duration-200 ${
            searchFocused ? 'w-72' : 'w-48'
          }`}
        >
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input
            id="topbar-search"
            type="text"
            placeholder="Search problems…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-xl" id="topbar-streak">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-orange-600">{summary.streak}</span>
          <span className="text-xs text-orange-400 font-medium">day streak</span>
        </div>

        {/* Notifications */}
        <button id="topbar-notifications" className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-700 rounded-full border border-white" />
        </button>

        {/* User avatar dropdown */}
        <div className="relative" id="topbar-user-menu">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
          >
            <img
              src={summary.avatar}
              alt={summary.name}
              className="w-8 h-8 rounded-lg bg-brand-100 object-cover"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-none">{summary.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{summary.points.toLocaleString('en-US')} pts</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-card-lg overflow-hidden z-50">
              <div className="p-3 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-800">{summary.name}</p>
                <p className="text-xs text-gray-400">{summary.email}</p>
              </div>
              <div className="p-1.5">
                <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                  <User className="w-4 h-4 text-gray-400" /> Profile
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                  <Settings className="w-4 h-4 text-gray-400" /> Settings
                </button>
                <div className="my-1 border-t border-gray-100" />
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-500 transition-colors"
                  onClick={() => {
                    signOut();
                    setShowDropdown(false);
                    router.push('/auth/login');
                    router.refresh();
                  }}
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
