
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Hamper, SiteSettings, Occasion } from '../types';

const Admin: React.FC = () => {
  const { hampers, occasions, settings, updateHampers, updateOccasions, updateSettings } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'hampers' | 'occasions' | 'settings'>('hampers');
  
  const [editingHamper, setEditingHamper] = useState<Hamper | null>(null);
  const [isHamperModalOpen, setIsHamperModalOpen] = useState(false);

  const [editingOccasion, setEditingOccasion] = useState<Occasion | null>(null);
  const [isOccasionModalOpen, setIsOccasionModalOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'AzharMajeed' && password === 'TheBlessingTrunk@90') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSettings: SiteSettings = {
      ...settings,
      phoneNumber: formData.get('phoneNumber') as string,
      whatsappNumber: formData.get('whatsappNumber') as string,
      proprietorName: formData.get('proprietorName') as string,
      instagramUrl: formData.get('instagramUrl') as string,
      facebookUrl: formData.get('facebookUrl') as string,
      heroTitle: formData.get('heroTitle') as string,
      heroSubtitle: formData.get('heroSubtitle') as string,
      heroImage: formData.get('heroImage') as string,
      aboutText1: formData.get('aboutText1') as string,
      aboutQuote: formData.get('aboutQuote') as string,
    };
    updateSettings(newSettings);
    alert('Settings saved successfully!');
  };

  const handleSaveHamper = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const hamperData: Hamper = {
      id: editingHamper?.id || Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      image: formData.get('image') as string,
      category: formData.get('category') as string,
      showOnHome: formData.get('showOnHome') === 'on',
      showOnHampers: formData.get('showOnHampers') === 'on',
      isSuggested: formData.get('isSuggested') === 'on',
    };

    if (editingHamper) {
      updateHampers(hampers.map(h => h.id === editingHamper.id ? hamperData : h));
    } else {
      updateHampers([...hampers, hamperData]);
    }
    setIsHamperModalOpen(false);
    setEditingHamper(null);
  };

  const handleSaveOccasion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const occasionData: Occasion = {
      id: editingOccasion?.id || Date.now().toString(),
      title: formData.get('title') as string,
      image: formData.get('image') as string,
    };

    if (editingOccasion) {
      updateOccasions(occasions.map(o => o.id === editingOccasion.id ? occasionData : o));
    } else {
      updateOccasions([...occasions, occasionData]);
    }
    setIsOccasionModalOpen(false);
    setEditingOccasion(null);
  };

  const deleteHamper = (id: string) => {
    if (window.confirm('Are you sure you want to delete this hamper?')) {
      updateHampers(hampers.filter(h => h.id !== id));
    }
  };

  const deleteOccasion = (id: string) => {
    if (window.confirm('Are you sure you want to delete this occasion?')) {
      updateOccasions(occasions.filter(o => o.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7] p-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-[#E8DFD0] w-full max-w-md">
          <h1 className="text-3xl serif text-[#3D2B1F] mb-8 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8B735B] mb-2 font-bold">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-b-2 border-[#E8DFD0] py-2 focus:outline-none focus:border-[#A67C37] bg-transparent"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8B735B] mb-2 font-bold">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b-2 border-[#E8DFD0] py-2 focus:outline-none focus:border-[#A67C37] bg-transparent"
                placeholder="Enter password"
              />
            </div>
            <button type="submit" className="w-full bg-[#3D2B1F] text-white py-3 rounded-full hover:bg-[#A67C37] transition-all font-semibold shadow-lg">
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl serif text-[#3D2B1F]">Owner's Dashboard</h1>
            <p className="text-[#8B735B] italic">Manage your blessings and trunk details</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm text-[#A67C37] hover:underline">Logout</button>
        </div>

        <div className="flex space-x-8 border-b border-[#E8DFD0] mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button 
            onClick={() => setActiveTab('hampers')}
            className={`pb-4 px-2 font-medium tracking-wide transition-all ${activeTab === 'hampers' ? 'text-[#3D2B1F] border-b-2 border-[#3D2B1F]' : 'text-[#8B735B]'}`}
          >
            Hampers & Products
          </button>
          <button 
            onClick={() => setActiveTab('occasions')}
            className={`pb-4 px-2 font-medium tracking-wide transition-all ${activeTab === 'occasions' ? 'text-[#3D2B1F] border-b-2 border-[#3D2B1F]' : 'text-[#8B735B]'}`}
          >
            Occasions Section
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-2 font-medium tracking-wide transition-all ${activeTab === 'settings' ? 'text-[#3D2B1F] border-b-2 border-[#3D2B1F]' : 'text-[#8B735B]'}`}
          >
            Site Content & Info
          </button>
        </div>

        {activeTab === 'hampers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl serif text-[#3D2B1F]">Product List</h2>
              <button 
                onClick={() => { setEditingHamper(null); setIsHamperModalOpen(true); }}
                className="bg-[#A67C37] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#8B672E] transition-all shadow-md"
              >
                + Add New Hamper
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hampers.map(h => (
                <div key={h.id} className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-48 overflow-hidden">
                    <img src={h.image} className="w-full h-full object-cover" alt={h.name} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg serif text-[#3D2B1F] mb-1">{h.name}</h3>
                    <p className="text-[#A67C37] font-bold mb-4">₹ {h.price}</p>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => { setEditingHamper(h); setIsHamperModalOpen(true); }}
                        className="flex-grow bg-[#F7F3EC] text-[#3D2B1F] py-2 rounded-lg text-sm font-medium hover:bg-[#E8DFD0] transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteHamper(h.id)}
                        className="bg-[#FDFBF7] text-red-600 border border-red-100 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'occasions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl serif text-[#3D2B1F]">Home Occasions</h2>
              <button 
                onClick={() => { setEditingOccasion(null); setIsOccasionModalOpen(true); }}
                className="bg-[#A67C37] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#8B672E] transition-all shadow-md"
              >
                + Add New Occasion
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {occasions.map(o => (
                <div key={o.id} className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-sm">
                  <div className="aspect-square overflow-hidden">
                    <img src={o.image} className="w-full h-full object-cover" alt={o.title} />
                  </div>
                  <div className="p-4">
                    <h3 className="text-md serif text-[#3D2B1F] mb-4 truncate">{o.title}</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => { setEditingOccasion(o); setIsOccasionModalOpen(true); }}
                        className="flex-grow bg-[#F7F3EC] text-[#3D2B1F] py-1.5 rounded-lg text-xs font-medium hover:bg-[#E8DFD0] transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteOccasion(o.id)}
                        className="bg-[#FDFBF7] text-red-600 border border-red-100 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white p-8 md:p-12 rounded-3xl border border-[#E8DFD0] shadow-sm max-w-4xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest text-[#A67C37] font-bold border-b border-[#F7F3EC] pb-2">Contact Details</h3>
                <div>
                  <label className="block text-xs font-bold text-[#8B735B] mb-2">Display Phone Number</label>
                  <input name="phoneNumber" defaultValue={settings.phoneNumber} className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B735B] mb-2">WhatsApp Number (Pure Digits)</label>
                  <input name="whatsappNumber" defaultValue={settings.whatsappNumber} className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B735B] mb-2">Proprietor Name</label>
                  <input name="proprietorName" defaultValue={settings.proprietorName} className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest text-[#A67C37] font-bold border-b border-[#F7F3EC] pb-2">Social Media</h3>
                <div>
                  <label className="block text-xs font-bold text-[#8B735B] mb-2">Instagram URL</label>
                  <input name="instagramUrl" defaultValue={settings.instagramUrl} className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B735B] mb-2">Facebook URL</label>
                  <input name="facebookUrl" defaultValue={settings.facebookUrl} className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm uppercase tracking-widest text-[#A67C37] font-bold border-b border-[#F7F3EC] pb-2">Homepage & Brand</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-[#8B735B] mb-2">Hero Title</label>
                  <input name="heroTitle" defaultValue={settings.heroTitle} className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B735B] mb-2">Hero Subtitle</label>
                  <input name="heroSubtitle" defaultValue={settings.heroSubtitle} className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B735B] mb-2">Hero Image URL</label>
                <input name="heroImage" defaultValue={settings.heroImage} className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B735B] mb-2">About Section Text</label>
                <textarea name="aboutText1" defaultValue={settings.aboutText1} className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2 h-24" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B735B] mb-2">Brand Quote</label>
                <input name="aboutQuote" defaultValue={settings.aboutQuote} className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button type="submit" className="bg-[#3D2B1F] text-white px-10 py-3 rounded-full hover:bg-[#A67C37] transition-all font-semibold shadow-lg">
                Save All Site Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {isHamperModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl serif text-[#3D2B1F]">{editingHamper ? 'Edit Hamper' : 'Add New Hamper'}</h2>
              <button onClick={() => { setIsHamperModalOpen(false); setEditingHamper(null); }} className="text-[#8B735B] hover:text-[#3D2B1F]">✕</button>
            </div>
            <form onSubmit={handleSaveHamper} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#8B735B] mb-2">Hamper Name</label>
                  <input name="name" defaultValue={editingHamper?.name} required className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B735B] mb-2">Price (e.g. 4,500)</label>
                  <input name="price" defaultValue={editingHamper?.price} required className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B735B] mb-2">Image URL</label>
                <input name="image" defaultValue={editingHamper?.image} required className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B735B] mb-2">Description</label>
                <textarea name="description" defaultValue={editingHamper?.description} className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2 h-20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B735B] mb-2">Category</label>
                <select name="category" defaultValue={editingHamper?.category} className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2">
                  <option value="Wooden Trunk">Wooden Trunk</option>
                  <option value="Festival Special">Festival Special</option>
                  <option value="Keepsake Box">Keepsake Box</option>
                  <option value="Custom Blessing">Custom Blessing</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" name="showOnHome" defaultChecked={editingHamper?.showOnHome ?? true} className="accent-[#A67C37]" />
                  <span className="text-sm text-[#4A3728]">Show on Home</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" name="showOnHampers" defaultChecked={editingHamper?.showOnHampers ?? true} className="accent-[#A67C37]" />
                  <span className="text-sm text-[#4A3728]">Show on Hampers Page</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" name="isSuggested" defaultChecked={editingHamper?.isSuggested ?? false} className="accent-[#A67C37]" />
                  <span className="text-sm text-[#4A3728]">Suggested (Order Page)</span>
                </label>
              </div>
              <div className="pt-6 border-t border-[#F7F3EC] flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={() => { setIsHamperModalOpen(false); setEditingHamper(null); }}
                  className="px-6 py-2 text-[#8B735B] hover:text-[#3D2B1F]"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#3D2B1F] text-white px-10 py-2 rounded-full hover:bg-[#A67C37] transition-all font-semibold">
                  Save Hamper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isOccasionModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl serif text-[#3D2B1F]">{editingOccasion ? 'Edit Occasion' : 'Add New Occasion'}</h2>
              <button onClick={() => { setIsOccasionModalOpen(false); setEditingOccasion(null); }} className="text-[#8B735B] hover:text-[#3D2B1F]">✕</button>
            </div>
            <form onSubmit={handleSaveOccasion} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#8B735B] mb-2">Occasion Title</label>
                <input name="title" defaultValue={editingOccasion?.title} required className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B735B] mb-2">Image URL</label>
                <input name="image" defaultValue={editingOccasion?.image} required className="w-full border border-[#E8DFD0] rounded-lg px-4 py-2" />
              </div>
              <div className="pt-6 border-t border-[#F7F3EC] flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={() => { setIsOccasionModalOpen(false); setEditingOccasion(null); }}
                  className="px-6 py-2 text-[#8B735B] hover:text-[#3D2B1F]"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#3D2B1F] text-white px-10 py-2 rounded-full hover:bg-[#A67C37] transition-all font-semibold">
                  Save Occasion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
