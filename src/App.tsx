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
  
  // Render the appropriate page based on the current route
  const renderPage = () => {
    switch (currentRoute) {
      case '/simulator':
        return <SimulatorPage />;
      case '/challenges':
        return <ChallengesPage />;
      case '/':
      default:
        return <HomePage />;
    }
  };
  
  return renderPage();
}

export default App;