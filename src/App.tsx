import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  ChevronDown, 
  CreditCard, 
  History as HistoryIcon, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Send, 
  Settings, 
  ShieldCheck, 
  Smartphone, 
  X,
  Bell,
  CheckCircle2,
  Headphones,
  Search,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Download,
  User,
  Lock,
  Globe,
  BellRing
} from 'lucide-react';

// --- Types ---
type Country = {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
};

type Transaction = {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  name: string;
  date: string;
  method: string;
  status: 'completed' | 'pending';
};

type Tab = 'dashboard' | 'transfers' | 'history' | 'settings';

// --- Mock Data ---
const COUNTRIES: Country[] = [
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'received', amount: 1250.00, name: 'Stripe Payout', date: 'Today, 2:30 PM', method: 'Bank Transfer', status: 'completed' },
  { id: '2', type: 'sent', amount: 45.00, name: 'Netflix Subscription', date: 'Yesterday, 10:00 AM', method: 'Card ending in 4242', status: 'completed' },
  { id: '3', type: 'sent', amount: 120.00, name: 'Alice Johnson', date: 'May 14, 4:15 PM', method: 'Mobile Money', status: 'completed' },
  { id: '4', type: 'received', amount: 300.00, name: 'Upwork Escrow', date: 'May 12, 9:00 AM', method: 'Bank Transfer', status: 'pending' },
  { id: '5', type: 'sent', amount: 15.50, name: 'Uber Rides', date: 'May 10, 8:45 PM', method: 'Card ending in 4242', status: 'completed' },
  { id: '6', type: 'sent', amount: 85.00, name: 'Electric Bill', date: 'May 08, 1:15 PM', method: 'Bank Transfer', status: 'completed' },
  { id: '7', type: 'received', amount: 50.00, name: 'Michael Smith', date: 'May 05, 6:30 PM', method: 'Mobile Money', status: 'completed' },
];

const RECENT_CONTACTS = [
  { name: 'Alice Johnson', initials: 'AJ', color: 'bg-pink-100 text-pink-700' },
  { name: 'Michael Smith', initials: 'MS', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'Sarah Connor', initials: 'SC', color: 'bg-purple-100 text-purple-700' },
  { name: 'David Kim', initials: 'DK', color: 'bg-amber-100 text-amber-700' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [balance, setBalance] = useState(14500.50);

  // Form State
  const [recipient, setRecipient] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card' | 'bank'>('mobile');
  
  // Payment Flow State
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const handleSendMoney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !recipientPhone || !amount || isNaN(Number(amount))) return;
    
    // Basic phone validation
    if (recipientPhone.replace(/\D/g, '').length < 5) {
      alert("Please enter a valid phone number");
      return;
    }

    setIsConfirming(true);
  };

  const confirmPayment = () => {
    setPaymentStatus('processing');
    
    // Simulate network request
    setTimeout(() => {
      setPaymentStatus('success');
      
      const numericAmount = parseFloat(amount);
      setBalance(prev => prev - numericAmount);
      
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'sent',
        amount: numericAmount,
        name: recipient,
        date: 'Just now',
        method: paymentMethod === 'mobile' ? 'Mobile Money' : paymentMethod === 'card' ? 'Card Payment' : 'Bank Transfer',
        status: 'completed'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);

      setTimeout(() => {
        setIsConfirming(false);
        setPaymentStatus('idle');
        setRecipient('');
        setRecipientPhone('');
        setAmount('');
        setActiveTab('history'); // Navigate to history to see new tx
      }, 2000);
      
    }, 1500);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const selectContact = (name: string) => {
    setRecipient(name);
    setActiveTab('dashboard'); // Jump back to dashboard to complete payment
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- RENDERERS ---

  const renderDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: Balance & Payment Form */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-brand-blue-dark to-brand-blue rounded-3xl p-8 text-white shadow-xl shadow-brand-blue/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="text-brand-blue-light font-medium mb-1">Total Balance</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{formatCurrency(balance)}</h2>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setActiveTab('transfers')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                 <ArrowDownLeft size={16} /> Request
              </button>
              <button 
                onClick={() => {
                  document.getElementById('recipient-input')?.focus();
                }}
                className="px-4 py-2 bg-white text-brand-blue text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
              >
                 <ArrowUpRight size={16} /> Send
              </button>
            </div>
          </div>
        </div>

        {/* Payment Form Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative" id="payment-form">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
            <Send className="text-brand-blue" size={20} /> Quick Transfer
          </h3>

          <form onSubmit={handleSendMoney} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sender Name</label>
              <input 
                type="text" 
                value="Alex Carter" 
                disabled 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recipient Name</label>
                  <input 
                    id="recipient-input"
                    type="text" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="e.g. John Doe" 
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recipient Phone</label>
                  <div className="flex relative">
                    <button 
                      type="button" 
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="flex-shrink-0 flex items-center justify-between px-3 py-3 bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:border-brand-blue z-10 w-[110px]"
                    >
                       <div className="flex items-center gap-2">
                         <span className="text-lg leading-none">{selectedCountry.flag}</span>
                         <span className="font-semibold text-sm">{selectedCountry.dialCode}</span>
                       </div>
                       <ChevronDown size={14} className="text-slate-400 ml-1" />
                    </button>
                    
                    <div className="relative flex-1">
                      <input 
                        type="tel"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value.replace(/[^0-9\s-]/g, ''))}
                        placeholder="000 000 000"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-r-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                        required
                      />
                    </div>

                    <AnimatePresence>
                      {isCountryDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setIsCountryDropdownOpen(false)}></div>
                          <motion.div 
                             initial={{ opacity: 0, y: -10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -10 }}
                             className="absolute top-14 left-0 z-30 w-72 bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-100 max-h-64 overflow-y-auto"
                          >
                             {COUNTRIES.map(country => (
                               <button
                                 key={country.code}
                                 type="button"
                                 onClick={() => {
                                    setSelectedCountry(country);
                                    setIsCountryDropdownOpen(false);
                                 }}
                                 className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                               >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xl leading-none">{country.flag}</span>
                                    <span className="text-sm font-medium text-slate-700">{country.name}</span>
                                  </div>
                                  <span className="text-xs font-semibold text-slate-400">{country.dialCode}</span>
                               </button>
                             ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00" 
                    required
                    className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('mobile')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'mobile' ? 'border-brand-blue bg-brand-blue-light text-brand-blue' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                >
                  <Smartphone size={24} className="mb-2" />
                  <span className="text-xs font-semibold text-center leading-tight">Mobile<br/>Money</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'card' ? 'border-brand-blue bg-brand-blue-light text-brand-blue' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                >
                  <CreditCard size={24} className="mb-2" />
                  <span className="text-xs font-semibold text-center leading-tight">Credit/Debit<br/>Card</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'bank' ? 'border-brand-blue bg-brand-blue-light text-brand-blue' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                >
                  <Building2 size={24} className="mb-2" />
                  <span className="text-xs font-semibold text-center leading-tight">Bank<br/>Transfer</span>
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-lg transition-transform active:scale-[0.98] shadow-lg shadow-slate-900/10"
            >
              Review Payment <ArrowRightLeft size={18} />
            </button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-4">
              <ShieldCheck size={14} className="text-green-500" />
              <span>Transactions are end-to-end encrypted</span>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Transaction History Snippet */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
            <button 
              onClick={() => setActiveTab('history')}
              className="text-brand-blue text-sm font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {transactions.slice(0, 5).map((tx) => (
                <motion.div 
                  key={tx.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'received' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {tx.type === 'received' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 truncate max-w-[140px] sm:max-w-xs">{tx.name}</p>
                      <p className="text-xs text-slate-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === 'received' ? 'text-green-600' : 'text-slate-800'}`}>
                      {tx.type === 'received' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">{tx.status}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
          <p className="text-slate-500 text-sm mt-1">Review your full history of payments and requests.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
              <th className="pb-4 font-semibold px-4 cursor-pointer hover:text-slate-600">Transaction</th>
              <th className="pb-4 font-semibold px-4">Method & Date</th>
              <th className="pb-4 font-semibold px-4 text-center">Status</th>
              <th className="pb-4 font-semibold px-4 text-right cursor-pointer hover:text-slate-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${tx.type === 'received' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {tx.type === 'received' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{tx.name}</p>
                      <p className="text-xs text-slate-400">ID: {tx.id.toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm font-medium text-slate-700">{tx.method}</p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full ${tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <p className={`font-bold ${tx.type === 'received' ? 'text-green-600' : 'text-slate-800'}`}>
                    {tx.type === 'received' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination mock */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
        <p className="text-sm text-slate-500">Showing 1 to {transactions.length} of {transactions.length} results</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 disabled:opacity-50 cursor-not-allowed">Prev</button>
          <button className="px-3 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50">Next</button>
        </div>
      </div>
    </motion.div>
  );

  const renderTransfers = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Send Money</h2>
          
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Recent Contacts</h3>
            <div className="flex flex-wrap gap-4">
              {RECENT_CONTACTS.map(contact => (
                <button 
                  key={contact.name}
                  onClick={() => selectContact(contact.name)}
                  className="flex flex-col items-center justify-center w-20 group"
                >
                  <div className={`w-14 h-14 rounded-full ${contact.color} flex items-center justify-center text-lg font-bold mb-2 group-hover:ring-4 group-hover:ring-brand-blue/20 transition-all shadow-sm`}>
                    {contact.initials}
                  </div>
                  <span className="text-xs text-slate-600 text-center font-medium line-clamp-1">{contact.name}</span>
                </button>
              ))}
              <button 
                className="flex flex-col items-center justify-center w-20 group"
              >
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center mb-2 group-hover:border-brand-blue group-hover:text-brand-blue transition-all">
                  <Search size={20} />
                </div>
                <span className="text-xs text-slate-500 text-center font-medium">Search</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Or enter details manually</h3>
            <p className="text-sm text-slate-500 mb-6">You can quickly jump to the dashboard to complete the transaction.</p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3 bg-brand-blue text-white rounded-xl font-semibold hover:bg-brand-blue-dark transition-colors inline-flex items-center gap-2 shadow-lg shadow-brand-blue/20"
            >
              Go to Transfer Form <ArrowUpRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
      <div className="lg:col-span-4">
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="bg-brand-blue-dark rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-brand-blue/20"
        >
          <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Secure Transfers</h3>
          <p className="text-brand-blue-light text-sm leading-relaxed mb-6">
            All your transfers are protected with bank-level encryption. Your money is safe with SwiftPay.
          </p>
          <ul className="space-y-3 text-sm text-white/90">
             <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-green-400" /> Instant verification</li>
             <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-green-400" /> Fraud protection 24/7</li>
             <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-green-400" /> Zero hidden fees</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Account Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your profile, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-2">
          {/* Settings Navigation Menu (Mock) */}
          <button className="w-full text-left px-4 py-3 bg-white border border-brand-blue text-brand-blue rounded-xl font-semibold shadow-sm flex items-center gap-3">
            <User size={18}/> Profile Information
          </button>
          <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors flex items-center gap-3">
            <ShieldCheck size={18}/> Security limits
          </button>
          <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors flex items-center gap-3">
            <BellRing size={18}/> Notifications
          </button>
          <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors flex items-center gap-3">
            <Globe size={18}/> Language & Region
          </button>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold border-4 border-white shadow-sm">
                 AC
               </div>
               <div>
                 <h3 className="text-xl font-bold text-slate-800">Alex Carter</h3>
                 <p className="text-slate-500 text-sm">Personal Account • ID: SWF-10294</p>
                 <button className="text-brand-blue text-sm font-semibold mt-1">Change Avatar</button>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" defaultValue="Alex Carter" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" defaultValue="alex.carter@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input type="text" defaultValue="+1 (555) 123-4567" disabled className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Timezone</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none">
                  <option>Eastern Time (US & Canada)</option>
                  <option>Pacific Time (US & Canada)</option>
                  <option>UTC / GMT</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
              <button className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">Cancel</button>
              <button className="px-6 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl font-semibold transition-colors">Save Changes</button>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Lock size={18} className="text-slate-400"/> Security</h3>
             <div className="flex items-center justify-between py-4 border-b border-slate-50">
               <div>
                 <p className="font-semibold text-slate-800">Two-Factor Authentication</p>
                 <p className="text-sm text-slate-500">Protect your account with an extra layer of security.</p>
               </div>
               <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-blue">
                 <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition"></span>
               </button>
             </div>
             <div className="flex items-center justify-between py-4">
               <div>
                 <p className="font-semibold text-slate-800">Change Password</p>
                 <p className="text-sm text-slate-500">Update your password regularly to keep your account safe.</p>
               </div>
               <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50">Update</button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // --- COMPONENT MAP ---
  const tabContent = {
    dashboard: renderDashboard,
    transfers: renderTransfers,
    history: renderHistory,
    settings: renderSettings
  };

  // --- NAVIGATION CONFIG ---
  const navItems: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transfers', label: 'Transfers', icon: ArrowRightLeft },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-brand-bg)] w-full font-sans text-slate-800 selection:bg-brand-blue selection:text-white">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-brand-blue rounded-xl flex items-center justify-center text-white">
            <LayoutDashboard size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">SwiftPay</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive ? 'bg-brand-blue-light text-brand-blue' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} /> {item.label}
              </button>
            )
          })}
        </nav>

        {/* Support Block per Requirements */}
        <div className="p-4 mt-auto">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-brand-blue font-semibold mb-1">
              <Headphones size={18} />
              <span className="text-sm">24/7 Support</span>
            </div>
            <p className="text-xs text-slate-500 mb-2 leading-relaxed">
              Have an issue with a payment? Contact our team.
            </p>
            <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 flex items-center justify-center">
              074****882
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-600 transition-colors rounded-lg font-medium">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-blue rounded-xl flex items-center justify-center text-white">
            <LayoutDashboard size={18} />
          </div>
          <span className="font-bold text-lg text-slate-900">SwiftPay</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-slate-500 hover:bg-slate-50 p-2 rounded-full">
            <Bell size={20} />
          </button>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-700 p-1">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU MODAL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 flex justify-between items-center border-b border-slate-100">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-500">
                  <X size={20} />
                </button>
              </div>
              
              <nav className="p-4 space-y-2 flex-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button 
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                        isActive ? 'bg-brand-blue-light text-brand-blue' : 'text-slate-600'
                      }`}
                    >
                      <Icon size={20} /> {item.label}
                    </button>
                  )
                })}
              </nav>

              <div className="p-6 mt-auto border-t border-slate-100">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                  <p className="text-xs text-slate-500 mb-1">Support Number</p>
                  <p className="font-bold text-slate-700">074****882</p>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-full overflow-y-auto w-full pt-20 lg:pt-0 relative">
        {/* Top bar desktop */}
        <div className="hidden lg:flex items-center justify-between px-8 py-6 bg-transparent">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions, payees..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-brand-bg)]"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 leading-tight">Alex Carter</p>
                <p className="text-xs text-slate-500">Personal Account</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden border border-indigo-200 shadow-sm">
                AC
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 lg:px-8 pb-8 lg:pb-12 max-w-7xl mx-auto">
          {tabContent[activeTab]()}
        </div>
      </main>

      {/* CONFIRMATION OVERLAY MODAL */}
      <AnimatePresence>
        {isConfirming && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => paymentStatus === 'idle' && setIsConfirming(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md relative z-10 overflow-hidden"
            >
              {paymentStatus === 'idle' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Confirm Payment</h3>
                    <button 
                      onClick={() => setIsConfirming(false)}
                      className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="text-center mb-8">
                    <p className="text-sm text-slate-500 mb-1">You are sending</p>
                    <h4 className="text-4xl font-bold tracking-tight text-slate-900">{formatCurrency(parseFloat(amount))}</h4>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 mb-8 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">To</span>
                      <div className="text-right">
                        <span className="font-semibold text-slate-800 text-sm block">{recipient}</span>
                        <span className="text-slate-500 text-xs block">{selectedCountry.dialCode} {recipientPhone}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Method</span>
                      <span className="font-semibold text-slate-800 text-sm">
                        {paymentMethod === 'mobile' ? 'Mobile Money' : paymentMethod === 'card' ? 'Card ending 4242' : 'Bank Transfer'}
                      </span>
                    </div>
                    <div className="w-full h-px bg-slate-200"></div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Fee</span>
                      <span className="font-semibold text-slate-800 text-sm">$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-800 font-bold text-sm">Total</span>
                      <span className="font-bold text-brand-blue text-sm">{formatCurrency(parseFloat(amount))}</span>
                    </div>
                  </div>

                  <button 
                    onClick={confirmPayment}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-brand-blue/20"
                  >
                    Confirm & Send 
                  </button>
                </>
              )}

              {paymentStatus === 'processing' && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-brand-blue rounded-full animate-spin mb-6"></div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Processing Payment</h3>
                  <p className="text-slate-500 text-sm">Securely connecting to your provider...</p>
                </div>
              )}

              {paymentStatus === 'success' && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-10 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Payment Sent!</h3>
                  <p className="text-slate-500 text-sm mb-6">Your money is on its way to {recipient}.</p>
                  
                  <div className="bg-slate-50 w-full p-4 rounded-xl font-mono text-xs text-slate-500 mb-6 border border-slate-100">
                    ID: {Math.random().toString(36).substr(2, 12).toUpperCase()}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
