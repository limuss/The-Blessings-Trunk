
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hamper, SiteSettings, Occasion, MediaItem } from '../types';

interface StoreContextType {
  hampers: Hamper[];
  occasions: Occasion[];
  settings: SiteSettings;
  mediaLibrary: MediaItem[];
  // Settings operations
  updateSettings: (settings: SiteSettings) => void;
  // Hamper operations
  addHamper: (hamper: Hamper) => void;
  updateHamper: (hamper: Hamper) => void;
  deleteHamper: (id: string) => void;
  // Occasion operations
  addOccasion: (occasion: Occasion) => void;
  updateOccasion: (occasion: Occasion) => void;
  deleteOccasion: (id: string) => void;
  // Media operations
  addToMediaLibrary: (item: MediaItem) => void;
  removeFromMediaLibrary: (id: string) => void;
}

const defaultSettings: SiteSettings = {
  phoneNumber: '+91 88990 43549',
  whatsappNumber: '8899043549',
  ownerEmail: 'muslimnazirlonekmr@gmail.com',
  proprietorName: 'Azhar Majeed',
  instagramUrl: '#',
  facebookUrl: '#',
  twitterUrl: '#',
  heroTitle: 'The Blessings Trunk',
  heroSubtitle: 'A trunk full of love, warmth & heartfelt wishes',
  heroImage: 'https://images.unsplash.com/photo-1606830733744-0ad778449672?q=80&w=2000&auto=format&fit=crop',
  aboutTitle: 'Gifting with Emotion',
  aboutText1: 'The Blessings Trunk was founded on a simple belief: a gift is more than its contents; it is a physical manifestation of a blessing.',
  aboutText2: 'Every almond, every walnut, and every thread of saffron is sourced with reverence for the land and the hands that harvest it.',
  aboutQuote: 'We don\'t sell hampers; we facilitate blessings.',
  gasEndpoint: 'https://script.google.com/macros/s/AKfycbzEzTXIUGapqsQeptHT-qQzlRyKP7-SLmb87J6KoSzBpgvGI5MtUaB2Ag8VvEuBiWfOVQ/exec',
};

const defaultHampers: Hamper[] = [
  { id: '1', name: 'Royal Saffron Trunk', description: 'Large walnut trunk, all premium varieties.', price: '4,500', image: 'https://images.unsplash.com/photo-1606830733744-0ad778449672?q=80&w=600&auto=format&fit=crop', category: 'Wooden Trunk', showOnHome: true, showOnHampers: true, isSuggested: true },
  { id: '2', name: 'Heritage Walnut Collection', description: 'Handcrafted walnut box with premium dry fruits.', price: '5,200', image: 'https://images.unsplash.com/photo-1605666118742-5f65a6f2316e?q=80&w=600&auto=format&fit=crop', category: 'Wooden Trunk', showOnHome: true, showOnHampers: true, isSuggested: true },
  { id: '3', name: 'Eid Mubarak Box', description: 'Vibrant festival box for special occasions.', price: '3,800', image: 'https://images.unsplash.com/photo-1598124838120-020bc4155916?q=80&w=600&auto=format&fit=crop', category: 'Festival Special', showOnHome: true, showOnHampers: true, isSuggested: true },
];

const defaultOccasions: Occasion[] = [
  { id: '1', title: 'Eid Blessings', image: 'https://images.unsplash.com/photo-1598124838120-020bc4155916?q=80&w=1470&auto=format&fit=crop' },
  { id: '2', title: 'Diwali Gifting', image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1548&auto=format&fit=crop' },
  { id: '3', title: 'Newborn Joy', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1470&auto=format&fit=crop' },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hampers, setHampers] = useState<Hamper[]>(() => {
    const saved = localStorage.getItem('bt_hampers');
    return saved ? JSON.parse(saved) : defaultHampers;
  });

  const [occasions, setOccasions] = useState<Occasion[]>(() => {
    const saved = localStorage.getItem('bt_occasions');
    return saved ? JSON.parse(saved) : defaultOccasions;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('bt_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('bt_media');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('bt_hampers', JSON.stringify(hampers)), [hampers]);
  useEffect(() => localStorage.setItem('bt_occasions', JSON.stringify(occasions)), [occasions]);
  useEffect(() => localStorage.setItem('bt_settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('bt_media', JSON.stringify(mediaLibrary)), [mediaLibrary]);

  // Visitor Notification
  useEffect(() => {
    const sessionKey = 'bt_notified_visit';
    if (!sessionStorage.getItem(sessionKey) && settings.gasEndpoint) {
      fetch(settings.gasEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'visit',
          data: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        })
      }).catch(err => console.debug('Visit ping failed:', err));
      sessionStorage.setItem(sessionKey, 'true');
    }
  }, [settings.gasEndpoint]);

  const updateSettings = (newSettings: SiteSettings) => setSettings(newSettings);

  const addHamper = (h: Hamper) => setHampers(prev => [...prev, h]);
  const updateHamper = (h: Hamper) => setHampers(prev => prev.map(item => item.id === h.id ? h : item));
  const deleteHamper = (id: string) => setHampers(prev => prev.filter(item => item.id !== id));

  const addOccasion = (o: Occasion) => setOccasions(prev => [...prev, o]);
  const updateOccasion = (o: Occasion) => setOccasions(prev => prev.map(item => item.id === o.id ? o : item));
  const deleteOccasion = (id: string) => setOccasions(prev => prev.filter(item => item.id !== id));
  
  const addToMediaLibrary = (item: MediaItem) => setMediaLibrary(prev => [item, ...prev]);
  const removeFromMediaLibrary = (id: string) => setMediaLibrary(prev => prev.filter(m => m.id !== id));

  return (
    <StoreContext.Provider value={{ 
      hampers, occasions, settings, mediaLibrary, 
      updateSettings,
      addHamper, updateHamper, deleteHamper,
      addOccasion, updateOccasion, deleteOccasion,
      addToMediaLibrary, removeFromMediaLibrary 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
