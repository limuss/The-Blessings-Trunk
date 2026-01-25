
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const questions = [
  { id: 'occasion', question: 'What is the special occasion you are planning for?', options: ['Eid', 'Diwali', 'Newborn', 'Wedding', 'Corporate', 'Just Because'] },
  { id: 'recipient', question: 'Who is this blessing for?', placeholder: 'e.g. A dear friend, family member, colleague...' },
  { id: 'preference', question: 'What is your preference for the hamper?', options: ['Premium Luxury', 'Elegant & Simple', 'Festive & Colorful'] },
  { id: 'requirements', question: 'Any special messages or dietary requirements?', placeholder: 'e.g. Handwritten note, no sugar, focus on walnuts...' },
  { id: 'phone', question: 'Lastly, please share your phone number so our agent can reach out.', placeholder: 'Phone number' }
];

const Order: React.FC = () => {
  const { settings, hampers } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const currentQ = questions[currentStep];
  const suggestedHampers = hampers.filter(h => h.isSuggested);

  const handleNext = (val?: string) => {
    const finalVal = val || inputValue;
    if (!finalVal.trim()) return;

    const newAnswers = { ...answers, [currentQ.id]: finalVal };
    setAnswers(newAnswers);
    setInputValue('');

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateWhatsappUrl(newAnswers);
      setIsFinished(true);
    }
  };

  const generateWhatsappUrl = (ans: Record<string, string>) => {
    const summary = `✨ *New Blessing Request* ✨\n\n🎁 *Occasion:* ${ans.occasion}\n👤 *For:* ${ans.recipient}\n🌟 *Style:* ${ans.preference}\n📝 *Notes:* ${ans.requirements}\n📞 *Contact:* ${ans.phone}\n\n_Sent via The Blessings Trunk Website_`;
    const encoded = encodeURIComponent(summary);
    setWhatsappUrl(`https://wa.me/${settings.whatsappNumber}?text=${encoded}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7] px-6 py-12">
      <div className="max-w-xl w-full">
        {!isFinished ? (
          <div className="bg-white p-10 md:p-16 rounded-3xl shadow-2xl border border-[#E8DFD0] animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-12">
              <span className="text-xs uppercase tracking-[0.3em] text-[#A67C37] font-bold">Step {currentStep + 1} of {questions.length}</span>
              <div className="w-full h-1 bg-[#F7F3EC] mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-[#A67C37] transition-all duration-700" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl serif text-[#3D2B1F] mb-10 leading-tight">{currentQ.question}</h2>
            {currentQ.options ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQ.options.map(opt => (
                  <button key={opt} onClick={() => handleNext(opt)} className="px-6 py-4 border border-[#E8DFD0] rounded-xl text-left hover:border-[#A67C37] hover:bg-[#FDFBF7] hover:text-[#A67C37] transition-all font-medium text-[#4A3728]">
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <input autoFocus type={currentQ.id === 'phone' ? 'tel' : 'text'} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleNext()} placeholder={currentQ.placeholder} className="w-full text-xl md:text-2xl border-b-2 border-[#E8DFD0] py-4 bg-transparent focus:outline-none focus:border-[#A67C37] transition-colors placeholder:text-[#E8DFD0] text-[#3D2B1F] serif" />
                <div className="flex justify-between items-center">
                  {currentStep > 0 && <button onClick={() => setCurrentStep(prev => prev - 1)} className="text-[#8B735B] hover:text-[#3D2B1F] transition-colors text-sm font-medium">← Back</button>}
                  <button onClick={() => handleNext()} className="bg-[#3D2B1F] text-white px-8 py-3 rounded-full hover:bg-[#A67C37] transition-all ml-auto">Continue</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            <div className="w-24 h-24 bg-[#A67C37] rounded-full flex items-center justify-center mx-auto shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <h2 className="text-4xl serif text-[#3D2B1F] mb-4">A Blessing is Prepared</h2>
              <p className="text-lg text-[#6B513E] max-w-md mx-auto italic">Thank you for sharing your heart. Please click below to connect with our gifting agent.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-[#3D2B1F] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#A67C37] transition-all shadow-lg flex items-center space-x-3">
                <span>Chat with Gifting Agent</span>
              </a>
              <p className="text-xs text-[#8B735B] uppercase tracking-widest font-medium">Opens in WhatsApp</p>
            </div>
            {suggestedHampers.length > 0 && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E8DFD0] text-left">
                <h3 className="text-sm uppercase tracking-widest text-[#A67C37] mb-6 font-bold">Suggested Highlights</h3>
                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                  {suggestedHampers.map((item) => (
                    <div key={item.id} className="min-w-[150px] group">
                      <div className="aspect-[4/5] bg-[#F7F3EC] rounded-xl overflow-hidden mb-2">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                      </div>
                      <p className="text-xs serif text-[#3D2B1F] text-center font-medium">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
