import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import OrderModal from '../components/OrderModal';

const Home: React.FC = () => {
  const { hampers, occasions, settings } = useStore();
  const [modalState, setModalState] = useState<{ open: boolean; product?: string }>({ open: false });

  const homeHampers = hampers.filter(h => h.showOnHome);

  return (
    <div className="bg-[#FDFBF7] relative">
      <OrderModal
        isOpen={modalState.open}
        onClose={() => setModalState({ open: false })}
        productName={modalState.product}
      />

      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] flex items-center px-6 md:px-12 py-20 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('${settings.heroImage}')` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl serif text-white mb-4 drop-shadow-2xl">{settings.heroTitle}</h1>
          <p className="text-2xl md:text-3xl italic serif text-white/90 mb-8 drop-shadow-xl">{settings.heroSubtitle}</p>
          <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-xl drop-shadow-lg">
            Premium dry fruit hampers handcrafted in Jammu & Kashmir—thoughtfully curated for moments that matter.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => setModalState({ open: true })}
              className="bg-[#A67C37] text-white px-8 py-3 rounded text-lg hover:bg-[#8B672E] transition-all shadow-md"
            >
              Order a Blessing
            </button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 relative group">
          <div className="absolute -inset-4 border border-[#E8DFD0] rounded transition-transform group-hover:scale-105"></div>
          <img
            src={settings.homeFeatureImage}
            alt="Wooden Trunk Feature"
            className="relative rounded shadow-2xl w-full h-[450px] object-cover"
          />
        </div>
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl md:text-5xl serif text-[#3D2B1F]">A Gift That Speaks Without Words</h2>
          <div className="w-20 h-0.5 bg-[#E8DFD0] my-8"></div>
          <p className="text-lg leading-relaxed text-[#4A3728]">
            {settings.aboutText1}
          </p>
          <button
            onClick={() => setModalState({ open: true, product: 'Custom Hamper' })}
            className="text-[#A67C37] font-bold uppercase tracking-widest text-sm border-b-2 border-[#A67C37] pb-1 hover:text-[#3D2B1F] hover:border-[#3D2B1F] transition-all"
          >
            Curate Your Own
          </button>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-24 bg-[#F7F3EC] px-6 md:px-12 text-center">
        <h2 className="text-4xl serif italic text-[#3D2B1F] mb-16">Blessings for Every Occasion</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {occasions.map((occ) => (
            <div key={occ.id} className="bg-white rounded p-4 shadow-sm hover:shadow-xl transition-all group cursor-pointer" onClick={() => setModalState({ open: true, product: occ.title })}>
              <div className="overflow-hidden mb-6 aspect-square">
                <img src={occ.image} alt={occ.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="text-xl serif mb-4">{occ.title}</h3>
              <div className="flex justify-center">
                <img src="https://img.icons8.com/color/48/000000/leaf.png" className="w-6 opacity-30" alt="leaf decoration" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hampers Section */}
      <section className="py-24 px-6 md:px-12 text-center">
        <h2 className="text-4xl serif italic text-[#3D2B1F] mb-16">Our Featured Hampers</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {homeHampers.map((hamper) => (
            <div key={hamper.id} className="bg-white p-2 rounded shadow-sm flex flex-col items-center group">
              <div className="w-full overflow-hidden h-80 mb-8">
                <img src={hamper.image} alt={hamper.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h3 className="text-2xl serif mb-2">{hamper.name}</h3>
              <p className="text-[#A67C37] font-semibold mb-6">Starting from ₹ {hamper.price}</p>
              <div className="w-full flex items-center justify-center space-x-4 mb-6 px-4">
                <div className="flex-grow h-[1px] bg-[#E8DFD0]"></div>
                <button
                  onClick={() => setModalState({ open: true, product: hamper.name })}
                  className="bg-[#A67C37] text-white px-10 py-2.5 hover:bg-[#8B672E] transition-colors uppercase text-sm tracking-widest font-semibold whitespace-nowrap"
                >
                  Order Now
                </button>
                <div className="flex-grow h-[1px] bg-[#E8DFD0]"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop Locations Section */}
      <section className="py-24 bg-[#3D2B1F] text-[#FDFBF7] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl serif mb-4">Visit Our Boutiques</h2>
            <p className="text-[#D9C8B8] italic">Experience the warmth of our handcrafted heritage in person.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {settings.shops.map((shop, idx) => (
              <div key={shop.id} className="bg-[#4A3728] p-8 rounded-3xl border border-[#5C4233] hover:border-[#A67C37] transition-all group">
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

export default Home;