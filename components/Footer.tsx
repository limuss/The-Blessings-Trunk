
import React from 'react';
import { useStore } from '../context/StoreContext';

const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="bg-[#3D2B1F] text-[#FDFBF7] pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h3 className="text-2xl serif mb-6 italic">Visit Us</h3>
          <p className="text-[#D9C8B8] leading-relaxed">
            NST Complex, 1st Floor<br />
            Residency Road, Srinagar<br />
            Jammu & Kashmir, 190001
          </p>
        </div>
        <div>
          <h3 className="text-2xl serif mb-6 italic">Contact</h3>
          <div className="border-l-2 border-[#A67C37] pl-4">
            <p className="text-[#D9C8B8] font-medium">{settings.proprietorName}</p>
            <p className="text-[#D9C8B8] mb-1">{settings.phoneNumber}</p>
            <p className="text-xs text-[#8B735B] uppercase tracking-tighter">Proprietor</p>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <h3 className="text-2xl serif mb-6 italic">Follow Our Journey</h3>
          <div className="flex space-x-4">
            <a href={settings.facebookUrl} className="hover:text-[#A67C37] transition-colors">FB</a>
            <a href={settings.instagramUrl} className="hover:text-[#A67C37] transition-colors">IG</a>
            <a href={settings.twitterUrl} className="hover:text-[#A67C37] transition-colors">TW</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-[#5C4233] text-center text-sm text-[#8B735B]">
        &copy; {new Date().getFullYear()} The Blessings Trunk. All rights reserved. Handcrafted in Kashmir.
      </div>
    </footer>
  );
};

export default Footer;
