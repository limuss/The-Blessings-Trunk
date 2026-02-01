
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hamper, SiteSettings, Occasion, MediaItem, ShopLocation } from '../types';

interface StoreContextType {
  hampers: Hamper[];
  occasions: Occasion[];
  settings: SiteSettings;
  mediaLibrary: MediaItem[];
  cart: string[]; // Array of Hamper IDs
  wishlist: string[]; // Array of Hamper IDs
  isLoading: boolean;
  updateSettings: (settings: SiteSettings) => void;
  addHamper: (hamper: Hamper) => void;
  updateHamper: (hamper: Hamper) => void;
  deleteHamper: (id: string) => void;
  addOccasion: (occasion: Occasion) => void;
  updateOccasion: (occasion: Occasion) => void;
  deleteOccasion: (id: string) => void;
  addToMediaLibrary: (item: MediaItem) => void;
  removeFromMediaLibrary: (id: string) => void;
  toggleCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
}

const defaultSettings: SiteSettings = {
  phoneNumber: '+91 88990 43549',
  whatsappNumber: '8899043549',
  ownerEmail: 'theblessingstrunk@gmail.com',
  proprietorName: 'Azhar Majeed',
  instagramUrl: '#',
  facebookUrl: '#',
  twitterUrl: '#',
  heroTitle: 'The Blessings Trunk',
  heroSubtitle: 'A trunk full of love, warmth & heartfelt wishes',
  heroImage: 'https://images.unsplash.com/photo-1606830733744-0ad778449672?q=80&w=2000&auto=format&fit=crop',
  homeFeatureImage: 'https://images.unsplash.com/photo-1605666118742-5f65a6f2316e?q=80&w=1510&auto=format&fit=crop',
  aboutTitle: 'Gifting with Emotion',
  aboutText1: 'The Blessings Trunk facilitates blessings through premium handcrafted Kashmiri dry fruit hampers.',
  aboutText2: 'Every thread of saffron is sourced with reverence for our heritage.',
  aboutQuote: 'Facilitating blessings, one trunk at a time.',
  shops: [
    { id: 'shop-1', name: 'Srinagar Flagship', address: 'NST Complex, 1st Floor, Residency Road, Srinagar, J&K', lat: 34.0754, lng: 74.8142 },
  ]
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hampers, setHampers] = useState<Hamper[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedHampers = localStorage.getItem('bt_hampers');
    const savedOccasions = localStorage.getItem('bt_occasions');
    const savedSettings = localStorage.getItem('bt_settings');
    const savedCart = localStorage.getItem('bt_cart');
    const savedWishlist = localStorage.getItem('bt_wishlist');

    if (savedHampers) setHampers(JSON.parse(savedHampers));
    if (savedOccasions) setOccasions(JSON.parse(savedOccasions));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    
    setIsLoading(false);
  }, []);

  useEffect(() => { localStorage.setItem('bt_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('bt_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  const toggleCart = (id: string) => setCart(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleWishlist = (id: string) => setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const updateSettings = (s: SiteSettings) => setSettings(s);
  const addHamper = (h: Hamper) => setHampers(prev => [...prev, h]);
  const updateHamper = (h: Hamper) => setHampers(prev => prev.map(i => i.id === h.id ? h : i));
  const deleteHamper = (id: string) => setHampers(prev => prev.filter(i => i.id !== id));
  const addOccasion = (o: Occasion) => setOccasions(prev => [...prev, o]);
  const updateOccasion = (o: Occasion) => setOccasions(prev => prev.map(i => i.id === o.id ? o : i));
  const deleteOccasion = (id: string) => setOccasions(prev => prev.filter(i => i.id !== id));
  const addToMediaLibrary = (m: MediaItem) => setMediaLibrary(prev => [m, ...prev]);
  const removeFromMediaLibrary = (id: string) => setMediaLibrary(prev => prev.filter(m => m.id !== id));

  return (
    <StoreContext.Provider value={{ 
      hampers, occasions, settings, mediaLibrary, cart, wishlist, isLoading,
      updateSettings, addHamper, updateHamper, deleteHamper,
      addOccasion, updateOccasion, deleteOccasion,
      addToMediaLibrary, removeFromMediaLibrary, toggleCart, toggleWishlist
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
