import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { getMediaList } from "@/client/VideoHelper";
import { cdnUrl } from "@/env_config";
import { message } from "antd";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    RedoOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import useDocumentTitle from "@/hooks/useDocumentTitle";

export interface FType {
    key: string;
    mimeType: string;
    times: string;
}

interface PropsType {
    activeSong?: FType;
    setActiveSong?: (file: FType) => void;
}

const Music: React.FC<PropsType> = (props) => {
    const { activeSong, setActiveSong } = props;

    useEffect(() => {
        getList();
    }, []);

    // 如果有传值进来，就播放传值的歌
    useEffect(() => {
        if (activeSong && activeSong.key !== active?.key) {
            setActive(activeSong);
            setIsPlaying(false);
        }
    }, [activeSong]);

    // 是否单曲循环
    const [isOneCircle, setIsOneCircle] = useState<boolean>(false);
    const [musicList, setMusicList] = useState<FType[]>([]);
    const [randomList, setRandomList] = useState<FType[]>([]);
    const getList = async () => {
        const res2: any = await getMediaList();
        if (res2) {
            const music = res2.filter((item: FType) =>
                item.mimeType.includes("audio")
            );
            setMusicList(music);
            // 每次初始化生成随机列表
            const list = [...music].sort(() => Math.random() - Math.random());
            setRandomList(list);
        }
    };

    const musicBox = useRef(null);
    const [active, setActive] = useState<FType>(); // 当前播放歌曲
    const [isShowList, setIsShowList] = useState<boolean | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        if (setActiveSong && active && active?.key !== activeSong?.key) {
            setActiveSong(active);
        }
    }, [active]);

    // 根据 active 的不同切换播放的歌曲
    useEffect(() => {
        if (active) {
            changeSong(active);
            setIsPlaying(false);
        }
    }, [active]);

    // 根据当前歌曲名称切换 title
    useDocumentTitle(active?.key || "暂无播放");

    // 播放 song
    const changeSong = (song: FType) => {
        const dom: any = musicBox;
        if (dom.current) {
            dom.current.childNodes[0].pause();
            dom.current.childNodes[0].src = "";
            dom.current.childNodes[0].childNodes[0].src = "";
            dom.current.removeChild(dom.current.childNodes[0]);

            const audio: any = document.createElement("audio");
            audio.controls = true;
            audio.autoplay = true;

            // 更新播放按钮的状态
            audio.onplay = () => setIsPlaying(true);
            audio.onpause = () => setIsPlaying(false);

            // 监听播放结束，单曲循环或下一首
            audio.onended = handleFinish;

            const source = document.createElement("source");
            source.src = `${cdnUrl}/${song.key}`;
            source.type = song.mimeType;

            audio.appendChild(source);
            dom.current.appendChild(audio);
        }
    };

    // 播放 & 暂停
    const handlePlaying = (bool: boolean) => {
        const dom: any = musicBox;
        if (
            dom.current &&
            dom.current.childNodes &&
            dom.current.childNodes.length === 1
        ) {
            const music: any = dom.current.childNodes[0];
            if (bool) {
                music.play();
            } else {
                music.pause();
            }
            setIsPlaying(bool);
        }
    };

    // 处理播放完之后
    const handleFinish = () => {
        if (isOneCircle) {
            // 单曲循环
            active && changeSong(active);
        } else {
            // 播放完随机播放下一首
            playAfterSong();
        }
    };

    // 由于 hooks 的原因，要重新绑定这个事件才能获取到当前的 isOneCircle 的状态
    useEffect(() => {
        const dom: any = musicBox;
        if (dom.current) {
            const audio = dom.current.childNodes[0];
            audio.onended = handleFinish;
        }
    }, [isOneCircle]);

    // 处理选择歌曲
    const handleChoice = (item: FType) => {
        setActive(item);
        setIsShowList(null);
        message.success(`当前播放：${item.key}`, 1);
    };

    // 播放上一首
    const playBeforeSong = () => {
        let index = randomList.findIndex(
            (item) => active && item.key === active.key
        );
        index = index === 0 ? randomList.length - 1 : index - 1;
        setActive(randomList[index]);
        message.success(`当前播放：${randomList[index].key}`, 1);
    };

    // 播放下一首
    const playAfterSong = () => {
        let index = randomList.findIndex(
            (item) => active && item.key === active.key
        );
        index = index === randomList.length - 1 ? 0 : index + 1;
        setActive(randomList[index]);
        message.success(`当前播放：${randomList[index].key}`, 1);
    };

    // 获取上一首的名称
    const getBeforeSong = () => {
        let index = randomList.findIndex(
            (item) => active && item.key === active.key
        );
        index = index === 0 ? randomList.length - 1 : index - 1;
        return randomList[index] ? randomList[index].key : "";
    };

    // 获取下一首的名称
    const getAfterSong = () => {
        let index = randomList.findIndex(
            (item) => active && item.key === active.key
        );
        index = index === randomList.length - 1 ? 0 : index + 1;
        return randomList[index] ? randomList[index].key : "";
    };

    // 展示歌曲列表
    const showSongList = () => {
        if (!isShowList) {
            setIsShowList(true);
        } else {
            setIsShowList(false);
            setTimeout(() => {
                setIsShowList(null);
            }, 300);
        }
    };

    return (
        <div className={styles.music}>
            {/* 播放 */}
            <div className={styles.musicBox} ref={musicBox}>
                <audio controls>
                    <source src={""} />
                </audio>
            </div>
            <div
                className={styles.songName}
                title={active ? active.key : ""}
            >
                <span onClick={showSongList}>
                    {active ? active.key : "暂无播放"}
                </span>
            </div>
            {/* 控件 */}
            {active && (
                <div className={styles.iconBox}>
                    <RedoOutlined
                        className={`${styles.playIcon} ${
                            isOneCircle ? styles.active : ""
                        }`}
                        title={"单曲循环"}
                        onClick={() => setIsOneCircle(!isOneCircle)}
                    />
                    <ArrowLeftOutlined
                        className={styles.playIcon}
                        title={`上一首：${getBeforeSong()}`}
                        onClick={playBeforeSong}
                    />
                    {!isPlaying && (
                        <PlayCircleOutlined
                            className={`${styles.playIcon}`}
                            title={`播放`}
                            onClick={handlePlaying.bind(null, true)}
                        />
                    )}
                    {isPlaying && (
                        <PauseCircleOutlined
                            className={`${styles.playIcon}`}
                            title={`暂停`}
                            onClick={handlePlaying.bind(null, false)}
                        />
                    )}
                    <ArrowRightOutlined
                        className={styles.playIcon}
                        title={`下一首：${getAfterSong()}`}
                        onClick={playAfterSong}
                    />
                    {/* <UnorderedListOutlined
                        className={`${styles.playIcon} ${
                            isShowList ? styles.active : ""
                        }`}
                        title={`歌曲列表`}
                        onClick={showSongList}
                    /> */}
                </div>
            )}
            {/* 列表 */}
            <div
                className={`${styles.musicList} ${
                    isShowList === null
                        ? ""
                        : isShowList
                        ? styles.show
                        : styles.hide
                } ScrollBar`}
            >
                {musicList &&
                    musicList.map((item) => (
                        <span
                            key={item.key}
                            onClick={() => handleChoice(item)}
                            className={
                                active && active.key === item.key
                                    ? styles.active
                                    : ""
                            }
                        >
                            {item.key}
                        </span>
                    ))}
            </div>
        </div>
    );
};

export default Music;
