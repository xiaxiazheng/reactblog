import React, { createContext, useState } from 'react';

export const IsLoginContext = createContext({} as any);

export const IsLoginProvider: React.FC = props => {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <IsLoginContext.Provider value={{isLogin, setIsLogin}}>
      {props.children}
    </IsLoginContext.Provider>
  )
}

export const IsLoginConsumer = IsLoginContext.Consumer;