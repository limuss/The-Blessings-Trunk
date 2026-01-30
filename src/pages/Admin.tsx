import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';

const Admin: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isAuthLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-[#A67C37] border-t-transparent rounded-full"></div>
          <p className="text-[#8B735B] text-xs uppercase tracking-widest font-bold">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // Controller Logic: Render either Login or Dashboard based on Auth status
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {!currentUser ? (
        <AdminLogin 
          authError={authError} 
          onAuthError={setAuthError} 
        />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
};

export default Admin;