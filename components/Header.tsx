import React from 'react';
import type { Page } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  setPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ setPage }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setPage('landing');
  };

  return (
    <header className="sticky top-4 z-50 container mx-auto">
       <div className="bg-white/25 dark:bg-gray-800/25 backdrop-blur-md shadow-lg border border-white/20 dark:border-white/10 rounded-2xl px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setPage('landing')}
        >
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <h1 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">CommunityNet</h1>
        </div>
        <nav className="flex items-center space-x-4">
          <button onClick={() => setPage('directory')} className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-white font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:drop-shadow-[0_2px_4px_rgba(79,70,229,0.4)] dark:hover:drop-shadow-[0_2px_4px_rgba(79,70,229,0.6)]">Directory</button>
          <button onClick={() => setPage('dashboard')} className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-white font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:drop-shadow-[0_2px_4px_rgba(79,70,229,0.4)] dark:hover:drop-shadow-[0_2px_4px_rgba(79,70,229,0.6)]">Dashboard</button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            )}
          </button>
          {currentUser ? (
            <div className="flex items-center space-x-4">
               <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Welcome, {currentUser.name.split(' ')[0]}!</span>
              <button onClick={handleLogout} className="bg-white/50 dark:bg-gray-700/50 text-text-secondary dark:text-text-secondary-dark font-semibold py-2 px-4 rounded-lg border border-gray-300/50 dark:border-white/10 shadow-sm hover:bg-white/80 dark:hover:bg-gray-600/50 transition-all transform hover:-translate-y-0.5 hover:shadow-lg">
                Logout
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => setPage('auth')} className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-white font-medium transition-all duration-300">Login</button>
              <button onClick={() => setPage('auth')} className="bg-gradient-to-r from-primary to-accent text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-xl hover:shadow-primary/40 dark:hover:shadow-accent/40 transform hover:-translate-y-1 transition-all duration-300">
                Join Now
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;