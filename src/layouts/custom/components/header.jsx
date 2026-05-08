import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { toAbsoluteUrl } from '@/lib/helpers';
import { ChatSheet } from '@/partials/topbar/chat-sheet';
import { NotificationsSheet } from '@/partials/topbar/notifications-sheet';
import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import { MapPin, MessageCircleMore, MessageSquareDot, Search, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import JobSearchForm from '@/pages/home/components/JobSearchForm';

export function Header({ width }) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="flex items-center supports-[backdrop-filter]:bg-background sticky top-0 z-50 shrink-0 h-(--header-height) border-b border-border bg-background">
      <Container width={width} className="flex justify-between items-center gap-4 relative">
        <div className={cn("flex items-center gap-10 flex-1 transition-all duration-300", showMobileSearch ? "opacity-0 invisible w-0" : "opacity-100 visible")}>
          <Link to="/" className="shrink-0">
            <img
              src={toAbsoluteUrl('/media/app/mini-logo-circle.svg')}
              className="dark:hidden min-h-[42px]"
              alt="logo"
            />
            <img
              src={toAbsoluteUrl('/media/app/mini-logo-circle-dark.svg')}
              className="hidden dark:inline-block min-h-[42px]"
              alt="logo"
            />
          </Link>

          {/* Desktop Search - Hidden on Home Page */}
          {!isHomePage && (
            <JobSearchForm variant="header" />
          )}
        </div>

        {/* Mobile Search Input Overlay */}
        <div className={cn(
          "absolute inset-0 z-10 flex items-center px-4 bg-background transition-all duration-300",
          showMobileSearch ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"
        )}>
          <div className="flex items-center w-full gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input 
                type="text" 
                autoFocus={showMobileSearch}
                placeholder="Search jobs, companies..." 
                className="w-full bg-muted border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary focus:bg-background transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/jobs/search?q=${e.target.value}`;
                  }
                }}
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowMobileSearch(false)}>
              <X className="size-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3.5">
          <div className="flex items-center gap-1.5">
            {/* Mobile Search Trigger */}
            <Button 
              variant="ghost" 
              mode="icon" 
              shape="circle" 
              className="size-9 hover:bg-muted lg:hidden"
              onClick={() => setShowMobileSearch(true)}
            >
              <Search className="size-4.5!" />
            </Button>

            <ChatSheet
              trigger={
                <Button variant="ghost" mode="icon" shape="circle" className="size-9 hover:bg-muted">
                  <MessageCircleMore className="size-4.5!" />
                </Button>
              }
            />
            <NotificationsSheet
              trigger={
                <Button variant="ghost" mode="icon" shape="circle" className="size-9 hover:bg-muted">
                  <MessageSquareDot className="size-4.5!" />
                </Button>
              }
            />
          </div>
          <div className="w-[1px] h-6 bg-border mx-1 hidden sm:block"></div>
          <UserDropdownMenu
            trigger={
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="hidden sm:flex flex-col items-end leading-none">
                  <span className="text-sm font-semibold group-hover:text-primary transition-colors">Admin User</span>
                  <span className="text-[10px] text-muted-foreground">Premium Member</span>
                </div>
                <img
                  className="size-9 rounded-full border-2 border-transparent group-hover:border-primary transition-all shrink-0"
                  src={toAbsoluteUrl('/media/avatars/gray/5.png')}
                  alt=""
                />
              </div>
            }
          />
        </div>
      </Container>
    </header>
  );
}
// export { Header };
