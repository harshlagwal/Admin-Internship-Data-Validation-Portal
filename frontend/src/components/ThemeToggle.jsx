import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center gap-2 p-1 rounded-full bg-slate-200/50 dark:bg-slate-800/80 border border-main transition-all duration-300 hover:ring-4 hover:ring-primary/10 group overflow-hidden"
      aria-label="Toggle Theme"
      id="theme-toggle"
    >
      {/* Background slide effect - perfectly sized to cover icons */}
      <div 
        className={`absolute inset-y-1 w-8 rounded-full bg-white dark:bg-slate-600 shadow-lg shadow-black/5 transition-transform duration-300 ease-in-out ${
          theme === 'dark' ? 'translate-x-[40px]' : 'translate-x-0'
        }`} 
      />
      
      <div className="relative z-10 flex items-center justify-center w-8 h-8 text-amber-500 transition-colors duration-300">
        <Sun className={`w-4 h-4 transition-transform duration-500 ${theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0 opacity-0'}`} />
      </div>
      
      <div className="relative z-10 flex items-center justify-center w-8 h-8 text-blue-500 transition-colors duration-300">
        <Moon className={`w-4 h-4 transition-transform duration-500 ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0 opacity-0'}`} />
      </div>

      <span className="sr-only">
        Switch to {theme === 'dark' ? 'light' : 'dark'} mode
      </span>
    </button>
  );
}
