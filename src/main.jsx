import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import './utils/i18n.js';
import Loader from './components/Shared/Loader/Loader.jsx';
import { useEffect } from 'react';


export function Root() {
  const [appKey, setAppKey] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 8500);
    return () => clearTimeout(timer);
  }, []);

  window.forceRerender = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setAppKey((k) => k + 1);
      setIsFadingOut(false);
    }, 500);
  };

  if (isInitialLoading) {
    return <Loader theme="light" />;
  }

  return (
    <StrictMode>
      <div style={{
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.5s ease-in-out',
        width: '100%',
        minHeight: '100vh',
        pointerEvents: isFadingOut ? 'none' : 'auto'
      }}>
        <BrowserRouter key={appKey}>
          <App />
        </BrowserRouter>
      </div>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
