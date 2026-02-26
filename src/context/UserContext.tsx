import React, { createContext, useState } from "react";

type UserContextType = {
    username: "zbb" | "hyp";
    setUsername: React.Dispatch<React.SetStateAction<"zbb" | "hyp">>;
};

export const UserContext = createContext<UserContextType>({} as UserContextType);

type UserProviderProps = {
    children: React.ReactNode;
};

/** 保存用户信息 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const beforeUser = localStorage.getItem("username") as "zbb" | "hyp" | null;
    const [username, setUsername] = useState<"zbb" | "hyp">(
        beforeUser || "zbb"
    );

    return (
        <UserContext.Provider value={{ username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
};

export const UserConsumer = UserContext.Consumer;
