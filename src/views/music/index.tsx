import React from "react";
import MusicPlayer from "@/components/music-player";
import styles from "./index.module.scss";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const Music = () => {
    useDocumentTitle('音乐播放器');

    return (
        <div className={styles.music}>
            <div className={styles.playerBox}>
                <MusicPlayer />
            </div>
        </div>
    );
};

export default Music;
