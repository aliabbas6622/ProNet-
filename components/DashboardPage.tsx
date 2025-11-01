import React, { useState, useEffect } from 'react';
import { generateBlurb } from '../services/geminiService';
import type { Business, Profile } from '../types';
import { useAuth } from '../contexts/AuthContext';

type DashboardTab = 'profile' | 'listing' | 'settings';

interface DashboardPageProps {
  onAddBusiness: (business: Omit<Business, 'id' | 'type'>) => void;
  onAddOrUpdateProfile: (profile: Omit<Profile, 'id' | 'type' | 'avatarUrl' | 'name' | 'userId'>) => void;
  userProfile: Profile | undefined;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onAddBusiness, onAddOrUpdateProfile, userProfile }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');
  const [isGenerating, setIsGenerating] = useState(false);
  const [profile, setProfile] = useState({ 
    name: currentUser?.name || '', 
    role: '', 
    summary: '', 
    linkedIn: '', 
    consent: false 
  });
  const [business, setBusiness] = useState({ 
    name: '', 
    category: '', 
    description: '', 
    email: '', 
    logo: null as File | null, 
    logoPreview: null as string | null 
  });

  useEffect(() => {
    if (userProfile) {
      setProfile({
        name: userProfile.name,
        role: userProfile.role,
        summary: userProfile.summary,
        linkedIn: userProfile.linkedInUrl,
        consent: true,
      });
    } else if (currentUser) {
      setProfile(p => ({ ...p, name: currentUser.name }));
    }
  }, [userProfile, currentUser]);

  const handleGenerateBlurb = async (type: 'profile' | 'business') => {
    setIsGenerating(true);
    let promptText = '';
    if (type === 'profile') {
      promptText = profile.role || 'professional';
    } else {
      promptText = business.category || 'business';
    }

    const blurb = await generateBlurb(promptText);

    if (type === 'profile') {
      setProfile(p => ({ ...p, summary: blurb }));
    } else {
      setBusiness(b => ({ ...b, description: blurb }));
    }
    setIsGenerating(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setBusiness(b => ({
          ...b,
          logo: file,
          logoPreview: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.role || !profile.consent) {
      alert('Please fill out your role and provide consent to share your profile.');
      return;
    }
    onAddOrUpdateProfile({
      role: profile.role,
      summary: profile.summary,
      linkedInUrl: profile.linkedIn,
    });
    alert('Profile saved successfully!');
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business.name || !business.category || !business.email) {
      alert('Please fill out the business name, category, and email.');
      return;
    }
    onAddBusiness({
      name: business.name,
      category: business.category,
      description: business.description,
      contactEmail: business.email,
      logoUrl: business.logoPreview || `https://picsum.photos/seed/${encodeURIComponent(business.name)}/200`
    });
    setBusiness({ name: '', category: '', description: '', email: '', logo: null, logoPreview: null });
    alert('Business listing created successfully!');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2 text-text-primary dark:text-text-primary-dark">My Profile</h2>
            <p className="mb-6 text-text-secondary dark:text-text-secondary-dark">Manage your individual professional profile.</p>
            <form className="space-y-6" onSubmit={handleProfileSubmit}>
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">Full Name</label>
                <input type="text" value={profile.name} readOnly className="mt-1 block w-full p-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-300/40 dark:border-white/10 rounded-md shadow-sm cursor-not-allowed"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">Role / Title</label>
                <input type="text" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} placeholder="e.g., Software Engineer" className="mt-1 block w-full p-2 bg-white/50 dark:bg-gray-700/50 border border-gray-300/40 dark:border-white/10 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-all duration-200"/>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">Summary / Blurb</label>
                  <button type="button" onClick={() => handleGenerateBlurb('profile')} disabled={isGenerating} className="text-sm font-semibold text-accent hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    {isGenerating ? 'Generating...' : '✨ Auto-generate with AI'}
                  </button>
                </div>
                <textarea rows={4} value={profile.summary} onChange={e => setProfile({...profile, summary: e.target.value})} className="mt-1 block w-full p-2 bg-white/50 dark:bg-gray-700/50 border border-gray-300/40 dark:border-white/10 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-all duration-200"></textarea>
              </div>
               <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">LinkedIn Profile URL</label>
                <input type="url" value={profile.linkedIn} onChange={e => setProfile({...profile, linkedIn: e.target.value})} className="mt-1 block w-full p-2 bg-white/50 dark:bg-gray-700/50 border border-gray-300/40 dark:border-white/10 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-all duration-200"/>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input type="checkbox" checked={profile.consent} onChange={e => setProfile({...profile, consent: e.target.checked})} className="focus:ring-accent h-4 w-4 text-accent bg-white/50 dark:bg-gray-700/50 border-gray-300/40 dark:border-white/10 rounded"/>
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-text-primary dark:text-text-primary-dark">I consent to sharing my profile publicly.</label>
                </div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-xl hover:shadow-primary/40 dark:hover:shadow-accent/40 transform hover:-translate-y-1 transition-all duration-300">Save Profile</button>
            </form>
          </div>
        );
      case 'listing':
         return (
          <div>
            <h2 className="text-2xl font-bold mb-2 text-text-primary dark:text-text-primary-dark">My Business Listing</h2>
            <p className="mb-6 text-text-secondary dark:text-text-secondary-dark">Update your business information for the directory.</p>
            <form className="space-y-6" onSubmit={handleBusinessSubmit}>
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">Business Name</label>
                <input type="text" value={business.name} onChange={e => setBusiness({...business, name: e.target.value})} className="mt-1 block w-full p-2 bg-white/50 dark:bg-gray-700/50 border border-gray-300/40 dark:border-white/10 rounded-md shadow-sm focus:ring-accent focus:border-accent transition-all duration-200"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">Business Logo</label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="inline-block h-20 w-20 rounded-lg overflow-hidden bg-gray-100/50 dark:bg-gray-700/50 border border-gray-300/40 dark:border-white/10 flex-shrink-0">
                    {business.logoPreview ? (
                      <img className="h-full w-full object-cover" src={business.logoPreview} alt="Logo Preview" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <svg className="h-10 w-10 text-gray-300 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <label htmlFor="logo-upload" className="cursor-pointer bg-white/50 dark:bg-gray-700/50 py-2 px-3 border border-gray-300/40 dark:border-white/10 rounded-md shadow-sm text-sm leading-4 font-medium text-text-primary dark:text-text-primary-dark hover:bg-white/80 dark:hover:bg-gray-600/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent transition-all duration-200">
                    <span>Upload logo</span>
                    <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoChange} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">Category</label>
                <input type="text" value={business.category} onChange={e => setBusiness({...business, category: e.target.value})} placeholder="e.g., Cafe, Tech Consulting" className="mt-1 block w-full p-2 bg-white/50 dark:bg-gray-700/50 border border-gray-300/40 dark:border-white/10 rounded-md shadow-sm focus:ring-accent focus:border-accent transition-all duration-200"/>
              </div>
              <div>
                 <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">Description</label>
                  <button type="button" onClick={() => handleGenerateBlurb('business')} disabled={isGenerating} className="text-sm font-semibold text-accent hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    {isGenerating ? 'Generating...' : '✨ Auto-generate with AI'}
                  </button>
                </div>
                <textarea rows={4} value={business.description} onChange={e => setBusiness({...business, description: e.target.value})} className="mt-1 block w-full p-2 bg-white/50 dark:bg-gray-700/50 border border-gray-300/40 dark:border-white/10 rounded-md shadow-sm focus:ring-accent focus:border-accent transition-all duration-200"></textarea>
              </div>
               <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">Public Contact Email</label>
                <input type="email" value={business.email} onChange={e => setBusiness({...business, email: e.target.value})} className="mt-1 block w-full p-2 bg-white/50 dark:bg-gray-700/50 border border-gray-300/40 dark:border-white/10 rounded-md shadow-sm focus:ring-accent focus:border-accent transition-all duration-200"/>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-xl hover:shadow-primary/40 dark:hover:shadow-accent/40 transform hover:-translate-y-1 transition-all duration-300">Save Listing</button>
            </form>
          </div>
        );
      case 'settings':
        return <div><h2 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">Settings</h2><p className="mt-4 text-text-secondary dark:text-text-secondary-dark">Account settings and preferences will be available here.</p></div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-1/4">
        <nav className="space-y-2">
          {(['profile', 'listing', 'settings'] as DashboardTab[]).map((tab, index) => (
            <div key={tab} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left font-semibold p-3 rounded-lg transition-all duration-200 ${activeTab === tab ? 'bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-primary dark:text-white shadow-md' : 'hover:bg-white/30 dark:hover:bg-gray-700/30 text-text-primary dark:text-text-primary-dark hover:shadow-md hover:translate-x-1'}`}
              >
                {tab === 'profile' && 'My Profile'}
                {tab === 'listing' && 'My Listing'}
                {tab === 'settings' && 'Settings'}
              </button>
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex-1 bg-white/25 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/40 dark:bg-gray-800/25 dark:border-white/10 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div key={activeTab} className="animate-fade-in">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;