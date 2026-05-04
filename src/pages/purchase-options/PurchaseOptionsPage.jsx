import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PurchaseOptionCard } from './components/PurchaseOptionCard';

const SUBSCRIPTION_DATA = [
  {
    type: 'Subscription',
    title: 'Small Company',
    line1: '3 Job Listings',
    amount: 'USD 139',
    duration: 'monthly',
    description: 'Best for small employers',
    features: ['3 active jobs at any time', 'Standard support', 'Basic analytics']
  },
  {
    type: 'Subscription',
    title: 'Midsize Company',
    line1: '10 Job Listings',
    amount: 'USD 229',
    duration: 'monthly',
    isPopular: true,
    description: 'Medium size companies like this',
    features: ['10 active jobs at any time', 'Priority support', 'Advanced analytics', 'Featured listings']
  },
  {
    type: 'Subscription',
    title: 'Large Company',
    line1: 'Unlimited Job Listings',
    amount: 'USD 499',
    duration: 'monthly',
    description: "A large company's preference",
    features: ['Unlimited active jobs at any time', '24/7 Dedicated support', 'Custom reporting', 'Branded profile']
  }
];

const LISTING_DATA = [
  {
    type: 'Listing',
    title: 'Single Job Listing',
    line1: 'One month duration',
    amount: 'USD 49',
    description: 'Perfect for one-time hiring needs',
    features: ['Standard listing', 'One month visibility', 'Easy management']
  }
];

export function PurchaseOptionsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const getFilteredData = () => {
    if (activeTab === 'listing') return LISTING_DATA;
    if (activeTab === 'subscription') return SUBSCRIPTION_DATA;
    return [...SUBSCRIPTION_DATA, ...LISTING_DATA];
  };

  const currentData = getFilteredData();
  const columnCount = currentData.length > 3 ? 4 : 3;

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList variant="line" size="md" className="gap-8">
              <TabsTrigger value="all" className="px-6 py-2 font-bold tracking-tight text-base">All</TabsTrigger>
              <TabsTrigger value="listing" className="px-6 py-2 font-bold tracking-tight text-base">Listing</TabsTrigger>
              <TabsTrigger value="subscription" className="px-6 py-2 font-bold tracking-tight text-base">Subscription</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {currentData.map((card, index) => (
              <div 
                key={`${activeTab}-${index}`} 
                className={`
                  flex-grow-0 flex-shrink-0 w-full flex flex-col items-center
                  sm:w-[calc(50%-1.5rem)] 
                  ${columnCount === 4 
                    ? 'lg:w-[calc(25%-1.5rem)]' 
                    : 'lg:w-[calc(25%-1.5rem)]'
                  }
                  max-w-[400px]
                `}
              >
                <PurchaseOptionCard {...card} />
              </div>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
