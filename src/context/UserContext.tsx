import React, { createContext, useState } from "react";

export const UserContext = createContext({} as any);

/** 保存用户信息 */
export const UserProvider: React.FC = (props) => {
    const beforeUser = localStorage.getItem("username") as "zyb" | "hyp" | null;
    const [username, setUsername] = useState<"zyb" | "hyp">(
        beforeUser || "zyb"
    );

    return (
        <UserContext.Provider value={{ username, setUsername }}>
            {props.children}
        </UserContext.Provider>
    );
};

export const UserConsumer = UserContext.Consumer;
