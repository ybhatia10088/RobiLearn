import React, { useState, useEffect } from 'react';
import HomePage from '@/pages/HomePage';
import SimulatorPage from '@/pages/SimulatorPage';
import ChallengesPage from '@/pages/ChallengesPage';
import { useCurrentRoute } from '@/hooks/useNavigation';

function App() {
  const [currentRoute, setCurrentRoute] = useState(useCurrentRoute());
  
  useEffect(() => {
    const handleRouteChange = (event: Event) => {
      const path = (event as CustomEvent).detail;
      setCurrentRoute(path);
    };
    
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    
    window.addEventListener('navigationChange', handleRouteChange);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('navigationChange', handleRouteChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  // Extract the base path without query parameters
  const basePath = currentRoute.split('?')[0];
  
  // Render the appropriate page based on the current route
  const renderPage = () => {
    switch (basePath) {
      case '/simulator':
        return <SimulatorPage />;
      case '/challenges':
        return <ChallengesPage />;
      case '/':
        return <HomePage />;
      default:
        // Redirect to home page for unknown routes
        window.history.replaceState({}, '', '/');
        return <HomePage />;
    }
  };
  
  return renderPage();
}

export default App;