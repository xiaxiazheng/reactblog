import React from 'react';

interface PropsType {
    contentHtml: string;
}

const RichtextShow: React.FC<PropsType> = (props) => {
    return (
        <div style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: props.contentHtml }}></div>
    )
}

export default RichtextShow;
