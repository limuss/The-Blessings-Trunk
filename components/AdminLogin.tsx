
import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const AdminLogin: React.FC<{ onAuthError: (e: string) => void; authError: string }> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError('Access Denied. Unauthorized credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-[#E8DFD0] w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl serif text-[#3D2B1F] font-bold">Admin Portal</h1>
          <p className="text-[#8B735B] text-sm mt-2">Private Management Access</p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100">{error}</div>}
          
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#A67C37] mb-2 tracking-widest">Admin ID</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b-2 border-[#E8DFD0] py-2 focus:outline-none focus:border-[#A67C37] bg-transparent text-[#3D2B1F]"
              placeholder="theblessingstrunk@gmail.com"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[#A67C37] mb-2 tracking-widest">Master Key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-[#E8DFD0] py-2 focus:outline-none focus:border-[#A67C37] bg-transparent text-[#3D2B1F]"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#3D2B1F] text-white py-4 rounded-full hover:bg-[#A67C37] transition-all font-semibold shadow-lg"
          >
            {isSubmitting ? 'Authenticating...' : 'Unlock Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;