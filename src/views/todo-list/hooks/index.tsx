import { useCallback, useContext, useState } from "react";
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

export const useIsHIdeModel = (key: string) => {
    const k = `is-hide-model-${key}`
    const [isHideModel, setIsHideModel] = useState<boolean>(localStorage.getItem(k) === '1');

    const setIsHide = () => {
        const val = !isHideModel;
        localStorage.setItem(k, val ? '1' : '0');
        setIsHideModel(val);
    };

    return {
        isHide: isHideModel,
        setIsHide
    }
}