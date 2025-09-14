import React from 'react';
import { Trophy, Calendar, BookOpen, Target, Award, TrendingUp } from 'lucide-react';
import { Poem, StreakData } from '../types';

interface ProgressDashboardProps {
  poems: Poem[];
  streakData: StreakData;
}

export default function ProgressDashboard({ poems, streakData }: ProgressDashboardProps) {
  const poemsWithFeedback = poems.filter(poem => poem.feedback);
  const averageScore = poemsWithFeedback.length > 0 
    ? poemsWithFeedback.reduce((sum, poem) => sum + (poem.feedback?.score || 0), 0) / poemsWithFeedback.length
    : 0;

  const thisMonth = new Date();
  const poemsThisMonth = poems.filter(poem => {
    const poemDate = new Date(poem.createdAt);
    return poemDate.getMonth() === thisMonth.getMonth() && 
           poemDate.getFullYear() === thisMonth.getFullYear();
  });

  const stats = [
    {
      icon: BookOpen,
      label: 'Total Poems',
      value: poems.length,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Calendar,
      label: 'This Month',
      value: poemsThisMonth.length,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Target,
      label: 'Current Streak',
      value: `${streakData.current} days`,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      icon: Trophy,
      label: 'Best Streak',
      value: `${streakData.longest} days`,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  const earnedBadges = streakData.badges.filter(badge => badge.earned);
  const unearnedBadges = streakData.badges.filter(badge => !badge.earned);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Progress</h2>
        <p className="text-slate-600">Track your poetry journey and celebrate your achievements.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bg} mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
            <div className="text-slate-600 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Writing Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-slate-800">Writing Progress</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Poems Written</span>
              <span className="font-semibold text-slate-800">{poems.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Feedback Received</span>
              <span className="font-semibold text-slate-800">{poemsWithFeedback.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Average Score</span>
              <span className="font-semibold text-slate-800">
                {averageScore > 0 ? `${averageScore.toFixed(1)}/10` : 'N/A'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="text-sm text-slate-500 mb-2">Monthly Goal Progress</div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((poemsThisMonth.length / 10) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {poemsThisMonth.length}/10 poems this month
              </div>
            </div>
          </div>
        </div>

        {/* Streak Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-slate-800">Streak History</h3>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">🔥</div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{streakData.current}</div>
            <div className="text-slate-600 text-sm mb-4">Current streak</div>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-2">Personal Best</div>
              <div className="text-xl font-semibold text-slate-800">{streakData.longest} days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="w-6 h-6 text-yellow-600" />
          <h3 className="text-xl font-semibold text-slate-800">Achievements</h3>
        </div>

        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm font-medium text-slate-600 mb-4">Earned Badges</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className="font-semibold text-slate-800 text-sm mb-1">{badge.name}</div>
                  <div className="text-xs text-slate-600">{badge.description}</div>
                  {badge.earnedDate && (
                    <div className="text-xs text-yellow-600 mt-2">
                      {new Date(badge.earnedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {unearnedBadges.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-4">Available Badges</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {unearnedBadges.map((badge) => (
                <div key={badge.id} className="text-center p-4 bg-slate-50 rounded-lg opacity-60">
                  <div className="text-3xl mb-2 grayscale">{badge.icon}</div>
                  <div className="font-semibold text-slate-600 text-sm mb-1">{badge.name}</div>
                  <div className="text-xs text-slate-500">{badge.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}