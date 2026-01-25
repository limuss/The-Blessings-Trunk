
import React from 'react';
import { useStore } from '../context/StoreContext';

const About: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="bg-[#FDFBF7]">
      <section className="py-24 px-6 md:px-12 text-center bg-[#F7F3EC]">
        <h1 className="text-5xl md:text-7xl serif text-[#3D2B1F] mb-6 italic">The Soul of the Trunk</h1>
        <p className="text-xl serif text-[#6B513E] uppercase tracking-widest">Handcrafted in Jammu & Kashmir</p>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <h2 className="text-4xl serif text-[#3D2B1F]">{settings.aboutTitle}</h2>
            <div className="w-16 h-0.5 bg-[#A67C37]"></div>
            <p className="text-lg leading-relaxed text-[#4A3728]">
              {settings.aboutText1}
            </p>
            <p className="text-lg leading-relaxed text-[#4A3728]">
              {settings.aboutText2}
            </p>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 border border-[#E8DFD0] rounded-lg"></div>
             <img src="https://images.unsplash.com/photo-1541339907198-e08759df9a73?q=80&w=1470&auto=format&fit=crop" alt="Kashmir" className="relative rounded-lg shadow-2xl z-10" />
          </div>
        </div>

        <div className="bg-[#3D2B1F] text-[#FDFBF7] p-12 md:p-20 rounded-3xl text-center space-y-8 shadow-2xl">
          <h2 className="text-4xl serif">Premium Quality, Roots Deep in J&K</h2>
          <p className="text-xl text-[#D9C8B8] max-w-2xl mx-auto leading-relaxed italic">
            From the crisp air of our orchards to the meticulous bow tied around your trunk.
          </p>
          <blockquote className="text-3xl serif italic text-[#A67C37] py-8">
            "{settings.aboutQuote}"
          </blockquote>
          <div className="flex justify-center space-x-12 pt-8">
            <div className="text-center">
              <span className="block text-3xl serif mb-2">100%</span>
              <span className="text-xs uppercase tracking-widest text-[#A67C37]">Natural</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl serif mb-2">Artisan</span>
              <span className="text-xs uppercase tracking-widest text-[#A67C37]">Crafted</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl serif mb-2">Heritage</span>
              <span className="text-xs uppercase tracking-widest text-[#A67C37]">Driven</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
