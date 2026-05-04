import { useState } from 'react';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CART_ITEM = {
  id: 1,
  type: 'Subscription',
  title: 'Small Company',
  amount: '$139.00',
  line1: '3 Job Listings',
  duration: 'Monthly Subscription'
};

const UPGRADE_OPTIONS = [
  { id: 'mid', title: 'Midsize Company (10 Jobs)', amount: '$229.00' },
  { id: 'large', title: 'Large Company (Unlimited Jobs)', amount: '$499.00' }
];

const LISTING_ONLY_OPTIONS = [
  { id: 'list1', title: '1 Job Listing', amount: '$49.99' },
  { id: 'list2', title: '2 Job Listings', amount: '$99.99' },
  { id: 'list3', title: '3 Job Listings', amount: '$149.99' }
];

export function CartPage() {
  const navigate = useNavigate();
  const [poNumber, setPoNumber] = useState('');
  const [purchaseName, setPurchaseName] = useState('');
  const [cartItem, setCartItem] = useState(CART_ITEM);

  const subtotal = cartItem ? parseFloat(cartItem.amount.replace('$', '')) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (!cartItem) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-950">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-full shadow-sm mb-6 border border-slate-100 dark:border-slate-800">
          <ShoppingBag className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-xl font-medium mb-6">Your cart is empty</h2>
        <Button onClick={() => navigate('/purchase-plan-listing')} variant="outline" className="px-8 border-slate-200">
          Browse Plans
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen  pb-20 font-sans">
      <Container className="py-1 max-w-5xl px-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Checkout</h1>
          <button onClick={() => navigate('/purchase-plan-listing')} className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Plans
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Details & Upgrades */}
          <div className="lg:col-span-7">
            
            {/* Selected Package */}
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Selected Package</h2>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">{cartItem.title}</h3>
                  <p className="text-sm text-slate-500 mb-1">{cartItem.duration}</p>
                  <p className="text-sm font-medium text-blue-600">{cartItem.line1}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">{cartItem.amount}</div>
                  <button 
                    onClick={() => setCartItem(null)}
                    className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1 justify-end w-full"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-8"></div>

            {/* Upgrades (Flex Layout, No Boxes) */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Upgrade Subscription</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                {UPGRADE_OPTIONS.map((option) => (
                  <button 
                    key={option.id}
                    className="flex-1 flex flex-col items-start hover:opacity-70 transition-opacity text-left"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{option.title}</span>
                    <span className="text-base font-semibold text-blue-600">{option.amount}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Upgrade Subscription</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                {LISTING_ONLY_OPTIONS.map((option) => (
                  <button 
                    key={option.id}
                    className="flex-1 flex flex-col items-start hover:opacity-70 transition-opacity text-left"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{option.title}</span>
                    <span className="text-base font-semibold text-blue-600">{option.amount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Alternative Options (Flex Layout, No Boxes) */}
            {/* <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Alternative Options</h2>
              <div className="flex flex-wrap gap-6">
                {LISTING_ONLY_OPTIONS.map((option) => (
                  <button 
                    key={option.id}
                    className="flex flex-col items-start hover:opacity-70 transition-opacity"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{option.title}</span>
                    <span className="text-sm font-semibold text-slate-500">{option.amount}</span>
                  </button>
                ))}
              </div>
            </div> */}

          </div>

          {/* Right Column: Checkout Info */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Taxes (8%)</span>
                  <span className="font-medium text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-500">PO Number (Optional)</Label>
                  <Input 
                    placeholder="Enter PO number" 
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-500">Purchase Name</Label>
                  <Input 
                    placeholder="Name of purchase" 
                    value={purchaseName}
                    onChange={(e) => setPurchaseName(e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              <Button className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Checkout
              </Button>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
