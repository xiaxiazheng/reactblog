import React, { useEffect } from "react";
import "@/App.scss";
import "./antd.scss";
import "@/assets/scss/Global.scss";
import Router from "./router";
import { IsLoginProvider } from "./context/IsLoginContext";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { hot } from "react-hot-loader/root";
import { isDev } from "./env_config";

const App: React.FC = () => {
    return (
        <div className={`App darkTheme`}>
            <IsLoginProvider>
                <ThemeProvider>
                    <UserProvider>
                        <Router />
                    </UserProvider>
                </ThemeProvider>
            </IsLoginProvider>
        </div>
    );
};

export default isDev ? hot(App) : App;
