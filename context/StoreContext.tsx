
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hamper, SiteSettings, Occasion, MediaItem, ShopLocation } from '../types';

interface StoreContextType {
  hampers: Hamper[];
  occasions: Occasion[];
  settings: SiteSettings;
  mediaLibrary: MediaItem[];
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
  syncToCloud: () => Promise<boolean>;
  fetchFromCloud: () => Promise<void>;
}

const DB_NAME = 'BlessingsTrunkDB';
const STORE_NAME = 'media';

const getDB = () => new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const defaultHampers: Hamper[] = [
  {
    id: '1',
    name: 'Royal Kashmiri Trunk',
    description: 'A grand wooden trunk featuring a premium selection of Mamra almonds, walnuts, and pure saffron.',
    price: '4500',
    image: 'https://images.unsplash.com/photo-1606830733744-0ad778449672?q=80&w=800&auto=format&fit=crop',
    category: 'Wooden Trunk',
    showOnHome: true,
    showOnHampers: true,
    isSuggested: true
  },
  {
    id: '2',
    name: 'Saffron & Gold Delight',
    description: 'An elegant festive box centered around Grade-A Kashmiri Saffron and sun-dried apricots.',
    price: '3200',
    image: 'https://images.unsplash.com/photo-1590080876118-20d20d4f3b7c?q=80&w=800&auto=format&fit=crop',
    category: 'Festival Special',
    showOnHome: true,
    showOnHampers: true,
    isSuggested: false
  },
  {
    id: '3',
    name: 'The Nurture Box',
    description: 'Thoughtfully curated for wellness, featuring energy-rich nuts and traditional Kashmiri herbs.',
    price: '2800',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop',
    category: 'Custom Blessing',
    showOnHome: true,
    showOnHampers: true,
    isSuggested: true
  }
];

const defaultOccasions: Occasion[] = [
  { id: 'occ-1', title: 'Grand Weddings', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop' },
  { id: 'occ-2', title: 'Eid Celebrations', image: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?q=80&w=800&auto=format&fit=crop' },
  { id: 'occ-3', title: 'Corporate Gifting', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop' }
];

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
  homeFeatureImage: 'https://images.unsplash.com/photo-1605666118742-5f65a6f2316e?q=80&w=1510&auto=format&fit=crop',
  aboutTitle: 'Gifting with Emotion',
  aboutText1: 'The Blessings Trunk was founded on a simple belief: a gift is more than its contents; it is a physical manifestation of a blessing.',
  aboutText2: 'Every almond, every walnut, and every thread of saffron is sourced with reverence for the land and the hands that harvest it.',
  aboutQuote: 'We don\'t sell hampers; we facilitate blessings.',
  shops: [
    { id: 'shop-1', name: 'Srinagar Flagship', address: 'NST Complex, 1st Floor, Residency Road, Srinagar, J&K', lat: 34.0754, lng: 74.8142 },
    { id: 'shop-2', name: 'Gulmarg Boutique', address: 'Main Market Road, Near Tourist Center, Gulmarg, J&K', lat: 34.0484, lng: 74.3805 },
    { id: 'shop-3', name: 'Pahalgam Hub', address: 'Market Square, Pahalgam, Anantnag, J&K', lat: 34.0161, lng: 75.3250 }
  ]
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hampers, setHampers] = useState<Hamper[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const savedHampers = localStorage.getItem('bt_hampers');
        const savedOccasions = localStorage.getItem('bt_occasions');
        const savedSettings = localStorage.getItem('bt_settings');
        
        if (savedHampers) setHampers(JSON.parse(savedHampers));
        else setHampers(defaultHampers);

        if (savedOccasions) setOccasions(JSON.parse(savedOccasions));
        else setOccasions(defaultOccasions);

        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (!parsed.shops) parsed.shops = defaultSettings.shops;
          setSettings(parsed);
        }

        const dbInst = await getDB();
        const tx = dbInst.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => setMediaLibrary(request.result);
      } catch (e) {
        console.error('Initialization failed:', e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => { if (!isLoading) localStorage.setItem('bt_hampers', JSON.stringify(hampers)); }, [hampers, isLoading]);
  useEffect(() => { if (!isLoading) localStorage.setItem('bt_occasions', JSON.stringify(occasions)); }, [occasions, isLoading]);
  useEffect(() => { if (!isLoading) localStorage.setItem('bt_settings', JSON.stringify(settings)); }, [settings, isLoading]);

  const addToMediaLibrary = async (item: MediaItem) => {
    setMediaLibrary(prev => [item, ...prev]);
    const dbInst = await getDB();
    const tx = dbInst.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(item);
  };

  const removeFromMediaLibrary = async (id: string) => {
    setMediaLibrary(prev => prev.filter(m => m.id !== id));
    const dbInst = await getDB();
    const tx = dbInst.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
  };

  const fetchFromCloud = async () => {
    // Firestore functionality disabled for now
    console.log("Cloud fetch is currently disabled.");
  };

  const syncToCloud = async (): Promise<boolean> => {
    // Firestore functionality disabled for now
    console.log("Cloud sync is currently disabled.");
    return true;
  };

  const updateSettings = (s: SiteSettings) => setSettings(s);
  const addHamper = (h: Hamper) => setHampers(prev => [...prev, h]);
  const updateHamper = (h: Hamper) => setHampers(prev => prev.map(i => i.id === h.id ? h : i));
  const deleteHamper = (id: string) => setHampers(prev => prev.filter(i => i.id !== id));
  const addOccasion = (o: Occasion) => setOccasions(prev => [...prev, o]);
  const updateOccasion = (o: Occasion) => setOccasions(prev => prev.map(i => i.id === o.id ? o : i));
  const deleteOccasion = (id: string) => setOccasions(prev => prev.filter(i => i.id !== id));

  return (
    <StoreContext.Provider value={{ 
      hampers, occasions, settings, mediaLibrary, isLoading,
      updateSettings, addHamper, updateHamper, deleteHamper,
      addOccasion, updateOccasion, deleteOccasion,
      addToMediaLibrary, removeFromMediaLibrary, syncToCloud, fetchFromCloud
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
