import { useState, useEffect } from 'react';
import { Container } from '@/components/common/container';
import { JobFilters } from './components/JobFilters';
import { JobCard } from './components/JobCard';
import { JobDetails } from './components/JobDetails';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Share2, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SearchJobList, searchJob, selectKeywordData, selectSearchResult } from '@/services/redux/slice/jobSlice';
import { toast } from 'sonner';



export default function JobSearchPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const locationPath = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  
  const { keyword, company, industry, country, state, city, pageNo } = params;
  const keywordData = useSelector(selectKeywordData);
  const searchResult = useSelector(selectSearchResult);
  const jobs = searchResult?.Return?.Jobs?.Jobs || [];

  const [selectedJob, setSelectedJob] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(Number(pageNo) || 1);
  const [totalPages, setTotalPages] = useState(1);

  // Sync selected job when jobs list changes
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  const fetchJobs = async ({
    mode = "initial",
    pageNum = 1,
    filters = {},
    method = "Search",
  } = {}) => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      setHasError(false);
      let requestPage = pageNum;
      
      if (mode === "append") {
        requestPage = (keywordData?.currentPage || 1) + 1;
      }

      // Format keyword for display/API if needed
      const formattedKeyword = keyword
        ?.split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const requestData = {
        method,
        keyword: formattedKeyword || keywordData?.keyword || "",
        location: keywordData?.location || "",
        pageNum: requestPage,
        jobTitles: filters.title || null,
        industries: filters.category || null,
        companies: filters.companies || null,
        benefits: filters.benefits || null,
        jobTypes: filters.jobTypes || null,
        radius: filters.radius || null,
        dates: filters.dates || null,
      };

      if (mode === "page") {
        let basePath = locationPath.pathname.replace(/\/\d+$/, "");
        navigate(`${basePath}/${requestPage}`);
      }

      if (mode !== "append" && mode !== "page") {
        dispatch(searchJob.request());
      }

      const data = await dispatch(SearchJobList(requestData)).unwrap();
      
      if (!data) return;
      
      const newJobs = data?.Return?.Jobs?.Jobs || [];
      const totalCount = data?.Return?.Jobs?.Total_Count || 0;
      setTotalPages(Math.ceil(totalCount / 10));

      if (mode === "append") {
        if (newJobs.length === 0) {
          setHasMore(false);
        } else {
          dispatch(searchJob.appendJobs({
            data: newJobs,
            currentPage: requestPage,
          }));
          setPage(requestPage);
        }
      } else {
        dispatch(searchJob.success({
          ...data,
          keyword: formattedKeyword || keywordData?.keyword,
          location: keywordData?.location,
          currentPage: requestPage,
          locKey: keywordData?.locKey,
        }));
        setPage(requestPage);
        setHasMore(newJobs.length > 0);
      }
    } catch (err) {
      setHasError(true);
      toast.error(err.message || "Error occurred during search");
      dispatch(searchJob.failure(err));
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchJobs({ mode: "initial", pageNum: 1 });
    window.history.replaceState({}, document.title);
  }, [keyword, keywordData?.location]);

  useEffect(() => {
    let title = 'Job Search | JOBSAE';
    if (keyword) title = `Jobs for ${keyword} | JOBSAE`;
    else if (company) title = `Jobs at ${company} | JOBSAE`;
    document.title = title;
  }, [keyword, company]);

  const getActiveSearchDisplay = () => {
    const parts = [];
    if (keyword) parts.push(`"${keyword}"`);
    if (company) parts.push(`at ${company}`);
    if (industry) parts.push(`in ${industry}`);
    
    const locationParts = [];
    if (city) locationParts.push(city);
    if (state) locationParts.push(state);
    if (country) locationParts.push(country);
    
    if (locationParts.length > 0) {
      parts.push(`in ${locationParts.join(', ')}`);
    }

    return parts.join(' ') || 'All Jobs';
  };

  return (
    <div className="flex flex-col max-w-screen min-h-screen bg-muted/20">
      <JobFilters defaultKeyword={keyword} />
      
      <main className="grow">
        <Container className="py-6 h-[calc(100vh-140px)]">
          <div className="flex bg-card border border-border rounded-2xl overflow-hidden h-full shadow-xl shadow-black/5">
            {/* Left List */}
            <div className="w-full lg:w-[420px] border-r border-border flex flex-col shrink-0 bg-background">
              <div className="p-3 border-b border-border bg-card/30 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                    <SearchIcon className="size-3" />
                    {getActiveSearchDisplay()}
                  </h2>
                  <p className="text-[10px] font-bold text-primary mt-0.5">345 new jobs found</p>
                </div>
                <Button variant="ghost" size="icon" className="size-8 rounded-lg"><Share2 className="size-4" /></Button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-border/50">
                {isFetching && page === 1 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-muted-foreground">Searching for jobs...</p>
                  </div>
                ) : jobs.length > 0 ? (
                  <>
                    {jobs.map(job => (
                      <JobCard 
                        key={job.id || job.Job_Id} 
                        job={job} 
                        isActive={selectedJob?.id === job.id || selectedJob?.Job_Id === job.Job_Id}
                        onClick={() => setSelectedJob(job)}
                      />
                    ))}
                    {hasMore && (
                      <div className="p-4 flex justify-center">
                        <Button 
                          variant="ghost" 
                          onClick={() => fetchJobs({ mode: "append" })}
                          disabled={isFetching}
                        >
                          {isFetching ? "Loading..." : "Load More"}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
                    <p className="text-muted-foreground font-bold">No jobs found matching your criteria.</p>
                    <Button variant="link" onClick={() => fetchJobs({ mode: "initial" })}>Try again</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Details */}
            <div className="hidden lg:block flex-1 overflow-hidden bg-background">
              <JobDetails job={selectedJob} />
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
