'use client';

import useReadingProgress from '@/hooks/useReadingProgress';

export default function PostProgressBar() {
  const progress = useReadingProgress();

  return (
    <div className="fixed top-16 left-0 z-10 w-full h-px">
      <div
        className="h-full bg-cyan-500 dark:bg-cyan-400 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
