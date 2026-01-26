import React, { useState, useMemo, useEffect } from 'react';
import { CreditCard, Truck, ShieldCheck, CheckCircle, ChevronLeft, Building2, Smartphone, Banknote, Loader2, Info, Search, ChevronDown, Package, ArrowRight, Sparkles, Trophy, Calendar, MapPin, ReceiptText, AlertTriangle, Check, Search as SearchIcon } from 'lucide-react';
import { ShippingAddress, Product } from '../types';
import { detectFraudRisk } from '../services/geminiService';

interface CartItemWithProduct {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  product: Product;
}

interface CheckoutViewProps {
  total: number;
  items: CartItemWithProduct[];
  onBack: () => void;
  onPlaceOrder: (address: ShippingAddress, paymentMethod: string, fraudScore: number) => void;
}

const ALL_BANKS = [
  "HDFC Bank", "ICICI Bank", "State Bank of India (SBI)", "Axis Bank", "Kotak Mahindra Bank",
  "Yes Bank", "IndusInd Bank", "Punjab National Bank", "Bank of Baroda", "Union Bank of India",
  "Canara Bank", "IDFC FIRST Bank", "Standard Chartered", "Citibank", "HSBC Bank",
  "RBL Bank", "Federal Bank", "South Indian Bank", "Karnataka Bank", "City Union Bank",
  "DBS Bank", "Bank of India", "Dhanlaxmi Bank", "Karur Vysya Bank", "Punjab & Sind Bank"
].sort();

const POPULAR_BANKS = [
  { name: 'HDFC Bank', icon: '🏦' },
  { name: 'ICICI Bank', icon: '🏛️' },
  { name: 'State Bank of India (SBI)', icon: '🏢' },
  { name: 'Axis Bank', icon: '🏰' },
  { name: 'Kotak Mahindra Bank', icon: '🏨' },
  { name: 'Yes Bank', icon: '🏠' },
];

const COMMON_HANDLES = ['@okaxis', '@paytm', '@ybl', '@okhdfcbank', '@okicici'];

const CheckoutView: React.FC<CheckoutViewProps> = ({ total, items, onBack, onPlaceOrder }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [orderId] = useState(`LX-${Math.floor(100000 + Math.random() * 900000)}`);
  const [calculatedFraudScore, setCalculatedFraudScore] = useState(0);
  
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  const earnedPoints = Math.floor(total * 0.1);

  const filteredBanks = useMemo(() => {
    if (!bankSearch) return ALL_BANKS;
    return ALL_BANKS.filter(bank => 
      bank.toLowerCase().includes(bankSearch.toLowerCase())
    );
  }, [bankSearch]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const verifyUpi = () => {
    if (!upiId.includes('@')) return;
    setIsVerifyingUpi(true);
    setTimeout(() => {
      setIsVerifyingUpi(false);
      setIsUpiVerified(true);
    }, 1200);
  };

  useEffect(() => {
    setIsUpiVerified(false);
  }, [upiId]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    const orderDetails = {
      total: (total * 1.08).toFixed(2),
      itemsCount: items.length,
      customerName: address.fullName,
      shippingZip: address.zipCode,
      paymentType: paymentMethod,
      upiId: paymentMethod === 'upi' ? upiId : undefined,
      bank: paymentMethod === 'netbanking' ? selectedBank : undefined
    };
    
    try {
      const score = await detectFraudRisk(orderDetails);
      setCalculatedFraudScore(score);
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        window.scrollTo(0, 0);
      }, 2000);
    } catch (err) {
      console.error("AI Fraud Check Failed", err);
      setIsProcessing(false);
      setIsSuccess(true);
    }
  };

  const handleFinalize = () => {
    onPlaceOrder(address, paymentMethod, calculatedFraudScore);
  };

  if (isSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-reveal">
        <div className="text-center mb-12 relative">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-[2] animate-pulse"></div>
            <div className="relative w-40 h-40 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.5)] ring-8 ring-indigo-50">
              <CheckCircle size={80} strokeWidth={2} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-900 px-4 py-2 rounded-2xl shadow-xl font-black text-xs flex items-center gap-2 animate-bounce">
              <Sparkles size={16} />
              +{earnedPoints} Credits
            </div>
          </div>
          <h2 className="text-5xl font-display italic font-black text-slate-900 mb-4 tracking-tighter">Success!</h2>
          <p className="text-slate-500 text-xl leading-relaxed italic font-display">Your order {orderId} is confirmed.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto">
          <button onClick={handleFinalize} className="flex-1 bg-slate-900 text-white py-6 rounded-3xl font-black text-lg shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
            <Package size={24} /> Track Package
          </button>
          <button onClick={() => window.location.reload()} className="flex-1 bg-white border-2 border-slate-100 text-slate-600 py-6 rounded-3xl font-bold text-lg hover:border-slate-300 transition-all">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, Mastercard, AMEX' },
    { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, BHIM' },
    { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'All major banks supported' },
    { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay upon receiving order' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <button 
        onClick={onBack} 
        className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 mb-12 font-black text-[10px] uppercase tracking-[0.4em] transition-all group"
      >
        <div className="p-2 rounded-full border border-slate-200 group-hover:border-indigo-600 transition-colors">
          <ChevronLeft size={16} />
        </div>
        Return to Matrix
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-7 space-y-12">
          {/* Progress Header */}
          <div className="flex items-center gap-6 mb-16">
            <div className={`flex flex-col gap-2 ${step >= 1 ? 'text-slate-900' : 'text-slate-300'}`}>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Phase 01</span>
              <h4 className="text-lg font-black tracking-tight">Distribution</h4>
            </div>
            <div className="h-[2px] bg-slate-100 flex-1 relative overflow-hidden">
               <div className={`absolute inset-0 bg-slate-900 transition-transform duration-700 origin-left ${step >= 2 ? 'scale-x-100' : 'scale-x-0'}`} />
            </div>
            <div className={`flex flex-col gap-2 ${step >= 2 ? 'text-slate-900' : 'text-slate-300'}`}>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Phase 02</span>
              <h4 className="text-lg font-black tracking-tight">Settlement</h4>
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-8 animate-reveal">
              <h3 className="text-4xl font-display italic font-black text-slate-900 tracking-tighter uppercase mb-8">Shipping Artifacts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Full Identity</label>
                  <input required value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} className="w-full bg-white border border-slate-100 rounded-[24px] py-4 px-6 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" placeholder="Alex Rivera" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Comms Link</label>
                  <input required value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full bg-white border border-slate-100 rounded-[24px] py-4 px-6 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Physical Node Address</label>
                <input required value={address.address} onChange={e => setAddress({...address, address: e.target.value})} className="w-full bg-white border border-slate-100 rounded-[24px] py-4 px-6 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" placeholder="123 Vanguard Plaza, Suite 404" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">City Node</label>
                  <input required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full bg-white border border-slate-100 rounded-[24px] py-4 px-6 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" placeholder="San Francisco" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Area Code</label>
                  <input required value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} className="w-full bg-white border border-slate-100 rounded-[24px] py-4 px-6 text-slate-900 outline-none focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm" placeholder="94103" />
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-950 text-white py-6 rounded-[32px] font-black text-lg uppercase tracking-[0.4em] hover:bg-indigo-600 transition-all shadow-3xl active:scale-[0.98] mt-8">
                Confirm Phase 01
              </button>
            </form>
          ) : (
            <div className="space-y-12 animate-reveal">
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-4xl font-display italic font-black text-slate-900 tracking-tighter uppercase">Payment Matrix</h3>
                <button onClick={() => setStep(1)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline transition-colors pb-1">Edit Distribution</button>
              </div>
              
              {/* Enhanced Payment Selection */}
              <div className="grid grid-cols-1 gap-6">
                {paymentMethods.map(method => {
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-6 p-6 rounded-[40px] border-2 transition-all duration-500 text-left relative overflow-hidden group ${
                        isSelected 
                        ? 'border-slate-950 bg-slate-950 text-white shadow-[0_40px_80px_-20px_rgba(2,6,23,0.3)] scale-[1.02] z-10' 
                        : 'border-slate-100 hover:border-slate-300 bg-white text-slate-900'
                      }`}
                    >
                      {/* Selection Highlight Glow */}
                      {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent" />}

                      <div className={`p-4 rounded-2xl transition-all duration-500 ${isSelected ? 'bg-white text-slate-950 scale-110 shadow-xl' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                        <method.icon size={28} />
                      </div>
                      <div className="flex-1 relative z-10">
                        <p className={`text-xl font-display italic font-black ${isSelected ? 'text-white' : 'text-slate-950'}`}>{method.name}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-white/40' : 'text-slate-400'}`}>{method.description}</p>
                      </div>

                      {/* Prominent Checkmark Indicator */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ${
                        isSelected 
                        ? 'bg-indigo-500 text-white scale-100 opacity-100 rotate-0 shadow-lg' 
                        : 'bg-slate-100 text-transparent scale-50 opacity-0 -rotate-12'
                      }`}>
                        <Check size={20} strokeWidth={4} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sub-phase inputs */}
              <div className="pt-8 border-t border-slate-100 animate-reveal">
                {paymentMethod === 'card' && (
                  <div className="p-10 bg-white rounded-[48px] space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/5">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Card Matrix ID</label>
                      <input className="w-full bg-slate-50 border border-slate-100 rounded-[24px] py-4 px-6 text-slate-900 outline-none focus:bg-white focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Expiration</label>
                        <input className="w-full bg-slate-50 border border-slate-100 rounded-[24px] py-4 px-6 text-slate-900 outline-none focus:bg-white focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">CVC Cluster</label>
                        <input className="w-full bg-slate-50 border border-slate-100 rounded-[24px] py-4 px-6 text-slate-900 outline-none focus:bg-white focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all" placeholder="•••" type="password" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="p-10 bg-white rounded-[48px] space-y-6 border border-slate-100 shadow-2xl shadow-slate-900/5">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-3">Unified Protocol ID</label>
                      <div className="relative">
                        <input 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className={`w-full pl-6 pr-32 py-4 bg-slate-50 border rounded-[24px] text-slate-900 outline-none transition-all ${isUpiVerified ? 'border-green-500 bg-green-50' : 'border-slate-100 focus:bg-white focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900'}`} 
                          placeholder="identity@upi" 
                        />
                        <button 
                          onClick={verifyUpi}
                          className="absolute right-3 top-2.5 bg-slate-950 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
                        >
                          {isVerifyingUpi ? 'Sync...' : isUpiVerified ? 'Sync\'d' : 'Sync ID'}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {COMMON_HANDLES.map(handle => (
                        <button key={handle} onClick={() => setUpiId(prev => (prev.split('@')[0] || 'user') + handle)} className="px-5 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white hover:text-slate-900 hover:border-slate-900 transition-all">
                          {handle}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'netbanking' && (
                  <div className="p-10 bg-white rounded-[48px] space-y-10 border border-slate-100 shadow-2xl shadow-slate-900/5">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.8em] block mb-8 ml-3">Popular Node Banks</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {POPULAR_BANKS.map(bank => (
                          <button
                            key={bank.name}
                            onClick={() => setSelectedBank(bank.name)}
                            className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${selectedBank === bank.name ? 'border-slate-950 bg-slate-950 text-white shadow-xl scale-105' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
                          >
                            <span className="text-3xl">{bank.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-center">{bank.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <SearchIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Query bank clusters..."
                          value={bankSearch}
                          onChange={(e) => setBankSearch(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-[24px] py-4 pl-16 pr-6 text-sm outline-none focus:bg-white focus:ring-[12px] focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                        />
                      </div>
                      <div className="max-h-[250px] overflow-y-auto custom-scrollbar border border-slate-100 rounded-[32px] bg-slate-50/50">
                        {filteredBanks.map(bank => (
                          <button
                            key={bank}
                            onClick={() => setSelectedBank(bank)}
                            className={`w-full text-left px-8 py-5 text-sm flex items-center justify-between border-b border-slate-100 last:border-0 transition-all ${selectedBank === bank ? 'bg-white text-slate-950 font-black italic' : 'text-slate-500 hover:bg-white hover:text-slate-950'}`}
                          >
                            {bank}
                            {selectedBank === bank && <div className="p-1 bg-slate-950 text-white rounded-full"><Check size={12} strokeWidth={4} /></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing || (paymentMethod === 'netbanking' && !selectedBank) || (paymentMethod === 'upi' && !isUpiVerified)}
                className="w-full bg-slate-950 text-white py-8 rounded-[40px] font-black text-2xl uppercase tracking-[0.4em] flex items-center justify-center gap-6 hover:bg-indigo-600 transition-all shadow-[0_40px_80px_-20px_rgba(79,70,229,0.4)] disabled:opacity-20 disabled:scale-100 group relative overflow-hidden"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-4">
                    <Loader2 className="animate-spin" size={32} />
                    <span>Neural Verification...</span>
                  </div>
                ) : (
                  <>
                    Authorize Settlement <ArrowRight className="group-hover:translate-x-3 transition-transform" size={28} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-12">
          {/* Artifact Summary */}
          <div className="bg-white p-12 rounded-[64px] border border-slate-100 shadow-3xl space-y-12 sticky top-40 overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform"><ReceiptText size={200} /></div>
            
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[1em] mb-10">Matrix Summary</h4>
              <div className="space-y-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-center">
                    <img src={item.product.images[0]} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-950 line-clamp-1">{item.product.title}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.quantity} x ${item.product.price.toFixed(2)}</p>
                    </div>
                    <span className="text-sm font-black italic font-display">${(item.quantity * item.product.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 space-y-6">
               <div className="flex justify-between items-center text-slate-400">
                 <span className="text-[10px] font-black uppercase tracking-widest">Global Subtotal</span>
                 <span className="font-bold text-slate-900">${total.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center text-slate-400">
                 <span className="text-[10px] font-black uppercase tracking-widest">Matrix Fees (8%)</span>
                 <span className="font-bold text-slate-900">${(total * 0.08).toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center pt-10 border-t border-slate-100">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-950 uppercase tracking-[0.6em] mb-2">Final Value</span>
                    <span className="text-6xl font-display italic font-black text-indigo-600 tracking-tighter leading-none">${(total * 1.08).toFixed(2)}</span>
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
               <div className="p-3 bg-white rounded-2xl text-amber-500 shadow-sm"><Trophy size={24} /></div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-950">Identity Reward</p>
                  <p className="text-xs font-bold text-slate-400 uppercase">+{earnedPoints} Lux Credits Acquired</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;