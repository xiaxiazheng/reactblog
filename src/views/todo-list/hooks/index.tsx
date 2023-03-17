import { useCallback, useContext } from "react";
import { TodoEditContext } from "../TodoEditContext";

export const useUpdateFlag = () => {
    const { flag, setFlag } = useContext(TodoEditContext);

    const updateFlag = () => {
        setFlag(Math.random());
    };

    return { flag, updateFlag };
};
