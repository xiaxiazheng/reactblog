import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
// import { IsLoginContext } from "@/context/IsLoginContext";
import { getMediaList } from "@/client/VideoHelper";
import { cdnUrl } from "@/env_config";
// import {
//   ArrowLeftOutlined,
//   ArrowRightOutlined,
//   RedoOutlined,
//   UnorderedListOutlined,
// } from "@ant-design/icons";
import { Icon } from "@ant-design/compatible";
import { message } from "antd";
import { timesofSongAddOne } from '@/client/TimesofSong'

interface FileType {
  key: string;
  mimeType: string;
  times: string;
}

const Music: React.FC = () => {
  // const { isLogin } = useContext(IsLoginContext);

  useEffect(() => {
    getList();
  }, []);

  // 是否单曲循环
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
    }
  };

  const musicBox = useRef(null);
  const circle = useRef(null);
  const [active, setActive] = useState<FileType>(); // 当前播放歌曲
  const [showList, setShowList] = useState<boolean | null>(null);

  // 根据 active 的不同切换播放的歌曲
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
      audio.onplaying = handlePlaying.bind(null, song.key);

      // 监听播放结束
      audio.onended = handleFinish;

      const source = document.createElement("source");
      source.src = `${cdnUrl}/${song.key}`;
      source.type = song.mimeType;
      audio.appendChild(source);
      dom.current.appendChild(audio);
    }
  };

  // 开始播放后计时
  const handlePlaying = (song_name: string) => {
    // 听了 20s 就当做听了一次这首歌
    setTimeout(async () => {
      let params = {
        song_name
      }
      const res = await timesofSongAddOne(params)
      if (res) {
        message.success(`${res.message}；当前次数：${res.data}`)
      }
    }, 20000)
  }

  // 由于 hooks 的原因，要重新绑定这个事件才能获取到当前的 isOneCircle 的状态
  useEffect(() => {
    const dom: any = musicBox;
    if (dom.current) {
      const audio = dom.current.childNodes[0];
      audio.onended = handleFinish;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOneCircle]);

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
          type="redo"
          className={`${styles.playIcon} ${isOneCircle ? styles.active : ""}`}
          title={"单曲循环"}
          onClick={() => setIsOneCircle(!isOneCircle)}
        />
        <Icon
          type="arrow-left"
          className={styles.playIcon}
          title={`上一首：${getBeforeSong()}`}
          onClick={playBeforeSong}
        />
        <Icon
          type="unordered-list"
          className={styles.playIcon}
          title={`歌曲列表`}
          onClick={showSongList}
        />
        <Icon
          type="arrow-right"
          className={styles.playIcon}
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
              {/* 这个是已播放次数 */}
              <span className={styles.times}> [ {item.times} ] </span>
            </span>
          ))}
      </div>
    </div>
  );
};

export default Music;