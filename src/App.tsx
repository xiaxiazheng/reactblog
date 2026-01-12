import React from "react";
import "@/App.scss";
import "./antd.scss";
import "@/assets/scss/Global.scss";
import Router from "./router";
import { IsLoginProvider } from "./context/IsLoginContext";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { SettingsProvider } from "@xiaxiazheng/blog-libs";

const App: React.FC = () => {
    return (
        <div className={`App darkTheme`}>
            <IsLoginProvider>
                <ThemeProvider>
                    <UserProvider>
                        <SettingsProvider>
                            <Router />
                        </SettingsProvider>
                    </UserProvider>
                </ThemeProvider>
            </IsLoginProvider>
        </div>
    );
};

export default App;
