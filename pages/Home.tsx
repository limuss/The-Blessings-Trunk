
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Home: React.FC = () => {
  const { hampers, occasions, settings } = useStore();
  
  const homeHampers = hampers.filter(h => h.showOnHome);

  return (
    <div className="bg-[#FDFBF7]">
      {/* Hero Section */}
      <section 
        className="relative min-h-[85vh] flex items-center px-6 md:px-12 py-20 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('${settings.heroImage}')` }}
      >
        <div className="absolute inset-0 bg-[#FDFBF7]/60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl serif text-[#3D2B1F] mb-4">{settings.heroTitle}</h1>
          <p className="text-2xl md:text-3xl italic serif text-[#6B513E] mb-8">{settings.heroSubtitle}</p>
          <p className="text-lg text-[#4A3728] leading-relaxed mb-10 max-w-xl">
            Premium dry fruit hampers handcrafted in Jammu & Kashmir—thoughtfully curated for moments that matter.
          </p>
          <div className="flex space-x-4">
            <Link to="/hampers" className="bg-[#A67C37] text-white px-8 py-3 rounded text-lg hover:bg-[#8B672E] transition-all shadow-md">
              Order a Blessing
            </Link>
            <Link to="/hampers" className="border border-[#A67C37] text-[#A67C37] px-8 py-3 rounded text-lg hover:bg-[#A67C37] hover:text-white transition-all">
              Explore Hampers
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <img 
            src="https://images.unsplash.com/photo-1605666118742-5f65a6f2316e?q=80&w=1510&auto=format&fit=crop" 
            alt="Wooden Trunk" 
            className="rounded shadow-2xl w-full h-[450px] object-cover"
          />
        </div>
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl md:text-5xl serif text-[#3D2B1F]">A Gift That Speaks Without Words</h2>
          <div className="w-20 h-0.5 bg-[#E8DFD0] my-8"></div>
          <p className="text-lg leading-relaxed text-[#4A3728]">
            {settings.aboutText1}
          </p>
          <p className="text-lg leading-relaxed text-[#4A3728]">
            Handcrafted in the heart of Jammu & Kashmir, each gift is a gesture of warmth and tradition.
          </p>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-24 bg-[#F7F3EC] px-6 md:px-12 text-center">
        <h2 className="text-4xl serif italic text-[#3D2B1F] mb-16">Blessings for Every Occasion</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {occasions.map((occ) => (
            <div key={occ.id} className="bg-white rounded p-4 shadow-sm hover:shadow-md transition-shadow group">
              <div className="overflow-hidden mb-6 aspect-square">
                <img src={occ.image} alt={occ.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
                <Link to="/order" className="bg-[#A67C37] text-white px-10 py-2.5 hover:bg-[#8B672E] transition-colors uppercase text-sm tracking-widest font-semibold whitespace-nowrap">
                  Order Now
                </Link>
                <div className="flex-grow h-[1px] bg-[#E8DFD0]"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
