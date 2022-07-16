import React, { useState } from "react";
import styles from "./index.module.scss";
import { default as imgPlaceHolder } from "@/assets/loading.svg";

interface PropsType {
    imageName: string;
    imageUrl: string;
}

/** 图片遮罩加载 */
const MaskLoadImage: React.FC<PropsType> = (props) => {
    // const imgRef = useRef(null);

    const { imageName, imageUrl } = props;

    const [isload, setIsload] = useState(false);
    const handleOnload = () => {
        setIsload(true);
    };

    // const changeRealSrc = () => {
    //   const imgdom: any = imgRef.current;
    //   console.log(imgdom.src, encodeURI(imageUrl));

    //   if (imgdom.src !== encodeURI(imageUrl)) {
    //     imgdom.src = imageUrl;
    //   }
    // }

    return (
        <div className={styles.wrapper}>
            <img
                // className={styles.maskLoadImage}
                src={imageUrl}
                // data-src={imageUrl}
                alt={imageName}
                title={imageName}
                onLoad={handleOnload}
            />
            {!isload && (
                <img
                    className={styles.mask}
                    src={imgPlaceHolder}
                    // data-src={imageUrl}
                    alt={imageName}
                    title={imageName}
                />
            )}
        </div>
    );
};

export default MaskLoadImage;
