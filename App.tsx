import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import DirectoryPage from './components/DirectoryPage';
import DashboardPage from './components/DashboardPage';
import AuthPage from './components/AuthPage';
import Breadcrumbs from './components/Breadcrumbs';
import type { Listing, Business, Profile } from './types';
import { ListingType } from './types';
import { useAuth } from './contexts/AuthContext';

export type Page = 'landing' | 'directory' | 'dashboard' | 'auth';

const mockData: Listing[] = [
  { id: 1, type: ListingType.Individual, name: 'Alice Johnson', role: 'UX Designer', summary: 'Creative UX designer focused on user-centric solutions.', avatarUrl: 'https://picsum.photos/seed/alice/200', linkedInUrl: '#' },
  { id: 2, type: ListingType.Business, name: 'Innovate Solutions', category: 'Tech Consulting', description: 'Providing cutting-edge tech consulting for startups.', logoUrl: 'https://picsum.photos/seed/innovate/200', contactEmail: 'contact@innovate.com' },
  { id: 3, type: ListingType.Individual, name: 'Bob Williams', role: 'Frontend Developer', summary: 'Passionate about building beautiful and responsive web interfaces.', avatarUrl: 'https://picsum.photos/seed/bob/200', linkedInUrl: '#' },
  { id: 4, type: ListingType.Individual, name: 'Charlie Brown', role: 'Project Manager', summary: 'Experienced PM with a track record of successful project delivery.', avatarUrl: 'https://picsum.photos/seed/charlie/200', linkedInUrl: '#' },
  { id: 5, type: ListingType.Business, name: 'GreenLeaf Cafe', category: 'Restaurant', description: 'Organic and locally sourced ingredients for a healthy lifestyle.', logoUrl: 'https://picsum.photos/seed/greenleaf/200', contactEmail: 'info@greenleaf.com' },
  { id: 6, type: ListingType.Individual, name: 'Diana Prince', role: 'Marketing Specialist', summary: 'Expert in digital marketing and brand strategy.', avatarUrl: 'https://picsum.photos/seed/diana/200', linkedInUrl: '#' },
  { id: 7, type: ListingType.Business, name: 'BuildRight Construction', category: 'Construction', description: 'Quality craftsmanship for residential and commercial projects.', logoUrl: 'https://picsum.photos/seed/buildright/200', contactEmail: 'quotes@buildright.com' },
  { id: 8, type: ListingType.Individual, name: 'Ethan Hunt', role: 'Photographer', summary: 'Capturing moments that last a lifetime.', avatarUrl: 'https://picsum.photos/seed/ethan/200', linkedInUrl: '#' },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [listings, setListings] = useState<Listing[]>(mockData);
  const { currentUser, loading } = useAuth();

  const userProfile = useMemo(() => 
    listings.find(l => 
        l.type === ListingType.Individual && 
        currentUser && 
        'userId' in l && l.userId === currentUser.id
    ) as Profile | undefined,
  [listings, currentUser]);

  const handleAddBusiness = (businessData: Omit<Business, 'id' | 'type'>) => {
    const newBusiness: Business = {
      id: Date.now(),
      type: ListingType.Business,
      ...businessData,
    };
    setListings(prevListings => [newBusiness, ...prevListings]);
  };
  
  const handleAddOrUpdateProfile = (profileData: Omit<Profile, 'id' | 'type' | 'avatarUrl' | 'name' | 'userId'>) => {
    if (!currentUser) return;

    const existingProfileIndex = listings.findIndex(
      l => l.type === ListingType.Individual && 'userId' in l && l.userId === currentUser.id
    );

    if (existingProfileIndex > -1) {
      const updatedListings = [...listings];
      const existingProfile = updatedListings[existingProfileIndex] as Profile;
      updatedListings[existingProfileIndex] = {
        ...existingProfile,
        ...profileData,
      };
      setListings(updatedListings);
    } else {
      const newProfile: Profile = {
        id: Date.now(),
        type: ListingType.Individual,
        userId: currentUser.id,
        name: currentUser.name,
        avatarUrl: `https://i.pravatar.cc/200?u=${currentUser.id}`,
        ...profileData,
      };
      setListings(prevListings => [newProfile, ...prevListings]);
    }
  };

  const navigate = (page: Page) => {
    if (page === 'dashboard') {
        if (currentUser) {
            setCurrentPage('dashboard');
        } else {
            setCurrentPage('auth');
        }
    } else {
        setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setPage={navigate} listings={listings} />;
      case 'directory':
        return <DirectoryPage listings={listings} />;
      case 'dashboard':
        if (!currentUser) return <AuthPage setPage={setCurrentPage} />;
        return <DashboardPage 
          onAddBusiness={handleAddBusiness} 
          onAddOrUpdateProfile={handleAddOrUpdateProfile}
          userProfile={userProfile}
        />;
      case 'auth':
         if (currentUser) {
            setCurrentPage('dashboard');
            return <DashboardPage 
              onAddBusiness={handleAddBusiness}
              onAddOrUpdateProfile={handleAddOrUpdateProfile}
              userProfile={userProfile}
            />;
         }
         return <AuthPage setPage={setCurrentPage} />;
      default:
        return <LandingPage setPage={navigate} listings={listings} />;
    }
  };

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
     )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-[#E8ECFF] text-text-primary dark:from-background-dark dark:to-[#111827] dark:text-text-primary-dark font-sans flex flex-col">
      <Header setPage={navigate} />
      <main className="flex-grow container mx-auto px-4 pt-20 pb-12">
        <Breadcrumbs currentPage={currentPage} setPage={navigate} />
        <div key={currentPage} className="animate-fade-in">
          {renderPage()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;