import React, { useEffect } from "react";
import "@/App.scss";
import "./antd.scss";
import "@/assets/scss/Global.scss";
import Router from "./router";
import { IsLoginProvider } from "./context/IsLoginContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SettingsProvider } from "./context/SettingsContext";
import { UserProvider } from "./context/UserContext";
import { hot } from "react-hot-loader/root";
import { isDev } from "./env_config";

// 开发版才引入打开 vscode 的操作
// if (isDev) {
//     require("../openInVscode/listenDomClick");
// }

const App: React.FC = () => {
    return (
        <div className={`App darkTheme`}>
            <IsLoginProvider>
                <ThemeProvider>
                    <SettingsProvider>
                        <UserProvider>
                            <Router />
                        </UserProvider>
                    </SettingsProvider>
                </ThemeProvider>
            </IsLoginProvider>
        </div>
    );
};

export default isDev ? hot(App) : App;
