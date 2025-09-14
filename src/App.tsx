import React, { useState, useEffect } from 'react';
import { Poem, Theme } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useStreak } from './hooks/useStreak';
import { getFeedbackForPoem } from './services/feedbackService';
import Header from './components/Header';
import ThemeSelector from './components/ThemeSelector';
import WritingEditor from './components/WritingEditor';
import PoemHistory from './components/PoemHistory';
import ProgressDashboard from './components/ProgressDashboard';

function App() {
  const [currentView, setCurrentView] = useState<'write' | 'history' | 'progress'>('write');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [poems, setPoems] = useLocalStorage<Poem[]>('raven-poems', []);
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

  const handleSavePoem = (poemData: Omit<Poem, 'id' | 'createdAt'>) => {
    const newPoem: Poem = {
      ...poemData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    setPoems(prevPoems => [newPoem, ...prevPoems]);
    updateStreak();
    
    // Reset writing state
    setIsWriting(false);
    setSelectedTheme(null);
  };

  const handleGetFeedback = async (poem: Poem) => {
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
      />

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
    </div>
  );
}

export default App;