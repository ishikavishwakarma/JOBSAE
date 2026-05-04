import { useState, useEffect } from 'react';
import { Container } from '@/components/common/container';
import { JobFilters } from './components/JobFilters';
import { JobCard } from './components/JobCard';
import { JobDetails } from './components/JobDetails';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Share2, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams, useSearchParams } from 'react-router-dom';

const JOBS_DATA = [
  {
    id: 1,
    title: 'Senior Frontend Developer (React)',
    company: 'TechFlow Systems',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaSnofJIi09OSYLOI5RGwA3B5HfIJXu253_g&s',
    location: 'Remote / New York',
    postedAt: '2h ago',
    applicants: 45,
    description: 'We are looking for a Senior Frontend Developer with deep expertise in React and modern CSS. You will be responsible for building high-performance, accessible, and beautiful web applications.<br/><br/><b>Requirements:</b><br/>- 5+ years of React experience<br/>- Strong TypeScript skills<br/>- Experience with Tailwind CSS'
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    company: 'CreativePulse',
    logo: toAbsoluteUrl('/media/brand-logos/figma.svg'),
    location: 'London, UK',
    postedAt: '5h ago',
    applicants: 12,
    description: 'Join our award-winning design team to create world-class digital products. You should have a strong portfolio and experience with design systems.'
  },
  {
    id: 3,
    title: 'Full Stack Engineer',
    company: 'CloudNative',
    logo: toAbsoluteUrl('/media/brand-logos/google.svg'),
    location: 'San Francisco, CA',
    postedAt: '1d ago',
    applicants: 89,
    description: 'Help us scale our cloud infrastructure. Experience with Node.js and AWS is a must.'
  }
];

export default function JobSearchPage() {
  const [selectedJob, setSelectedJob] = useState(JOBS_DATA[0]);
  const params = useParams();
  const [searchParams] = useSearchParams();
  
  const { keyword, company, industry, country, state, city, pageNo } = params;

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
            <div className="w-full md:w-[420px] border-r border-border flex flex-col shrink-0 bg-background">
              <div className="p-5 border-b border-border bg-card/30 flex justify-between items-center">
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
                {JOBS_DATA.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    isActive={selectedJob?.id === job.id}
                    onClick={() => setSelectedJob(job)}
                  />
                ))}
              </div>
            </div>

            {/* Right Details */}
            <div className="hidden md:block flex-1 overflow-hidden bg-background">
              <JobDetails job={selectedJob} />
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
