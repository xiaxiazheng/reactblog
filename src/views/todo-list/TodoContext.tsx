import React, { createContext, useState } from "react";

export const TodoContext = createContext({} as any);

/** 保存 todo 信息 */
export const TodoProvider: React.FC = (props) => {
    const [flag, setFlag] = useState<any>();

    return (
        <TodoContext.Provider value={{ flag, setFlag }}>
            {props.children}
        </TodoContext.Provider>
    );
};

export const UserConsumer = TodoContext.Consumer;
