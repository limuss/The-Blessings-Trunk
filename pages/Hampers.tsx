
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import OrderModal from '../components/OrderModal';

const Hampers: React.FC = () => {
  const { hampers, settings } = useStore();
  const [modalState, setModalState] = useState<{ open: boolean; product?: string }>({ open: false });

  const handleWhatsAppRedirect = (styleName?: string) => {
    const text = styleName 
      ? `✨ *Inquiry for ${styleName}* ✨\n\nHello! I'm interested in customizing the *${styleName}*. Could you please assist me with the options and pricing?`
      : "Hello! I'm interested in customizing a blessing hamper. Could you please assist me?";
    const message = encodeURIComponent(text);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
  };

  const displayedHampers = hampers.filter(h => h.showOnHampers);
  
  const categories = Array.from(new Set(hampers.map(h => h.category)));

  return (
    <div className="bg-[#FDFBF7]">
      <OrderModal 
        isOpen={modalState.open} 
        onClose={() => setModalState({ open: false })} 
        productName={modalState.product} 
      />

      {/* Intro Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-5xl md:text-6xl serif text-[#3D2B1F] mb-6">Our Signature Collections</h1>
        <p className="text-xl italic serif text-[#6B513E] max-w-2xl mx-auto leading-relaxed">
          Explore our range of curated blessings, each one a testament to the artisan heritage of Kashmir.
        </p>
      </section>

      {/* Filtered Grid */}
      <section className="py-24 bg-[#F7F3EC] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {categories.map(cat => (
            <div key={cat} className="mb-20 last:mb-0">
              <h2 className="text-3xl serif text-[#3D2B1F] mb-10 border-l-4 border-[#A67C37] pl-6 italic">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayedHampers.filter(h => h.category === cat).map((h) => (
                  <div key={h.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                    <div className="aspect-square overflow-hidden rounded-lg mb-6 relative">
                      <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      {h.discountPrice && (
                         <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-tighter shadow-sm">
                           Offer
                         </div>
                      )}
                    </div>
                    <h4 className="text-lg serif text-[#3D2B1F] mb-2">{h.name}</h4>
                    <p className="text-sm text-[#8B735B] line-clamp-2 mb-4 h-10">{h.description}</p>
                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                          <p className="text-[#A67C37] font-bold">₹ {h.price}</p>
                          {h.discountPrice && (
                            <p className="text-[#8B735B] text-[10px] line-through">₹ {h.discountPrice}</p>
                          )}
                        </div>
                        {h.isSuggested && (
                          <span className="bg-[#FDFBF7] text-[#A67C37] text-[10px] px-2 py-0.5 rounded border border-[#E8DFD0] uppercase font-bold">Featured</span>
                        )}
                      </div>
                      <button 
                        onClick={() => setModalState({ open: true, product: h.name })}
                        className="block w-full text-center bg-[#A67C37] text-white py-2.5 rounded text-sm font-semibold hover:bg-[#8B672E] transition-colors"
                      >
                        Inquire Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {displayedHampers.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-[#8B735B] italic">No hampers available in this category yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto border-y border-[#E8DFD0] py-16">
          <h2 className="text-4xl serif text-[#3D2B1F] mb-6">Need a Custom Blessing?</h2>
          <p className="text-lg text-[#6B513E] mb-10 leading-relaxed italic">
            Whether it's a bulk order for a wedding or a specific corporate requirement, we can curate the perfect trunk for you.
          </p>
          <button 
            onClick={() => handleWhatsAppRedirect()}
            className="bg-[#3D2B1F] text-white px-10 py-4 rounded-full text-lg hover:bg-[#A67C37] transition-all shadow-lg flex items-center justify-center mx-auto space-x-3"
          >
            <span>Consult Gifting Agent</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Hampers;
