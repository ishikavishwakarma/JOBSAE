import { cn } from '@/lib/utils';
import { MapPin, Briefcase, Clock, Bookmark, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function JobCard({ job, isActive, onClick }) {
  const navigate = useNavigate();

  const title = job.Job_Title || job.title;
  const companyName = job.Company_Name || job.company;
  const locationText = job.Job_Location || job.location;
  const logoUrl = job.Company_Logo || job.logo;
  const postedAtText = job.Posted_At_Display || job.postedAt || '';
  const jobId = job.Job_Id || job.id;

  const handleSeeMore = (e) => {
    e.stopPropagation();
    navigate(`/jobs/details/${jobId}`);
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-5 cursor-pointer border-b border-border hover:bg-muted/30 transition-all relative group",
        isActive && "bg-primary/5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary"
      )}
    >
      <div className="flex gap-4">
        <div className="size-14 rounded-xl bg-white border border-border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
          <img src={logoUrl} alt={companyName} className="size-10 object-contain p-1" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-bold text-[15px] leading-tight truncate transition-colors",
              isActive ? "text-primary" : "text-foreground group-hover:text-primary"
            )}>
              {title}
            </h3>
            {postedAtText?.includes('h') && (
              <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                <Sparkles className="size-2.5" /> New
              </span>
            )}
          </div>
          
          <p className="text-sm font-semibold text-foreground/70 mt-0.5">{companyName}</p>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <MapPin className="size-3.5" />
              <span>{locationText}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <Clock className="size-3.5" />
              <span>{postedAtText}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button size="sm" className="h-8 text-xs font-bold rounded-lg px-4">Apply Now</Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs font-bold rounded-lg px-4 group/btn"
              onClick={handleSeeMore}
            >
              See more <ArrowRight className="size-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-primary transition-colors h-fit p-1 hover:bg-muted rounded-lg">
          <Bookmark className="size-5" />
        </button>
      </div>
    </div>
  );
}
