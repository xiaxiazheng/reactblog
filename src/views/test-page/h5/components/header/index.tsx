import React from "react";

interface Props {
    formData: any;
}

const Header: React.FC<Props> = (props) => {
    const { formData } = props;
    const { title } = formData;

    return <h2 style={{}}>{title || "头部标题"}</h2>;
};

export default Header;
