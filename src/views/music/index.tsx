import React, { useEffect, useState } from "react";
import { Empty, Input } from "antd";
import MusicPlayer from "@/components/music-player-in-header";
import styles from "./index.module.scss";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { getMediaList } from "@xiaxiazheng/blog-libs";   
import { FType } from "@/components/music-player-in-header";

const Music = () => {
    useDocumentTitle("音乐播放器");

    const [keyword, setKeyword] = useState<string>("");

    const [musicList, setMusicList] = useState<FType[]>([]);
    const [originList, setOriginList] = useState<FType[]>([]);
    const [activeSong, setActiveSong] = useState<FType>();
    const getList = async () => {
        const res2: any = await getMediaList();
        if (res2) {
            const music = res2.filter((item: FType) =>
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
            originList.filter(
                (item) =>
                    item.key.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
            )
        );
    }, [keyword]);

    return (
        <div className={styles.music}>
            <div className={styles.playerBox}>
                <MusicPlayer
                    activeSong={activeSong}
                    setActiveSong={setActiveSong}
                />
            </div>
            <div className={`${styles.musicList} ScrollBar`}>
                <Input
                    className={styles.keyword}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                {keyword && musicList?.length === 0 && (
                    <Empty style={{ marginTop: 30 }} />
                )}
                {musicList?.map((item) => (
                    <div
                        key={item.key}
                        onClick={() => setActiveSong(item)}
                        className={`${styles.songItem} ${
                            activeSong && activeSong.key === item.key
                                ? styles.active
                                : ""
                        }`}
                    >
                        {item.key}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Music;
