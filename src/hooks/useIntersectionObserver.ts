'use client';
import { useEffect, useRef } from 'react';

const useIntersectionObserver = <T extends HTMLElement>(callback: () => void, options?: IntersectionObserverInit) => {
  const targetRef = useRef<T>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callbackRef.current();
      }
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return targetRef;
};

export default useIntersectionObserver;
