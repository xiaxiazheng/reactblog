import React, { useEffect, useState } from "react";
import { Input } from "antd";
import MusicPlayer from "@/components/music-player";
import styles from "./index.module.scss";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { getMediaList } from "@/client/VideoHelper";
import { FileType } from "@/components/music-player";

const Music = () => {
    useDocumentTitle("音乐播放器");

    const [keyword, setKeyword] = useState<string>("");

    const [musicList, setMusicList] = useState<FileType[]>([]);
    const [originList, setOriginList] = useState<FileType[]>([]);
    const [activeSong, setActiveSong] = useState<FileType>();
    const getList = async () => {
        const res2: any = await getMediaList();
        if (res2) {
            const music = res2.filter((item: FileType) =>
                item.mimeType.includes("audio")
            );
            setMusicList(music);
            setOriginList(music);
        }
    };

    useEffect(() => {
        getList();
    }, []);

    useEffect(() => {
        setMusicList(
            originList.filter((item) => item.key.indexOf(keyword) !== -1)
        );
    }, [keyword]);

    return (
        <div className={styles.music}>
            <div className={styles.playerBox}>
                <MusicPlayer activeSong={activeSong} />
            </div>
            <div className={`${styles.musicList} ScrollBar`}>
                <Input
                    className={styles.keyword}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                {musicList &&
                    musicList.map((item) => (
                        <div
                            key={item.key}
                            onClick={() => setActiveSong(item)}
                            className={`${
                                activeSong && activeSong.key === item.key
                                    ? styles.active
                                    : ""
                            } ${styles.songItem}`}
                        >
                            {item.key}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Music;
