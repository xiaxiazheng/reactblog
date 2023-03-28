import { useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../rematch";

export const useUpdateFlag = () => {
    const flag = useSelector((state: RootState) => state.edit.flag);
    const dispatch = useDispatch<Dispatch>();
    const {
        setFlag,
    } = dispatch.edit;

    const updateFlag = () => {
        setFlag(Math.random());
    };

    return { flag, updateFlag };
};
