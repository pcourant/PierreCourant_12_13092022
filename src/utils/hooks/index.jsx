import { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';

/**
 * Pause the calling function during the specified number of milliseconds
 * @param {Integer} ms - The number of milliseconds to block the calling function
 * @returns {Promise} - A promise which will be resolved after the specified number of milliseconds
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Custom Hooks that get the width of a DOM element after each window resizing
 * @param {A useRef() Object} chartContainerRef - a mutable ref of a DOM element
 * @returns {Number} - The current width of chartContainerRef after the last window resizing
 */
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

/**
 * Custom Hooks that get the size of th window after each window resizing
 * @returns {Number[]} - The current size [width, height] of ths window after the last window resizing
 */
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

/**
 * Custom Hooks that wrap a Axios GET request from a specified URL
 * @param {String} url - the URL to fetch data from
 * @returns {Object.<isLoading: Boolean, error: Object, data: Object>}
 */
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
  return { isLoading, error, data };
}
