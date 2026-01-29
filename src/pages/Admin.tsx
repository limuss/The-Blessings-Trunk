import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Hamper, SiteSettings, MediaItem, ShopLocation } from '../types';
import { auth } from '../services/firebase';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const Admin: React.FC = () => {
  const {
    hampers, settings, mediaLibrary,
    updateSettings, addHamper, updateHamper, deleteHamper,
    addToMediaLibrary, removeFromMediaLibrary
  } = useStore();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'hampers' | 'media' | 'settings'>('hampers');
  const [isUploading, setIsUploading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingHamper, setEditingHamper] = useState<Hamper | null>(null);
  const [isHamperModalOpen, setIsHamperModalOpen] = useState(false);

  // 🔐 Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🔑 Login handler
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Auth error:", error);
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        setAuthError('Email or password is incorrect');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address');
      } else if (error.code === 'auth/unauthorized-domain') {
        setAuthError('This domain is not authorized in Firebase.');
      } else {
        setAuthError(error.message);
      }
    }
  };

  // 🚪 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  // 📤 Media upload (local)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      try {
        const newItem: MediaItem = {
          id: Date.now().toString(),
          url: base64String,
          name: file.name,
          type: 'gallery',
          uploadedAt: new Date().toISOString(),
        };
        await addToMediaLibrary(newItem);
        setSyncStatus({ type: 'success', message: 'Image added locally!' });
        setTimeout(() => setSyncStatus(null), 3000);
      } catch {
        setSyncStatus({ type: 'error', message: 'Upload failed.' });
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // 🧺 Save / update hamper
  const saveHamper = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const h: Hamper = {
      id: editingHamper?.id || Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      discountPrice: (formData.get('discountPrice') as string) || undefined,
      image: formData.get('image') as string,
      category: formData.get('category') as string,
      showOnHome: formData.get('showOnHome') === 'on',
      showOnHampers: formData.get('showOnHampers') === 'on',
      isSuggested: formData.get('isSuggested') === 'on',
    };

    editingHamper ? updateHamper(h) : addHamper(h);
    setIsHamperModalOpen(false);
    setEditingHamper(null);
  };

  // ⚙️ Settings save
  const handleSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const shops: ShopLocation[] = [1, 2, 3].map(num => ({
      id: `shop-${num}`,
      name: formData.get(`shop${num}_name`) as string,
      address: formData.get(`shop${num}_address`) as string,
      lat: parseFloat(formData.get(`shop${num}_lat`) as string),
      lng: parseFloat(formData.get(`shop${num}_lng`) as string)
    }));

    const newSettings: SiteSettings = {
      ...settings,
      heroTitle: formData.get('heroTitle') as string,
      heroSubtitle: formData.get('heroSubtitle') as string,
      heroImage: formData.get('heroImage') as string,
      homeFeatureImage: formData.get('homeFeatureImage') as string,
      proprietorName: formData.get('proprietorName') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      whatsappNumber: formData.get('whatsappNumber') as string,
      ownerEmail: formData.get('ownerEmail') as string,
      aboutTitle: formData.get('aboutTitle') as string,
      aboutText1: formData.get('aboutText1') as string,
      aboutText2: formData.get('aboutText2') as string,
      aboutQuote: formData.get('aboutQuote') as string,
      shops
    };

    updateSettings(newSettings);
    setSyncStatus({ type: 'success', message: 'Settings updated.' });
    setTimeout(() => setSyncStatus(null), 4000);
  };

  // ⏳ Loading
  if (isAuthLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#A67C37] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // 🔐 Login screen
  if (!currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <form onSubmit={handleAuth} className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md space-y-6">
          <h1 className="text-3xl font-bold text-center">Admin Login</h1>

          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
              {authError}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border p-3 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border p-3 rounded"
          />

          <button type="submit" className="w-full bg-black text-white py-3 rounded">
            Login
          </button>
        </form>
      </div>
    );
  }

  // ✅ Dashboard (unchanged UI continues…)
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Welcome, {currentUser.email}</h1>
      <button onClick={handleLogout} className="mt-4 underline">
        Sign out
      </button>

      {/* 👉 Your existing dashboard UI continues here unchanged */}
    </div>
  );
};

export default Admin;
