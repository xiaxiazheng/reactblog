import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
// import { IsLoginContext } from "@/context/IsLoginContext";
import { getMediaList } from "@/client/VideoHelper";
import { cdnUrl } from "@/env_config";
import { Icon, message } from "antd";

interface FileType {
  key: string;
  mimeType: string;
}

const Music: React.FC = () => {
  // const { isLogin } = useContext(IsLoginContext);

  useEffect(() => {
    getList();
  }, []);

  const [isOneCircle, setIsOneCircle] = useState<boolean>(false);
  const [musicList, setMusicList] = useState<FileType[]>([]);
  const [randomList, setRandomList] = useState<FileType[]>([]);
  const getList = async () => {
    const res2: any = await getMediaList();
    if (res2) {
      const music = res2.filter((item: FileType) =>
        item.mimeType.includes("audio")
      );
      setMusicList(music);
      // 每次初始化生成随机列表
      const list = [...music].sort(() => Math.random() - Math.random());
      setRandomList(list);
      // console.log('本次随机列表：', list);
    }
  };

  const musicBox = useRef(null);
  const circle = useRef(null);
  const [active, setActive] = useState<FileType>(); // 当前播放歌曲
  const [showList, setShowList] = useState<boolean | null>(null);

  useEffect(() => {
    if (active) {
      changeSong(active);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // 播放 song
  const changeSong = (song: FileType) => {
    const dom: any = musicBox;
    if (dom.current) {
      dom.current.childNodes[0].pause();
      dom.current.childNodes[0].src = "";
      dom.current.childNodes[0].childNodes[0].src = "";
      dom.current.removeChild(dom.current.childNodes[0]);

      const audio: any = document.createElement("audio");
      audio.controls = true;
      audio.autoplay = true;

      audio.addEventListener("ended", () => handleFinish(isOneCircle));

      const source = document.createElement("source");
      source.src = `${cdnUrl}/${song.key}`;
      source.type = song.mimeType;
      audio.appendChild(source);
      dom.current.appendChild(audio);
    }
  };

  // 处理播放完之后
  const handleFinish = (isOneCircle: boolean) => {
    console.log('isOneCircle', isOneCircle)
    if (isOneCircle) {
      // 单曲循环
      active && changeSong(active)
    } else {
      // 播放完随机播放下一首
      playAfterSong();
    }
  }

  // 处理选择歌曲
  const handleChoice = (item: FileType) => {
    setActive(item);
    setShowList(null);
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

  const [isDrog, setIsDrog] = useState(false);
  const [downX, setDownX] = useState<any>();
  const [downY, setDownY] = useState<any>();
  const [left, setLeft] = useState(
    Number(localStorage.getItem("musicLeft") || 0)
  );
  const [top, setTop] = useState(Number(localStorage.getItem("musicTop") || 0));

  const down = (e: any) => {
    e.preventDefault();
    setIsDrog(true);
    const dom: any = circle.current;
    setDownX(e.clientX - dom.offsetLeft);
    setDownY(e.clientY - dom.offsetTop);
  };

  const move = (e: any) => {
    e.preventDefault();
    if (isDrog) {
      setLeft(e.clientX - downX);
      setTop(e.clientY - downY);
    }
  };

  const up = (ev: any) => {
    ev.preventDefault();
    setIsDrog(false);
    localStorage.setItem("musicLeft", String(left));
    localStorage.setItem("musicTop", String(top));
  };

  const showSongList = () => {
    if (!showList) {
      setShowList(true);
    } else {
      setShowList(false);
      setTimeout(() => {
        setShowList(null);
      }, 300);
    }
  };

  return (
    <div
      ref={circle}
      className={styles.music}
      draggable={true}
      onMouseDown={down}
      onMouseMove={move}
      onMouseUp={up}
      onMouseLeave={up}
      style={{
        left: left,
        top: top,
      }}
    >
      {/* 播放 */}
      <div className={styles.musicBox} ref={musicBox}>
        <audio controls>
          <source src={""} />
        </audio>
      </div>
      {/* 控件 */}
      <div className={styles.iconBox}>
        <span className={styles.songName} title={active ? active.key : ""}>
          {active ? active.key : ""}
        </span>
        <Icon
          className={`${styles.playIcon} ${isOneCircle ? styles.active : ""}`}
          type="redo"
          title={"单曲循环"}
          onClick={() => setIsOneCircle(!isOneCircle)}
        />
        <Icon
          className={styles.playIcon}
          type="arrow-left"
          title={`上一首：${getBeforeSong()}`}
          onClick={playBeforeSong}
        />
        <Icon
          className={styles.playIcon}
          type="unordered-list"
          title={`歌曲列表`}
          onClick={showSongList}
        />
        <Icon
          className={styles.playIcon}
          type="arrow-right"
          title={`下一首：${getAfterSong()}`}
          onClick={playAfterSong}
        />
      </div>
      {/* 列表 */}
      <div
        className={`${styles.musicList} ${
          showList === null ? "" : showList ? styles.show : styles.hide
        } ScrollBar`}
      >
        {musicList &&
          musicList.map((item) => (
            <span
              key={item.key}
              onClick={() => handleChoice(item)}
              className={active && active.key === item.key ? styles.active : ""}
            >
              {item.key}
            </span>
          ))}
      </div>
    </div>
  );
};

export default Music;
