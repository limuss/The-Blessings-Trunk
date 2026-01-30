import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AdminLoginProps {
  onAuthError: (error: string) => void;
  authError: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onAuthError, authError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    onAuthError('');
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      onAuthError('Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7] p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-[#E8DFD0] w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#3D2B1F] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#A67C37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl serif text-[#3D2B1F] font-bold">Admin Access</h1>
          <p className="text-[#8B735B] text-sm mt-2 uppercase tracking-widest font-medium">The Blessings Trunk</p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-6">
          {authError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 animate-in shake duration-300">
              {authError}
            </div>
          )}
          
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#A67C37] mb-2 tracking-widest">Administrator Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b-2 border-[#E8DFD0] py-2 focus:outline-none focus:border-[#A67C37] bg-transparent text-[#3D2B1F] transition-colors"
              placeholder="admin@blessingstrunk.com"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[#A67C37] mb-2 tracking-widest">Secret Key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-[#E8DFD0] py-2 focus:outline-none focus:border-[#A67C37] bg-transparent text-[#3D2B1F] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#3D2B1F] text-white py-4 rounded-full hover:bg-[#A67C37] transition-all font-semibold shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Verifying...' : 'Unlock Dashboard'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#F7F3EC] text-center">
          <p className="text-[#8B735B] text-[10px] uppercase tracking-[0.2em] font-bold">
            Private Boutique Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
