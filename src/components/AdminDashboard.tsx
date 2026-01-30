import React, { useState, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { useStore } from '../context/StoreContext';
import { Hamper, SiteSettings, MediaItem, Occasion } from '../types';
import { auth } from '../services/firebase';

const AdminDashboard: React.FC = () => {
  const { 
    hampers, occasions, settings, mediaLibrary,
    updateSettings, addHamper, updateHamper, deleteHamper,
    addOccasion, updateOccasion, deleteOccasion,
    addToMediaLibrary, removeFromMediaLibrary
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'hampers' | 'occasions' | 'shops' | 'site' | 'media'>('hampers');
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingHamper, setEditingHamper] = useState<Hamper | null>(null);
  const [isHamperModalOpen, setIsHamperModalOpen] = useState(false);

  const [editingOccasion, setEditingOccasion] = useState<Occasion | null>(null);
  const [isOccasionModalOpen, setIsOccasionModalOpen] = useState(false);

  const handleLogout = () => signOut(auth);

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
    setSyncStatus({ type: 'success', message: 'Hamper saved locally' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const saveOccasion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const o: Occasion = {
      id: editingOccasion?.id || `occ-${Date.now()}`,
      title: formData.get('title') as string,
      image: formData.get('image') as string,
    };
    editingOccasion ? updateOccasion(o) : addOccasion(o);
    setIsOccasionModalOpen(false);
    setEditingOccasion(null);
    setSyncStatus({ type: 'success', message: 'Occasion updated' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
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
    };
    updateSettings(newSettings);
    setSyncStatus({ type: 'success', message: 'Global site content updated' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 pb-32">
      {syncStatus && (
        <div className="fixed top-24 right-6 z-[200] bg-[#3D2B1F] text-white px-8 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-right-4 border border-[#A67C37]">
          <div className="flex items-center space-x-3">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="font-bold text-sm tracking-wide">{syncStatus.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl serif text-[#3D2B1F]">Owner's Management Suite</h1>
            <p className="text-[#8B735B] italic mt-1">Curate your digital boutique and blessings</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="px-8 py-2.5 bg-[#F7F3EC] text-[#3D2B1F] rounded-full text-sm font-bold border border-[#E8DFD0] hover:bg-white transition-all shadow-sm"
          >
            Secure Sign Out
          </button>
        </header>

        <nav className="flex space-x-8 border-b border-[#E8DFD0] mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {['hampers', 'occasions', 'shops', 'site', 'media'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-2 font-medium tracking-wide transition-all capitalize ${activeTab === tab ? 'text-[#3D2B1F] border-b-2 border-[#3D2B1F]' : 'text-[#8B735B]'}`}
            >
              {tab === 'site' ? 'Hero & Content' : tab}
            </button>
          ))}
        </nav>

        {/* Hampers Management */}
        {activeTab === 'hampers' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl serif text-[#3D2B1F]">Product Collections</h2>
              <button 
                onClick={() => { setEditingHamper(null); setIsHamperModalOpen(true); }} 
                className="bg-[#3D2B1F] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#A67C37] shadow-lg transition-all"
              >
                + Create New Hamper
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {hampers.map(h => (
                <div key={h.id} className="bg-white border border-[#E8DFD0] rounded-3xl overflow-hidden p-5 flex flex-col group shadow-sm hover:shadow-xl transition-all">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-[#F7F3EC]">
                    <img src={h.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={h.name} />
                  </div>
                  <h3 className="font-bold text-[#3D2B1F] text-lg mb-1">{h.name}</h3>
                  <p className="text-[#A67C37] text-sm font-bold mb-4">₹ {h.price}</p>
                  <div className="flex space-x-2 mt-auto">
                    <button onClick={() => { setEditingHamper(h); setIsHamperModalOpen(true); }} className="flex-grow py-2.5 bg-[#F7F3EC] text-[#3D2B1F] text-xs font-bold rounded-xl hover:bg-[#E8DFD0] transition-colors">Edit Details</button>
                    <button onClick={() => { if(confirm('Remove this hamper?')) deleteHamper(h.id); }} className="py-2.5 px-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Occasions Management */}
        {activeTab === 'occasions' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl serif text-[#3D2B1F]">Blessing Occasions</h2>
              <button 
                onClick={() => { setEditingOccasion(null); setIsOccasionModalOpen(true); }} 
                className="bg-[#3D2B1F] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#A67C37] shadow-lg"
              >
                + Add Occasion Category
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {occasions.map(o => (
                <div key={o.id} className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden p-4 flex flex-col group shadow-sm">
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-[#F7F3EC]"><img src={o.image} className="w-full h-full object-cover" alt={o.title} /></div>
                  <h3 className="font-bold text-[#3D2B1F] text-center mb-4">{o.title}</h3>
                  <div className="flex space-x-2 mt-auto">
                    <button onClick={() => { setEditingOccasion(o); setIsOccasionModalOpen(true); }} className="flex-grow py-2 bg-[#F7F3EC] text-[#3D2B1F] text-[10px] font-bold rounded-lg">Edit</button>
                    <button onClick={() => { if(confirm('Delete?')) deleteOccasion(o.id); }} className="py-2 px-3 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Site Content Management */}
        {activeTab === 'site' && (
          <form onSubmit={handleSettingsSubmit} className="animate-in fade-in duration-500 bg-white p-10 rounded-3xl border border-[#E8DFD0] space-y-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#A67C37] border-b pb-3">Landing Experience (Hero)</h3>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8B735B] mb-2">Main Title</label>
                  <input name="heroTitle" defaultValue={settings.heroTitle} className="w-full border p-3 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8B735B] mb-2">Sub-headline</label>
                  <input name="heroSubtitle" defaultValue={settings.heroSubtitle} className="w-full border p-3 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8B735B] mb-2">Background Image URL</label>
                  <input name="heroImage" defaultValue={settings.heroImage} className="w-full border p-3 rounded-xl text-xs font-mono" />
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#A67C37] border-b pb-3">Brand Story (About)</h3>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8B735B] mb-2">Feature Image URL</label>
                  <input name="homeFeatureImage" defaultValue={settings.homeFeatureImage} className="w-full border p-3 rounded-xl text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8B735B] mb-2">Philosophy Quote</label>
                  <input name="aboutQuote" defaultValue={settings.aboutQuote} className="w-full border p-3 rounded-xl text-sm italic" />
                </div>
              </div>
              <div className="col-span-full space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#A67C37] border-b pb-3">Detailed Narratives</h3>
                <textarea name="aboutText1" defaultValue={settings.aboutText1} className="w-full border p-4 rounded-xl text-sm h-32 leading-relaxed" placeholder="Primary Story Text" />
                <textarea name="aboutText2" defaultValue={settings.aboutText2} className="w-full border p-4 rounded-xl text-sm h-32 leading-relaxed" placeholder="Secondary Story Text" />
              </div>
            </div>
            <div className="flex justify-end">
               <button type="submit" className="bg-[#3D2B1F] text-white px-12 py-4 rounded-full font-bold shadow-xl hover:bg-[#A67C37] transition-all">Publish Content Changes</button>
            </div>
          </form>
        )}

        {/* Media Management */}
        {activeTab === 'media' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-[#E8DFD0] text-center space-y-6">
              <div className="w-20 h-20 bg-[#F7F3EC] rounded-full flex items-center justify-center mx-auto text-[#A67C37]">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={isUploading} 
                className="bg-[#3D2B1F] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#A67C37] shadow-lg transition-all"
              >
                {isUploading ? 'Uploading Local Asset...' : 'Upload New Asset'}
              </button>
              <p className="text-xs text-[#8B735B] uppercase tracking-widest font-bold">Storage for custom hamper photography</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mediaLibrary.map(item => (
                <div key={item.id} className="group relative bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-sm aspect-square">
                  <img src={item.url} className="w-full h-full object-cover" alt={item.name} />
                  <div className="absolute inset-0 bg-[#3D2B1F]/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-4 transition-all">
                    <p className="text-[9px] text-white uppercase tracking-widest font-bold mb-3 text-center truncate w-full">{item.name}</p>
                    <button onClick={() => { if(confirm('Permanently delete asset?')) removeFromMediaLibrary(item.id); }} className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold shadow-lg">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reusable Modals */}
      {isHamperModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 my-10 animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl serif text-[#3D2B1F]">{editingHamper ? 'Edit Hamper' : 'New Creation'}</h2>
              <button onClick={() => setIsHamperModalOpen(false)} className="text-[#8B735B] hover:text-[#3D2B1F]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            <form onSubmit={saveHamper} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-[10px] uppercase font-bold text-[#A67C37] mb-2">Display Name</label><input name="name" defaultValue={editingHamper?.name} required placeholder="e.g. Royal Kashmiri Trunk" className="w-full border p-3 rounded-xl" /></div>
                <div><label className="block text-[10px] uppercase font-bold text-[#A67C37] mb-2">Starting Price (₹)</label><input name="price" defaultValue={editingHamper?.price} required placeholder="4500" className="w-full border p-3 rounded-xl" /></div>
                <div><label className="block text-[10px] uppercase font-bold text-[#A67C37] mb-2">Category</label><select name="category" defaultValue={editingHamper?.category || 'Wooden Trunk'} className="w-full border p-3 rounded-xl"><option>Wooden Trunk</option><option>Festival Special</option><option>Custom Blessing</option></select></div>
                <div><label className="block text-[10px] uppercase font-bold text-[#A67C37] mb-2">Image URL</label><input name="image" defaultValue={editingHamper?.image} required placeholder="Direct link to image" className="w-full border p-3 rounded-xl" /></div>
                <div className="col-span-full"><label className="block text-[10px] uppercase font-bold text-[#A67C37] mb-2">Short Narrative</label><textarea name="description" defaultValue={editingHamper?.description} placeholder="Describe the soul of this hamper..." className="w-full border p-4 rounded-xl h-24" /></div>
                <div className="col-span-full flex space-x-6 bg-[#FDFBF7] p-5 rounded-2xl border border-[#F7F3EC]">
                  <label className="flex items-center space-x-2 text-xs font-bold text-[#6B513E] cursor-pointer"><input type="checkbox" name="showOnHome" defaultChecked={editingHamper?.showOnHome ?? true} className="rounded border-[#E8DFD0] text-[#A67C37] focus:ring-[#A67C37]" /> <span>Landing Page</span></label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-[#6B513E] cursor-pointer"><input type="checkbox" name="showOnHampers" defaultChecked={editingHamper?.showOnHampers ?? true} className="rounded border-[#E8DFD0] text-[#A67C37] focus:ring-[#A67C37]" /> <span>Gallery View</span></label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-[#6B513E] cursor-pointer"><input type="checkbox" name="isSuggested" defaultChecked={editingHamper?.isSuggested ?? false} className="rounded border-[#E8DFD0] text-[#A67C37] focus:ring-[#A67C37]" /> <span>Highlight</span></label>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#3D2B1F] text-white py-5 rounded-full font-bold hover:bg-[#A67C37] shadow-xl transition-all">Commit Changes</button>
            </form>
          </div>
        </div>
      )}

      {isOccasionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl serif text-[#3D2B1F]">{editingOccasion ? 'Edit Occasion' : 'New Occasion'}</h2><button onClick={() => setIsOccasionModalOpen(false)} className="text-[#8B735B]">×</button></div>
            <form onSubmit={saveOccasion} className="space-y-6">
              <div><label className="block text-[10px] uppercase font-bold text-[#A67C37] mb-2">Category Title</label><input name="title" defaultValue={editingOccasion?.title} required placeholder="e.g. Grand Weddings" className="w-full border p-3 rounded-xl" /></div>
              <div><label className="block text-[10px] uppercase font-bold text-[#A67C37] mb-2">Visual Image URL</label><input name="image" defaultValue={editingOccasion?.image} required placeholder="Direct link to image" className="w-full border p-3 rounded-xl" /></div>
              <button type="submit" className="w-full bg-[#3D2B1F] text-white py-4 rounded-full font-bold shadow-lg">Save Category</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;