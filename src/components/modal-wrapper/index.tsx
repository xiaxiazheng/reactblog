import { ThemeContext } from "@/context/ThemeContext";
import { Modal, ModalProps } from "antd";
import { useContext } from "react";

const ModalWrapper = (props: ModalProps) => {
    const { children, className, ...rest } = props;

    const { theme } = useContext(ThemeContext);

    return (
        <Modal {...rest}

            className={`${className} ${theme === "dark" ? "darkTheme" : ""}`}>
            {children}
        </Modal>
    )
}

export default ModalWrapper;