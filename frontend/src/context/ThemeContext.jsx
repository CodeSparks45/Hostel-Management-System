import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Pehle check karo memory mein kuch save hai kya, warna default 'light'
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    // HTML tag ko pakdo
    const root = window.document.documentElement;
    
    // Agar dark hai toh html tag mein class="dark" add kar do
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // User ki pasand browser memory mein save kar lo
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Theme badalne ka remote control
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};