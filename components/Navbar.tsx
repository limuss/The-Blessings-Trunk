
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isAdmin } = useAuth();
  const { cart } = useStore();

  return (
    <nav className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8DFD0] py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl md:text-3xl font-bold serif text-[#3D2B1F]">
          The Blessings Trunk
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-widest text-[#6B513E]">
          <Link to="/" className="hover:text-[#A67C37]">Home</Link>
          <Link to="/hampers" className="hover:text-[#A67C37]">Hampers</Link>
          
          {isAdmin ? (
            <Link to="/admin" className="text-[#A67C37] font-bold">Admin Panel</Link>
          ) : (
            <Link to="/profile" className="hover:text-[#A67C37] relative flex items-center">
              <span>My Profile</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#A67C37] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {!currentUser ? (
            <Link to="/login" className="bg-[#3D2B1F] text-white px-6 py-2.5 rounded hover:bg-[#A67C37]">Login</Link>
          ) : (
            <Link to="/order" className="bg-[#A67C37] text-white px-6 py-2.5 rounded shadow-sm">Order Now</Link>
          )}
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#3D2B1F]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#FDFBF7] border-b border-[#E8DFD0] py-6 px-6 flex flex-col space-y-4">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/hampers" onClick={() => setIsMenuOpen(false)}>Hampers</Link>
          {isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>}
          <Link to="/profile" onClick={() => setIsMenuOpen(false)}>My Profile ({cart.length})</Link>
          {!currentUser ? <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link> : <Link to="/order" onClick={() => setIsMenuOpen(false)}>Order Now</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
