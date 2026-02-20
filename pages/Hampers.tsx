
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import OrderModal from '../components/OrderModal';
import { useNavigate } from 'react-router-dom';
import ImageSequencePlayer from '../components/ImageSequencePlayer';

const Hampers: React.FC = () => {
  const { hampers, toggleCart, toggleWishlist, cart, wishlist, settings } = useStore();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [modalState, setModalState] = useState<{ open: boolean; product?: string }>({ open: false });

  const handleAction = (id: string, action: 'cart' | 'wishlist') => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (action === 'cart') toggleCart(id);
    else toggleWishlist(id);
  };

  const categories = Array.from(new Set(hampers.map(h => h.category)));

  return (
    <div className="bg-[#FDFBF7]">
      <OrderModal
        isOpen={modalState.open}
        onClose={() => setModalState({ open: false })}
        productName={modalState.product}
      />

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl serif text-[#3D2B1F] mb-6">Our Collections</h1>
        <p className="text-xl italic serif text-[#6B513E] max-w-2xl mx-auto">Premium dry fruit blessings from the heart of Kashmir.</p>
      </section>

      <section className="py-24 bg-[#F7F3EC] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {categories.map(cat => (
            <div key={cat} className="mb-20 last:mb-0">
              <h2 className="text-3xl serif text-[#3D2B1F] mb-10 border-l-4 border-[#A67C37] pl-6 italic">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {hampers.filter(h => h.category === cat && h.showOnHampers).map((h) => (
                  <div key={h.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-xl transition-all group flex flex-col">
                    <div className="aspect-square overflow-hidden rounded-lg mb-6 relative">
                      {h.name === 'California Almonds' ? (
                        <ImageSequencePlayer
                          basePath="/almond-sequence/ezgif-frame-"
                          frameCount={258}
                          extension=".jpg"
                          className="w-full h-full"
                          fps={30}
                        />
                      ) : h.name === 'Goa Cashews' ? (
                        <ImageSequencePlayer
                          basePath="/cashew-sequence/ezgif-frame-"
                          frameCount={260}
                          extension=".jpg"
                          className="w-full h-full"
                          fps={30}
                        />
                      ) : h.name === 'Ajwa Dates' ? (
                        <ImageSequencePlayer
                          basePath="/ajwa-dates-sequence/ezgif-frame-"
                          frameCount={124}
                          extension=".jpg"
                          className="w-full h-full"
                          fps={30}
                        />
                      ) : h.name === 'Kalmi Dates' ? (
                        <ImageSequencePlayer
                          basePath="/kalmi-dates-sequence/ezgif-frame-"
                          frameCount={280}
                          extension=".jpg"
                          className="w-full h-full"
                          fps={30}
                        />
                      ) : h.name === 'Saffron (Kesari)' ? (
                        <ImageSequencePlayer
                          basePath="/saffron-sequence/ezgif-frame-"
                          frameCount={92}
                          extension=".jpg"
                          className="w-full h-full"
                          fps={30}
                        />
                      ) : h.name === 'Eid Special' ? (
                        <ImageSequencePlayer
                          basePath="/eid-special-sequence/ezgif-frame-"
                          frameCount={75}
                          extension=".jpg"
                          className="w-full h-full"
                          fps={30}
                          placeholderFrame={38}
                        />
                      ) : (
                        <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      )}
                      <button
                        onClick={() => handleAction(h.id, 'wishlist')}
                        className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors ${wishlist.includes(h.id) ? 'bg-[#A67C37] text-white' : 'bg-white/80 text-[#3D2B1F]'}`}
                      >
                        <svg className="w-4 h-4" fill={wishlist.includes(h.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </div>
                    <h4 className="text-lg serif text-[#3D2B1F] mb-1">{h.name}</h4>
                    <p className="text-[#A67C37] font-bold mb-4">₹ {h.price}</p>

                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button
                        onClick={() => setModalState({ open: true, product: h.name })}
                        className="py-2 text-[10px] font-bold uppercase rounded-lg border border-[#E8DFD0] text-[#3D2B1F] hover:bg-[#FDFBF7] transition-all"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => setModalState({ open: true, product: h.name })}
                        className="py-2 text-[10px] font-bold uppercase rounded-lg bg-[#A67C37] text-white hover:bg-[#8B672E]"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-24 bg-[#3D2B1F] text-[#FDFBF7] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl serif mb-4">Visit Us</h2>
            <p className="text-[#D9C8B8] italic">Pick up your blessings or consult with our experts at our boutique locations.</p>
          </div>
          <div className="flex justify-center flex-wrap gap-8 md:gap-12">
            {settings.shops.map((shop, idx) => (
              <div key={shop.id} className="bg-[#4A3728] p-8 rounded-3xl border border-[#5C4233] hover:border-[#A67C37] transition-all group w-full max-w-sm text-left">
                <div className="text-[#A67C37] mb-6 flex justify-between items-start">
                  <div className="w-12 h-12 bg-[#3D2B1F] rounded-full flex items-center justify-center text-xl font-bold">{idx + 1}</div>
                  <svg className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3 className="text-2xl serif mb-4">{shop.name}</h3>
                <p className="text-[#D9C8B8] leading-relaxed mb-6 italic">{shop.address}</p>
                <div className="flex space-x-4">
                  <a
                    href={`https://www.google.com/maps?q=${shop.lat},${shop.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-widest font-bold text-[#A67C37] hover:text-white transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hampers;
