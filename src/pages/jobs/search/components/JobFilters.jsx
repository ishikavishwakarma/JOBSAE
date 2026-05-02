import { useState } from 'react';
import {
  ChevronDown,
  Filter,
  Globe,
  Monitor,
  Network,
  Search,
  Users,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Container } from '@/components/common/container';

export function JobFilters() {
  const [activeFilters, setActiveFilters] = useState([]);

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const chips = [
    { id: 'remote', label: 'Remote', icon: Monitor },
    { id: 'advertising', label: 'Advertising' },
    { id: 'social', label: 'Social Media' },
    { id: 'seo', label: 'SEO' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'easy-apply', label: 'Easy Apply', icon: Zap },
    { id: 'under-10', label: 'Under 10 applicants', icon: Users },
    { id: 'network', label: 'In my network', icon: Network },
  ];

  return (
    <div className="bg-background border-b border-border sticky top-(--header-height) z-40 bg-background/95 backdrop-blur-sm w-full overflow-x-hidden">
      <Container className="mx-auto py-2 md:py-3 px-4 md:px-6 overflow-hidden">
        {/* Mobile Search Row */}
        <div className="lg:hidden mb-3 relative group w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search jobs, companies..."
            className="w-full bg-muted border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary focus:bg-background transition-all"
          />
        </div>

        {/* Filters Row - Responsive Scroll */}
        <div className="flex items-center overflow-x-auto no-scrollbar w-full touch-pan-x pb-1 flex-nowrap gap-2">
          {/* Selects Group */}
          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            <Select defaultValue="all">
              <SelectTrigger className="w-auto h-8 md:h-9 px-4 rounded-full bg-muted border-none text-[13px] font-bold whitespace-nowrap shadow-none focus:ring-0">
                <SelectValue placeholder="Date Posted" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Time</SelectItem>
                <SelectItem value="day">Past 24 Hours</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-auto h-8 md:h-9 px-4 rounded-full bg-muted border-none text-[13px] font-bold whitespace-nowrap shadow-none focus:ring-0">
                <SelectValue placeholder="Experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Level</SelectItem>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid-Senior</SelectItem>
                <SelectItem value="director">Director</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-auto h-8 md:h-9 px-4 rounded-full bg-muted border-none text-[13px] font-bold whitespace-nowrap shadow-none focus:ring-0">
                <SelectValue placeholder="Employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Type</SelectItem>
                <SelectItem value="full">Full-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="remote">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-4 w-[1px] bg-border mx-1 shrink-0" />

          {/* Quick Filters Chips */}
          <div className="flex items-center gap-2 shrink-0">
            {chips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => toggleFilter(chip.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-1.5 md:py-2 rounded-full text-[13px] font-bold border transition-all whitespace-nowrap shrink-0',
                  activeFilters.includes(chip.id)
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                    : 'bg-muted/50 border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-muted',
                )}
              >
                {chip.icon && (
                  <chip.icon
                    className={cn(
                      'size-3.5',
                      activeFilters.includes(chip.id) ? 'fill-white/20' : '',
                    )}
                  />
                )}
                {chip.label}
              </button>
            ))}
          </div>

          {/* End Section (Reset & Sort) */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0 pl-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 md:h-9 font-bold text-primary hover:bg-primary/5 whitespace-nowrap"
            >
              Reset
            </Button>
            <div className="hidden xl:flex items-center gap-2 text-[13px] text-muted-foreground font-medium whitespace-nowrap">
              Sort by:
              <span className="text-foreground font-black cursor-pointer flex items-center">
                Most Recent <ChevronDown className="size-4 ml-1" />
              </span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
