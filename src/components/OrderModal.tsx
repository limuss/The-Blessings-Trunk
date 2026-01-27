
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, productName }) => {
  const { settings } = useStore();
  const [formData, setFormData] = useState({ email: '', whatsapp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Send Notification to Serverless Backend (GAS)
      if (settings.gasEndpoint) {
        // We include settings.ownerEmail so the GAS script knows where to send the email notification.
        // Ensure your GAS script uses MailApp.sendEmail({to: e.parameter.ownerEmail, ...})
        await fetch(settings.gasEndpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'order',
            data: {
              product: productName || 'Custom Blessing Request',
              email: formData.email,
              whatsapp: formData.whatsapp,
              ownerEmail: settings.ownerEmail, // Crucial for automated emails
              timestamp: new Date().toISOString()
            }
          })
        });
      }

      // 2. Open WhatsApp for the User
      const message = `✨ *New Inquiry from Website* ✨\n\n🎁 *Product:* ${productName || 'Custom Request'}\n📧 *Email:* ${formData.email}\n📱 *WhatsApp:* ${formData.whatsapp}\n\n_Sent from The Blessings Trunk_`;
      const encodedMsg = encodeURIComponent(message);
      
      // Auto-open WhatsApp chat with the owner
      window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodedMsg}`, '_blank');
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({ email: '', whatsapp: '' });
      }, 4000);
    } catch (error) {
      console.error('Submission error:', error);
      // Fallback redirect if fetch completely fails
      window.open(`https://wa.me/${settings.whatsappNumber}`, '_blank');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 border border-[#E8DFD0]">
        <div className="relative h-40 bg-[#3D2B1F] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none scale-150">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="modal-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M0,5 L10,5 M5,0 L5,10" stroke="white" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#modal-pattern)" />
            </svg>
          </div>
          
          <div className="text-center relative z-10 px-6">
            <h2 className="text-3xl md:text-4xl serif text-[#FDFBF7] italic mb-1">Blessing Inquiry</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#A67C37] font-bold">The Blessings Trunk</p>
          </div>

          <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        <div className="p-10">
          {isSuccess ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <h3 className="text-2xl serif text-[#3D2B1F] mb-2">Request Submitted</h3>
                <p className="text-sm text-[#8B735B] leading-relaxed">
                  We've recorded your inquiry and opened WhatsApp for you to connect directly with us.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-[#F7F3EC]/50 p-4 rounded-2xl border border-[#F7F3EC] text-center">
                <p className="text-[#6B513E] text-xs font-medium uppercase tracking-widest mb-1">Inquiry For</p>
                <p className="text-[#3D2B1F] serif text-lg italic">
                  {productName || 'Handcrafted Trunk Curation'}
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[10px] uppercase tracking-widest text-[#A67C37] font-bold mb-2 group-focus-within:text-[#3D2B1F] transition-colors">Your Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border-b border-[#E8DFD0] py-3 focus:outline-none focus:border-[#A67C37] transition-all bg-transparent text-[#3D2B1F] placeholder:text-[#D9C8B8]"
                    placeholder="Where should we send details?"
                  />
                </div>

                <div className="group">
                  <label className="block text-[10px] uppercase tracking-widest text-[#A67C37] font-bold mb-2 group-focus-within:text-[#3D2B1F] transition-colors">WhatsApp Number</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.whatsapp}
                    onChange={e => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="w-full border-b border-[#E8DFD0] py-3 focus:outline-none focus:border-[#A67C37] transition-all bg-transparent text-[#3D2B1F] placeholder:text-[#D9C8B8]"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#3D2B1F] text-white py-5 rounded-full font-bold hover:bg-[#A67C37] transition-all shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50 group"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Inquire Now</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
