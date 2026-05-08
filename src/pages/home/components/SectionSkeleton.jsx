import React from 'react';

const SectionSkeleton = ({ items = 4, columns = 4 }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-8`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 h-48 shadow-sm">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl mb-6"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default SectionSkeleton;
