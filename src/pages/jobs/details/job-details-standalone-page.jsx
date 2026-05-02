import { useParams, Link } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { JobDetails } from '../search/components/JobDetails';
import { toAbsoluteUrl } from '@/lib/helpers';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default function JobDetailsStandalonePage() {
  const { id } = useParams();
  const job = JOBS_DATA.find(j => j.id.toString() === id) || JOBS_DATA[0];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="bg-background border-b border-border pb-4 sticky top-(--header-height) z-40">
        <Container className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to="/jobs/search">
              <ChevronLeft className="size-4 mr-1" /> Back to Search
            </Link>
          </Button>
          <div className="h-4 w-px bg-border mx-2" />
          <h1 className="text-sm font-bold truncate max-w-[300px]">{job.title} at {job.company}</h1>
        </Container>
      </div>

      <Container className="mt-8">
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl shadow-black/5 min-h-[800px]">
          <JobDetails job={job} />
        </div>
      </Container>
    </div>
  );
}
