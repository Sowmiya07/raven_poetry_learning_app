import { Theme } from '../types';

export const THEMES: Theme[] = [
  {
    id: 'love',
    name: 'Love & Romance',
    description: 'Explore the depths of human connection and affection',
    prompt: 'Write about a moment when love surprised you...',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'nature',
    name: 'Nature & Seasons',
    description: 'Find inspiration in the natural world around us',
    prompt: 'Describe how a season makes you feel...',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'loss',
    name: 'Loss & Memory',
    description: 'Process grief and cherish memories through verse',
    prompt: 'Write about something you miss...',
    color: 'from-slate-500 to-gray-600',
  },
  {
    id: 'dreams',
    name: 'Dreams & Aspirations',
    description: 'Capture your hopes and visions for the future',
    prompt: 'What do you dream of becoming...',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'childhood',
    name: 'Childhood & Nostalgia',
    description: 'Revisit the innocence and wonder of youth',
    prompt: 'Remember a childhood moment that shaped you...',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'freedom',
    name: 'Freedom & Adventure',
    description: 'Celebrate independence and the spirit of exploration',
    prompt: 'Write about a time you felt truly free...',
    color: 'from-blue-500 to-cyan-600',
  },
];