import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Hamper, SiteSettings, MediaItem, ShopLocation } from '../types';
import { auth } from '../services/firebase';
import firebase from 'firebase/compat/app';

const Admin: React.FC = () => {
  const { 
    hampers, settings, mediaLibrary,
    updateSettings, addHamper, updateHamper, deleteHamper,
    addToMediaLibrary, removeFromMediaLibrary
  } = useStore();
  
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      console.error("Auth error:", error);
      // Map Firebase errors to user-friendly messages
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError('This domain is not authorized in your Firebase Project.');
      } else if (
        error.code === 'auth/invalid-credential' || 
        error.code === 'auth/wrong-password' || 
        error.code === 'auth/user-not-found'
      ) {
        setAuthError('Email or password is incorrect');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address');
      } else {
        setAuthError(error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error", error);
    }
  };

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
        setSyncStatus({ type: 'success', message: 'Image added to local library!' });
        setTimeout(() => setSyncStatus(null), 3000);
      } catch (error) {
        setSyncStatus({ type: 'error', message: 'Failed to store image locally.' });
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

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
    if (editingHamper) updateHamper(h);
    else addHamper(h);
    setIsHamperModalOpen(false);
    setEditingHamper(null);
  };

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
      shops: shops
    };
    updateSettings(newSettings);
    setSyncStatus({ type: 'success', message: 'Settings applied locally.' });
    setTimeout(() => setSyncStatus(null), 4000);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin h-10 w-10 border-4 border-[#A67C37] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7] p-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-[#E8DFD0] w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl serif text-[#3D2B1F] font-bold">Admin Portal</h1>
            <p className="text-[#8B735B] text-sm mt-2">Sign in to your dashboard</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-6">
            {authError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 animate-in shake duration-300">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#A67C37] mb-2 tracking-widest">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 border-[#E8DFD0] py-2 focus:outline-none focus:border-[#A67C37] bg-transparent text-[#3D2B1F]"
                placeholder="admin@blessingstrunk.com"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#A67C37] mb-2 tracking-widest">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b-2 border-[#E8DFD0] py-2 focus:outline-none focus:border-[#A67C37] bg-transparent text-[#3D2B1F]"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full bg-[#3D2B1F] text-white py-4 rounded-full hover:bg-[#A67C37] transition-all font-semibold shadow-lg">
              Login to Dashboard
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#F7F3EC] pt-6">
            <p className="text-[#8B735B] text-[10px] uppercase tracking-widest font-bold">Authorized Access Only</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 pb-32">
      {syncStatus && (
        <div className={`fixed top-24 right-6 z-[200] px-8 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-right-4 duration-300 flex items-center space-x-4 border ${
          syncStatus.type === 'success' ? 'bg-[#3D2B1F] text-[#FDFBF7] border-[#A67C37]' : 'bg-red-600 text-white border-red-800'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${syncStatus.type === 'success' ? 'bg-green-500' : 'bg-white/20'}`}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm">Action Successful</span>
            <span className="text-xs opacity-80">{syncStatus.message}</span>
          </div>
          <button onClick={() => setSyncStatus(null)} className="opacity-50 hover:opacity-100 ml-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl serif text-[#3D2B1F]">Owner's Dashboard</h1>
            <p className="text-[#8B735B] italic">Welcome back, {currentUser.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-8 py-2.5 bg-[#F7F3EC] text-[#3D2B1F] rounded-full text-sm font-bold border border-[#E8DFD0] hover:bg-white transition-all shadow-sm"
          >
            Sign Out
          </button>
        </header>

        <div className="flex space-x-8 border-b border-[#E8DFD0] mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {['hampers', 'media', 'settings'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-2 font-medium tracking-wide transition-all capitalize ${activeTab === tab ? 'text-[#3D2B1F] border-b-2 border-[#3D2B1F]' : 'text-[#8B735B]'}`}
            >
              {tab === 'media' ? 'Media Gallery' : tab}
            </button>
          ))}
        </div>

        {/* Hampers Tab */}
        {activeTab === 'hampers' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl serif text-[#3D2B1F]">Manage Hampers</h2>
              <button 
                onClick={() => { setEditingHamper(null); setIsHamperModalOpen(true); }}
                className="bg-[#3D2B1F] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#A67C37] transition-all"
              >
                + Add New Hamper
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hampers.map(h => (
                <div key={h.id} className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden p-4 flex flex-col group shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-[#F7F3EC]">
                    <img src={h.image} className="w-full h-full object-cover" alt={h.name} />
                  </div>
                  <h3 className="font-bold text-[#3D2B1F] text-lg">{h.name}</h3>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[#8B735B] text-xs font-semibold">₹ {h.price}</span>
                  </div>
                  <p className="text-[#A67C37] text-[10px] font-bold uppercase tracking-widest">{h.category}</p>
                  <div className="flex space-x-2 mt-auto pt-4">
                    <button onClick={() => { setEditingHamper(h); setIsHamperModalOpen(true); }} className="flex-grow py-2 bg-[#F7F3EC] text-[#3D2B1F] text-xs font-bold rounded-lg hover:bg-[#E8DFD0]">Edit</button>
                    <button onClick={() => { if(confirm('Delete this hamper?')) deleteHamper(h.id); }} className="py-2 px-4 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="bg-white p-10 rounded-3xl border border-[#E8DFD0] shadow-sm flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-[#F7F3EC] rounded-full flex items-center justify-center text-[#A67C37] mb-2">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-[#3D2B1F] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#A67C37] shadow-lg disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Upload New Local Asset'}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {mediaLibrary.map(item => (
                <div key={item.id} className="group relative bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-sm h-64">
                  <img src={item.url} className="w-full h-full object-cover" alt={item.name} />
                  <div className="absolute inset-0 bg-[#3D2B1F]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 space-y-3">
                    <button onClick={() => { if(confirm('Delete permanently?')) removeFromMediaLibrary(item.id); }} className="w-full bg-red-600 text-white py-2 text-[11px] uppercase tracking-widest font-bold rounded-lg">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-500">
            <form onSubmit={handleSettingsSubmit} className="bg-white p-10 rounded-3xl border border-[#E8DFD0] space-y-12 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-[#A67C37] font-bold border-b border-[#F7F3EC] pb-3">Home Page Layout</h3>
                  <div>
                    <label className="block text-xs font-bold text-[#8B735B] mb-2 uppercase">Hero Title</label>
                    <input name="heroTitle" defaultValue={settings.heroTitle} className="w-full border border-[#E8DFD0] rounded-xl px-4 py-3 text-sm focus:border-[#A67C37] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8B735B] mb-2 uppercase">Hero Background</label>
                    <input name="heroImage" defaultValue={settings.heroImage} className="w-full border border-[#E8DFD0] rounded-xl px-4 py-3 text-xs focus:border-[#A67C37] outline-none" />
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-[#A67C37] font-bold border-b border-[#F7F3EC] pb-3">Contact Details</h3>
                  <div><label className="block text-xs font-bold text-[#8B735B] mb-2 uppercase">WhatsApp Number</label><input name="whatsappNumber" defaultValue={settings.whatsappNumber} className="w-full border border-[#E8DFD0] rounded-xl px-4 py-3 text-sm" /></div>
                </div>
              </div>
              <div className="flex justify-end pt-8">
                 <button type="submit" className="bg-[#3D2B1F] text-white px-12 py-4 rounded-full font-bold shadow-xl hover:bg-[#A67C37] transition-all">Apply Settings</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {isHamperModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-8 my-10 animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-8"><h2 className="text-3xl serif text-[#3D2B1F]">{editingHamper ? 'Edit Hamper' : 'New Hamper'}</h2><button onClick={() => setIsHamperModalOpen(false)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div>
            <form onSubmit={saveHamper} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-xs font-bold text-[#8B735B] mb-2">Hamper Name</label><input name="name" defaultValue={editingHamper?.name} required className="w-full border border-[#E8DFD0] rounded-xl px-4 py-2" /></div>
                <div><label className="block text-xs font-bold text-[#8B735B] mb-2">Starting Price</label><input name="price" defaultValue={editingHamper?.price} required className="w-full border border-[#E8DFD0] rounded-xl px-4 py-2" /></div>
                <div><label className="block text-xs font-bold text-[#8B735B] mb-2">Category</label><select name="category" defaultValue={editingHamper?.category || 'Wooden Trunk'} className="w-full border border-[#E8DFD0] rounded-xl px-4 py-2"><option>Wooden Trunk</option><option>Festival Special</option><option>Keepsake Box</option><option>Custom Blessing</option></select></div>
                <div className="col-span-full"><label className="block text-xs font-bold text-[#8B735B] mb-2">Image URL</label><input name="image" defaultValue={editingHamper?.image} required className="w-full border border-[#E8DFD0] rounded-xl px-4 py-2 text-xs" /></div>
              </div>
              <button type="submit" className="w-full bg-[#3D2B1F] text-white py-4 rounded-xl font-bold hover:bg-[#A67C37]">Confirm Hamper Details</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
