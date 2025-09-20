import React, { useState, useEffect, useContext } from "react";
import { ImageType, getImgList } from "@xiaxiazheng/blog-libs";
import ImageListBox from "@/components/file-image-handle/image-list-box";
import styles from "./index.module.scss";
import { UserContext } from "@/context/UserContext";
import FileImageUpload from "@/components/file-image-handle/file-image-upload";

const Admin: React.FC = () => {
    const [AdminImgList, setAdminImgList] = useState<ImageType[]>([]);
    const { username } = useContext(UserContext);

    useEffect(() => {
        getImageList();
    }, []);

    const getImageList = async () => {
        const res: ImageType[] = await getImgList("main", username);
        setAdminImgList(res);
    };

    return (
        <div className={styles.Admin}>
            <FileImageUpload type="main" refresh={getImageList} />
            <ImageListBox
                type="main"
                imageList={AdminImgList}
                refresh={getImageList}
            />
        </div>
    );
};

const AdminBox: React.FC = () => {
    return (
        <div>
            <Admin />
        </div>
    );
};

export default AdminBox;
