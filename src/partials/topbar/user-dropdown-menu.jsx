import { useMemo } from 'react';
import { I18N_LANGUAGES } from '@/i18n/config';
import {
  BetweenHorizontalStart,
  Coffee,
  CreditCard,
  FileText,
  Globe,
  IdCard,
  Moon,
  Settings,
  Shield,
  SquareCode,
  UserCircle,
  Users,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useLanguage } from '@/providers/i18n-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetAuth } from '@/services/redux/slice/authSlice';
import { decryptResponse } from '@/utils/helpers/apiHelper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

export function UserDropdownMenu({ trigger }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currenLanguage, changeLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const { userData, token } = useSelector((state) => state.auth);

  const user = useMemo(() => {
    if (!userData || !token) return null;
    try {
      const decrypted = decryptResponse(userData);
      return decrypted?.[0]?.Return?.User?.tblUser?.[0] || 
             decrypted?.Return?.User?.tblUser?.[0] || 
             decrypted?.tblUser?.[0];
    } catch (e) {
      return null;
    }
  }, [userData, token]);

  // Use display data from currentUser
  const displayName = user?.Full_Name || user?.fullname || 'User';
  const displayEmail = user?.EMail_Address || user?.email || '';
  const displayAvatar = user?.Profile_Picture_Url || toAbsoluteUrl('/media/avatars/gray/5.png');

  const handleLanguage = (lang) => {
    changeLanguage(lang);
  };

  const handleThemeToggle = (checked) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const handleLogout = () => {
    // Social Logouts
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    if (window.FB) {
      window.FB.getLoginStatus((response) => {
        if (response?.status === "connected") {
          window.FB.logout();
        }
      });
    }

    // Preserve specific items
    const selectedCountry = localStorage.getItem("selected_country");
    const userLocation = localStorage.getItem("user_location");
    const geoPersistent = localStorage.getItem("geo_location_persistent");
    
    localStorage.clear();
    
    // Restore preserved items
    if (selectedCountry) localStorage.setItem("selected_country", selectedCountry);
    if (userLocation) localStorage.setItem("user_location", userLocation);
    if (geoPersistent) localStorage.setItem("geo_location_persistent", geoPersistent);

    const geoLocation = sessionStorage.getItem("geo_location");
    sessionStorage.clear();
    if (geoLocation) sessionStorage.setItem("geo_location", geoLocation);

    // Reset Redux
    dispatch(resetAuth());
    
    navigate('/auth/signin');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <img
              className="size-9 rounded-full border-2 border-green-500"
              src={displayAvatar}
              alt="User avatar"
            />

            <div className="flex flex-col">
              <Link
                to="/account/home/get-started"
                className="text-sm text-mono hover:text-primary font-semibold text-slate-900 dark:text-slate-100"
              >
                {displayName}
              </Link>
              <a
                href={`mailto:${displayEmail}`}
                className="text-xs text-muted-foreground hover:text-primary"
              >
                {displayEmail}
              </a>
            </div>
          </div>
          <Badge variant="primary" appearance="light" size="sm">
            Pro
          </Badge>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link
            to="/public-profile/profiles/default"
            className="flex items-center gap-2"
          >
            <IdCard />
            Public Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/profile"
            className="flex items-center gap-2"
          >
            <UserCircle />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/company-profile"
            className="flex items-center gap-2"
          >
            <UserCircle />
            Company Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/settings/account-settings"
            className="flex items-center gap-2"
          >
            <Settings />
            User Settings
          </Link>
        </DropdownMenuItem>

        {/* My Account Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Settings />
            My Account
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <DropdownMenuItem asChild>
              <Link
                to="/account/home/get-started"
                className="flex items-center gap-2"
              >
                <Coffee />
                Get Started
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="/profile"
                className="flex items-center gap-2"
              >
                <FileText />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="/company-profile"
                className="flex items-center gap-2"
              >
                <FileText />
                Company Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="/account/billing/basic"
                className="flex items-center gap-2"
              >
                <CreditCard />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="/account/security/overview"
                className="flex items-center gap-2"
              >
                <Shield />
                Security
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="/account/members/teams"
                className="flex items-center gap-2"
              >
                <Users />
                Members & Roles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="/account/integrations"
                className="flex items-center gap-2"
              >
                <BetweenHorizontalStart />
                Integrations
              </Link>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem asChild>
          <Link
            to="https://devs.keenthemes.com"
            className="flex items-center gap-2"
          >
            <SquareCode />
            Dev Forum
          </Link>
        </DropdownMenuItem>

        {/* Language Submenu with Radio Group */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2 [&_[data-slot=dropdown-menu-sub-trigger-indicator]]:hidden hover:[&_[data-slot=badge]]:border-input data-[state=open]:[&_[data-slot=badge]]:border-input">
            <Globe />
            <span className="flex items-center justify-between gap-2 grow relative">
              Language
              <Badge
                variant="outline"
                className="absolute end-0 top-1/2 -translate-y-1/2"
              >
                {currenLanguage.label}
                <img
                  src={currenLanguage.flag}
                  className="w-3.5 h-3.5 rounded-full"
                  alt={currenLanguage.label}
                />
              </Badge>
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <DropdownMenuRadioGroup
              value={currenLanguage.code}
              onValueChange={(value) => {
                const selectedLang = I18N_LANGUAGES.find(
                  (lang) => lang.code === value,
                );
                if (selectedLang) handleLanguage(selectedLang);
              }}
            >
              {I18N_LANGUAGES.map((item) => (
                <DropdownMenuRadioItem
                  key={item.code}
                  value={item.code}
                  className="flex items-center gap-2"
                >
                  <img
                    src={item.flag}
                    className="w-4 h-4 rounded-full"
                    alt={item.label}
                  />

                  <span>{item.label}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Footer */}
        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={(event) => event.preventDefault()}
        >
          <Moon />
          <div className="flex items-center gap-2 justify-between grow">
            Dark Mode
            <Switch
              size="sm"
              checked={theme === 'dark'}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </DropdownMenuItem>
        <div className="p-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-hw-blue-dark text-hw-blue-dark hover:bg-hw-blue-dark hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-hw-blue-dark transition-all"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
