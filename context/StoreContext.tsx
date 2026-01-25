
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hamper, SiteSettings, Occasion } from '../types';

interface StoreContextType {
  hampers: Hamper[];
  occasions: Occasion[];
  settings: SiteSettings;
  updateHampers: (hampers: Hamper[]) => void;
  updateOccasions: (occasions: Occasion[]) => void;
  updateSettings: (settings: SiteSettings) => void;
}

const defaultSettings: SiteSettings = {
  phoneNumber: '+91 60055 02054',
  whatsappNumber: '916005502054',
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
};

const defaultHampers: Hamper[] = [
  { id: '1', name: 'Royal Saffron Trunk', description: 'Large walnut trunk, all premium varieties.', price: '4,500', image: 'https://images.unsplash.com/photo-1606830733744-0ad778449672?q=80&w=600&auto=format&fit=crop', category: 'Wooden Trunk', showOnHome: true, showOnHampers: true, isSuggested: true },
  { id: '2', name: 'Heritage Walnut Collection', description: 'Handcrafted walnut box with premium dry fruits.', price: '5,200', image: 'https://images.unsplash.com/photo-1605666118742-5f65a6f2316e?q=80&w=600&auto=format&fit=crop', category: 'Wooden Trunk', showOnHome: true, showOnHampers: true, isSuggested: true },
  { id: '3', name: 'Eid Mubarak Box', description: 'Vibrant festival box for special occasions.', price: '3,800', image: 'https://images.unsplash.com/photo-1598124838120-020bc4155916?q=80&w=600&auto=format&fit=crop', category: 'Festival Special', showOnHome: true, showOnHampers: true, isSuggested: true },
  { id: '4', name: 'Newborn Welcome Tray', description: 'Gentle and premium selection for new arrivals.', price: '2,900', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop', category: 'Custom Blessing', showOnHome: true, showOnHampers: true, isSuggested: false },
];

const defaultOccasions: Occasion[] = [
  { id: '1', title: 'Eid Blessings', image: 'https://images.unsplash.com/photo-1598124838120-020bc4155916?q=80&w=1470&auto=format&fit=crop' },
  { id: '2', title: 'Diwali Gifting', image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1548&auto=format&fit=crop' },
  { id: '3', title: 'Newborn Joy', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1470&auto=format&fit=crop' },
  { id: '4', title: 'Family Celebrations', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1469&auto=format&fit=crop' },
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

  useEffect(() => {
    localStorage.setItem('bt_hampers', JSON.stringify(hampers));
  }, [hampers]);

  useEffect(() => {
    localStorage.setItem('bt_occasions', JSON.stringify(occasions));
  }, [occasions]);

  useEffect(() => {
    localStorage.setItem('bt_settings', JSON.stringify(settings));
  }, [settings]);

  const updateHampers = (newHampers: Hamper[]) => setHampers(newHampers);
  const updateOccasions = (newOccasions: Occasion[]) => setOccasions(newOccasions);
  const updateSettings = (newSettings: SiteSettings) => setSettings(newSettings);

  return (
    <StoreContext.Provider value={{ hampers, occasions, settings, updateHampers, updateOccasions, updateSettings }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
