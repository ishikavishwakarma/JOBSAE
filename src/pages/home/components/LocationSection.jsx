import React from 'react';
import { MapPin } from 'lucide-react';

const LocationSection = ({ locations }) => {
  if (!locations || locations.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-6 tracking-tight">Popular locations</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-normal max-w-2xl">
              Start your career in one of these vibrant cities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {locations.map((loc, idx) => (
            <button 
              key={idx} 
              className="group relative overflow-hidden rounded-[32px] aspect-[4/5] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500"
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
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
