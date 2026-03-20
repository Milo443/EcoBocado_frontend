import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
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
