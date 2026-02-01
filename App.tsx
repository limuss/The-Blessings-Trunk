
import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Hampers from './pages/Hampers';
import About from './pages/About';
import Order from './pages/Order';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ChatBot from './components/ChatBot';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hampers" element={<Hampers />} />
                <Route path="/about" element={<About />} />
                <Route path="/order" element={<Order />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/occasions" element={<Home />} />
              </Routes>
            </main>
            <Footer />
            <ChatBot />
          </div>
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
};

export default App;
