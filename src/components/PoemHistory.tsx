import React, { useState } from 'react';
import { Calendar, Search, BookOpen, Sparkles } from 'lucide-react';
import { Poem } from '../types';

interface PoemHistoryProps {
  poems: Poem[];
}

export default function PoemHistory({ poems }: PoemHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);

  const filteredPoems = poems.filter(poem => {
    const matchesSearch = poem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poem.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedTheme === 'all' || poem.theme === selectedTheme;
    return matchesSearch && matchesTheme;
  });

  const themes = Array.from(new Set(poems.map(poem => poem.theme)));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Poetry Archive</h2>
        <p className="text-slate-600">Revisit your creative journey through poetry.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search poems by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          >
            <option value="all">All Themes</option>
            {themes.map(theme => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </div>

        <div className="text-sm text-slate-500 mb-4">
          {filteredPoems.length} poem{filteredPoems.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {filteredPoems.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl text-slate-600 mb-2">No poems found</h3>
          <p className="text-slate-500">
            {poems.length === 0 ? "Start writing your first poem!" : "Try adjusting your search criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoems.map((poem) => (
            <div
              key={poem.id}
              onClick={() => setSelectedPoem(poem)}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {poem.title}
                </h3>
                {poem.feedback && (
                  <div className="flex items-center space-x-1 text-purple-600">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">{poem.feedback.score}/10</span>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-slate-500 mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(poem.createdAt).toLocaleDateString()}
              </div>
              
              <p className="text-slate-600 text-sm line-clamp-3 mb-4 italic">
                {poem.content}
              </p>
              
              <div className="text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block">
                {poem.theme}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Poem Detail Modal */}
      {selectedPoem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{selectedPoem.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-slate-500 mt-2">
                  <span>{selectedPoem.theme}</span>
                  <span>•</span>
                  <span>{new Date(selectedPoem.createdAt).toLocaleDateString()}</span>
                  {selectedPoem.feedback && (
                    <>
                      <span>•</span>
                      <span className="text-purple-600 font-medium">Score: {selectedPoem.feedback.score}/10</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedPoem(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                {selectedPoem.content}
              </div>
            </div>

            {selectedPoem.feedback && (
              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-semibold text-slate-800 mb-4">AI Feedback</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-slate-700 mb-2">Strengths</h5>
                    <ul className="space-y-1 text-sm">
                      {selectedPoem.feedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span className="text-slate-600">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-700 mb-2">Suggestions</h5>
                    <ul className="space-y-1 text-sm">
                      {selectedPoem.feedback.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-0.5">→</span>
                          <span className="text-slate-600">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-slate-700 text-sm">{selectedPoem.feedback.overall}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedPoem(null)}
              className="w-full mt-6 bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}