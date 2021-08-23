import React from "react";
import MusicPlayer from "@/components/music-player";
import styles from "./index.module.scss";

const Music = () => {
    return (
        <div className={styles.music}>
            <div className={styles.playerBox}>
                <MusicPlayer />
            </div>
        </div>
    );
};

export default Music;
