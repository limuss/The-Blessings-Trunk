import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Hamper, SiteSettings, MediaItem, ShopLocation, Occasion } from '../types';
import { auth } from '../services/firebase';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const Admin: React.FC = () => {
  const {
    hampers,
    occasions,
    settings,
    mediaLibrary,
    updateSettings,
    addHamper,
    updateHamper,
    deleteHamper,
    addOccasion,
    updateOccasion,
    deleteOccasion,
    addToMediaLibrary,
    removeFromMediaLibrary,
  } = useStore();

  // ─────────────────── AUTH ───────────────────
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // ─────────────────── UI STATE ───────────────────
  const [activeTab, setActiveTab] =
    useState<'hampers' | 'occasions' | 'shops' | 'site' | 'media'>('hampers');

  const [syncStatus, setSyncStatus] =
    useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingHamper, setEditingHamper] = useState<Hamper | null>(null);
  const [isHamperModalOpen, setIsHamperModalOpen] = useState(false);

  const [editingOccasion, setEditingOccasion] = useState<Occasion | null>(null);
  const [isOccasionModalOpen, setIsOccasionModalOpen] = useState(false);

  // ─────────────────── AUTH LISTENER ───────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ─────────────────── LOGIN ───────────────────
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setAuthError('Email or password is incorrect');
    }
  };

  // ─────────────────── LOGOUT ───────────────────
  const handleLogout = async () => {
    await signOut(auth);
  };

  // ─────────────────── MEDIA UPLOAD ───────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;

      const newItem: MediaItem = {
        id: Date.now().toString(),
        url: base64String,
        name: file.name,
        type: 'gallery',
        uploadedAt: new Date().toISOString(),
      };

      await addToMediaLibrary(newItem);
      setSyncStatus({ type: 'success', message: 'Asset added to gallery' });
      setIsUploading(false);
      setTimeout(() => setSyncStatus(null), 3000);
    };

    reader.readAsDataURL(file);
  };

  // ─────────────────── SAVE HAMPER ───────────────────
  const saveHamper = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const hamper: Hamper = {
      id: editingHamper?.id || Date.now().toString(),
      name: fd.get('name') as string,
      description: fd.get('description') as string,
      price: fd.get('price') as string,
      discountPrice: (fd.get('discountPrice') as string) || undefined,
      image: fd.get('image') as string,
      category: fd.get('category') as string,
      showOnHome: fd.get('showOnHome') === 'on',
      showOnHampers: fd.get('showOnHampers') === 'on',
      isSuggested: fd.get('isSuggested') === 'on',
    };

    editingHamper ? updateHamper(hamper) : addHamper(hamper);

    setIsHamperModalOpen(false);
    setEditingHamper(null);
    setSyncStatus({ type: 'success', message: 'Hamper saved' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // ─────────────────── SAVE OCCASION ───────────────────
  const saveOccasion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const occasion: Occasion = {
      id: editingOccasion?.id || `occ-${Date.now()}`,
      title: fd.get('title') as string,
      image: fd.get('image') as string,
    };

    editingOccasion ? updateOccasion(occasion) : addOccasion(occasion);

    setIsOccasionModalOpen(false);
    setEditingOccasion(null);
    setSyncStatus({ type: 'success', message: 'Occasion saved' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // ─────────────────── SITE SETTINGS ───────────────────
  const handleSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const newSettings: SiteSettings = {
      ...settings,
      heroTitle: fd.get('heroTitle') as string,
      heroSubtitle: fd.get('heroSubtitle') as string,
      heroImage: fd.get('heroImage') as string,
      homeFeatureImage: fd.get('homeFeatureImage') as string,
      proprietorName: fd.get('proprietorName') as string,
      phoneNumber: fd.get('phoneNumber') as string,
      whatsappNumber: fd.get('whatsappNumber') as string,
      ownerEmail: fd.get('ownerEmail') as string,
      aboutTitle: fd.get('aboutTitle') as string,
      aboutText1: fd.get('aboutText1') as string,
      aboutText2: fd.get('aboutText2') as string,
      aboutQuote: fd.get('aboutQuote') as string,
    };

    updateSettings(newSettings);
    setSyncStatus({ type: 'success', message: 'Site content updated' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // ─────────────────── SHOPS ───────────────────
  const updateShops = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const shops: ShopLocation[] = [];

    for (let i = 1; i <= 3; i++) {
      const name = fd.get(`shop${i}_name`) as string;
      if (name) {
        shops.push({
          id: `shop-${i}`,
          name,
          address: fd.get(`shop${i}_address`) as string,
          lat: parseFloat(fd.get(`shop${i}_lat`) as string) || 0,
          lng: parseFloat(fd.get(`shop${i}_lng`) as string) || 0,
        });
      }
    }

    updateSettings({ ...settings, shops });
    setSyncStatus({ type: 'success', message: 'Boutique locations updated' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // ─────────────────── LOADING ───────────────────
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#A67C37] border-t-transparent rounded-full" />
      </div>
    );
  }

  // ─────────────────── LOGIN SCREEN ───────────────────
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <form onSubmit={handleAuth} className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md space-y-6">
          <h1 className="text-3xl font-bold text-center">Admin Login</h1>
          {authError && <div className="bg-red-50 text-red-600 p-3 rounded">{authError}</div>}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border p-3 rounded" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border p-3 rounded" />
          <button className="w-full bg-black text-white py-3 rounded">Login</button>
        </form>
      </div>
    );
  }

  // ─────────────────── DASHBOARD ───────────────────
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="italic">Logged in as {currentUser.email}</p>
      <button onClick={handleLogout} className="underline mt-4">Sign out</button>
      {/* Your full dashboard JSX continues here */}
    </div>
  );
};

export default Admin;
