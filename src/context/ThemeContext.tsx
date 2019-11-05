import React, { createContext, useState } from 'react';

export const ThemeContext = createContext({} as any);

export const ThemeProvider: React.FC = props => {
  const [theme, setTheme] = useState<'dark'|'light'>('dark');
  
  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export const ThemeConsumer = ThemeContext.Consumer;