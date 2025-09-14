import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Save, Sparkles } from 'lucide-react';
import { Theme, Poem, PoemFeedback } from '../types';

interface WritingEditorProps {
  theme: Theme;
  onBack: () => void;
  onSavePoem: (poem: Omit<Poem, 'id' | 'createdAt'>) => void;
  onGetFeedback: (poem: Poem) => Promise<PoemFeedback>;
}

export default function WritingEditor({ theme, onBack, onSavePoem, onGetFeedback }: WritingEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [feedback, setFeedback] = useState<PoemFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    const poem: Omit<Poem, 'id' | 'createdAt'> = {
      title: title.trim(),
      content: content.trim(),
      theme: theme.name,
      feedback,
    };

    onSavePoem(poem);
    onBack();
  };

  const handleGetFeedback = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsGettingFeedback(true);
    
    const tempPoem: Poem = {
      id: 'temp',
      title: title.trim(),
      content: content.trim(),
      theme: theme.name,
      createdAt: new Date(),
    };

    try {
      const poemFeedback = await onGetFeedback(tempPoem);
      setFeedback(poemFeedback);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error getting feedback:', error);
    } finally {
      setIsGettingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to themes</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[70vh]">
          <div className="mb-8">
            <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${theme.color} text-white rounded-full text-sm font-medium mb-4`}>
              {theme.name}
            </div>
            <p className="text-slate-600 italic mb-6">"{theme.prompt}"</p>
          </div>

          <div className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Give your poem a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold text-slate-800 bg-transparent border-0 border-b-2 border-slate-200 focus:border-slate-400 outline-none pb-2 placeholder-slate-400"
              />
            </div>

            <div className="relative">
              <textarea
                ref={textareaRef}
                placeholder="Let your words flow..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 text-lg text-slate-700 bg-transparent resize-none border-0 outline-none placeholder-slate-400 leading-relaxed"
                style={{ fontFamily: 'Georgia, serif' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              {content.split(/\s+/).filter(word => word.length > 0).length} words
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGetFeedback}
                disabled={!title.trim() || !content.trim() || isGettingFeedback}
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGettingFeedback ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isGettingFeedback ? 'Analyzing...' : 'Get Feedback'}</span>
              </button>
              
              <button
                onClick={handleSave}
                disabled={!title.trim() || !content.trim()}
                className="flex items-center space-x-2 px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Poem</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && feedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Feedback</h3>
              <button
                onClick={() => setShowFeedback(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="text-3xl font-bold text-purple-600">{feedback.score}/10</div>
                <div className="text-slate-600">Overall Score</div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Strengths</h4>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-slate-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Suggestions for Improvement</h4>
                <ul className="space-y-2">
                  {feedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">→</span>
                      <span className="text-slate-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">Overall Assessment</h4>
                <p className="text-slate-700">{feedback.overall}</p>
              </div>

              <button
                onClick={() => setShowFeedback(false)}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Continue Writing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}