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
    hampers, occasions, settings, mediaLibrary,
    updateSettings, addHamper, updateHamper, deleteHamper,
    addOccasion, updateOccasion, deleteOccasion,
    addToMediaLibrary, removeFromMediaLibrary
  } = useStore();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

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

  /* 🔐 Auth listener */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsub();
  }, []);

  /* 🔑 Login */
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setAuthError('Email or password is incorrect');
    }
  };

  /* 🚪 Logout */
  const handleLogout = async () => {
    await signOut(auth);
  };

  /* 📤 Media upload */
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

  /* 🧺 Save Hamper */
  const saveHamper = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const h: Hamper = {
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
    editingHamper ? updateHamper(h) : addHamper(h);
    setIsHamperModalOpen(false);
    setEditingHamper(null);
    setSyncStatus({ type: 'success', message: 'Hamper saved' });
    setTimeout(() => setSy
