import React, { useState, useEffect } from 'react';
import { Theme } from './types';
import { useAuth } from './contexts/AuthContext';
import { usePoems } from './hooks/usePoems';
import { useStreak } from './hooks/useStreak';
import { getFeedbackForPoem } from './services/feedbackService';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import DatabaseStatus from './components/DatabaseStatus';
import ResetPasswordPage from './components/ResetPasswordPage';
import ThemeSelector from './components/ThemeSelector';
import WritingEditor from './components/WritingEditor';
import PoemHistory from './components/PoemHistory';
import ProgressDashboard from './components/ProgressDashboard';

function App() {
  // Check if we're on the reset password page
  const urlParams = new URLSearchParams(window.location.search);
  const isResetPasswordPage = window.location.hash === '#reset-password' || 
                              window.location.pathname === '/reset-password' ||
                              urlParams.get('type') === 'recovery' ||
                              window.location.href.includes('verify?token=') && urlParams.get('type') === 'recovery';
  
  if (isResetPasswordPage) {
    return <ResetPasswordPage />;
  }

  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'write' | 'history' | 'progress'>('write');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { poems, addPoem, updatePoem, syncing } = usePoems();
  const { streakData, updateStreak, updateBadges } = useStreak();

  useEffect(() => {
    // Update badges when poems change
    const poemsWithFeedback = poems.filter(poem => poem.feedback);
    updateBadges(poems.length, poemsWithFeedback.length);
  }, [poems]);

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
  };

  const handleStartWriting = () => {
    setIsWriting(true);
  };

  const handleBackToThemes = () => {
    setIsWriting(false);
    setSelectedTheme(null);
  };

  const handleSavePoem = async (poemData: Omit<Poem, 'id' | 'createdAt'>) => {
    const newPoem = await addPoem(poemData);
    updateStreak();
    
    // Reset writing state
    setIsWriting(false);
    setSelectedTheme(null);
  };

  const handleGetFeedback = async (poem: any) => {
    return await getFeedbackForPoem(poem);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view as 'write' | 'history' | 'progress');
    if (view === 'write') {
      setIsWriting(false);
      setSelectedTheme(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-slate-100">
      <Header 
        currentView={currentView}
        onViewChange={handleViewChange}
        streakCount={streakData.current}
        onAuthClick={() => setShowAuthModal(true)}
      />

      <DatabaseStatus />

      {syncing && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="max-w-6xl mx-auto flex items-center justify-center space-x-2 text-blue-700">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Syncing your poems...</span>
          </div>
        </div>
      )}

      {currentView === 'write' && (
        <>
          {isWriting && selectedTheme ? (
            <WritingEditor
              theme={selectedTheme}
              onBack={handleBackToThemes}
              onSavePoem={handleSavePoem}
              onGetFeedback={handleGetFeedback}
            />
          ) : (
            <ThemeSelector
              selectedTheme={selectedTheme}
              onThemeSelect={handleThemeSelect}
              onStartWriting={handleStartWriting}
            />
          )}
        </>
      )}

      {currentView === 'history' && (
        <PoemHistory poems={poems} />
      )}

      {currentView === 'progress' && (
        <ProgressDashboard 
          poems={poems}
          streakData={streakData}
        />
      )}

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => handleViewChange('write')}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg ${
              currentView === 'write' ? 'text-purple-600' : 'text-slate-600'
            }`}
          >
            <span className="text-xs">Write</span>
          </button>
          <button
            onClick={() => handleViewChange('history')}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg ${
              currentView === 'history' ? 'text-purple-600' : 'text-slate-600'
            }`}
          >
            <span className="text-xs">Archive</span>
          </button>
          <button
            onClick={() => handleViewChange('progress')}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg ${
              currentView === 'progress' ? 'text-purple-600' : 'text-slate-600'
            }`}
          >
            <span className="text-xs">Progress</span>
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default App;