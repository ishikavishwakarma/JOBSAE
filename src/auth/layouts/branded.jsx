import { Link, Outlet } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';

export function BrandedLayout() {
  return (
    <div className="w-full min-h-screen  flex justify-center items-center bg-slate-50 dark:bg-slate-950 p-4 lg:p-8">
      <div className="grid lg:grid-cols-2 w-full max-w-6xl h-[85vh] bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800">
        
        {/* Left Section: Visual Brand Image */}
        <div className="relative group overflow-hidden order-1 ">
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" 
            alt="Professional Workspace"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-blue-600/30 to-indigo-600/10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-slate-900/10" />
          
          {/* Logo overlay */}
          <div className="absolute top-12 left-12 z-20">
            <Link to="/">
              <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white/20">
                 <img src="/media/app/mini-logo.svg" className="h-8" alt="JOBSAE" />
                 <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">JOBSAE</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Section: Interactive Form */}
        <div className="flex flex-col justify-center items-center p-8 lg:p-5 order-2 lg:order-1 bg-white dark:bg-slate-900 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
