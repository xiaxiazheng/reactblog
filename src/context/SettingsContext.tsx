import { getSettings } from "@xiaxiazheng/blog-libs";
import React, { createContext, useEffect, useState } from "react";

interface ContextType {
    todoNameMap: Record<string, any>;
    todoDescriptionMap: Record<string, any>;
    todoPoolDefaultShow: number;
    todoColorNameMap: Record<string, any>;
    todoColorMap: Record<string, any>;
    todoCategoryDefaultShow: number;
    todoDefaultColor: number;
    quickDecisionConfig: Record<string, any>;
    todoShowBeforeToday: Record<string, any>;
    todoPreset: Array<Record<string, string>>;
};

export const SettingsContext = createContext<Partial<ContextType>>({});

/** 保存用户信息 */
export const SettingsProvider: React.FC = (props) => {
    const [settings, setSettings] = useState<Partial<ContextType>>({});

    useEffect(() => {
        getSettings().then((res) => {
            console.log("settings", res);
            setSettings(res);
        });
    }, []);

    return (
        <SettingsContext.Provider value={settings}>
            {props.children}
        </SettingsContext.Provider>
    );
};

export const SettingsConsumer = SettingsContext.Consumer;
