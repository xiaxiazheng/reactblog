import React from 'react';
import { Input } from 'antd';

interface Props {
    style: object;
}

const InputComp: React.FC<Props> = (props) => {
    const { style } = props;

    return <Input style={style} />
};

export default InputComp;