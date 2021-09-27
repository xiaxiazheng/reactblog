import React from 'react';

interface Props {
    style: object;
}

const Image: React.FC<Props> = (props) => {
    const { style } = props;

    return <div>一张图片</div>
};

export default Image;