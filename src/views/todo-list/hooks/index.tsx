import { useCallback, useContext } from "react";
import { TodoContext } from "../TodoContext";

export const useUpdateFlag = () => {
    const { flag, setFlag } = useContext(TodoContext);

    const updateFlag = () => {
        setFlag(Math.random());
    };

    return { flag, updateFlag };
};
