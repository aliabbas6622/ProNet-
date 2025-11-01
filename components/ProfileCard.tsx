import React from 'react';
import type { Listing, Profile, Business } from '../types';
import { ListingType } from '../types';

interface ProfileCardProps {
  listing: Listing;
}

const isProfile = (listing: Listing): listing is Profile => {
    return listing.type === ListingType.Individual;
}
const isBusiness = (listing: Listing): listing is Business => {
    return listing.type === ListingType.Business;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ listing }) => {
  const imageUrl = isProfile(listing) ? listing.avatarUrl : listing.logoUrl;
  const subtitle = isProfile(listing) ? listing.role : listing.category;

  const cardVibeClasses = isProfile(listing)
    ? 'hover:shadow-primary/40 dark:hover:shadow-primary/50 group-hover:border-primary/30'
    : 'hover:shadow-accent/40 dark:hover:shadow-accent/50 group-hover:border-accent/30';

  const handleViewProfileClick = () => {
    if (isProfile(listing)) {
      window.open(listing.linkedInUrl, '_blank', 'noopener,noreferrer');
    } else if (isBusiness(listing)) {
      window.location.href = `mailto:${listing.contactEmail}`;
    }
  };

  return (
    <div className={`
      bg-white/60 dark:bg-slate-800/40 
      backdrop-blur-md rounded-2xl shadow-lg shadow-primary/10 dark:shadow-lg dark:shadow-black/20 
      transform hover:-translate-y-2 
      hover:shadow-2xl ${cardVibeClasses}
      transition-all duration-400 ease-in-out group 
      border border-white/40 dark:border-white/10`}
    >
      <div className="p-6 pt-16 relative text-center">
         <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <img className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-600 shadow-lg object-cover transition-transform duration-300 ease-in-out group-hover:scale-110" src={imageUrl} alt={listing.name} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">{listing.name}</h3>
          <p className={`font-semibold ${isProfile(listing) ? 'text-primary' : 'text-accent'}`}>{subtitle}</p>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-2 h-10 overflow-hidden">
            {isProfile(listing) ? listing.summary : listing.description}
          </p>
        </div>
        
        {/* --- ACTIONS CONTAINER --- */}
        <div className="mt-6 h-10 flex justify-center items-center">
            {/* Social icons visible by default, fade out on hover */}
            <div className="flex justify-center space-x-3 transition-opacity duration-300 opacity-100 group-hover:opacity-0">
            {isProfile(listing) && (
                <a href={listing.linkedInUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/50 dark:bg-gray-700/50 rounded-full text-text-secondary dark:text-text-secondary-dark hover:bg-primary hover:text-white dark:hover:text-white transition-colors transform hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
            )}
            {isBusiness(listing) && (
                <a href={`mailto:${listing.contactEmail}`} className="p-2 bg-white/50 dark:bg-gray-700/50 rounded-full text-text-secondary dark:text-text-secondary-dark hover:bg-accent hover:text-white dark:hover:text-white transition-colors transform hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/></svg>
                </a>
            )}
            </div>
            
            {/* "View Profile" button hidden by default, fades in on hover */}
            <div className="absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <button 
                  onClick={handleViewProfileClick}
                  className="bg-gradient-to-r from-primary to-accent text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:brightness-110 transition-all">
                    View Profile
                </button>
            </div>
        </div>
        {/* --- END ACTIONS CONTAINER --- */}
      </div>
    </div>
  );
};

export default ProfileCard;