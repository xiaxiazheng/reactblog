import React, { createContext, useState } from "react";

export const ThemeContext = createContext(
    {} as {
        theme: "dark" | "light";
        setTheme: React.Dispatch<React.SetStateAction<"dark" | "light">>;
    }
);

/** 保存主题 */
export const ThemeProvider: React.FC = (props) => {
    const beforeTheme = localStorage.getItem("theme") as
        | "dark"
        | "light"
        | null;
    const [theme, setTheme] = useState<"dark" | "light">(beforeTheme || "dark");

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {props.children}
        </ThemeContext.Provider>
    );
};

export const ThemeConsumer = ThemeContext.Consumer;
