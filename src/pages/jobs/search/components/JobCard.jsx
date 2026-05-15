import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  MapPin, 
  Share2, 
  Bookmark, 
  ExternalLink, 
  ChevronRight,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useApplyJob, useSingleJobDetail } from '@/services/redux/apis/jobApi';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

const safeParse = (data) => {
  if (!data) return null;
  if (Array.isArray(data)) return data;
  if (typeof data !== 'string') return data;
  try {
    return JSON.parse(data);
  } catch (e) {
    // If it contains comma separated values but not valid JSON
    if (data.includes(',')) return data.split(',').map(s => s.trim());
    return [data];
  }
};

export function JobCard({ job, isActive, onClick }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleApplyClick } = useApplyJob();
  const { getSingleJobDetail, isLoading: isFetchingDetails } = useSingleJobDetail();
  
  const [isSaved, setIsSaved] = useState(false);

  const title = job.Job_Title || job.title;
  const companyName = job.Company_Name || job.company;
  const locationText = job.Job_Location || job.location;
  const logoUrl = job.Company_Logo || job.logo;
  const postedAtText = job.Posted_At_Display || job.post_days || '';
  const jobId = job.Job_Id || job.id;
  const body = job.Job_Description || job.body || '';
  
  const jobTypes = safeParse(job.Job_Type || job.job_type);
  const jobIndustry = safeParse(job.Industry || job.industry);

  const handleSeeMore = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // In a real app, you might want to fetch full details before navigating
      // or just navigate if the ID is enough for the details page.
      // We'll follow the user's intent of "See more" behavior.
      const rawPath = job.view_url ? job.view_url.replace(/\\/g, "") : `/jobs/details/${jobId}`;
      const finalPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
      navigate(finalPath);
    } catch (err) {
      console.error("Navigation failed", err);
    }
  };

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    setIsSaved((prev) => !prev);
  };

  const handleShareJob = (e) => {
    e.stopPropagation();
    const shareUrl = window.location.origin + (job.view_url ? job.view_url.replace(/\\/g, "") : `/jobs/details/${jobId}`);
    const shareData = {
      title: title || "Job Opportunity",
      text: `Check out this job: ${title} at ${companyName}`,
      url: shareUrl
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      // In a real app, use toast here
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 cursor-pointer border rounded-2xl transition-all relative group",
        isActive 
          ? "bg-slate-50 dark:bg-slate-900/50  shadow-inner" 
          : "bg-white dark:bg-slate-950 hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
      )}
    >
      <div className="flex gap-4 items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-base font-bold leading-tight truncate mb-1",
            isActive ? "text-primary" : "text-slate-900 dark:text-white group-hover:text-primary transition-colors"
          )}>
            {title}
          </h3>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{companyName}</p>
          <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1">
            <MapPin className="size-3" /> {locationText}
          </p>
        </div>
        
        <div className="size-14 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-1">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={companyName} 
              className="w-full h-full object-contain"
              onError={(e) => { e.target.src = '/media/images/company-placeholder.png'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black text-xl uppercase rounded-lg">
              {companyName?.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2">
        <div 
          className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: body.substring(0, 200) }}
        />
        
        <div className="flex flex-wrap gap-2 mt-3">
          {Array.isArray(jobTypes) && jobTypes.map((type, index) => (
            <span
              key={`type-${index}`}
              className="text-[10px] font-bold border border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-400 rounded-md px-2 py-0.5"
            >
              {typeof type === 'string' ? type : type?.Name || type?.label}
            </span>
          ))}

          {Array.isArray(jobIndustry) && jobIndustry.map((industry, index) => (
            <span
              key={`industry-${index}`}
              className="text-[10px] font-bold border border-primary/20 bg-primary/5 text-primary rounded-md px-2 py-0.5"
            >
              {typeof industry === 'string' ? industry : industry?.Name || industry?.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Clock className="size-3" />
          {postedAtText}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <Link
          onClick={handleSeeMore}
          to={job.view_url ? job.view_url.replace(/\\/g, "") : `/jobs/details/${jobId}`}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 group/more"
        >
          See more <ChevronRight className="size-3.5 group-hover/more:translate-x-0.5 transition-transform" />
        </Link>

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="h-8 rounded-lg text-xs font-bold px-4 shadow-lg shadow-primary/20"
            onClick={(e) => {
              e.stopPropagation();
              handleApplyClick(job);
            }}
          >
            Apply Now <ExternalLink className="size-3 ml-1.5" />
          </Button>

          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleSaveToggle}
                  className={cn(
                    "size-8 rounded-lg border border-border flex items-center justify-center transition-all",
                    isSaved ? "bg-primary/10 text-primary border-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Bookmark className={cn("size-4", isSaved && "fill-current")} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{isSaved ? "Saved" : "Save"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleShareJob}
                  className="size-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  <Share2 className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Share</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
