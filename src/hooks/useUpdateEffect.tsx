import React, { useEffect, useRef } from 'react';

const useUpdateEffect = (fn: Function, deps?: Array<any>) => {
    const ref = useRef<boolean>(false);

    useEffect(() => {
        ref.current && fn();
    }, deps);

    useEffect(() => {
        ref.current = true;
    }, []);
}

export default useUpdateEffect;