
import React from 'react';
// Use MemoryRouter instead of HashRouter to avoid security restrictions on location manipulation in the blob-origin sandbox environment.
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Hampers from './pages/Hampers';
import About from './pages/About';
import Order from './pages/Order';
import Admin from './pages/Admin';
import ChatBot from './components/ChatBot';
import { StoreProvider } from './context/StoreContext';

const GAS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzEzTXIUGapqsQeptHT-qQzlRyKP7-SLmb87J6KoSzBpgvGI5MtUaB2Ag8VvEuBiWfOVQ/exec";


const App: React.FC = () => {
  return (
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
              <Route path="/occasions" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <ChatBot />
        </div>
      </Router>
    </StoreProvider>
  );
};

export default App;
