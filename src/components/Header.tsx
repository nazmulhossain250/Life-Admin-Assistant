import React from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  setShowApp: (show: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  showReset: boolean;
  onReset: () => void;
}

export function Header({ setShowApp, darkMode, toggleDarkMode, showReset, onReset }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowApp(false)}>
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight text-stone-900 dark:text-white">Life Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {showReset && (
            <button 
              onClick={onReset}
              className="text-sm font-medium text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
