import React from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LocationSection = ({ locations, onNavigate }) => {
  const navigate = useNavigate();
  if (!locations || locations.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-3 tracking-tight">Popular locations</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-normal">
              Find opportunities in the cities you love.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => onNavigate('/jobsnearme/location')}
            className="rounded-xl px-8 h-12 text-base font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm shrink-0"
          >
            All locations
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {locations.slice(0, 8).map((loc, idx) => {
            const path = `/jobsnearme${loc.URL || loc.mapKey}`;
            return (
              <Link 
                key={idx} 
                to={path}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(path);
                }}
                className="group relative overflow-hidden rounded-[32px] aspect-[4/5] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <img 
                  src={loc.Logo_URL || `/media/images/600x400/${(idx % 4) + 1}.jpg`} 
                  alt={loc.Title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-bold text-sm tracking-wider uppercase">{loc.Country || 'GLOBAL'}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{loc.Title}</h3>
                  <p className="text-slate-300 font-medium text-base mb-2">
                    {loc.Job_Cnt_Text || '0 jobs'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
