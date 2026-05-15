import { useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { decryptResponse } from '@/utils/helpers/apiHelper';
import { Container } from '@/components/common/container';
import { toAbsoluteUrl } from '@/lib/helpers';
import { ChatSheet } from '@/partials/topbar/chat-sheet';
import { NotificationsSheet } from '@/partials/topbar/notifications-sheet';
import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import { MapPin, MessageCircleMore, MessageSquareDot, Search, X, ShoppingCart, LogIn, Moon, Sun } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import JobSearchForm from '@/pages/home/components/JobSearchForm';

export function Header({ width }) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const { userData, token } = useSelector((state) => state.auth);
  const user = useMemo(() => {
    if (!userData) return null;
    try {
      const decrypted = decryptResponse(userData);
      console.log("decrypted", decrypted);
      // Unwrap normalization: result might be [ { Return: { User: { tblUser: [...] } } } ]
      const rawUser = decrypted?.[0]?.Return?.User?.tblUser?.[0] || decrypted?.Return?.User?.tblUser?.[0] || decrypted?.tblUser?.[0];
      return rawUser;
    } catch (e) {
      console.error("Header decryption failed", e);
      return null;
    }
  }, [userData]);

  return (
    <header className={cn(
      "flex items-center sticky top-0 z-50 shrink-0 h-(--header-height) transition-all duration-300",
      isHomePage 
        ? "bg-transparent absolute border-none w-full" 
        : "supports-[backdrop-filter]:bg-background border-b border-border bg-background"
    )}>
      <Container width={width} className="flex justify-between items-center gap-4 relative">
        <div className={cn("flex items-center gap-10 flex-1 transition-all duration-300", showMobileSearch ? "opacity-0 invisible w-0" : "opacity-100 visible")}>
          <Link to="/" className="shrink-0">
            <img
              src={toAbsoluteUrl('/media/avatars/ae.png')}
              className="min-h-[42px] w-auto h-10 object-contain"
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
                <Button 
                  variant="ghost" 
                  mode="icon" 
                  shape="circle" 
                  className={cn(
                    "size-9 transition-colors",
                    isHomePage ? "text-white hover:bg-white/10" : "hover:bg-muted"
                  )}
                >
                  <MessageCircleMore className="size-4.5!" />
                </Button>
              }
            />
            <NotificationsSheet
              trigger={
                <Button 
                  variant="ghost" 
                  mode="icon" 
                  shape="circle" 
                  className={cn(
                    "size-9 transition-colors",
                    isHomePage ? "text-white hover:bg-white/10" : "hover:bg-muted"
                  )}
                >
                  <MessageSquareDot className="size-4.5!" />
                </Button>
              }
            />
            
            {/* Cart Button */}
            <Button 
              variant="ghost" 
              mode="icon" 
              shape="circle" 
              className={cn(
                "size-9 transition-colors",
                isHomePage ? "text-white hover:bg-white/10" : "hover:bg-muted"
              )}
              onClick={() => navigate('/purchase-options')}
            >
              <ShoppingCart className="size-4.5!" />
            </Button>
          </div>
          <div className={cn(
            "w-[1px] h-6 mx-1 hidden sm:block",
            isHomePage ? "bg-white/20" : "bg-border"
          )}></div>
          
          {user ? (
            <UserDropdownMenu
              trigger={
                <div className="flex items-center gap-3 cursor-pointer group">
                  <div className="hidden sm:flex flex-col items-end leading-none">
                    <span className={cn(
                      "text-sm font-semibold group-hover:text-primary transition-colors",
                      isHomePage ? "text-white" : "text-slate-900 dark:text-slate-100"
                    )}>
                      {user?.Full_Name || "User"}
                    </span>
                    <span className={cn(
                      "text-[10px] font-medium",
                      isHomePage ? "text-blue-100/70" : "text-muted-foreground"
                    )}>
                      {user?.User_Type ? `${user.User_Type} Member` : "Member"}
                    </span>
                  </div>
                  <img
                    className="size-9 rounded-full border-2 border-transparent group-hover:border-primary transition-all shrink-0 shadow-sm"
                    src={user?.Profile_Picture_Url || toAbsoluteUrl('/media/avatars/gray/5.png')}
                    alt=""
                  />
                </div>
              }
            />
          ) : (
            <div className="flex items-center gap-2 lg:gap-3">
              <Button
                variant="ghost"
                mode="icon"
                shape="circle"
                className={cn(
                  "size-9 transition-colors",
                  isHomePage ? "text-white hover:bg-white/10" : "hover:bg-muted"
                )}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="size-5!" /> : <Moon className="size-5!" />}
              </Button>
              <Button 
                variant={isHomePage ? "default" : "outline"}
                size="sm" 
                className={cn(
                  "gap-2 font-bold transition-all shadow-sm rounded-full px-5",
                  isHomePage 
                    ? "bg-white text-hw-blue-dark hover:bg-blue-50 border-none" 
                    : "border-hw-blue-dark text-hw-blue-dark hover:bg-hw-blue-dark hover:text-white"
                )}
                onClick={() => navigate('/auth/signin')}
              >
                <LogIn className="size-4" />
                <span>Login</span>
              </Button>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
// export { Header };
