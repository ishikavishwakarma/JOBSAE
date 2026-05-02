import { useState, useEffect } from 'react';
import { 
  Monitor, 
  Users, 
  TrendingUp, 
  LayoutGrid, 
  Target, 
  Briefcase, 
  Smartphone, 
  PenTool, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Stethoscope, 
  ChefHat, 
  Building,
  GraduationCap,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Container } from '@/components/common/container';

const AllCategoriesPage = () => {
  useEffect(() => {
    document.title = 'Browse Categories | JOBSAE';
  }, []);

  const categories = [
    { name: 'Technology & IT', jobs: '1,420', icon: <Monitor className="w-8 h-8" />, color: 'bg-blue-500' },
    { name: 'Healthcare & Nursing', jobs: '2,150', icon: <Stethoscope className="w-8 h-8" />, color: 'bg-emerald-500' },
    { name: 'Finance & Banking', jobs: '980', icon: <TrendingUp className="w-8 h-8" />, color: 'bg-slate-900' },
    { name: 'Creative & Design', jobs: '640', icon: <PenTool className="w-8 h-8" />, color: 'bg-purple-500' },
    { name: 'Marketing & PR', jobs: '850', icon: <Target className="w-8 h-8" />, color: 'bg-rose-500' },
    { name: 'Management', jobs: '720', icon: <Briefcase className="w-8 h-8" />, color: 'bg-indigo-500' },
    { name: 'Engineering', jobs: '540', icon: <LayoutGrid className="w-8 h-8" />, color: 'bg-cyan-500' },
    { name: 'Mobile Apps', jobs: '430', icon: <Smartphone className="w-8 h-8" />, color: 'bg-blue-600' },
    { name: 'Retail & E-commerce', jobs: '1,800', icon: <ShoppingBag className="w-8 h-8" />, color: 'bg-orange-500' },
    { name: 'Logistics & Transport', jobs: '1,100', icon: <Truck className="w-8 h-8" />, color: 'bg-amber-600' },
    { name: 'Security & Legal', jobs: '340', icon: <ShieldCheck className="w-8 h-8" />, color: 'bg-slate-700' },
    { name: 'Hospitality & Food', jobs: '1,650', icon: <ChefHat className="w-8 h-8" />, color: 'bg-orange-400' },
    { name: 'Construction', jobs: '890', icon: <Building className="w-8 h-8" />, color: 'bg-yellow-600' },
    { name: 'Education & Training', jobs: '780', icon: <GraduationCap className="w-8 h-8" />, color: 'bg-blue-700' },
    { name: 'Customer Support', jobs: '2,300', icon: <Users className="w-8 h-8" />, color: 'bg-teal-500' },
    { name: 'Non-Profit', jobs: '210', icon: <Globe className="w-8 h-8" />, color: 'bg-green-600' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.05),transparent)]" />
        <Container>
          <div className="max-w-3xl relative z-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
              Browse jobs by <span className="text-blue-600 dark:text-blue-400">category</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Discover opportunities across 16+ professional industries. Your perfect role is just a click away.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((cat, index) => (
              <a 
                href="#" 
                key={index} 
                className="group p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-2xl transition-all flex flex-col items-center text-center hover:-translate-y-2"
              >
                <div className={`w-20 h-20 ${cat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-slate-200 dark:shadow-none group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cat.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-semibold">{cat.jobs} Open Positions</p>
                <div className="mt-6 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

    </div>
  );
};

import { ArrowRight as LucideArrowRight } from 'lucide-react';

export { AllCategoriesPage };
