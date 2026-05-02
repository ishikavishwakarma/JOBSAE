import { useState, useEffect } from 'react';
import { 
  Building2, 
  LayoutGrid, 
  MapPin, 
  Tag, 
  ArrowRight, 
  ChevronRight,
  Briefcase,
  Monitor,
  Users,
  TrendingUp,
  Target,
  Globe
} from 'lucide-react';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const JobsNearMePage = () => {
  useEffect(() => {
    document.title = 'Jobs Near Me | JOBSAE';
  }, []);

  const companies = [
    { name: 'TechFlow', logo: 'TF', color: 'bg-blue-600', industry: 'Software', openJobs: '12' },
    { name: 'HealthFirst', logo: 'HF', color: 'bg-emerald-600', industry: 'Healthcare', openJobs: '8' },
    { name: 'Global Finance', logo: 'GF', color: 'bg-slate-900', industry: 'Finance', openJobs: '15' },
    { name: 'CreativeEdge', logo: 'CE', color: 'bg-purple-600', industry: 'Design', openJobs: '5' },
    { name: 'EcoRetail', logo: 'ER', color: 'bg-orange-600', industry: 'Retail', openJobs: '20' },
    { name: 'LogiSmart', logo: 'LS', color: 'bg-cyan-600', industry: 'Logistics', openJobs: '14' },
  ];

  const categories = [
    { name: 'Technology', jobs: '1,240', icon: <Monitor className="w-6 h-6" /> },
    { name: 'Marketing', jobs: '850', icon: <Target className="w-6 h-6" /> },
    { name: 'Healthcare', jobs: '2,100', icon: <Users className="w-6 h-6" /> },
    { name: 'Finance', jobs: '980', icon: <TrendingUp className="w-6 h-6" /> },
    { name: 'Customer Service', jobs: '1,500', icon: <Users className="w-6 h-6" /> },
    { name: 'Operations', jobs: '640', icon: <LayoutGrid className="w-6 h-6" /> },
  ];

  const locations = [
    { city: 'New York', jobs: '4,500+' },
    { city: 'San Francisco', jobs: '3,200+' },
    { city: 'Austin', jobs: '1,800+' },
    { city: 'Chicago', jobs: '2,400+' },
    { city: 'Seattle', jobs: '2,100+' },
    { city: 'Miami', jobs: '1,200+' },
    { city: 'Denver', jobs: '1,500+' },
    { city: 'Boston', jobs: '1,900+' },
  ];

  const keywords = [
    'Remote', 'Full-time', 'Junior Developer', 'Manager', 'Hybrid', 
    'Entry Level', 'Immediate Start', 'High Salary', 'Night Shift', 'Weekend'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20">
      
      {/* Hero Section for Jobs Near Me */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <Container>
          <div className="max-w-3xl relative z-10">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-4">
               <MapPin className="w-5 h-5" />
               <span>Based on your location</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Local Jobs in your <span className="text-blue-600 dark:text-blue-400">Neighborhood</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl">
              We've found thousands of opportunities within 25 miles of you. Start your next chapter close to home.
            </p>
            <div className="flex flex-wrap gap-4">
               <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold">Browse All Near Me</Button>
               <Button variant="outline" className="h-12 px-8 border-slate-200 dark:border-slate-700">Update Location</Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 1. Top Companies Section */}
      <section className="py-20">
        <Container>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                Top Companies Hiring Near You
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Work with industry leaders in your area.</p>
            </div>
            <Link to="/companies">
              <Button variant="outline" className="hidden sm:flex border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-100 dark:hover:bg-slate-800">
                Show All Companies <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <div key={index} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl transition-all group border-b-4 border-b-transparent hover:border-b-blue-600">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 ${company.color} rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                    {company.logo}
                  </div>
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                    {company.openJobs} Open Roles
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{company.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">{company.industry}</p>
                <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
                  View Profile <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Categories Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <Container>
          <div className="mb-10 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LayoutGrid className="w-6 h-6 text-blue-600" />
              Popular Local Categories
            </h2>
            <Link to="/categories">
              <Button variant="outline" className="hidden sm:flex border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-100 dark:hover:bg-slate-800">
                Show All Categories <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, index) => (
              <a href="#" key={index} className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all group">
                <div className="w-12 h-12 mb-4 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shadow-md group-hover:bg-blue-500 group-hover:text-white">
                  {cat.icon}
                </div>
                <h4 className="font-bold text-sm mb-1">{cat.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-blue-100">{cat.jobs} jobs</p>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Locations Section */}
      <section className="py-20">
        <Container>
          <div className="mb-10 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              Explore Nearby Areas
            </h2>
            <Link to="/locations">
              <Button variant="outline" className="hidden sm:flex border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-100 dark:hover:bg-slate-800">
                Show All Locations <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {locations.map((loc, index) => (
              <a href="#" key={index} className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all group">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{loc.city}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{loc.jobs}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Keywords Section */}
      <section className="py-20 bg-slate-900 text-white rounded-[2rem] mx-4 lg:mx-auto max-w-7xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent)]" />
        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Tag className="w-7 h-7 text-blue-400" />
              Top Search Keywords
            </h2>
            <p className="text-slate-400 text-lg">Quickly find exactly what you're looking for with our most popular local search terms.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {keywords.map((word, index) => (
              <a 
                key={index} 
                href="#" 
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-lg font-semibold transition-all hover:scale-105 hover:border-blue-400/50"
              >
                {word}
              </a>
            ))}
          </div>
        </Container>
      </section>

    </div>
  );
};

export { JobsNearMePage };
