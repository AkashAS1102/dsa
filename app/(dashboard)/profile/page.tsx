import { 
  User, Mail, Star, Flame, Code2, Trophy, Calendar, Github, ExternalLink
} from 'lucide-react';
import { DEMO_USER, RECENT_SUBMISSIONS, PROBLEMS } from '@/lib/mock-data';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Profile hero card */}
      <div className="bg-white rounded-3xl shadow-card ring-1 ring-gray-100 overflow-hidden">
        {/* Cover */}
        <div className="h-28 gradient-teal relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 right-8 w-24 h-24 rounded-full bg-white" />
            <div className="absolute -bottom-4 left-16 w-16 h-16 rounded-full bg-white" />
          </div>
        </div>
        {/* Info */}
        <div className="px-6 pb-6 -mt-10">
          <img
            src={DEMO_USER.avatar}
            alt={DEMO_USER.name}
            className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-brand-100"
          />
          <div className="mt-3 flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">{DEMO_USER.name}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" /> {DEMO_USER.email}
              </p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Joined {new Date(DEMO_USER.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-colors">
                <Github className="w-4 h-4" /> GitHub
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 gradient-teal text-white rounded-xl text-sm font-semibold shadow-glow-teal hover:opacity-90 transition-all">
                <ExternalLink className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Solved', value: DEMO_USER.totalSolved, icon: Code2, color: 'text-brand-700', bg: 'bg-brand-50' },
          { label: 'Global Rank', value: `#${DEMO_USER.rank}`, icon: Trophy, color: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'Points', value: DEMO_USER.points.toLocaleString('en-US'), icon: Star, color: 'text-violet-700', bg: 'bg-violet-50' },
          { label: 'Streak', value: `${DEMO_USER.streak} days`, icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4`}>
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <p className={`text-xl font-extrabold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Problem breakdown */}
        <div className="bg-white rounded-2xl shadow-card ring-1 ring-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Problem Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Easy',   solved: DEMO_USER.solvedEasy,   total: 5,  color: '#16a34a', bg: 'bg-green-500' },
              { label: 'Medium', solved: DEMO_USER.solvedMedium, total: 4,  color: '#ca8a04', bg: 'bg-yellow-500' },
              { label: 'Hard',   solved: DEMO_USER.solvedHard,   total: 1,  color: '#dc2626', bg: 'bg-red-500' },
            ].map(({ label, solved, total, color, bg }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold" style={{ color }}>{label}</span>
                  <span className="text-gray-500 font-medium">{solved} solved</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${bg} rounded-full transition-all`}
                    style={{ width: `${Math.min(100, (solved / (solved + total)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card ring-1 ring-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Recent Submissions</h2>
          <div className="space-y-2">
            {RECENT_SUBMISSIONS.map(sub => {
              const statusColor = sub.status === 'Accepted'
                ? 'text-green-600 bg-green-50'
                : sub.status === 'Wrong Answer'
                ? 'text-red-500 bg-red-50'
                : 'text-yellow-600 bg-yellow-50';
              return (
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{sub.problemTitle}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono uppercase">{sub.language} · {new Date(sub.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor}`}>
                    {sub.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
