import { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Globe, 
  Briefcase, 
  Users, 
  Smartphone, 
  Target,
  ArrowRight,
  Check,
  TrendingUp,
  LayoutGrid,
  Monitor,
  Share2,
  Play,
  ChevronRight
} from 'lucide-react';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [search, setSearch] = useState({
    keyword: '',
    cityState: '',
    country: ''
  });

  useEffect(() => {
    document.title = 'JOBSAE | Find Your Next Job';
  }, []);

  const categories = [
    { name: 'Technology & IT', jobs: '1,420 jobs', icon: <Monitor className="w-6 h-6" /> },
    { name: 'Healthcare', jobs: '2,150 jobs', icon: <Users className="w-6 h-6" /> },
    { name: 'Finance & Banking', jobs: '980 jobs', icon: <TrendingUp className="w-6 h-6" /> },
    { name: 'Creative & Design', jobs: '640 jobs', icon: <LayoutGrid className="w-6 h-6" /> },
    { name: 'Marketing & PR', jobs: '850 jobs', icon: <Target className="w-6 h-6" /> },
    { name: 'Business & Management', jobs: '720 jobs', icon: <Briefcase className="w-6 h-6" /> },
  ];

  const locations = [
    { city: 'New York', state: 'NY', country: 'USA', image: '/media/images/600x400/1.jpg', jobs: '12,400' },
    { city: 'San Francisco', state: 'CA', country: 'USA', image: '/media/images/600x400/2.jpg', jobs: '8,180' },
    { city: 'London', state: 'Greater London', country: 'UK', image: '/media/images/600x400/3.jpg', jobs: '15,310' },
    { city: 'Berlin', state: 'Berlin', country: 'Germany', image: '/media/images/600x400/4.jpg', jobs: '5,150' },
  ];

  const popularKeywords = [
    'Work from home', 'Software Engineer', 'Data Analyst', 'Marketing Manager', 
    'Project Manager', 'Customer Service', 'Sales Representative', 
    'Graphic Designer', 'Nurse', 'Part-time'
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-16 pb-20 lg:pt-24 lg:pb-32 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[140px] rounded-full pointer-events-none" />
        
        <Container>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-semibold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
              Discover your next <span className="text-blue-600 dark:text-blue-400">career milestone</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-normal">
              Access millions of opportunities and expert insights to find the role that truly fits your life and ambition.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-3 flex flex-col md:flex-row items-center gap-0 group transition-all hover:border-blue-500 dark:hover:border-blue-400">
              
              <div className="flex-1 flex items-center px-6 w-full md:w-auto h-16 transition-colors group-focus-within:bg-slate-50/50 dark:group-focus-within:bg-slate-900/50 rounded-l-xl">
                <Search className="w-6 h-6 text-slate-400 dark:text-slate-500 shrink-0" />
                <input 
                  placeholder="Job title, keywords, or company" 
                  className="w-full bg-transparent border-none focus:ring-0 text-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 outline-none font-medium"
                  value={search.keyword}
                  onChange={e => setSearch({...search, keyword: e.target.value})}
                />
              </div>
              
              <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-700" />

              <div className="flex-1 flex items-center px-6 w-full md:w-auto h-16 transition-colors">
                <MapPin className="w-6 h-6 text-slate-400 dark:text-slate-500 shrink-0" />
                <input 
                  placeholder="City, state, or zip" 
                  className="w-full bg-transparent border-none focus:ring-0 text-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 outline-none font-medium"
                  value={search.cityState}
                  onChange={e => setSearch({...search, cityState: e.target.value})}
                />
              </div>

              <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-700" />

              <div className="flex-1 flex items-center px-6 w-full md:w-auto h-16 transition-colors">
                <Globe className="w-6 h-6 text-slate-400 dark:text-slate-500 shrink-0" />
                <input 
                  placeholder="Country" 
                  className="w-full bg-transparent border-none focus:ring-0 text-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 outline-none font-medium"
                  value={search.country}
                  onChange={e => setSearch({...search, country: e.target.value})}
                />
              </div>

              <div className="w-full md:w-auto p-1">
                <Button className="w-full md:w-auto h-14 px-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
                  Find Jobs
                </Button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-10 text-center">
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-200 block md:inline mb-3 md:mb-0 mr-4">
                Popular searches:
              </span>
              <div className="inline-flex flex-wrap justify-center gap-x-6 gap-y-3">
                {popularKeywords.map((keyword, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 pb-0.5"
                  >
                    {keyword}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Categories Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <Container>
          <div className="flex justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-3">Browse Jobs by Category</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-normal">Explore roles tailored to your unique expertise and career goals.</p>
            </div>
            <Link to="/categories" className="hidden sm:flex items-center text-blue-600 dark:text-blue-400 font-bold text-lg hover:text-blue-700 dark:hover:text-blue-300">
               Browse all <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((cat, idx) => (
              <a href="#" key={idx} className="flex items-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cat.name}</h3>
                  <p className="text-base text-slate-500 dark:text-slate-400 mt-1">{cat.jobs}</p>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <Container>
          <div className="text-center mb-20">
            <h2 className="text-4xl font-semibold text-slate-900 dark:text-white mb-6">Empowering your hiring journey</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal">From online distribution to social media reach, JOBSAE provides a complete recruitment ecosystem.</p>
          </div>

          <div className="space-y-32">
            {/* JOBSAE Online */}
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1 order-2 lg:order-1">
                <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-6">JOBSAE Online</div>
                <h3 className="text-4xl font-semibold text-slate-900 dark:text-white mb-6 leading-tight">Publish jobs online, <br/>reach candidates instantly</h3>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-normal">
                  Our advanced distribution network ensures your job listings appear on top search engines and job boards the moment you hit publish.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start text-lg text-slate-700 dark:text-slate-300 font-normal"><Check className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-4 shrink-0 mt-0.5" /> Unified multi-platform reach</li>
                  <li className="flex items-start text-lg text-slate-700 dark:text-slate-300 font-normal"><Check className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-4 shrink-0 mt-0.5" /> AI-optimized candidate matching</li>
                  <li className="flex items-start text-lg text-slate-700 dark:text-slate-300 font-normal"><Check className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-4 shrink-0 mt-0.5" /> Smart applicant tracking dashboard</li>
                </ul>
                <Button className="h-14 px-10 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg">Get Started</Button>
              </div>
              <div className="flex-1 order-1 lg:order-2 w-full">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl aspect-video overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl flex items-center justify-center relative">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-70 mix-blend-multiply dark:mix-blend-overlay scale-110" />
                   <div className="relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white dark:border-slate-700 max-w-sm w-full mx-4 transform -rotate-2">
                      <div className="flex items-center gap-5 mb-6">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center"><Monitor className="w-7 h-7" /></div>
                        <div>
                          <div className="text-lg font-semibold dark:text-white">Senior Product Designer</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Design Studio • Remote</div>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-3"></div>
                      <div className="w-3/4 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                      <Button className="w-full mt-6 h-11 text-sm font-semibold" variant="outline">View Listing</Button>
                   </div>
                </div>
              </div>
            </div>

            {/* JOBSAE Social */}
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1 w-full">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl aspect-video overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl flex items-center justify-center relative">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-70 mix-blend-multiply dark:mix-blend-overlay scale-110" />
                   <div className="relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white dark:border-slate-700 max-w-xs w-full mx-4 transform rotate-2">
                      <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                         <div className="flex items-center gap-3 text-pink-600 dark:text-pink-400 font-bold text-lg"><Share2 className="w-6 h-6" /> Instagram</div>
                         <div className="text-xs font-bold uppercase tracking-wider bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 px-3 py-1.5 rounded-full">Boosted</div>
                      </div>
                      <div className="w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 flex items-center justify-center">
                         <Play className="w-12 h-12 text-white dark:text-slate-500 fill-slate-300 dark:fill-slate-600" />
                      </div>
                      <div className="font-semibold text-base dark:text-white">Growing our engineering team!</div>
                   </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-block px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-sm font-semibold mb-6">JOBSAE Social</div>
                <h3 className="text-4xl font-semibold text-slate-900 dark:text-white mb-6 leading-tight">Leverage the power of <br/>social networks</h3>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-normal">
                  Turn your job listings into engaging social content. Reach passive candidates where they spend their time—on Instagram, TikTok, and Facebook.
                </p>
                <div className="grid sm:grid-cols-2 gap-8 mb-10">
                  <div>
                    <Smartphone className="w-8 h-8 text-pink-600 dark:text-pink-400 mb-3" />
                    <h4 className="font-semibold text-lg text-slate-900 dark:text-white">Mobile Optimized</h4>
                    <p className="text-base text-slate-600 dark:text-slate-400 mt-2 font-normal">Perfectly formatted for vertical scrolling and mobile browsing.</p>
                  </div>
                  <div>
                    <Target className="w-8 h-8 text-pink-600 dark:text-pink-400 mb-3" />
                    <h4 className="font-semibold text-lg text-slate-900 dark:text-white">Hyper-Local Targeting</h4>
                    <p className="text-base text-slate-600 dark:text-slate-400 mt-2 font-normal">Pinpoint candidates in specific neighborhoods and cities.</p>
                  </div>
                </div>
                <Button className="h-14 px-10 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-lg rounded-xl shadow-lg">Explore Social Hiring</Button>
              </div>
            </div>

            {/* JOBSAE Signs */}
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1 order-2 lg:order-1">
                <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-semibold mb-6">JOBSAE Signs</div>
                <h3 className="text-4xl font-semibold text-slate-900 dark:text-white mb-6 leading-tight">Traditional hiring, <br/>modern execution</h3>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-normal">
                  Bridge the gap between physical storefronts and digital applications with professional print templates and integrated QR technology.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start text-lg text-slate-700 dark:text-slate-300 font-normal"><Check className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-4 shrink-0 mt-0.5" /> High-impact storefront displays</li>
                  <li className="flex items-start text-lg text-slate-700 dark:text-slate-300 font-normal"><Check className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-4 shrink-0 mt-0.5" /> Scan-to-apply QR code integration</li>
                  <li className="flex items-start text-lg text-slate-700 dark:text-slate-300 font-normal"><Check className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-4 shrink-0 mt-0.5" /> Custom vehicle and banner formats</li>
                </ul>
                <Button className="h-14 px-10 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-lg rounded-xl shadow-lg">Browse Templates</Button>
              </div>
              <div className="flex-1 order-1 lg:order-2 w-full">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl aspect-video overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl flex items-center justify-center p-12 relative">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-70 mix-blend-multiply dark:mix-blend-overlay scale-110" />
                   <div className="relative z-10 w-full max-w-xs aspect-[3/4] bg-white rounded-xl shadow-2xl border-[12px] border-white flex flex-col items-center justify-center p-8 text-center transform -rotate-2">
                      <div className="text-red-600 font-bold text-5xl mb-4 tracking-tighter uppercase leading-none">HELP<br/>WANTED</div>
                      <div className="w-20 h-1.5 bg-red-600 mb-6"></div>
                      <div className="font-semibold text-2xl mb-8 text-slate-900 leading-tight">Apply Inside<br/>or Scan Now</div>
                      <div className="w-40 h-40 bg-slate-900 rounded-lg p-3">
                         <div className="w-full h-full bg-white flex items-center justify-center">
                            <div className="w-3/4 h-3/4 grid grid-cols-4 grid-rows-4 gap-1.5">
                               {Array.from({length: 16}).map((_, i) => (
                                 <div key={i} className={`bg-slate-900 ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-0'}`}></div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Locations Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <Container>
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-3">Top Hiring Hubs</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-normal">Join thriving professional communities in leading cities.</p>
            </div>
            <Link to="/locations" className="flex items-center text-blue-600 dark:text-blue-400 font-bold text-lg hover:text-blue-700 dark:hover:text-blue-300 transition-all">
              View all locations <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {locations.map((loc, idx) => (
              <a href="#" key={idx} className="group block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-2xl dark:hover:shadow-blue-900/10 transition-all hover:-translate-y-2">
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <img 
                    src={loc.image} 
                    alt={loc.city} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-semibold mb-1">{loc.city}</h3>
                    <p className="text-base text-white/80 font-medium">{loc.state}, {loc.country}</p>
                  </div>
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                  <span className="text-base font-semibold text-slate-700 dark:text-slate-300 font-normal">{loc.jobs} jobs available</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 dark:bg-blue-700 text-white text-center relative overflow-hidden mb-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        <Container className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">Elevate your professional <br/>journey today</h2>
          <p className="text-blue-100 mb-12 max-w-2xl mx-auto text-xl font-normal opacity-90">Join thousands of professionals and companies who have found their perfect match through JOBSAE.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button className="h-16 px-12 bg-white text-blue-600 hover:bg-slate-50 font-bold text-xl border-none rounded-xl shadow-xl hover:shadow-2xl transition-all">Create Account</Button>
            <Button variant="outline" className="h-16 px-12 border-white/40 text-white hover:bg-white/10 font-bold text-xl rounded-xl backdrop-blur-sm">Post a Job</Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export { HomePage };
