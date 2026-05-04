import { useSettings } from '@/providers/settings-provider';
import {
  Demo1LightSidebarPage,
  Demo2Page,
} from '../';

const DefaultPage = () => {
  const { settings } = useSettings();

  if (settings?.layout === 'demo1') {
    return <Demo1LightSidebarPage />;
  } else if (settings?.layout === 'demo2') {
    return <Demo2Page />;
  } else {
    return <Demo1LightSidebarPage />;
  }
};

export { DefaultPage };
