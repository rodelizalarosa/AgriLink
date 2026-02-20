import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

interface RouteTransitionProps {
  children: React.ReactNode;
}

const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previousLocation, setPreviousLocation] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    // Show loading spinner when route changes
    if (previousLocation && previousLocation !== location.pathname) {
      setIsLoading(true);
      
      // Simulate loading time (adjust as needed)
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800); // 800ms loading delay

      return () => clearTimeout(timer);
    }
    
    setPreviousLocation(location.pathname);
  }, [location.pathname, previousLocation]);

  // Don't show loading on initial load
  if (isLoading && previousLocation) {
    return <LoadingSpinner message="Loading page..." />;
  }

  return <>{children}</>;
};

export default RouteTransition;
