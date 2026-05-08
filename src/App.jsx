import { AppRouting } from '@/routing/app-routing';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './auth/providers/supabase-provider';
import { I18nProvider } from './providers/i18n-provider';
import { ModulesProvider } from './providers/modules-provider';
import { QueryProvider } from './providers/query-provider';
import { SettingsProvider } from './providers/settings-provider';
import { ThemeProvider } from './providers/theme-provider';
import { TooltipsProvider } from './providers/tooltips-provider';
import ServerVariablesWatcher from './utils/Security/ServerVariablesWatcher';
import { useEffect } from 'react';
import { loadServerVariablesFromCookie } from './utils/Security/server';
import { SET_SERVER_VARIABLES } from './services/redux/slice/routeSlice';
import { useDispatch } from 'react-redux';
import { startAppProfile, appProfileReady } from './utils/Security/appInit';
import { loadApplicationProfileIfNeeded } from './utils/Security/profileLoader';
import { useState } from 'react';
import { ScreenLoader } from './components/common/screen-loader';

const { BASE_URL } = import.meta.env;

const queryClient = new QueryClient();

export function App() {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Load server variables from cookie on app start
    const cookieVars = loadServerVariablesFromCookie();
    if (cookieVars) {
      dispatch(SET_SERVER_VARIABLES(cookieVars));
      // console.log("📦 Server variables loaded from cookie on app start");
    }

    // 🔥 Initial Profile Fetch (only once)
    if (startAppProfile()) {
      dispatch(loadApplicationProfileIfNeeded());
    }

    // Wait for profile to be ready to hide global loader
    appProfileReady.then(() => {
      setIsInitializing(false);
    });
  }, [dispatch]);

  // if (isInitializing) {
  //   return <ScreenLoader />;
  // }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <ThemeProvider>
            <I18nProvider>
              <HelmetProvider>
                <TooltipsProvider>
                  <QueryProvider>
                    <LoadingBarContainer>
                      <BrowserRouter basename={BASE_URL}>
                         <ServerVariablesWatcher />
                        <Toaster />
                        <ModulesProvider>
                          <AppRouting />
                        </ModulesProvider>
                      </BrowserRouter>
                    </LoadingBarContainer>
                  </QueryProvider>
                </TooltipsProvider>
              </HelmetProvider>
            </I18nProvider>
          </ThemeProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
