import React from 'react';
import type { Page } from '../App';
import DirectoryPage from './DirectoryPage';
import type { Listing } from '../types';

interface LandingPageProps {
  setPage: (page: Page) => void;
  listings: Listing[];
}

const LandingPage: React.FC<LandingPageProps> = ({ setPage, listings }) => {
  return (
    <div className="space-y-20">
      <section className="text-center bg-white/25 dark:bg-gray-800/25 backdrop-blur-md p-12 rounded-2xl shadow-xl border border-white/40 dark:border-white/10 opacity-0 animate-fade-in-up transition-transform duration-300 ease-in-out transform hover:scale-[1.02]">
        <h2 className="text-5xl md:text-6xl font-bold font-signature bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 drop-shadow-sm dark:drop-shadow-none">
          Connect. Collaborate. Grow Together.
        </h2>
        <p className="text-lg text-text-secondary dark:text-text-secondary-dark max-w-3xl mx-auto mb-8">
          A simple community platform for businesses and professionals.
        </p>
        <div className="flex flex-col items-center space-y-4">
            <button 
                onClick={() => setPage('dashboard')}
                className="bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-10 rounded-lg shadow-lg hover:shadow-xl hover:shadow-primary/40 dark:hover:shadow-accent/40 transform hover:-translate-y-1 transition-all duration-300"
            >
                Join the Network
            </button>
            <div className="flex items-center space-x-4 pt-4">
                 <button 
                    onClick={() => setPage('auth')}
                    className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 text-text-secondary dark:text-text-secondary-dark font-semibold py-2 px-4 rounded-lg border border-gray-300/50 dark:border-white/10 shadow-sm hover:bg-white/80 dark:hover:bg-gray-600/50 transition-all transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.81C34.553 5.822 29.587 3.5 24 3.5C11.983 3.5 2.5 12.983 2.5 25s9.483 21.5 21.5 21.5c11.983 0 21.5-9.483 21.5-21.5c0-1.455-.122-2.87-.36-4.242z"></path></svg>
                    <span>Continue with Google</span>
                  </button>
            </div>
        </div>
      </section>
      
      <section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h3 className="text-3xl font-bold text-center mb-8 text-text-primary dark:text-text-primary-dark">Featured Listings</h3>
        <div className="mt-16">
           <DirectoryPage previewMode={true} listings={listings} />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;