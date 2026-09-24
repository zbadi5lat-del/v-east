import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { SiteExperienceProvider } from './siteExperience';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteExperienceProvider>
      <App />
    </SiteExperienceProvider>
  </StrictMode>,
);
