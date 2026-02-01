
import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import { Navigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const { currentUser, isAdmin, isLoading, loginWithGoogle } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin h-12 w-12 border-4 border-[#A67C37] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Strictly protected Admin route
  if (currentUser && !isAdmin) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {!currentUser ? (
        <AdminLogin onAuthError={() => {}} authError="" />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
};

export default Admin;
