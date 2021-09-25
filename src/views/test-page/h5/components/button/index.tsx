import React from 'react';
import { Button } from 'antd';

interface Props {
    style: object;
}

const ButtonComp: React.FC<Props> = (props) => {
    const { style } = props;

    return <Button style={style}>按钮</Button>
};

export default ButtonComp;