import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="container mx-auto px-4 pb-4">
      <div className="bg-white/25 dark:bg-gray-800/25 backdrop-blur-md shadow-lg border border-white/20 dark:border-white/10 rounded-2xl">
        <div className="mx-auto px-4 py-6 text-center text-text-secondary dark:text-text-secondary-dark">
          <p>&copy; 2024 CommunityNet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;