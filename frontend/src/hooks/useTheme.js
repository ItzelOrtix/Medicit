import { useState, useEffect } from 'react';

export function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem('medicit_theme') === 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('medicit_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('medicit_theme', 'light');
    }
  }, [dark]);

  return { dark, toggle: () => setDark((p) => !p) };
}
