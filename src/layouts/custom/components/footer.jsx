import { Briefcase } from 'lucide-react';
import { Container } from '@/components/common/container';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-20 mt-auto">
      <Container>
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          <div className=" lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Briefcase className="w-6 h-6 text-white" />
               </div>
               <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">JOBSAE</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-lg leading-relaxed font-normal">
              Redefining recruitment through social engagement and innovative technology. Find your future, now.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Candidates</h4>
            <ul className="space-y-4 text-base text-slate-600 dark:text-slate-400 font-medium">
              <li><Link to="/jobs-near-me" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Jobs Near Me</Link></li>
              <li><Link to="/jobs/search" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Find Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Top Companies</Link></li>
              <li><Link to="/categories" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Browse Categories</Link></li>
              <li><Link to="/locations" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Job Locations</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Employers</h4>
            <ul className="space-y-4 text-base text-slate-600 dark:text-slate-400 font-medium">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Hire Talent</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Social Ads</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing Plan</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">About</h4>
            <ul className="space-y-4 text-base text-slate-600 dark:text-slate-400 font-medium">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Our Vision</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Legal</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800 text-base text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-medium text-sm">© {new Date().getFullYear()} JOBSAE. All rights reserved.</p>
          <div className="flex gap-8">
             <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">LinkedIn</a>
             <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Twitter</a>
             <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
