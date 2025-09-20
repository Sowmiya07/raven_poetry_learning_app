import React from 'react';
import { BookOpen, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import UserMenu from './UserMenu';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  streakCount: number;
  onAuthClick: () => void;
}

export default function Header({ currentView, onViewChange, streakCount, onAuthClick }: HeaderProps) {
  const { user, loading } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Logo className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-slate-800">Raven</h1>
                <p className="text-xs text-slate-500">Poetry & Writing</p>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onViewChange('write')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                currentView === 'write'
                  ? 'bg-slate-100 text-slate-800'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>Write</span>
            </button>
            <button
              onClick={() => onViewChange('history')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                currentView === 'history'
                  ? 'bg-slate-100 text-slate-800'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Archive</span>
            </button>
            <button
              onClick={() => onViewChange('progress')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                currentView === 'progress'
                  ? 'bg-slate-100 text-slate-800'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Progress</span>
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-amber-50 rounded-full">
              <span className="text-amber-600 text-sm">🔥</span>
              <span className="text-amber-800 font-medium text-sm">{streakCount} day streak</span>
            </div>
            
            {!loading && (
              user ? (
                <UserMenu />
              ) : (
                <button
                  onClick={onAuthClick}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:block">Sign In</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}