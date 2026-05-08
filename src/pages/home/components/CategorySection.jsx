import React from 'react';
import { ArrowRight, Monitor, Users, TrendingUp, LayoutGrid, Target, Briefcase } from 'lucide-react';

const CategorySection = ({ industries }) => {
  if (!industries || industries.length === 0) return null;

  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-2 tracking-tight">Explore by category</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-normal">
            Find the job that matches your skills and career interests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((cat, idx) => (
            <button 
              key={idx} 
              className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)] text-left flex items-start gap-6"
            >
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                {cat.Icon ? (
                   <span className="w-6 h-6 flex items-center justify-center font-bold">{cat.Icon}</span>
                ) : (
                   <LayoutGrid className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.Title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium text-base">
                    {cat.Job_Cnt_Text || '0 jobs'}
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
