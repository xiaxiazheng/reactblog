import React from 'react';
import './App.scss';
import Router from './common/Router';
import { IsLoginProvider } from './common/IsLoginContext';

const App: React.FC = () => {
  return (
    <div className="App">
      <IsLoginProvider>
        <Router></Router>
      </IsLoginProvider>
    </div>
  );
}

export default App;
