
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Hampers: React.FC = () => {
  const { hampers, settings } = useStore();

  const handleWhatsAppRedirect = (styleName?: string) => {
    const text = styleName 
      ? `✨ *Inquiry for ${styleName}* ✨\n\nHello! I'm interested in customizing the *${styleName}*. Could you please assist me with the options and pricing?`
      : "Hello! I'm interested in customizing a blessing hamper. Could you please assist me?";
    const message = encodeURIComponent(text);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
  };

  const displayedHampers = hampers.filter(h => h.showOnHampers);
  
  const styles = [
    { title: 'Wooden Trunk Hampers', category: 'Wooden Trunk', image: 'https://images.unsplash.com/photo-1590080876118-20d20d4f3b7c?q=80&w=1374&auto=format&fit=crop' },
    { title: 'Festival Special Boxes', category: 'Festival Special', image: 'https://images.unsplash.com/photo-1512413316925-fd4b93f31521?q=80&w=1374&auto=format&fit=crop' },
    { title: 'Keepsake Gift Boxes', category: 'Keepsake Box', image: 'https://images.unsplash.com/photo-1623939012331-996161ec8670?q=80&w=1471&auto=format&fit=crop' },
    { title: 'Custom Blessing Hampers', category: 'Custom Blessing', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1469&auto=format&fit=crop' }
  ];

  return (
    <div className="bg-[#FDFBF7]">
      {/* Intro Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-5xl md:text-6xl serif text-[#3D2B1F] mb-6">Our Signature Hampers</h1>
        <p className="text-xl italic serif text-[#6B513E] max-w-2xl mx-auto leading-relaxed">
          More than just gifts, these are vessels of love and tradition, carefully handcrafted in the valleys of Jammu & Kashmir.
        </p>
      </section>

      {/* Hamper Styles Section */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl serif text-[#3D2B1F] mb-12 border-l-4 border-[#A67C37] pl-6 italic">Gifting Styles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {styles.map((style, idx) => (
            <div key={idx} className="flex flex-col group">
              <div className="overflow-hidden rounded-lg shadow-sm mb-6 aspect-[16/10]">
                <img src={style.image} alt={style.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h3 className="text-2xl serif text-[#3D2B1F] mb-3">{style.title}</h3>
              <p className="text-[#4A3728] mb-6">Handcrafted containers designed to carry your heartfelt wishes.</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button 
                  onClick={() => handleWhatsAppRedirect(style.title)}
                  className="bg-[#3D2B1F] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#A67C37] transition-all shadow-md"
                >
                  Customize This Style
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 bg-[#F7F3EC] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl serif text-center text-[#3D2B1F] mb-16">Curated Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedHampers.map((h) => (
              <div key={h.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-xl transition-all group">
                <div className="aspect-square overflow-hidden rounded-lg mb-6">
                  <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h4 className="text-lg serif text-[#3D2B1F] mb-2">{h.name}</h4>
                <p className="text-[#A67C37] font-medium mb-4">₹ {h.price}</p>
                <Link to="/order" className="block w-full text-center bg-[#A67C37] text-white py-2 rounded text-sm hover:bg-[#8B672E] transition-colors">
                  Order Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto border-y border-[#E8DFD0] py-16">
          <h2 className="text-4xl serif text-[#3D2B1F] mb-6">Talk to Our Expert</h2>
          <p className="text-lg text-[#6B513E] mb-10 leading-relaxed italic">
            Looking for something uniquely yours? Connect directly with our gifting agent.
          </p>
          <button 
            onClick={() => handleWhatsAppRedirect()}
            className="bg-[#3D2B1F] text-white px-10 py-4 rounded-full text-lg hover:bg-[#A67C37] transition-all shadow-lg flex items-center justify-center mx-auto space-x-3"
          >
            <span>WhatsApp Agent</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Hampers;
