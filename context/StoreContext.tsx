

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hamper, SiteSettings, Occasion, MediaItem, ShopLocation } from '../types';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

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
  heroImage: 'https://i.pinimg.com/736x/71/ae/65/71ae65fb2265bfdde8e423a87be501df.jpg',
  homeFeatureImage: 'https://i.pinimg.com/736x/47/01/77/470177b9b31fe2b0f2a4b12dc7912f6d.jpg',
  aboutTitle: 'Gifting with Emotion',
  aboutText1: 'The Blessings Trunk facilitates blessings through premium handcrafted Kashmiri dry fruit hampers.',
  aboutText2: 'Every thread of saffron is sourced with reverence for our heritage.',
  aboutQuote: 'Facilitating blessings, one trunk at a time.',
  shops: [
    { id: 'shop-1', name: 'Srinagar Flagship', address: 'NST Complex, 1st Floor, Residency Road, Srinagar, J&K', lat: 34.0754, lng: 74.8142 },
  ]
};

const defaultOccasions: Occasion[] = [
  {
    id: 'occ-1',
    title: 'Nikkah & Weddings',
    image: 'https://i.pinimg.com/736x/58/ea/f8/58eaf86647247159eade109d171882a0.jpg'
  },
  {
    id: 'occ-2',
    title: 'Eid Celebrations',
    image: 'https://i.pinimg.com/1200x/7c/1f/e5/7c1fe57da9748fa573e65a722946921c.jpg'
  },
  {
    id: 'occ-3',
    title: 'Corporate Gifting',
    image: 'https://i.pinimg.com/736x/38/01/e0/3801e0205dc217c2f56452b76ab47f73.jpg'
  },
  {
    id: 'occ-4',
    title: 'Baby Announcement',
    image: 'https://i.pinimg.com/736x/b6/c0/80/b6c080db18f09fb72f2fcb219d58a2b7.jpg'
  },
  {
    id: 'occ-5',
    title: 'House Warming',
    image: 'https://i.pinimg.com/1200x/01/89/b8/0189b8f4a8e44005cc920da579acb90a.jpg'
  },
  {
    id: 'occ-6',
    title: 'Personal Gestures',
    image: 'https://i.pinimg.com/736x/52/2b/4e/522b4ed410f5881da1ecd7e69e8e278d.jpg'
  }
];

const defaultHampers: Hamper[] = [
  {
    id: 'hamp-1',
    name: 'Royal Saffron Trunk',
    description: 'A luxurious collection of premium Kashmiri Saffron, Mamra Almonds, and Snow-White Walnuts encased in a handcrafted walnut wood trunk. Perfect for weddings and grand gestures.',
    price: '3500',
    image: 'https://i.pinimg.com/736x/3c/6f/f9/3c6ff99812348abb108cb9a93d2c9f66.jpg',
    category: 'Wedding',
    showOnHome: true,
    showOnHampers: true,
    isSuggested: true
  },
  {
    id: 'hamp-2',
    name: 'Valley\'s Embrace',
    description: 'An assortment of sun-dried Apricots, Figs, and organic Kashmiri Honey. A sweet and healthy gesture for house warmings and personal gifts.',
    price: '1800',
    image: 'https://i.pinimg.com/736x/d5/08/98/d50898655c58f234e38bfdd284f86184.jpg',
    category: 'Gifting',
    showOnHome: true,
    showOnHampers: true,
    isSuggested: true
  },
  {
    id: 'hamp-3',
    name: 'Shikara Delight',
    description: 'A festive mix of Dates, Cashews, and our signature Kahwa spice mix. The perfect companion for Eid celebrations and family gatherings.',
    price: '2200',
    image: 'https://i.pinimg.com/736x/8b/c5/89/8bc589b14ca4495dc3e800b718828211.jpg',
    category: 'Festive',
    showOnHome: true,
    showOnHampers: true,
    isSuggested: false
  },
  {
    id: 'hamp-4',
    name: 'Pahalgam Picnic',
    description: 'A curated selection of trail mix, dried berries, and almond kernels. Ideal for corporate gifting and healthy snacking.',
    price: '1200',
    image: 'https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?q=80&w=1374&auto=format&fit=crop',
    category: 'Corporate',
    showOnHome: false,
    showOnHampers: true,
    isSuggested: false
  },
  {
    id: 'hamp-5',
    name: 'California Almonds',
    description: 'Crunchy, whole kernels from sunny California. Rich in vitamin E & healthy fats. 250g pack.',
    price: '350',
    image: 'https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?q=80&w=1374&auto=format&fit=crop',
    category: 'Dry Fruits',
    showOnHome: false,
    showOnHampers: true,
    isSuggested: false
  },
  {
    id: 'hamp-6',
    name: 'Goa Cashews',
    description: 'Creamy, premium Goan cashews—roasted or raw. Perfect for munching or curries. 250g pack.',
    price: '450',
    image: 'https://images.unsplash.com/photo-1606830733744-0ad778449672?q=80&w=2000&auto=format&fit=crop',
    category: 'Dry Fruits',
    showOnHome: false,
    showOnHampers: true,
    isSuggested: false
  },
  {
    id: 'hamp-7',
    name: 'Ajwa Dates',
    description: 'Holy dates from Medina—soft, caramel-like, and nutrient-packed. Eid favorite! 250g pack.',
    price: '800',
    image: 'https://images.unsplash.com/photo-1606830733744-0ad778449672?q=80&w=2000&auto=format&fit=crop',
    category: 'Dry Fruits',
    showOnHome: false,
    showOnHampers: true,
    isSuggested: true
  },
  {
    id: 'hamp-8',
    name: 'Kalmi Dates',
    description: 'Golden, chewy dates with a mild sweetness. Ideal for energy boosts. 250g pack.',
    price: '400',
    image: 'https://images.unsplash.com/photo-1606830733744-0ad778449672?q=80&w=2000&auto=format&fit=crop',
    category: 'Dry Fruits',
    showOnHome: false,
    showOnHampers: true,
    isSuggested: false
  },
  {
    id: 'hamp-9',
    name: 'Kimia Raisins',
    description: 'Large, juicy green raisins—sweet and plump for desserts or trail mix. 250g pack.',
    price: '300',
    image: '/images/raisins.jpg',
    category: 'Dry Fruits',
    showOnHome: false,
    showOnHampers: true,
    isSuggested: false
  },
  {
    id: 'hamp-10',
    name: 'Walnuts',
    description: 'Kashmir-sourced, brain-shaped nuts. Loaded with omega-3s for heart health. 250g pack.',
    price: '500',
    image: '/images/walnuts.jpg',
    category: 'Dry Fruits',
    showOnHome: false,
    showOnHampers: true,
    isSuggested: false
  },
  {
    id: 'hamp-11',
    name: 'Saffron (Kesari)',
    description: 'Pure Kashmiri strands—intense aroma for biryanis, teas, or sweets. 1g pack.',
    price: '450',
    image: 'https://images.unsplash.com/photo-1595166687023-34538947ddc8?q=80&w=1471&auto=format&fit=crop',
    category: 'Dry Fruits',
    showOnHome: false,
    showOnHampers: true,
    isSuggested: true
  },
  {
    id: 'hamp-12',
    name: 'Anjeer (Figs)',
    description: 'Dried, soft figs—fiber-rich for digestion and natural sweetness. 250g pack.',
    price: '350',
    image: '/images/anjeer.jpg',
    category: 'Dry Fruits',
    showOnHome: false,
    showOnHampers: true,
    isSuggested: false
  },
  {
    id: 'hamp-13',
    name: 'Royal Diwali Delight',
    description: 'Almonds, cashews, Ajwa dates, raisins, walnuts. For prosperity & joy. (Save 15%)',
    price: '1200',
    image: 'https://i.pinimg.com/736x/9f/f2/3b/9ff23b390fc813da5c5a9e6191acdc33.jpg',
    category: 'Festive',
    showOnHome: true,
    showOnHampers: true,
    isSuggested: true
  },
  {
    id: 'hamp-14',
    name: 'Eid Special',
    description: 'Ajwa & Kalmi dates, saffron, anjeer, kimia raisins. Blessed festivities! (Save 20%)',
    price: '1500',
    image: '/images/eid_special.jpg',
    category: 'Festive',
    showOnHome: true,
    showOnHampers: true,
    isSuggested: true
  },
  {
    id: 'hamp-15',
    name: 'Wellness Booster',
    description: 'Almonds, walnuts, figs, raisins. For daily health & fitness routines.',
    price: '900',
    image: '/images/wellness-booster.png',
    category: 'Gifting',
    showOnHome: false,
    showOnHampers: true,
    isSuggested: false
  },
  {
    id: 'hamp-16',
    name: 'Wedding Luxury',
    description: 'All-stars: Cashews, almonds, saffron, dates, walnuts. Grand gifting. (Save 25%)',
    price: '2200',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1440&auto=format&fit=crop',
    category: 'Wedding',
    showOnHome: true,
    showOnHampers: true,
    isSuggested: true
  },
  {
    id: 'hamp-17',
    name: 'Custom Hamper',
    description: 'Mix your favorites (min. 500g). Starting at ₹800.',
    price: '800',
    image: '/images/custom-hamper.png',
    category: 'Gifting',
    showOnHome: false,
    showOnHampers: true,
    isSuggested: false
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [hampers, setHampers] = useState<Hamper[]>(defaultHampers);
  const [occasions, setOccasions] = useState<Occasion[]>(defaultOccasions);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Store Data
  useEffect(() => {
    const savedHampers = localStorage.getItem('bt_hampers_v4');
    const savedOccasions = localStorage.getItem('bt_occasions_v2');
    const savedSettings = localStorage.getItem('bt_settings_v1');

    if (savedHampers) {
      const parsed = JSON.parse(savedHampers);
      // Migration for Royal Saffron Trunk image
      const saffronTrunk = parsed.find((h: any) => h.id === 'hamp-1');
      if (saffronTrunk && !saffronTrunk.image.includes('pinimg.com')) {
        saffronTrunk.image = 'https://i.pinimg.com/736x/3c/6f/f9/3c6ff99812348abb108cb9a93d2c9f66.jpg';
      }
      const valleyEmbrace = parsed.find((h: any) => h.id === 'hamp-2');
      if (valleyEmbrace && !valleyEmbrace.image.includes('pinimg.com')) {
        valleyEmbrace.image = 'https://i.pinimg.com/736x/d5/08/98/d50898655c58f234e38bfdd284f86184.jpg';
      }
      const diwaliDelight = parsed.find((h: any) => h.id === 'hamp-13');
      if (diwaliDelight && !diwaliDelight.image.includes('pinimg.com')) {
        diwaliDelight.image = 'https://i.pinimg.com/736x/9f/f2/3b/9ff23b390fc813da5c5a9e6191acdc33.jpg';
      }
      const shikaraDelight = parsed.find((h: any) => h.id === 'hamp-3');
      if (shikaraDelight && !shikaraDelight.image.includes('pinimg.com')) {
        shikaraDelight.image = 'https://i.pinimg.com/736x/8b/c5/89/8bc589b14ca4495dc3e800b718828211.jpg';
      }
      setHampers(parsed);
    }
    if (savedOccasions) {
      const parsed = JSON.parse(savedOccasions);
      // Migration for new Pinterest occasion images
      const updateOcc = (id: string, newUrl: string) => {
        const item = parsed.find((o: any) => o.id === id);
        if (item && !item.image.includes('pinimg.com')) {
          item.image = newUrl;
        }
      };
      updateOcc('occ-1', 'https://i.pinimg.com/736x/58/ea/f8/58eaf86647247159eade109d171882a0.jpg');
      updateOcc('occ-2', 'https://i.pinimg.com/1200x/7c/1f/e5/7c1fe57da9748fa573e65a722946921c.jpg');
      updateOcc('occ-3', 'https://i.pinimg.com/736x/38/01/e0/3801e0205dc217c2f56452b76ab47f73.jpg');
      updateOcc('occ-4', 'https://i.pinimg.com/736x/b6/c0/80/b6c080db18f09fb72f2fcb219d58a2b7.jpg');
      updateOcc('occ-5', 'https://i.pinimg.com/1200x/01/89/b8/0189b8f4a8e44005cc920da579acb90a.jpg');
      updateOcc('occ-6', 'https://i.pinimg.com/736x/52/2b/4e/522b4ed410f5881da1ecd7e69e8e278d.jpg');
      setOccasions(parsed);
    }
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Migration for new Pinterest images
      if (parsed.homeFeatureImage === 'https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?q=80&w=1374&auto=format&fit=crop') {
        parsed.homeFeatureImage = 'https://i.pinimg.com/736x/47/01/77/470177b9b31fe2b0f2a4b12dc7912f6d.jpg';
      }
      if (parsed.heroImage === 'https://images.unsplash.com/photo-1606830733744-0ad778449672?q=80&w=2000&auto=format&fit=crop') {
        parsed.heroImage = 'https://i.pinimg.com/736x/71/ae/65/71ae65fb2265bfdde8e423a87be501df.jpg';
      }
      setSettings(parsed);
    }

    setIsLoading(false);
  }, []);

  // Sync Cart/Wishlist with Firestore when User Changes
  useEffect(() => {
    const syncUserData = async () => {
      console.log('DEBUG: Syncing. UID:', currentUser?.uid);
      if (currentUser) {
        // User Login: Fetch specific data
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCart(data.cart || []);
          setWishlist(data.wishlist || []);
        } else {
          // New user or no data yet, can optionally merge or just start fresh
          // For now, let's start fresh to ensure privacy from guest session
          setCart([]);
          setWishlist([]);
        }
      } else {
        console.log('DEBUG: Logout. Clearing Cart.');
        // Logout: Clear private data
        setCart([]);
        setWishlist([]);
      }
    };
    syncUserData();
  }, [currentUser]);

  // Persist Store Data (Admin/Global)
  useEffect(() => { localStorage.setItem('bt_hampers_v4', JSON.stringify(hampers)); }, [hampers]);
  useEffect(() => { localStorage.setItem('bt_occasions_v2', JSON.stringify(occasions)); }, [occasions]);
  useEffect(() => { localStorage.setItem('bt_settings_v1', JSON.stringify(settings)); }, [settings]);

  // Save Cart/Wishlist to Firestore if Logged In
  const saveUserData = async (newCart: string[], newWishlist: string[]) => {
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(docRef, { cart: newCart, wishlist: newWishlist }, { merge: true });
    }
  };

  const toggleCart = (id: string) => {
    setCart(prev => {
      const newCart = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      saveUserData(newCart, wishlist);
      return newCart;
    });
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      saveUserData(cart, newWishlist);
      return newWishlist;
    });
  };

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
