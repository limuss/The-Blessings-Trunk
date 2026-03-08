
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
            NST building Ground floor<br />
            Near Jamia Masjid, Thathri, Doda<br />
            Jammu & Kashmir, 182203
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
        <div>&copy; {new Date().getFullYear()} The Blessings Basket. All rights reserved. Handcrafted in Kashmir.</div>
        <div className="mt-2 text-[#D9C8B8]">
          Site developed and designed by{" "}
          <a
            href="https://www.linkedin.com/in/muslim-nazir-506b56290/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#A67C37] transition-colors font-medium underline underline-offset-4"
          >
            Muslim Nazir Lone
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
