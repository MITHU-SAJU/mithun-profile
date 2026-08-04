import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from '../utils/analytics';

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Log a page view whenever the location (URL) changes
    logPageView(location.pathname + location.search);
  }, [location]);

  return null; // This component doesn't render anything visually
};

export default AnalyticsTracker;
