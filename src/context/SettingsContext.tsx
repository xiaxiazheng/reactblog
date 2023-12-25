import { getSettings } from "@/client/SettingsHelper";
import React, { createContext, useEffect, useState } from "react";

export const SettingsContext = createContext({} as any);

/** 保存用户信息 */
export const SettingsProvider: React.FC = (props) => {
    const [settings, setSettings] = useState<any>({});

    useEffect(() => {
        getSettings().then((res) => {
            console.log("res", res);
        });
    }, []);

    return (
        <SettingsContext.Provider value={settings}>
            {props.children}
        </SettingsContext.Provider>
    );
};

export const SettingsConsumer = SettingsContext.Consumer;
