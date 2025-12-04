import { useEffect, useRef } from 'react';

/**
 * Custom hook to run a function on a fixed interval.
 * @param callback The function to execute.
 * @param delay The delay in milliseconds (or null to stop the interval).
 */
export function useInterval(callback: () => void, delay: number | null) {
  // Use a ref to store the latest callback function. 
  // This allows us to always call the latest function instance without restarting the interval.
  const savedCallback = useRef(callback);

  // Update the saved callback when the function changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // Execute the latest version of the callback
      savedCallback.current();
    }
    
    if (delay !== null) {
      // Set the interval
      const id = setInterval(tick, delay);
      
      // Cleanup function: this runs when the component unmounts or delay changes
      return () => clearInterval(id);
    }
  }, [delay]);
}