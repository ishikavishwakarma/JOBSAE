import { useState, useEffect } from 'react';
import { Building2, Search, Filter, ArrowRight, Star, MapPin, Briefcase } from 'lucide-react';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';

const AllCompaniesPage = () => {
  useEffect(() => {
    document.title = 'Top Companies | JOBSAE';
  }, []);

  const companies = [
    { name: 'TechFlow', logo: 'TF', color: 'bg-blue-600', industry: 'Software & IT', rating: 4.8, jobs: 12, location: 'San Francisco, CA' },
    { name: 'HealthFirst', logo: 'HF', color: 'bg-emerald-600', industry: 'Healthcare', rating: 4.5, jobs: 8, location: 'New York, NY' },
    { name: 'Global Finance', logo: 'GF', color: 'bg-slate-900', industry: 'Banking', rating: 4.2, jobs: 15, location: 'London, UK' },
    { name: 'CreativeEdge', logo: 'CE', color: 'bg-purple-600', industry: 'Design Agency', rating: 4.9, jobs: 5, location: 'Berlin, DE' },
    { name: 'EcoRetail', logo: 'ER', color: 'bg-orange-600', industry: 'E-commerce', rating: 4.3, jobs: 20, location: 'Austin, TX' },
    { name: 'LogiSmart', logo: 'LS', color: 'bg-cyan-600', industry: 'Logistics', rating: 4.6, jobs: 14, location: 'Chicago, IL' },
    { name: 'SkyNet Systems', logo: 'SN', color: 'bg-indigo-600', industry: 'AI & Robotics', rating: 4.7, jobs: 9, location: 'Seattle, WA' },
    { name: 'PureAqua', logo: 'PA', color: 'bg-blue-400', industry: 'Sustainability', rating: 4.4, jobs: 11, location: 'Miami, FL' },
    { name: 'Nova Dynamics', logo: 'ND', color: 'bg-rose-600', industry: 'Aerospace', rating: 4.8, jobs: 7, location: 'Denver, CO' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header Section */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Work for the world's <span className="text-blue-600 dark:text-blue-400">best companies</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">
              Discover top-rated workplaces and find your dream role at industry-leading organizations.
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
               <div className="flex-1 flex items-center px-4 h-14 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Search className="w-5 h-5 text-slate-400 mr-3" />
                  <input placeholder="Search company by name..." className="bg-transparent border-none focus:ring-0 w-full outline-none text-lg font-medium" />
               </div>
               <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  Search Companies
               </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Companies Grid */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company, index) => (
              <div key={index} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden">
                {/* Visual Flair */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${company.color} opacity-[0.03] dark:opacity-[0.05] blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform`} />
                
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-20 h-20 ${company.color} rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-${company.color.split('-')[1]}-500/20`}>
                    {company.logo}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-amber-500 font-bold mb-1">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{company.rating}</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Reviews</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{company.name}</h2>
                  <div className="flex flex-wrap gap-4 text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {company.industry}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {company.location}
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="text-blue-600 dark:text-blue-400 font-bold">
                       {company.jobs} Open Jobs
                    </div>
                    <Button variant="ghost" className="group-hover:bg-blue-600 group-hover:text-white transition-all rounded-full px-6">
                      View Profile <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button variant="outline" className="h-14 px-12 border-slate-200 dark:border-slate-800 rounded-full font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-800">
               Load More Companies
            </Button>
          </div>
        </Container>
      </section>

    </div>
  );
};

export { AllCompaniesPage };
