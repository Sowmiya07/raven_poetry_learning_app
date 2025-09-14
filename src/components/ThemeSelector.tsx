import React from 'react';
import { Theme } from '../types';
import { THEMES } from '../data/themes';

interface ThemeSelectorProps {
  selectedTheme: Theme | null;
  onThemeSelect: (theme: Theme) => void;
  onStartWriting: () => void;
}

export default function ThemeSelector({ selectedTheme, onThemeSelect, onStartWriting }: ThemeSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Choose Your Inspiration</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Select a theme that resonates with your current mood and let your creativity flow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {THEMES.map((theme) => (
          <div
            key={theme.id}
            onClick={() => onThemeSelect(theme)}
            className={`relative group cursor-pointer rounded-xl p-6 transition-all duration-200 ${
              selectedTheme?.id === theme.id
                ? 'ring-2 ring-slate-400 shadow-lg transform scale-105'
                : 'hover:shadow-md hover:transform hover:scale-102'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-10 rounded-xl`}></div>
            <div className="relative">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">{theme.name}</h3>
              <p className="text-slate-600 text-sm mb-4">{theme.description}</p>
              <div className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg">
                "{theme.prompt}"
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTheme && (
        <div className="text-center animate-fade-in">
          <button
            onClick={onStartWriting}
            className="bg-slate-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Writing About {selectedTheme.name}
          </button>
        </div>
      )}
    </div>
  );
}