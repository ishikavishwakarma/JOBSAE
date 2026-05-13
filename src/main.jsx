import '@/components/keenicons/assets/styles.css';
import './css/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { Provider } from 'react-redux';
import { store, persistor } from "./services/redux/store.js";
import { PersistGate } from 'redux-persist/integration/react';

import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
