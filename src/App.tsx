import React from 'react';
import './App.scss';
import Router from './components/Router';
import { IsLoginProvider } from './context/IsLoginContext';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <div className="App">
      <IsLoginProvider>
        <ThemeProvider>
          <Router></Router>
        </ThemeProvider>
      </IsLoginProvider>
    </div>
  );
}

export default App;
