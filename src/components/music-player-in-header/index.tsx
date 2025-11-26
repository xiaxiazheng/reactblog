import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { getMediaList } from "@xiaxiazheng/blog-libs";
import { cdnUrl } from "@/env_config";
import { Button, Input, message, Tooltip } from "antd";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    RedoOutlined,
    TrademarkOutlined,
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

const MusicPlayerInHeader: React.FC<PropsType> = (props) => {
    const { activeSong, setActiveSong } = props;

    useEffect(() => {
        getMusicList();
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
    // 从接口拿的歌
    const [originalMusicList, setOriginalMusicList] = useState<FType[]>([]);
    // 乱序后的歌曲
    const [randomMusicList, setRandomMusicList] = useState<FType[]>([]);
    // 最后展示的播放列表
    const [showList, setShowList] = useState<FType[]>([]);
    const getMusicList = async () => {
        const res: any = await getMediaList();
        if (res) {
            const musicList = res.filter((item: FType) =>
                item.mimeType.includes("audio")
            );
            setOriginalMusicList(musicList);
            setRandomMusicList(musicList);
            setIsRandom(false);
        }
    };

    // 当前歌曲列表是否乱序
    const [isRandom, setIsRandom] = useState<boolean>(false);

    const getRandomList = (list: any[]) => {
        // 每次初始化生成随机列表
        const l = [...list].sort(() => Math.random() - Math.random());
        setRandomMusicList(l);
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
            // 滚动到特定歌曲
            scrollIntoView();
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
    }, [isOneCircle, showList]);

    // 处理选择歌曲
    const handleChoice = (item: FType) => {
        setActive(item);
        setIsShowList(null);
        message.success(`当前播放：${item.key}`, 1);
    };

    // 播放上一首
    const playBeforeSong = () => {
        let index = showList.findIndex(
            (item) => active && item.key === active.key
        );
        index = index === 0 ? showList.length - 1 : index - 1;
        setActive(showList[index]);
        message.success(`当前播放：${showList[index].key}`, 1);
    };

    // 播放下一首
    const playAfterSong = () => {
        let index = showList.findIndex(
            (item) => active && item.key === active.key
        );
        index = index === showList.length - 1 ? 0 : index + 1;
        setActive(showList[index]);
        message.success(`当前播放：${showList[index].key}`, 1);
    };

    // 获取上一首的名称
    const getBeforeSong = () => {
        let index = showList.findIndex(
            (item) => active && item.key === active.key
        );
        index = index === 0 ? showList.length - 1 : index - 1;
        return showList[index] ? showList[index].key : "";
    };

    // 获取下一首的名称
    const getAfterSong = () => {
        let index = showList.findIndex(
            (item) => active && item.key === active.key
        );
        index = index === showList.length - 1 ? 0 : index + 1;
        return showList[index] ? showList[index].key : "";
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

    // 滚动到可视位置
    const ref = useRef<any>(null);
    const scrollIntoView = () => {
        ref?.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    }

    const [keyword, setKeyword] = useState<string>("");
    useEffect(() => {
        getShowList();
    }, [keyword, randomMusicList]);

    // 获取播放列表
    const getShowList = () => {
        if (keyword.trim()) {
            // 用空格，或搜索，只需满足一种关键词即可
            if (keyword.includes(' ')) {
                const klist = keyword.split(' ').map(item => item.trim().toLowerCase()).filter(item => !!item);
                setShowList(
                    randomMusicList.filter((item) => klist.some((k) => item.key.toLowerCase().includes(k)))
                );
            }
            // 用加号，与搜索，所有关键词都要匹配
            else if (keyword.includes('+')) {
                const klist = keyword.split('+').map(item => item.trim().toLowerCase()).filter(item => !!item);
                setShowList(
                    randomMusicList.filter((item) => klist.every((k) => item.key.toLowerCase().includes(k)))
                );
            }
            // 其他就都是整体搜索
            else {
                setShowList(
                    randomMusicList.filter((item) => item.key.toLowerCase().includes(keyword.toLowerCase()))
                );
            }
        } else {
            setShowList(randomMusicList);
        }
        setTimeout(() => {
            scrollIntoView();
        }, 300);
    }

    return (
        <div className={styles.music}>
            <div className={styles.songName} title={active ? active.key : ""}>
                <span onClick={showSongList}>
                    {active ? active.key : "暂无播放"}
                </span>
            </div>
            {/* 列表 */}
            <div
                className={`${styles.musicList} ${isShowList === null
                    ? ""
                    : isShowList
                        ? styles.show
                        : styles.hide
                    }`}
            >
                {/* 播放 */}
                <div className={styles.musicBox} ref={musicBox}>
                    <audio controls>
                        <source src={""} />
                    </audio>
                </div>
                <div className={styles.iconBox}>
                    <Tooltip title={`单曲循环`} placement="bottom">
                        <Button
                            type="text"
                            icon={
                                <RedoOutlined
                                    className={`${styles.playIcon} ${isOneCircle ? styles.active : ""}`}
                                />
                            }
                            onClick={() => setIsOneCircle(!isOneCircle)}
                        />
                    </Tooltip>
                    <Tooltip
                        title={`上一首：${getBeforeSong()}`}
                        placement="bottom"
                    >
                        <Button
                            type="text"
                            icon={
                                <ArrowLeftOutlined
                                    className={styles.playIcon}
                                />
                            }
                            onClick={playBeforeSong}
                        />
                    </Tooltip>
                    {!isPlaying && (
                        <Tooltip title={`播放`} placement="bottom">
                            <Button
                                type="text"
                                icon={
                                    <PlayCircleOutlined
                                        className={`${styles.playIcon}`}
                                    />
                                }
                                onClick={handlePlaying.bind(null, true)}
                            />
                        </Tooltip>
                    )}
                    {isPlaying && (
                        <Tooltip title={`暂停`} placement="bottom">
                            <Button
                                type="text"
                                icon={<PauseCircleOutlined
                                    className={`${styles.playIcon}`}
                                />}
                                onClick={handlePlaying.bind(null, false)}
                            />
                        </Tooltip>
                    )}
                    <Tooltip
                        title={`下一首：${getAfterSong()}`}
                        placement="bottom"
                    >
                        <Button
                            type="text"
                            icon={<ArrowRightOutlined
                                className={`${styles.playIcon}`} />}
                            onClick={playAfterSong}
                        />
                    </Tooltip>
                    <Tooltip title={`乱序`} placement="bottom">
                        <Button
                            type="text"
                            icon={<TrademarkOutlined
                                className={styles.playIcon}
                                style={{ color: isRandom ? 'red' : '' }} />}
                            onClick={() => {
                                getRandomList(showList);
                                setIsRandom(true);
                            }}
                        />
                    </Tooltip>
                    {isRandom && <Tooltip title={`还原`} placement="bottom">
                        <Button
                            type="text"
                            className={styles.playIcon}
                            onClick={() => {
                                setRandomMusicList(originalMusicList)
                                getShowList();
                                setIsRandom(false);
                            }}
                        >
                            <span className={styles.playIcon} style={{ fontSize: '14px', padding: 0 }}>还原</span>
                        </Button>
                    </Tooltip>}
                    {active && showList.findIndex(item => item.key === active?.key) !== -1 &&
                        <Tooltip title={`定位`} placement="bottom">
                            <Button
                                type="text"
                                className={styles.playIcon}
                                onClick={() => {
                                    scrollIntoView();
                                }}
                            >
                                <span className={styles.playIcon} style={{ fontSize: '14px', padding: 0 }}>定位</span>
                            </Button>
                        </Tooltip>
                    }
                </div>
                {/* 歌曲列表信息 */}
                <div className={styles.nums}>
                    当前播放:第{showList.findIndex(item => item.key === active?.key) + 1} / 播放列表:{showList.length} / 总歌曲数:{originalMusicList.length}
                </div>
                {/* 搜索框 */}
                <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="搜索歌曲，空格或搜索，+号与搜索"
                />
                {/* 播放列表 */}
                <div className="ScrollBar">
                    {showList &&
                        showList
                            .map((item) => (
                                <span
                                    key={item.key}
                                    onClick={() => handleChoice(item)}
                                    className={
                                        active && active.key === item.key
                                            ? styles.active
                                            : ""
                                    }
                                    ref={active && active.key === item.key ? ref : null}
                                >
                                    {item.key}
                                </span>
                            ))}
                </div>
            </div>
            {isShowList && <div className={styles.mask} onClick={() => setIsShowList(false)} />}
        </div>
    );
};

export default MusicPlayerInHeader;
