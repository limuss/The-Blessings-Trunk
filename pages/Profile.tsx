
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Navigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { currentUser, logout, isLoading } = useAuth();
  const { cart, wishlist, hampers, toggleCart, toggleWishlist } = useStore();

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;

  const cartItems = hampers.filter(h => cart.includes(h.id));
  const wishlistItems = hampers.filter(h => wishlist.includes(h.id));

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-[#3D2B1F] rounded-full flex items-center justify-center text-white text-3xl serif">
              {currentUser.email?.[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl serif text-[#3D2B1F]">My Dashboard</h1>
              <p className="text-[#8B735B] italic">{currentUser.email}</p>
            </div>
          </div>
          <button onClick={logout} className="px-8 py-2.5 bg-red-50 text-red-600 rounded-full text-sm font-bold border border-red-100">Sign Out</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Section */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl serif text-[#3D2B1F] border-b pb-4">My Shopping Cart ({cartItems.length})</h2>
            {cartItems.length === 0 ? (
              <p className="text-[#8B735B] italic">Your cart is currently empty.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border flex space-x-4">
                    <img src={item.image} className="w-20 h-20 object-cover rounded-lg" alt={item.name} />
                    <div className="flex-grow">
                      <h3 className="font-bold text-[#3D2B1F]">{item.name}</h3>
                      <p className="text-[#A67C37] text-sm">₹ {item.price}</p>
                      <button onClick={() => toggleCart(item.id)} className="text-red-500 text-[10px] uppercase font-bold mt-2">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h2 className="text-2xl serif text-[#3D2B1F] border-b pb-4 mt-12">Wishlist</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {wishlistItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border text-center">
                  <img src={item.image} className="w-full h-24 object-cover rounded-lg mb-2" alt={item.name} />
                  <p className="text-xs font-bold text-[#3D2B1F] truncate">{item.name}</p>
                  <button onClick={() => toggleWishlist(item.id)} className="text-[#A67C37] text-[10px] mt-2 font-bold uppercase">Move to Cart</button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / Summary */}
          <div className="bg-white p-8 rounded-3xl border h-fit space-y-6">
            <h3 className="text-xl serif text-[#3D2B1F]">Order Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Items Subtotal</span>
              <span className="font-bold">₹ {cartItems.reduce((acc, i) => acc + parseInt(i.price), 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping (Kashmir)</span>
              <span className="text-green-600 font-bold">Free</span>
            </div>
            <div className="pt-4 border-t flex justify-between">
              <span className="serif text-lg">Total</span>
              <span className="text-xl font-bold text-[#A67C37]">₹ {cartItems.reduce((acc, i) => acc + parseInt(i.price), 0)}</span>
            </div>
            <button className="w-full bg-[#3D2B1F] text-white py-4 rounded-full font-bold shadow-lg hover:bg-[#A67C37]">Checkout Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
