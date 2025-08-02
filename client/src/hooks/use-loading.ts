import { useState, useEffect } from "react";

export function useLoading() {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Check if this is a fresh page load or reload
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isReload = navigationEntries.length > 0 && 
      (navigationEntries[0].type === 'reload' || navigationEntries[0].type === 'navigate');

    // Only show loading on fresh loads/reloads
    if (isReload) {
      // Minimum loading time to show the animation
      const minLoadTime = 2000;
      const startTime = Date.now();

      const checkLoadComplete = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= minLoadTime && document.readyState === 'complete') {
          setShowLoading(false);
        } else {
          setTimeout(checkLoadComplete, 100);
        }
      };

      checkLoadComplete();
    } else {
      // For navigation within the app, don't show loading
      setShowLoading(false);
    }
  }, []);

  return showLoading;
}