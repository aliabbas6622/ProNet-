import React, { useState, useMemo } from 'react';
import type { Listing } from '../types';
import { ListingType } from '../types';
import ProfileCard from './ProfileCard';

interface DirectoryPageProps {
  previewMode?: boolean;
  listings: Listing[];
}

const DirectoryPage: React.FC<DirectoryPageProps> = ({ previewMode = false, listings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredListings = useMemo(() => {
    let data = previewMode ? listings.slice(0, 4) : listings;
    
    if (searchTerm) {
      data = data.filter(l => 
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.type === ListingType.Individual && l.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.type === ListingType.Business && l.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterType !== 'all') {
      data = data.filter(l => l.type === filterType);
    }

    return data;
  }, [searchTerm, filterType, previewMode, listings]);

  const FilterPill: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <button
      onClick={() => setFilterType(value)}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
        filterType === value
          ? 'bg-primary text-white shadow-md'
          : 'bg-white/50 text-text-secondary hover:bg-white/80 dark:bg-gray-700/50 dark:text-text-secondary-dark dark:hover:bg-gray-600/50 transform hover:-translate-y-0.5 hover:shadow-md'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full">
      {!previewMode && (
        <div className="mb-8 p-6 bg-white/25 backdrop-blur-md rounded-xl shadow-lg border border-white/40 dark:bg-gray-800/25 dark:border-white/10 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <input
                type="text"
                placeholder="Search by name, role, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 bg-white/50 border border-gray-300/40 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text-secondary dark:bg-gray-700/50 dark:border-white/10 dark:placeholder-text-secondary-dark dark:text-text-primary-dark"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <div className="flex items-center space-x-2">
              <FilterPill value="all" label="All" />
              <FilterPill value={ListingType.Individual} label="Individuals" />
              <FilterPill value={ListingType.Business} label="Businesses" />
            </div>
          </div>
        </div>
      )}

      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-16">
          {filteredListings.map((listing, index) => (
            <div key={listing.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${previewMode ? index * 100 : (index * 100) + 200}ms` }}>
              <ProfileCard listing={listing} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-secondary dark:text-text-secondary-dark bg-white/25 dark:bg-gray-800/25 backdrop-blur-sm rounded-xl">
          <h3 className="text-xl font-semibold">No listings found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;
