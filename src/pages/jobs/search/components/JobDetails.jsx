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
  Monitor
} from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';

export function JobDetails({ job }) {
  if (!job) return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-10 text-center">
      <Building2 className="size-16 mb-4 opacity-10" />
      <p className="font-medium text-lg">Select a job to see full details</p>
      <p className="text-sm opacity-60 max-w-[200px] mt-2">Discover your next career move with JOBSAE Premium</p>
    </div>
  );

  const title = job.Job_Title || job.title;
  const companyName = job.Company_Name || job.company;
  const locationText = job.Job_Location || job.location;
  const logoUrl = job.Company_Logo || job.logo;
  const description = job.Job_Description || job.description || '';
  const applicants = job.Applicant_Count || job.applicants || 0;

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-background flex flex-col">
      {/* Top Banner/Header Area */}
      <div className="relative shrink-0">
        <div className="h-32 bg-linear-to-r from-primary/20 via-primary/5 to-background border-b border-border" />
        <div className="px-8 -mt-10 flex flex-col sm:flex-row justify-between items-end gap-4">
          <div className="size-20 rounded-2xl bg-white border-4 border-background shadow-xl flex items-center justify-center p-2">
            <img src={logoUrl} alt={companyName} className="size-14 object-contain" />
          </div>
          <div className="flex gap-2 pb-1">
            <Button variant="outline" size="icon" className="rounded-full"><Share2 className="size-4" /></Button>
            <Button variant="outline" size="icon" className="rounded-full"><MoreHorizontal className="size-4" /></Button>
          </div>
        </div>
      </div>

      <div className="px-8 pt-6 pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
            <Zap className="size-4 fill-primary" />
            Easy Apply
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight mt-1">{title}</h2>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-[13px] font-medium text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-bold border-r border-border pr-6 last:border-0">
              <Building2 className="size-4" />
              <span className="hover:underline cursor-pointer">{companyName}</span>
            </div>
            <div className="flex items-center gap-2 border-r border-border pr-6 last:border-0">
              <MapPin className="size-4" />
              <span>{locationText}</span>
            </div>
            <div className="flex items-center gap-2 border-r border-border pr-6 last:border-0">
              <DollarSign className="size-4 text-green-600" />
              <span className="text-green-700 font-bold">$120k - $160k · Full-time</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <span className="text-primary font-bold">{applicants} applicants</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-8 pb-8 border-b border-border">
          <Button size="lg" className="px-10 rounded-full font-black text-base shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            Apply now
          </Button>
          <Button variant="outline" size="lg" className="px-10 rounded-full font-bold border-2 transition-all hover:bg-muted">
            Save for later
          </Button>
          <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
            <ShieldCheck className="size-5 text-green-600" />
            <span className="text-xs font-bold text-green-700">Verified Job Posting</span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="size-5 text-primary" /> Role Description
              </h3>
              <div 
                className="text-base text-secondary-foreground leading-relaxed rich-text-content" 
                dangerouslySetInnerHTML={{ __html: description }} 
              />
            </section>
            {/* ... rest of the content can be kept as is or further dynamicized ... */}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-2xl border-none bg-muted/30 shadow-none">
              <CardContent className="p-6">
                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Job Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-background flex items-center justify-center border border-border shadow-xs">
                      <Briefcase className="size-4" />
                    </div>
                    <p className="text-sm font-medium">Full-time · Mid-Senior level</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-background flex items-center justify-center border border-border shadow-xs">
                      <Users className="size-4" />
                    </div>
                    <p className="text-sm font-medium">10,001+ employees · IT</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-background flex items-center justify-center border border-border shadow-xs">
                      <Zap className="size-4" />
                    </div>
                    <p className="text-sm font-medium">Direct hiring manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="p-6 rounded-2xl border border-border bg-card">
              <h3 className="font-bold mb-4">About the company</h3>
              <div className="flex items-center gap-3 mb-4">
                <img src={logoUrl} className="size-10 rounded border border-border p-1 bg-white" alt="" />
                <div>
                  <p className="font-bold text-sm leading-none">{companyName}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-widest">IT Services & Consulting</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {companyName} is a global leader in next-generation digital services and consulting. We enable clients in more than 50 countries to navigate their digital transformation.
              </p>
              <Button variant="outline" className="w-full mt-6 rounded-xl font-bold text-xs h-9">
                View Company Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
