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

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setAuthError('Email or password is incorrect');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#A67C37] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <form
          onSubmit={handleAuth}
          className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md space-y-6"
        >
          <h1 className="text-3xl font-bold text-center">Admin Login</h1>

          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded">
              {authError}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-3 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-3 rounded"
          />

          <button className="w-full bg-black text-white py-3 rounded">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="italic mb-6">Logged in as {currentUser.email}</p>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Sign out
      </button>
    </div>
  );
};

export default Admin;
