import React from 'react';
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CompanySection = ({ companies }) => {
  if (!companies || companies.length === 0) return null;

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-4">Top companies hiring</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg font-normal">
              Directly connect with top employers and find your next opportunity.
            </p>
          </div>
          <Button variant="outline" className="rounded-xl px-8 h-12 text-base font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            Explore companies
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.map((company, idx) => (
            <button 
              key={idx} 
              className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all text-left shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:shadow-none"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors overflow-hidden">
                  {company.Logo_URL ? (
                    <img src={company.Logo_URL} alt={company.Title} className="w-full h-full object-contain" />
                  ) : (
                    <Briefcase className="w-7 h-7 text-slate-400 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {company.Title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {company.Job_Cnt_Text || 'Active jobs'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanySection;
