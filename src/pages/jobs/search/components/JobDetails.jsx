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
  ExternalLink,
  ShieldCheck,
  Zap,
  Building2,
  DollarSign,
  GraduationCap,
  HeartPulse,
  Monitor,
  ArrowRight
} from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';

export function JobDetails({ job }) {
  if (!job) return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-10 text-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
        <Building2 className="size-20 relative z-10 opacity-20 text-primary" />
      </div>
      <p className="font-bold text-2xl text-foreground mb-2">Select a job to see full details</p>
      <p className="text-base opacity-60 max-w-[280px] leading-relaxed">Discover your next career move with JOBSAE Premium insights.</p>
    </div>
  );

  const title = job.Job_Title || job.title;
  const companyName = job.Company_Name || job.company;
  const locationText = job.Job_Location || job.location;
  const logoUrl = job.Company_Logo || job.logo;
  const description = job.Job_Description || job.body || '';
  const applicants = job.Applicant_Count || job.applicants || 0;

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-background flex flex-col animate-in slide-in-from-right-4 duration-500">
      {/* Top Banner Area with Vibrant Gradient */}
      <div className="relative shrink-0">
        <div className="h-40 bg-linear-to-r from-blue-600/20 via-primary/10 to-indigo-600/20 dark:from-blue-500/10 dark:via-primary/5 dark:to-indigo-500/10 border-b border-border relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -ml-24 -mb-24" />
        </div>
        <div className="px-8 -mt-12 flex flex-col sm:flex-row justify-between items-end gap-6 relative z-10">
          <div className="size-24 rounded-2xl bg-white dark:bg-slate-900 border-4 border-background dark:border-slate-950 shadow-2xl flex items-center justify-center p-2 overflow-hidden transform hover:scale-105 transition-transform duration-300">
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="size-16 object-contain p-1" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black text-3xl uppercase rounded-xl">
                {companyName?.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex gap-3 pb-2">
            <Button variant="outline" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"><Share2 className="size-4" /></Button>
            <Button variant="outline" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"><MoreHorizontal className="size-4" /></Button>
          </div>
        </div>
      </div>

      <div className="px-8 pt-8 pb-12">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] bg-primary/5 w-fit px-3 py-1 rounded-full mb-2">
            <Zap className="size-3.5 fill-primary animate-pulse" />
            Easy Apply
          </div>
          <h2 className="text-4xl font-black text-foreground tracking-tight leading-tight">{title}</h2>
          
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-6 text-[14px] font-bold text-muted-foreground">
            <div className="flex items-center gap-2.5 text-foreground font-black group cursor-pointer border-r border-border pr-8 last:border-0">
              <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Building2 className="size-4" />
              </div>
              <span className="hover:text-primary transition-colors">{companyName}</span>
            </div>
            <div className="flex items-center gap-2.5 border-r border-border pr-8 last:border-0">
              <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <MapPin className="size-4" />
              </div>
              <span>{locationText}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-green-50 dark:bg-green-900/10 flex items-center justify-center">
                <DollarSign className="size-4 text-green-600" />
              </div>
              <span className="text-green-700 dark:text-green-500 font-black">$120k - $160k · Full-time</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 px-5 py-3 bg-blue-50/50 dark:bg-blue-900/5 rounded-2xl border border-blue-100/50 dark:border-blue-900/20 w-fit">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="size-6 rounded-full border-2 border-background bg-slate-200" />
               ))}
            </div>
            <span className="text-sm font-bold text-blue-700 dark:text-blue-400">{applicants} applicants have already applied</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-10 pb-10 border-b border-border">
          <Button size="lg" className="h-14 px-12 rounded-2xl font-black text-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90">
            Apply now <ArrowRight className="ml-2 size-5" />
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-12 rounded-2xl font-black text-lg border-2 border-border transition-all hover:bg-muted hover:border-muted-foreground/20">
            Save for later
          </Button>
          <div className="ml-auto hidden xl:flex items-center gap-2.5 px-5 py-2.5 bg-green-500/10 rounded-2xl border border-green-500/20">
            <ShieldCheck className="size-5 text-green-600" />
            <span className="text-sm font-black text-green-700 dark:text-green-400">Verified Listing</span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase className="size-5" />
                </div>
                Role Description
              </h3>
              <div 
                className="text-lg text-secondary-foreground/80 leading-relaxed rich-text-content space-y-4" 
                dangerouslySetInnerHTML={{ __html: description }} 
              />
            </section>
          </div>

          <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Card className="rounded-3xl border-none bg-slate-50 dark:bg-slate-900/50 shadow-none overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <CardContent className="p-8 relative z-10">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Job Insights</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-border shadow-sm">
                      <Clock className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-black">Full-time</p>
                      <p className="text-xs text-muted-foreground">Work Schedule</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-border shadow-sm">
                      <GraduationCap className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-black">Mid-Senior level</p>
                      <p className="text-xs text-muted-foreground">Experience Required</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-border shadow-sm">
                      <ShieldCheck className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-black">Verified Manager</p>
                      <p className="text-xs text-muted-foreground">Direct Hiring</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-card hover:border-primary/20 transition-all duration-300">
              <h3 className="font-black text-lg mb-6">About the company</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 p-2 overflow-hidden">
                   {logoUrl ? <img src={logoUrl} className="w-full h-full object-contain" alt="" /> : <span className="font-bold text-primary">{companyName?.charAt(0)}</span>}
                </div>
                <div>
                  <p className="font-black text-base leading-none mb-1">{companyName}</p>
                  <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">IT Services & Consulting</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 font-medium">
                {companyName} is a global leader in next-generation digital services and consulting. We enable clients in more than 50 countries to navigate their digital transformation journey with excellence and innovation.
              </p>
              <Button variant="outline" className="w-full mt-8 rounded-2xl font-black text-sm h-12 border-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
                View Company Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
