
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const Login: React.FC = () => {
  const { currentUser, loginWithGoogle, isLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (currentUser) return <Navigate to="/profile" />;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7] p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-[#E8DFD0] w-full max-w-md">
        <h2 className="text-3xl serif text-[#3D2B1F] text-center mb-8">
          {isRegister ? 'Join the Trunk' : 'Welcome Back'}
        </h2>
        
        {error && <div className="mb-4 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

        <button 
          onClick={loginWithGoogle}
          className="w-full border border-[#E8DFD0] py-3 rounded-full flex items-center justify-center space-x-3 hover:bg-[#F7F3EC] transition-all mb-6"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="Google" />
          <span className="text-sm font-semibold text-[#3D2B1F]">Continue with Google</span>
        </button>

        <div className="relative my-8 flex items-center">
          <div className="flex-grow border-t border-[#E8DFD0]"></div>
          <span className="px-4 text-[10px] uppercase font-bold text-[#D9C8B8]">or use email</span>
          <div className="flex-grow border-t border-[#E8DFD0]"></div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full border p-3 rounded-xl text-sm" 
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full border p-3 rounded-xl text-sm" 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-[#A67C37] text-white py-4 rounded-full font-bold shadow-md hover:bg-[#3D2B1F]">
            {isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#8B735B]">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsRegister(!isRegister)} className="text-[#A67C37] font-bold underline">
            {isRegister ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;