
import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Hamper, SiteSettings, Occasion, MediaItem } from '../types';

const Admin: React.FC = () => {
  const { 
    hampers, occasions, settings, mediaLibrary, isLoading,
    updateSettings, addHamper, updateHamper, deleteHamper,
    addOccasion, updateOccasion, deleteOccasion,
    addToMediaLibrary, removeFromMediaLibrary, syncToCloud, fetchFromCloud
  } = useStore();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'hampers' | 'occasions' | 'media' | 'settings'>('hampers');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editing States
  const [editingHamper, setEditingHamper] = useState<Hamper | null>(null);
  const [isHamperModalOpen, setIsHamperModalOpen] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState<Occasion | null>(null);
  const [isOccasionModalOpen, setIsOccasionModalOpen] = useState(false);

  // Image Picker Logic
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [pickerCallback, setPickerCallback] = useState<(url: string) => void>(() => {});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'AzharMajeed' && password === 'TheBlessingTrunk@90') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const openImagePicker = (callback: (url: string) => void) => {
    setPickerCallback(() => callback);
    setIsImagePickerOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      const base64Data = base64String.split(',')[1];
      
      try {
        const newItem: MediaItem = {
          id: Date.now().toString(),
          url: base64String,
          name: file.name,
          type: 'gallery',
          uploadedAt: new Date().toISOString(),
        };
        await addToMediaLibrary(newItem);
        
        if (settings.gasEndpoint) {
          await fetch(settings.gasEndpoint, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
              action: 'upload',
              data: { filename: file.name, mimeType: file.type, base64: base64Data }
            })
          });
        }
      } catch (error) {
        console.error('Upload error:', error);
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

  const saveOccasion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const o: Occasion = {
      id: editingOccasion?.id || Date.now().toString(),
      title: formData.get('title') as string,
      image: formData.get('image') as string,
    };

    if (editingOccasion) updateOccasion(o);
    else addOccasion(o);
    
    setIsOccasionModalOpen(false);
    setEditingOccasion(null);
  };

  const handleSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSettings: SiteSettings = {
      ...settings,
      heroTitle: formData.get('heroTitle') as string,
      heroSubtitle: formData.get('heroSubtitle') as string,
      heroImage: formData.get('heroImage') as string,
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
    alert('Settings updated locally. Use "Publish Changes" to save permanently.');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7] p-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-[#E8DFD0] w-full max-w-md">
          <h1 className="text-3xl serif text-[#3D2B1F] mb-8 text-center font-bold">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-b-2 border-[#E8DFD0] py-2 focus:outline-none focus:border-[#A67C37] bg-transparent text-[#3D2B1F]"
              placeholder="Username"
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-[#E8DFD0] py-2 focus:outline-none focus:border-[#A67C37] bg-transparent text-[#3D2B1F]"
              placeholder="Password"
            />
            <button type="submit" className="w-full bg-[#3D2B1F] text-white py-3 rounded-full hover:bg-[#A67C37] transition-all font-semibold shadow-lg">
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 pb-32">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl serif text-[#3D2B1F]">Owner's Dashboard</h1>
            <p className="text-[#8B735B] italic">Using IndexedDB for high-res image persistence</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={fetchFromCloud}
              className="px-6 py-2 border-2 border-[#A67C37] text-[#A67C37] rounded-full text-sm font-bold hover:bg-[#A67C37] hover:text-white transition-all"
            >
              Fetch from Cloud
            </button>
            <button 
              onClick={syncToCloud}
              className="bg-[#3D2B1F] text-white px-8 py-2 rounded-full text-sm font-bold hover:bg-[#A67C37] transition-all shadow-lg"
            >
              Publish Changes
            </button>
          </div>
        </header>

        {isLoading && (
          <div className="bg-[#F7F3EC] p-4 text-center rounded-xl mb-8 animate-pulse text-[#3D2B1F] font-bold">
            Synchronizing data with database...
          </div>
        )}

        <div className="flex space-x-8 border-b border-[#E8DFD0] mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {['hampers', 'occasions', 'media', 'settings'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-2 font-medium tracking-wide transition-all capitalize ${activeTab === tab ? 'text-[#3D2B1F] border-b-2 border-[#3D2B1F]' : 'text-[#8B735B]'}`}
            >
              {tab === 'media' ? 'Media Library' : tab}
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
                    {h.discountPrice && <span className="text-red-500 text-[10px] line-through">₹ {h.discountPrice}</span>}
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

        {/* Media Library Tab */}
        {activeTab === 'media' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="bg-white p-10 rounded-3xl border border-[#E8DFD0] shadow-sm flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-[#F7F3EC] rounded-full flex items-center justify-center text-[#A67C37] mb-2">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <h3 className="text-2xl serif text-[#3D2B1F]">Upload High-Res Assets</h3>
                <p className="text-sm text-[#8B735B] mt-2 italic">Stored in high-capacity browser database and synced to cloud.</p>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-[#3D2B1F] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#A67C37] shadow-lg disabled:opacity-50 flex items-center space-x-3"
              >
                {isUploading ? 'Uploading...' : 'Select File'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {mediaLibrary.map(item => (
                <div key={item.id} className="group relative bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-64">
                  <img src={item.url} className="w-full h-full object-cover" alt={item.name} />
                  <div className="absolute inset-0 bg-[#3D2B1F]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 space-y-3">
                    <button onClick={() => { navigator.clipboard.writeText(item.url); alert('URL copied!'); }} className="w-full bg-white text-[#3D2B1F] py-2 text-[11px] uppercase tracking-widest font-bold rounded-lg">Copy URL</button>
                    <button onClick={() => removeFromMediaLibrary(item.id)} className="w-full bg-red-600 text-white py-2 text-[11px] uppercase tracking-widest font-bold rounded-lg">Delete</button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-3 truncate text-[10px] font-bold">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Occasions Tab */}
        {activeTab === 'occasions' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl serif text-[#3D2B1F]">Manage Occasions</h2>
              <button onClick={() => { setEditingOccasion(null); setIsOccasionModalOpen(true); }} className="bg-[#3D2B1F] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#A67C37] transition-all">+ Add New Occasion</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {occasions.map(o => (
                <div key={o.id} className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden p-4 shadow-sm group">
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-[#F7F3EC]">
                    <img src={o.image} className="w-full h-full object-cover" alt={o.title} />
                  </div>
                  <h3 className="font-bold text-[#3D2B1F] text-center mb-4">{o.title}</h3>
                  <div className="flex space-x-2">
                    <button onClick={() => { setEditingOccasion(o); setIsOccasionModalOpen(true); }} className="flex-grow py-2 bg-[#F7F3EC] text-[#3D2B1F] text-xs font-bold rounded-lg">Edit</button>
                    <button onClick={() => { if(confirm('Delete this occasion?')) deleteOccasion(o.id); }} className="p-2 bg-red-50 text-red-600 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-500">
            <form onSubmit={handleSettingsSubmit} className="bg-white p-10 rounded-3xl border border-[#E8DFD0] space-y-12 max-w-5xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-[#A67C37] font-bold border-b border-[#F7F3EC] pb-3">Hero Content</h3>
                  <div><label className="block text-xs font-bold text-[#8B735B] mb-2 uppercase">Hero Title</label><input name="heroTitle" defaultValue={settings.heroTitle} className="w-full border border-[#E8DFD0] rounded-xl px-4 py-3 text-sm focus:border-[#A67C37] outline-none" /></div>
                  <div><label className="block text-xs font-bold text-[#8B735B] mb-2 uppercase">Hero Subtitle</label><input name="heroSubtitle" defaultValue={settings.heroSubtitle} className="w-full border border-[#E8DFD0] rounded-xl px-4 py-3 text-sm focus:border-[#A67C37] outline-none" /></div>
                  <div>
                    <label className="block text-xs font-bold text-[#8B735B] mb-2 uppercase">Hero Image URL</label>
                    <div className="flex gap-2"><input id="settings-heroImage" name="heroImage" defaultValue={settings.heroImage} className="flex-grow border border-[#E8DFD0] rounded-xl px-4 py-3 text-xs focus:border-[#A67C37] outline-none" /><button type="button" onClick={() => openImagePicker((url) => { const el = document.getElementById('settings-heroImage') as HTMLInputElement; if (el) el.value = url; })} className="px-4 bg-[#F7F3EC] rounded-xl hover:bg-[#E8DFD0] text-[#3D2B1F]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-[#A67C37] font-bold border-b border-[#F7F3EC] pb-3">Contact Information</h3>
                  <div><label className="block text-xs font-bold text-[#8B735B] mb-2 uppercase">Proprietor Name</label><input name="proprietorName" defaultValue={settings.proprietorName} className="w-full border border-[#E8DFD0] rounded-xl px-4 py-3 text-sm" /></div>
                  <div><label className="block text-xs font-bold text-[#8B735B] mb-2 uppercase">Public Phone</label><input name="phoneNumber" defaultValue={settings.phoneNumber} className="w-full border border-[#E8DFD0] rounded-xl px-4 py-3 text-sm" /></div>
                  <div><label className="block text-xs font-bold text-[#8B735B] mb-2 uppercase">WhatsApp Number</label><input name="whatsappNumber" defaultValue={settings.whatsappNumber} className="w-full border border-[#E8DFD0] rounded-xl px-4 py-3 text-sm" /></div>
                  <div><label className="block text-xs font-bold text-[#8B735B] mb-2 uppercase">Business Email</label><input name="ownerEmail" defaultValue={settings.ownerEmail} className="w-full border border-[#E8DFD0] rounded-xl px-4 py-3 text-sm" /></div>
                </div>
              </div>
              <div className="flex justify-end pt-8"><button type="submit" className="bg-[#3D2B1F] text-white px-12 py-4 rounded-full font-bold shadow-xl hover:bg-[#A67C37] transition-all">Save All Settings Locally</button></div>
            </form>
          </div>
        )}
      </div>

      {/* Shared Modals */}
      {isImagePickerOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
          <div className="bg-[#FDFBF7] w-full max-w-4xl max-h-[80vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 bg-[#3D2B1F] text-white flex justify-between items-center"><h3 className="serif text-xl italic">Select from Media Library</h3><button onClick={() => setIsImagePickerOpen(false)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div>
            <div className="flex-grow overflow-y-auto p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {mediaLibrary.map(item => (
                <button key={item.id} onClick={() => { pickerCallback(item.url); setIsImagePickerOpen(false); }} className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#A67C37] transition-all relative group">
                  <img src={item.url} className="w-full h-full object-cover" alt={item.name} /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><span className="text-white font-bold text-xs uppercase tracking-widest">Select</span></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isHamperModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-8 my-10 animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-8"><h2 className="text-3xl serif text-[#3D2B1F]">{editingHamper ? 'Edit Hamper' : 'New Hamper'}</h2><button onClick={() => setIsHamperModalOpen(false)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div>
            <form onSubmit={saveHamper} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-xs font-bold text-[#8B735B] mb-2">Name</label><input name="name" defaultValue={editingHamper?.name} required className="w-full border border-[#E8DFD0] rounded-xl px-4 py-2" /></div>
                <div><label className="block text-xs font-bold text-[#8B735B] mb-2">Current Price</label><input name="price" defaultValue={editingHamper?.price} required className="w-full border border-[#E8DFD0] rounded-xl px-4 py-2" /></div>
                <div><label className="block text-xs font-bold text-[#8B735B] mb-2">Discount Price</label><input name="discountPrice" defaultValue={editingHamper?.discountPrice} className="w-full border border-[#E8DFD0] rounded-xl px-4 py-2" /></div>
                <div><label className="block text-xs font-bold text-[#8B735B] mb-2">Category</label><select name="category" defaultValue={editingHamper?.category} className="w-full border border-[#E8DFD0] rounded-xl px-4 py-2"><option>Wooden Trunk</option><option>Festival Special</option><option>Keepsake Box</option><option>Custom Blessing</option></select></div>
                <div className="col-span-full"><label className="block text-xs font-bold text-[#8B735B] mb-2">Image URL</label><div className="flex gap-2"><input id="hamper-image" name="image" defaultValue={editingHamper?.image} required className="flex-grow border border-[#E8DFD0] rounded-xl px-4 py-2 text-xs" /><button type="button" onClick={() => openImagePicker((url) => { const el = document.getElementById('hamper-image') as HTMLInputElement; if (el) el.value = url; })} className="px-4 bg-[#F7F3EC] rounded-xl hover:bg-[#E8DFD0] text-[#3D2B1F]">Pick</button></div></div>
              </div>
              <div><label className="block text-xs font-bold text-[#8B735B] mb-2">Description</label><textarea name="description" defaultValue={editingHamper?.description} className="w-full border border-[#E8DFD0] rounded-xl px-4 py-2 h-24" /></div>
              <div className="flex flex-wrap gap-6 bg-[#FDFBF7] p-6 rounded-2xl border border-[#F7F3EC]">
                <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="showOnHome" defaultChecked={editingHamper?.showOnHome} className="w-5 h-5" /><span className="text-sm font-semibold">Home</span></label>
                <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="showOnHampers" defaultChecked={editingHamper?.showOnHampers} className="w-5 h-5" /><span className="text-sm font-semibold">Hampers</span></label>
                <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="isSuggested" defaultChecked={editingHamper?.isSuggested} className="w-5 h-5" /><span className="text-sm font-semibold">Suggested</span></label>
              </div>
              <button type="submit" className="w-full bg-[#3D2B1F] text-white py-4 rounded-xl font-bold">Save Hamper</button>
            </form>
          </div>
        </div>
      )}

      {isOccasionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl serif text-[#3D2B1F]">{editingOccasion ? 'Edit Occasion' : 'New Occasion'}</h2><button onClick={() => setIsOccasionModalOpen(false)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div>
            <form onSubmit={saveOccasion} className="space-y-6">
              <div><label className="block text-xs font-bold text-[#8B735B] mb-2">Title</label><input name="title" defaultValue={editingOccasion?.title} required className="w-full border border-[#E8DFD0] rounded-xl px-4 py-2" /></div>
              <div><label className="block text-xs font-bold text-[#8B735B] mb-2">Image URL</label><div className="flex gap-2"><input id="occasion-image" name="image" defaultValue={editingOccasion?.image} required className="flex-grow border border-[#E8DFD0] rounded-xl px-4 py-2 text-xs" /><button type="button" onClick={() => openImagePicker((url) => { const el = document.getElementById('occasion-image') as HTMLInputElement; if (el) el.value = url; })} className="px-4 bg-[#F7F3EC] rounded-xl hover:bg-[#E8DFD0] text-[#3D2B1F]">Pick</button></div></div>
              <button type="submit" className="w-full bg-[#3D2B1F] text-white py-4 rounded-xl font-bold">Save Occasion</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
