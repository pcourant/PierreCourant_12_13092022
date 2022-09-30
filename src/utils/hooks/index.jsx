import { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  return width;
}

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export function useAxiosGet(url) {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    const axiosGet = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data.data);
      } catch (err) {
        // console.error(err);
        setError(err);
      } finally {
        await sleep(1000);
        if (
          url.includes('activity') ||
          url.includes('performance') ||
          url.includes('average-sessions')
        ) {
          await sleep(1000);
        }
        setLoading(false);
      }
    };
    axiosGet();
  }, [url]);
  return { isLoading, data, error };
}
