import { useCallback } from 'react';

type Route = '/' | '/simulator' | '/challenges' | '/learn';

export const useNavigate = () => {
  const navigate = useCallback((path: Route | string) => {
    // Update URL without page reload
    window.history.pushState({}, '', path);
    
    // Dispatch custom event for route change
    window.dispatchEvent(new CustomEvent('navigationChange', { detail: path }));
  }, []);

  return navigate;
};

export const useCurrentRoute = () => {
  return window.location.pathname + window.location.search;
};