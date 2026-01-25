
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8DFD0] py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl md:text-3xl font-bold serif text-[#3D2B1F] hover:opacity-80 transition-opacity">
          The Blessings Trunk
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-widest text-[#6B513E]">
          <Link to="/" className="hover:text-[#A67C37] transition-colors">Home</Link>
          <Link to="/hampers" className="hover:text-[#A67C37] transition-colors">Hampers</Link>
          <Link to="/about" className="hover:text-[#A67C37] transition-colors">About</Link>
          <Link to="/admin" className="hover:text-[#A67C37] transition-colors opacity-60 hover:opacity-100 text-[10px] tracking-tighter">Admin</Link>
          <Link to="/order" className="bg-[#A67C37] text-white px-6 py-2.5 rounded hover:bg-[#8B672E] transition-all shadow-sm">
            Order Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-[#3D2B1F] focus:outline-none" aria-label="Toggle Menu">
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#FDFBF7] border-b border-[#E8DFD0] py-6 px-6 flex flex-col space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
          <Link to="/" onClick={toggleMenu} className="text-[#6B513E] font-medium uppercase tracking-widest text-sm py-2">Home</Link>
          <Link to="/hampers" onClick={toggleMenu} className="text-[#6B513E] font-medium uppercase tracking-widest text-sm py-2">Hampers</Link>
          <Link to="/about" onClick={toggleMenu} className="text-[#6B513E] font-medium uppercase tracking-widest text-sm py-2">About</Link>
          <Link to="/admin" onClick={toggleMenu} className="text-[#6B513E]/50 font-medium uppercase tracking-widest text-[10px] py-1 border-t border-[#F7F3EC] mt-2">Admin Portal</Link>
          <Link to="/order" onClick={toggleMenu} className="bg-[#A67C37] text-white px-6 py-3 rounded text-center text-sm font-medium uppercase tracking-widest shadow-sm">
            Order Now
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
