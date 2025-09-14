import { useState, useEffect } from 'react';
import { StreakData, Badge } from '../types';
import { useLocalStorage } from './useLocalStorage';

const BADGES: Badge[] = [
  { id: 'first-poem', name: 'First Flight', description: 'Write your first poem', earned: false, icon: '🪶' },
  { id: 'week-streak', name: 'Dedicated Writer', description: '7-day writing streak', earned: false, icon: '📝' },
  { id: 'month-streak', name: 'Poetry Master', description: '30-day writing streak', earned: false, icon: '👑' },
  { id: 'ten-poems', name: 'Prolific Poet', description: 'Write 10 poems', earned: false, icon: '📚' },
  { id: 'feedback-seeker', name: 'Growth Mindset', description: 'Get feedback on 5 poems', earned: false, icon: '🎯' },
];

export function useStreak() {
  const [streakData, setStreakData] = useLocalStorage<StreakData>('raven-streak', {
    current: 0,
    longest: 0,
    lastWriteDate: null,
    badges: BADGES,
  });

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastWrite = streakData.lastWriteDate;
    
    if (!lastWrite) {
      // First poem ever
      const newStreak = {
        current: 1,
        longest: Math.max(1, streakData.longest),
        lastWriteDate: today,
        badges: streakData.badges.map(badge => 
          badge.id === 'first-poem' 
            ? { ...badge, earned: true, earnedDate: new Date() }
            : badge
        ),
      };
      setStreakData(newStreak);
      return newStreak;
    }

    if (lastWrite === today) {
      // Already wrote today
      return streakData;
    }

    const lastWriteDate = new Date(lastWrite);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastWriteDate.getTime()) / (1000 * 60 * 60 * 24));

    let newStreak: StreakData;
    
    if (diffDays === 1) {
      // Consecutive day
      const current = streakData.current + 1;
      newStreak = {
        ...streakData,
        current,
        longest: Math.max(current, streakData.longest),
        lastWriteDate: today,
      };
    } else {
      // Streak broken
      newStreak = {
        ...streakData,
        current: 1,
        lastWriteDate: today,
      };
    }

    // Check for streak badges
    const updatedBadges = newStreak.badges.map(badge => {
      if (badge.id === 'week-streak' && newStreak.current >= 7 && !badge.earned) {
        return { ...badge, earned: true, earnedDate: new Date() };
      }
      if (badge.id === 'month-streak' && newStreak.current >= 30 && !badge.earned) {
        return { ...badge, earned: true, earnedDate: new Date() };
      }
      return badge;
    });

    newStreak.badges = updatedBadges;
    setStreakData(newStreak);
    return newStreak;
  };

  const updateBadges = (poemCount: number, feedbackCount: number) => {
    const updatedBadges = streakData.badges.map(badge => {
      if (badge.id === 'ten-poems' && poemCount >= 10 && !badge.earned) {
        return { ...badge, earned: true, earnedDate: new Date() };
      }
      if (badge.id === 'feedback-seeker' && feedbackCount >= 5 && !badge.earned) {
        return { ...badge, earned: true, earnedDate: new Date() };
      }
      return badge;
    });

    setStreakData(prev => ({ ...prev, badges: updatedBadges }));
  };

  return {
    streakData,
    updateStreak,
    updateBadges,
  };
}