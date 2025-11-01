import React from 'react';
import type { Page } from '../App';

interface BreadcrumbsProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const pageTitles: { [key in Page]: string } = {
  landing: 'Home',
  directory: 'Directory',
  dashboard: 'Dashboard',
  auth: 'Account',
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPage, setPage }) => {
  // Don't show breadcrumbs on the main landing page
  if (currentPage === 'landing') {
    return null;
  }

  const capitalizedCurrentPage = pageTitles[currentPage];

  return (
    <nav aria-label="Breadcrumb" className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '50ms' }}>
      <ol className="flex items-center space-x-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
        <li>
          <button onClick={() => setPage('landing')} className="hover:text-primary dark:hover:text-white transition-colors duration-200">
            Home
          </button>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
            <span className="ml-2 text-text-primary dark:text-text-primary-dark font-semibold">{capitalizedCurrentPage}</span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
