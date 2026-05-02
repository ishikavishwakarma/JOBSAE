import { useState, useEffect } from 'react';
import { MapPin, Search, ArrowRight, ChevronRight, Globe, TrendingUp } from 'lucide-react';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';

const AllLocationsPage = () => {
  useEffect(() => {
    document.title = 'Job Locations | JOBSAE';
  }, []);

  const regions = [
    {
      name: 'United States',
      cities: [
        { name: 'New York', state: 'NY', jobs: '12,400', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop' },
        { name: 'San Francisco', state: 'CA', jobs: '8,180', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Austin', state: 'TX', jobs: '5,600', image: 'https://images.unsplash.com/photo-1531219248197-4a5cb5a39e4d?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Chicago', state: 'IL', jobs: '7,200', image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=2070&auto=format&fit=crop' },
      ]
    },
    {
      name: 'Europe',
      cities: [
        { name: 'London', state: 'UK', jobs: '15,310', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Berlin', state: 'Germany', jobs: '5,150', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Paris', state: 'France', jobs: '9,400', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Amsterdam', state: 'Netherlands', jobs: '4,200', image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=2070&auto=format&fit=crop' },
      ]
    },
    {
      name: 'Asia Pacific',
      cities: [
        { name: 'Tokyo', state: 'Japan', jobs: '11,200', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2071&auto=format&fit=crop' },
        { name: 'Singapore', state: 'Singapore', jobs: '6,800', image: 'https://images.unsplash.com/photo-1525625230556-8e807e9ad883?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Sydney', state: 'Australia', jobs: '4,900', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Dubai', state: 'UAE', jobs: '3,500', image: 'https://images.unsplash.com/photo-1512453979798-5ea4a73a88d6?q=80&w=2071&auto=format&fit=crop' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Search Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
              Find jobs in the world's <span className="text-blue-600 dark:text-blue-400">top cities</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">
              Browse opportunities across major global tech hubs and business centers.
            </p>
            
            <div className="relative group max-w-xl">
               <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600">
                  <Search className="w-6 h-6" />
               </div>
               <input 
                 placeholder="Search by city or country..." 
                 className="w-full h-16 pl-14 pr-6 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:border-blue-500 outline-none text-lg font-medium transition-all"
               />
            </div>
          </div>
        </Container>
      </section>

      {/* Locations Sections */}
      {regions.map((region, idx) => (
        <section key={idx} className={`py-20 ${idx % 2 !== 0 ? 'bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800' : ''}`}>
          <Container>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Globe className="w-8 h-8 text-blue-600" />
                {region.name}
              </h2>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                 <TrendingUp className="w-5 h-5" />
                 Growing Markets
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {region.cities.map((city, cityIdx) => (
                <a href="#" key={cityIdx} className="group flex flex-col bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={city.image} 
                      alt={city.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-xl font-bold">{city.name}</h4>
                      <p className="text-sm opacity-90">{city.state}</p>
                    </div>
                  </div>
                  <div className="p-5 flex justify-between items-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{city.jobs} Jobs</span>
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white rounded-[3rem] mx-4 lg:mx-auto max-w-7xl mb-20 overflow-hidden relative">
         <div className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full translate-y-32 translate-x-32" />
         <Container className="relative z-10 text-center">
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Can't find your city?</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">We are constantly expanding our reach to new regions and markets around the world.</p>
            <Button className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl">View All Global Markets</Button>
         </Container>
      </section>

    </div>
  );
};

export { AllLocationsPage };
