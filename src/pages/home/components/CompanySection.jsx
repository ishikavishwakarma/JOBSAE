import React from 'react';
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';

const CompanySection = ({ companies, onNavigate }) => {
  const navigate = useNavigate();
  if (!companies || companies.length === 0) return null;

  return (
    <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-3 tracking-tight">Top companies hiring now</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-normal">
              Work with world-class teams and industry leaders.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => onNavigate('/jobsnearme/company')}
            className="rounded-xl px-8 h-12 text-base font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm shrink-0"
          >
            Explore companies
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {companies.slice(0, 12).map((company, idx) => {
            const path = `/jobsnearme${company.URL || company.mapKey}`;
            return (
              <Link 
                key={idx} 
                to={path}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(path);
                }}
                className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-xl text-center cursor-pointer"
              >
                <div className="size-20 mx-auto mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform duration-300 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner">
                  <img 
                    src={company.Logo_URL || `/media/images/600x400/${(idx % 4) + 1}.jpg`} 
                    alt={company.Title} 
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" 
                  />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 truncate">{company.Title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {company.Job_Cnt_Text || '0 jobs'}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CompanySection;
