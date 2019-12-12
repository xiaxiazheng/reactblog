import React from 'react';
import '@/App.scss';
import '@/assets/scss/Global.scss';
import Router from './router/Router';
import { IsLoginProvider } from './context/IsLoginContext';
import { ThemeProvider } from './context/ThemeContext';
import { hot } from 'react-hot-loader/root';
import { isDev } from './env_config'

const App: React.FC = () => {

  return (
    <div className="App darkTheme">
      <IsLoginProvider>
        <ThemeProvider>
          <Router></Router>
        </ThemeProvider>
      </IsLoginProvider>
    </div>
  );
}

export default isDev ? hot(App) : App;
