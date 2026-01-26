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
  const [orderId] = useState(`LM-${Math.floor(100000 + Math.random() * 900000)}`);
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
      <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in zoom-in-95 duration-1000">
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
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Success!</h2>
          <p className="text-slate-500 text-xl leading-relaxed">Your order {orderId} is confirmed.</p>
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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors">
        <ChevronLeft size={20} /> Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-10">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>1</div>
              <span className="font-bold">Shipping</span>
            </div>
            <div className="h-px bg-slate-200 flex-1"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>2</div>
              <span className="font-bold">Payment</span>
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-black text-slate-900">Shipping Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Full Name" />
                <input required value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Phone Number" />
              </div>
              <input required value={address.address} onChange={e => setAddress({...address, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Street Address" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="City" />
                <input required value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Zip Code" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.99]">
                Continue to Payment
              </button>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900">Payment Method</h3>
                <button onClick={() => setStep(1)} className="text-xs font-bold text-indigo-600 uppercase hover:underline transition-colors">Edit Shipping</button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left relative overflow-hidden group ${
                      paymentMethod === method.id 
                      ? 'border-indigo-600 bg-indigo-50 shadow-lg scale-[1.02] z-10' 
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl transition-all ${paymentMethod === method.id ? 'bg-indigo-600 text-white scale-110' : 'bg-slate-100 text-slate-400'}`}>
                      <method.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-black ${paymentMethod === method.id ? 'text-indigo-900' : 'text-slate-900'}`}>{method.name}</p>
                      <p className={`text-xs ${paymentMethod === method.id ? 'text-indigo-600' : 'text-slate-500'}`}>{method.description}</p>
                    </div>
                    <div className={`p-1.5 rounded-full transition-all ${paymentMethod === method.id ? 'bg-indigo-600 text-white scale-100 opacity-100' : 'bg-slate-100 text-transparent scale-50 opacity-0'}`}>
                      <Check size={14} strokeWidth={4} />
                    </div>
                  </button>
                ))}
              </div>

              <div className="animate-in fade-in duration-300">
                {paymentMethod === 'card' && (
                  <div className="p-6 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
                    <input className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Card Number (0000 0000 0000 0000)" />
                    <div className="grid grid-cols-2 gap-4">
                      <input className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="MM/YY" />
                      <input className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="CVV" type="password" />
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="p-6 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
                    <div className="relative">
                      <input 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className={`w-full pl-4 pr-24 py-3 rounded-xl border outline-none ${isUpiVerified ? 'border-green-500 bg-green-50' : 'border-slate-200'}`} 
                        placeholder="username@upi" 
                      />
                      <button 
                        onClick={verifyUpi}
                        className="absolute right-2 top-1.5 bg-slate-900 text-white px-4 py-1.5 rounded-lg text-[10px] font-black"
                      >
                        {isVerifyingUpi ? '...' : isUpiVerified ? 'Verified' : 'Verify'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_HANDLES.map(handle => (
                        <button key={handle} onClick={() => setUpiId(prev => prev.split('@')[0] + handle)} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 hover:border-indigo-400">
                          {handle}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'netbanking' && (
                  <div className="p-6 bg-slate-50 rounded-3xl space-y-6 border border-slate-100">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Popular Banks</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {POPULAR_BANKS.map(bank => (
                          <button
                            key={bank.name}
                            onClick={() => setSelectedBank(bank.name)}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-2 ${selectedBank === bank.name ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
                          >
                            <span className="text-xl">{bank.icon}</span>
                            <span className="text-center line-clamp-1">{bank.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <SearchIcon size={16} className="absolute left-4 top-3.5 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search other banks..."
                          value={bankSearch}
                          onChange={(e) => setBankSearch(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar border border-slate-200 rounded-2xl bg-white">
                        {filteredBanks.map(bank => (
                          <button
                            key={bank}
                            onClick={() => setSelectedBank(bank)}
                            className={`w-full text-left px-5 py-3 text-sm flex items-center justify-between border-b last:border-0 ${selectedBank === bank ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                            {bank}
                            {selectedBank === bank && <Check size={14} />}
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
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-2xl disabled:opacity-50"
              >
                {isProcessing ? 'Gaurding with Lumina AI...' : `Pay ₹${(total * 1.08).toFixed(2)}`}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl space-y-6">
            <h4 className="text-lg font-black text-slate-900">Summary ({items.length})</h4>
            <div className="pt-6 border-t border-slate-100 space-y-4">
               <div className="flex justify-between text-slate-500 text-sm">
                 <span>Subtotal</span>
                 <span className="font-bold text-slate-900">₹{total.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center pt-2">
                 <span className="text-slate-900 font-black">Total</span>
                 <span className="text-2xl font-black text-indigo-600">₹{(total * 1.08).toFixed(2)}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;