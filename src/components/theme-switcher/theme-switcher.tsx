'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <label className="h-6 w-12 relative cursor-pointer transition ease-in-out duration-500">
      <input
        type="checkbox"
        className="peer sr-only"
        id="theme-switch"
        checked={resolvedTheme === 'dark'}
        onChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      />
      <span className="absolute flex justify-between items-center inset-0 px-1 z-1" aria-hidden="true">
        <LuSun size={16} />
        <LuMoon size={16} />
      </span>
      <span className="after:duration-500 absolute inset-0 rounded-full bg-sidebar-border after:content-[''] after:absolute after:top-1 after:left-1 after:h-4 after:w-4 after:rounded-full after:bg-foreground after:transition-transform peer-checked:after:translate-x-6 after:z-1" />
    </label>
  );
};
export default ThemeSwitcher;
