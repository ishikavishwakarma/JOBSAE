import { useEffect } from 'react';
import { Toolbar, ToolbarHeading } from '@/layouts/demo2/components/toolbar';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import { MENU_SIDEBAR } from '@/config/menu.config';
import { useBodyClass } from '@/hooks/use-body-class';
import { useMenu } from '@/hooks/use-menu';
import { useSettings } from '@/providers/settings-provider';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Navbar } from './components/navbar';

export function CustomLayout() {
  const { pathname } = useLocation();
  const { getCurrentItem } = useMenu(pathname);
  const item = getCurrentItem(MENU_SIDEBAR);
  const { setOption } = useSettings();

  useEffect(() => {
    // Set current layout
    setOption('layout', 'custom');
  }, [setOption]);

  useBodyClass(`
    [--header-height:70px]
    [--navbar-height:50px]
    bg-background
  `);

  return (
    <>
      <Helmet>
        <title>{item?.title || 'Home'}</title>
      </Helmet>
      <div className="flex grow flex-col">
        <Header />
        {/* <Navbar /> */}

        <main className="grow pt-5" role="content">
          {item && (
            <Toolbar>
              <ToolbarHeading />
            </Toolbar>
          )}
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
}
