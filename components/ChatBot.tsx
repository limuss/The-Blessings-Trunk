
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/gemini';
import { Message } from '../types';

const HAMPER_IMAGES: Record<string, string> = {
  'Royal Kashmiri Trunk': 'https://images.unsplash.com/photo-1606830733744-0ad778449672?q=80&w=300&auto=format&fit=crop',
  'Saffron & Gold Delight': 'https://images.unsplash.com/photo-1590080876118-20d20d4f3b7c?q=80&w=300&auto=format&fit=crop',
  'Nurture Box': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=300&auto=format&fit=crop',
  'Petite Blessing': 'https://images.unsplash.com/photo-1512413316925-fd4b93f31521?q=80&w=300&auto=format&fit=crop',
  'Celebration Tray': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=300&auto=format&fit=crop',
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to The Blessings Trunk! I'm here to help you find the perfect gift. What occasion are you planning for?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const findRecommendedImage = (text: string) => {
    for (const [name, url] of Object.entries(HAMPER_IMAGES)) {
      if (text.toLowerCase().includes(name.toLowerCase())) {
        return url;
      }
    }
    return undefined;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getGeminiResponse(input, messages);
    const imageUrl = findRecommendedImage(aiResponse);
    
    const modelMsg: Message = { 
      role: 'model', 
      text: aiResponse,
      imageUrl: imageUrl
    };
    
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-[350px] md:w-[400px] h-[500px] shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-[#E8DFD0] mb-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#3D2B1F] p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#A67C37] flex items-center justify-center text-xs serif italic">BT</div>
              <div>
                <h3 className="font-medium serif tracking-wide">Trunk Assistant</h3>
                <p className="text-[10px] text-[#D9C8B8] uppercase tracking-widest">Always here for you</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#FDFBF7]">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-[#A67C37] text-white rounded-tr-none' 
                  : 'bg-white text-[#4A3728] border border-[#E8DFD0] rounded-tl-none'
                }`}>
                  {m.imageUrl && (
                    <div className="mb-3 overflow-hidden rounded-lg">
                      <img src={m.imageUrl} alt="Recommended Hamper" className="w-full h-32 object-cover" />
                    </div>
                  )}
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#E8DFD0] px-4 py-2.5 rounded-2xl rounded-tl-none text-sm text-[#8B735B] italic animate-pulse">
                  Assistant is typing...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-[#E8DFD0] flex space-x-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-grow border border-[#E8DFD0] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#A67C37]"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-[#A67C37] text-white p-2 rounded-full hover:bg-[#8B672E] transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#3D2B1F] hover:bg-[#A67C37] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
