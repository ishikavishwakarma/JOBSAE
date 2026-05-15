import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Briefcase, 
  Globe, 
  Users, 
  Clock, 
  Share2, 
  MoreHorizontal, 
  ShieldCheck,
  Zap,
  Building2,
  DollarSign,
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { Footer } from '@/layouts/custom/components/footer';

export function JobDetails({ job }) {
  if (!job) return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-10 text-center animate-in fade-in duration-500">
      <div className="mb-4 opacity-20">
        <Building2 className="size-12 text-primary" />
      </div>
      <p className="font-bold text-lg text-foreground mb-1">Select a job to see details</p>
      <p className="text-[13px] opacity-60 max-w-[200px]">Browse the list to view full job descriptions and insights.</p>
    </div>
  );

  const title = job.Job_Title || job.title;
  const companyName = job.Company_Name || job.company;
  const locationText = job.Job_Location || job.location;
  const logoUrl = job.Company_Logo || job.logo;
  const description = job.Job_Description || job.body || '';
  const applicants = job.Applicant_Count || job.applicants || 0;

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-background flex flex-col animate-in fade-in duration-300 relative">
      {/* Sticky Top Section */}
      <div className="sticky top-0 z-30 bg-background border-b border-border/50">
        {/* Top Header Section */}
        <div className="relative shrink-0">
          <div className="h-28 bg-slate-50 dark:bg-slate-900/50 border-b border-border/50 relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
                  style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
          </div>
          <div className="px-5 -mt-8 flex flex-col sm:flex-row justify-between items-end gap-3 relative z-10">
            <div className="size-16 rounded-lg bg-white dark:bg-slate-900 border-2 border-background dark:border-slate-950 shadow-md flex items-center justify-center p-1 overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={companyName} className="size-10 object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg uppercase rounded-md">
                  {companyName?.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex gap-1.5 pb-0.5">
              <Button variant="outline" size="icon" className="size-8 rounded-lg hover:bg-primary/5 transition-colors"><Share2 className="size-3.5" /></Button>
              <Button variant="outline" size="icon" className="size-8 rounded-lg hover:bg-primary/5 transition-colors"><MoreHorizontal className="size-3.5" /></Button>
            </div>
          </div>
        </div>

        <div className="px-5 pt-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-primary font-bold text-[10px] uppercase tracking-wider">
              <Zap className="size-3 fill-primary" />
              Easy Apply
            </div>
            <h2 className="text-xl font-bold text-foreground tracking-tight leading-tight">{title}</h2>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 mb-3 text-[12px] font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5 text-foreground font-bold hover:text-primary transition-colors cursor-pointer">
                <Building2 className="size-3.5 text-muted-foreground" />
                <span>{companyName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                <span>{locationText}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="size-3.5" />
                <span className="text-foreground font-semibold">$120k - $160k · Full-time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-5 py-2.5 flex items-center justify-between gap-3 bg-slate-50/30 dark:bg-slate-900/10">
          <div className="flex items-center gap-2">
            <Button className="h-8.5 px-6 rounded-lg font-bold text-xs bg-primary hover:bg-primary/90">
              Apply now <ArrowRight className="ml-1.5 size-3.5" />
            </Button>
            <Button variant="outline" className="h-8.5 px-4 rounded-lg font-bold text-xs border-border">
              Save
            </Button>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[11px] font-bold text-muted-foreground hidden sm:inline">{applicants} applicants</span>
             <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/5 rounded-lg border border-green-500/10">
                <ShieldCheck className="size-3.5 text-green-600" />
                <span className="text-[9px] font-bold text-green-700 dark:text-green-500 uppercase tracking-wider">Verified</span>
             </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 pb-10 flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-8">
            <section>
              <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                <Briefcase className="size-4 text-primary" />
                Role Description
              </h3>
              <div 
                className="text-[14px] text-muted-foreground leading-relaxed rich-text-content" 
                dangerouslySetInnerHTML={{ __html: description }} 
              />
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-xl border border-border/50 bg-slate-50/50 dark:bg-slate-900/20">
              <h3 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground mb-4">Job Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-md bg-background flex items-center justify-center border border-border">
                    <Clock className="size-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold leading-tight">Full-time</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Schedule</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-md bg-background flex items-center justify-center border border-border">
                    <GraduationCap className="size-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold leading-tight">Mid-Senior</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Experience</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl border border-border bg-background">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm">Company</h3>
                <Button variant="link" className="h-auto p-0 text-[11px] font-bold">Profile</Button>
              </div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="size-9 rounded-md bg-slate-50 flex items-center justify-center border border-border p-1 overflow-hidden">
                   {logoUrl ? <img src={logoUrl} className="w-full h-full object-contain" alt="" /> : <span className="font-bold text-primary text-xs">{companyName?.charAt(0)}</span>}
                </div>
                <div>
                  <p className="font-bold text-[12px] leading-tight mb-0.5">{companyName}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">IT Services</p>
                </div>
              </div>
              <p className="text-[12px] text-muted-foreground leading-snug line-clamp-3">
                {companyName} is a global leader in next-generation digital services and consulting. We enable clients in more than 50 countries.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}



