'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Code2,
  GitGraph,
  Trophy,
  User,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'  },
  { href: '/problems',    icon: Code2,            label: 'Problems'   },
  { href: '/visualizer',  icon: GitGraph,         label: 'Visualizer' },
  { href: '/leaderboard', icon: Trophy,           label: 'Leaderboard'},
  { href: '/profile',     icon: User,             label: 'Profile'    },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] bg-white border-r border-gray-100 flex flex-col items-center py-5 z-50 shadow-sm">
      {/* Logo */}
      <Link href="/dashboard" className="mb-8 group" id="sidebar-logo">
        <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center shadow-glow-teal group-hover:scale-105 transition-transform duration-200">
          <Zap className="w-5 h-5 text-white" fill="currentColor" />
        </div>
      </Link>

      {/* Nav Items */}
      <nav className="flex flex-col gap-2 flex-1" id="sidebar-nav">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} id={`nav-${label.toLowerCase()}`}>
              <div
                className={cn(
                  'relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group cursor-pointer',
                  isActive
                    ? 'bg-brand-900 text-white shadow-glow-teal'
                    : 'text-gray-400 hover:bg-brand-50 hover:text-brand-900'
                )}
              >
                <Icon className="w-5 h-5" />
                {/* Tooltip */}
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-lg">
                  {label}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </span>
                {/* Active dot */}
                {isActive && (
                  <ChevronRight className="absolute -right-[17px] w-4 h-4 text-brand-900" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom badge */}
      <div className="mt-auto">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
          <span className="text-brand-900 font-bold text-xs">CF</span>
        </div>
      </div>
    </aside>
  );
}
