import Link from 'next/link';
import { 
  Flame, Trophy, Star, Code2, GitGraph, Zap, 
  CheckCircle2, XCircle, Clock, ArrowRight, TrendingUp
} from 'lucide-react';
import SolvedProgressChart from '@/components/dashboard/SolvedProgressChart';
import TopicsChart from '@/components/dashboard/TopicsChart';
import { DEMO_USER, PROBLEMS, RECENT_SUBMISSIONS } from '@/lib/mock-data';

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: any; color: string; sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-card ring-1 ring-gray-100 p-5 hover-lift">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    Easy:   'bg-green-50 text-green-700 ring-1 ring-green-200',
    Medium: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
    Hard:   'bg-red-50 text-red-600 ring-1 ring-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[difficulty] || ''}`}>
      {difficulty}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Accepted') return (
    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
      <CheckCircle2 className="w-4 h-4" /> Accepted
    </span>
  );
  if (status === 'Wrong Answer') return (
    <span className="flex items-center gap-1 text-red-500 text-sm font-medium">
      <XCircle className="w-4 h-4" /> Wrong Answer
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
      <Clock className="w-4 h-4" /> {status}
    </span>
  );
}

export default function DashboardPage() {
  const totalProblems = PROBLEMS.length;
  const easyProblems = PROBLEMS.filter(p => p.difficulty === 'Easy').length;
  const mediumProblems = PROBLEMS.filter(p => p.difficulty === 'Medium').length;
  const hardProblems = PROBLEMS.filter(p => p.difficulty === 'Hard').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl gradient-teal p-6 text-white shadow-card-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-20 w-40 h-40 rounded-full bg-white translate-y-1/2" />
        </div>
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-teal-100">Welcome back 👋</p>
            <h2 className="text-2xl font-extrabold mt-0.5">{DEMO_USER.name}</h2>
            <p className="text-sm text-teal-200 mt-1">
              You're ranked <span className="text-white font-bold">#{DEMO_USER.rank}</span> on the leaderboard.
              Keep it up!
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-1.5">
                <Flame className="w-4 h-4 text-orange-300" />
                <span className="text-sm font-bold">{DEMO_USER.streak} day streak</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-1.5">
                <Star className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-bold">{DEMO_USER.points.toLocaleString('en-US')} pts</span>
              </div>
            </div>
          </div>
          <img
            src={DEMO_USER.avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-2xl bg-teal-700 object-cover hidden sm:block border-2 border-white/20"
          />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Problems Solved"  value={DEMO_USER.totalSolved}       icon={CheckCircle2} color="bg-brand-900"   sub={`of ${totalProblems} total`} />
        <StatCard label="Current Rank"     value={`#${DEMO_USER.rank}`}        icon={Trophy}       color="bg-yellow-500"  sub="Leaderboard position" />
        <StatCard label="Total Points"     value={DEMO_USER.points.toLocaleString('en-US')} icon={Zap}    color="bg-violet-500"  sub="Earned from submissions" />
        <StatCard label="Day Streak"       value={DEMO_USER.streak}            icon={Flame}        color="bg-orange-500"  sub="Keep it going!" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <SolvedProgressChart />
        </div>
        <div className="lg:col-span-3">
          <TopicsChart />
        </div>
      </div>

      {/* Bottom section: Recent submissions + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card ring-1 ring-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Submissions</h2>
              <p className="text-xs text-gray-400">Your latest coding activity</p>
            </div>
            <Link href="/problems" className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {RECENT_SUBMISSIONS.slice(0, 5).map((sub) => {
              const problem = PROBLEMS.find(p => p.id === sub.problemId);
              return (
                <Link
                  key={sub.id}
                  href={`/problems/${sub.problemId}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Code2 className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 transition-colors">
                        {sub.problemTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {problem && <DifficultyBadge difficulty={problem.difficulty} />}
                        <span className="text-xs text-gray-400 font-mono uppercase">{sub.language}</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={sub.status} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl shadow-card ring-1 ring-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/problems"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-50 hover:bg-brand-100 transition-colors group"
                id="quick-start-coding"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-brand-800">Start Coding</span>
                </div>
                <ArrowRight className="w-4 h-4 text-brand-600 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/visualizer"
                className="flex items-center justify-between p-3 rounded-xl bg-violet-50 hover:bg-violet-100 transition-colors group"
                id="quick-visualizer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
                    <GitGraph className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-violet-800">Visualize DSA</span>
                </div>
                <ArrowRight className="w-4 h-4 text-violet-500 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/leaderboard"
                className="flex items-center justify-between p-3 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors group"
                id="quick-leaderboard"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-yellow-800">Leaderboard</span>
                </div>
                <ArrowRight className="w-4 h-4 text-yellow-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Problem distribution */}
          <div className="bg-white rounded-2xl shadow-card ring-1 ring-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-brand-700" />
              <h3 className="text-sm font-bold text-gray-900">Problem Pool</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Easy',   count: easyProblems,   color: 'bg-green-500', solved: DEMO_USER.solvedEasy },
                { label: 'Medium', count: mediumProblems, color: 'bg-yellow-500', solved: DEMO_USER.solvedMedium },
                { label: 'Hard',   count: hardProblems,   color: 'bg-red-500', solved: DEMO_USER.solvedHard },
              ].map(({ label, count, color, solved }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${color} flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-medium">{label}</span>
                      <span className="text-gray-400">{solved}/{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all`}
                        style={{ width: `${(solved / count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
