import { useEffect, useState } from 'react';

const useReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    let target = 0;
    let current = 0;

    const getTarget = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      return scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    };

    const tick = () => {
      current += (target - current) * 0.2;

      if (Math.abs(target - current) < 0.05) {
        current = target;
        rafId = null;
      } else {
        rafId = requestAnimationFrame(tick);
      }

      setProgress(current);
    };

    const onScroll = () => {
      target = getTarget();
      if (rafId === null) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
};

export default useReadingProgress;