import '@/components/keenicons/assets/styles.css';
import './css/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { Provider } from 'react-redux';
import { store } from "./services/redux/store.js";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <App />
      </Provider>
  </StrictMode>,
);
