import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'primereact/resources/themes/lara-light-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'chart.js/auto';
import { PrimeReactProvider } from 'primereact/api';
import { primeReactConfig } from './config/primereact';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider value={primeReactConfig}>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
);
