import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container mx-auto py-1 px-4 max-w-6xl">
    
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList variant="line" size="md" className="gap-8">
              <TabsTrigger 
                value="all" 
                className="px-4 py-2 font-bold tracking-tight"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="listing" 
                className="px-4 py-2 font-bold tracking-tight"
              >
                Listing
              </TabsTrigger>
              <TabsTrigger 
                value="subscription" 
                className="px-4 py-2 font-bold tracking-tight"
              >
                Subscription
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {SUBSCRIPTION_DATA.map((card, index) => (
                <PurchaseOptionCard key={`sub-${index}`} {...card} />
              ))}
              {LISTING_DATA.map((card, index) => (
                <PurchaseOptionCard key={`list-${index}`} {...card} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="listing" className="focus-visible:outline-none">
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {LISTING_DATA.map((card, index) => (
                  <PurchaseOptionCard key={`list-tab-${index}`} {...card} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SUBSCRIPTION_DATA.map((card, index) => (
                <PurchaseOptionCard key={`sub-tab-${index}`} {...card} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
