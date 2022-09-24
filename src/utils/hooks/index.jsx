import { useState, useEffect } from 'react';

export function useUpdateWidth(chartContainerRef) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function updateWidth() {
      setWidth(chartContainerRef.current.offsetWidth);
    }
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return [width, setWidth];
}
