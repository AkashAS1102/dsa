import Link from 'next/link';
import { Trophy, Flame, Code2, Star, Medal, ArrowLeft } from 'lucide-react';
import { LEADERBOARD, DEMO_USER } from '@/lib/mock-data';

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-xl">🥇</span>;
  if (rank === 2) return <span className="text-xl">🥈</span>;
  if (rank === 3) return <span className="text-xl">🥉</span>;
  return <span className="text-sm font-bold text-gray-400">#{rank}</span>;
}

export default function LeaderboardPage() {
  const top3 = LEADERBOARD.slice(0, 3);
  const rest = LEADERBOARD.slice(3);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">College-wide rankings by total points</p>
        </div>
        <div className="text-sm text-brand-700 font-semibold bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-xl">
          Your rank: #{DEMO_USER.rank}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3">
        {[top3[1], top3[0], top3[2]].map((user, i) => {
          const podiumRanks = [2, 1, 3];
          const rank = podiumRanks[i];
          const heights = ['h-28', 'h-36', 'h-24'];
          const bgColors = [
            'bg-gradient-to-b from-gray-100 to-gray-50 border-gray-200',
            'bg-gradient-to-b from-yellow-50 to-amber-50 border-yellow-200',
            'bg-gradient-to-b from-orange-50 to-amber-50/50 border-orange-100',
          ];
          return (
            <div key={user.id} className={`${heights[i]} ${bgColors[i]} border rounded-2xl flex flex-col items-center justify-end pb-4 p-3 shadow-card`}>
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-gray-200 mb-2 border-2 border-white shadow-sm" />
              <MedalIcon rank={rank} />
              <p className="text-xs font-bold text-gray-800 mt-1 text-center leading-tight">{user.name.split(' ')[0]}</p>
              <p className="text-xs font-semibold text-brand-700">{user.points.toLocaleString('en-US')} pts</p>
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="bg-white rounded-2xl shadow-card ring-1 ring-gray-100 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="col-span-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Rank</div>
          <div className="col-span-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">User</div>
          <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">Solved</div>
          <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">Streak</div>
          <div className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Points</div>
        </div>

        {LEADERBOARD.map((user) => {
          const isMe = user.id === DEMO_USER.id;
          return (
            <div
              key={user.id}
              id={`leaderboard-row-${user.rank}`}
              className={`grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-gray-50 items-center transition-colors ${
                isMe
                  ? 'bg-brand-50/60 border-l-2 border-l-brand-700'
                  : 'hover:bg-gray-50/50'
              }`}
            >
              {/* Rank */}
              <div className="col-span-1 flex items-center justify-center">
                <MedalIcon rank={user.rank} />
              </div>

              {/* User */}
              <div className="col-span-4 flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg bg-gray-100 object-cover flex-shrink-0"
                />
                <div>
                  <p className={`text-sm font-semibold leading-none ${isMe ? 'text-brand-800' : 'text-gray-800'}`}>
                    {user.name} {isMe && <span className="text-xs text-brand-600 font-bold">(you)</span>}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* Solved problems */}
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm font-bold text-gray-700">{user.totalSolved}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <span className="text-[10px] text-green-600 font-medium">{user.solvedEasy}E</span>
                  <span className="text-[10px] text-yellow-600 font-medium">{user.solvedMedium}M</span>
                  <span className="text-[10px] text-red-500 font-medium">{user.solvedHard}H</span>
                </div>
              </div>

              {/* Streak */}
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Flame className={`w-4 h-4 ${user.streak >= 20 ? 'text-orange-500' : 'text-gray-400'}`} />
                  <span className="text-sm font-bold text-gray-700">{user.streak}</span>
                </div>
              </div>

              {/* Points */}
              <div className="col-span-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                  <span className={`text-sm font-extrabold ${isMe ? 'text-brand-700' : 'text-gray-800'}`}>
                    {user.points.toLocaleString('en-US')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
