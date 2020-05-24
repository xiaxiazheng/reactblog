import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { IsLoginContext } from "@/context/IsLoginContext";
import { getMusicList } from "@/client/VideoHelper";
import { staticUrl } from "@/env_config";
import { Icon, message } from 'antd';

const Music: React.FC = () => {
  // const { isLogin } = useContext(IsLoginContext);

  useEffect(() => {
    getList();
  }, []);

  const [musicList, setMusicList] = useState<string[]>([]);
  const [randomList, setRandomList] = useState<string[]>([]);
  const getList = async () => {
    const res2: any = await getMusicList();
    if (res2) {
      setMusicList(res2);
      // 每次初始化生成随机列表
      const list = [...res2].sort(() => Math.random() - Math.random());
      setRandomList(list)
      // console.log('本次随机列表：', list);
    }
  };

  const musicBox = useRef(null);
  const [active, setActive] = useState<string>(); // 当前播放歌曲
  const [showList, setShowList] = useState<boolean | null>(null);

  useEffect(() => {
    if (active) {
      const dom: any = musicBox;
      if (dom.current) {
        const list = active.split(".");
        const type = list[list.length - 1];

        dom.current.childNodes[0].pause();
        dom.current.childNodes[0].src = "";
        dom.current.childNodes[0].childNodes[0].src = "";
        dom.current.removeChild(dom.current.childNodes[0]);

        const audio: any = document.createElement("audio");
        audio.controls = true;
        audio.autoplay = true;

        // 播放完随机播放下一首
        audio.addEventListener("ended", () => {
          playAfterSong()
        });

        const source = document.createElement("source");
        source.src = `${staticUrl}/${"music"}/${active}`;
        source.type = `audio/${type}`;
        audio.appendChild(source);
        dom.current.appendChild(audio);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const choiceSong = (item: string) => {
    setActive(item)
    message.success(`当前播放：${item}`, 1)
  }

  const playBeforeSong = () => {
    let index = randomList.findIndex(item => item === active);
    index = index === 0 ? randomList.length - 1 : index - 1;
    setActive(randomList[index]);
    message.success(`当前播放：${randomList[index]}`, 1)
  }

  const playAfterSong = () => {
    let index = randomList.findIndex(item => item === active);
    index = index === randomList.length - 1 ? 0 : index + 1;
    setActive(randomList[index]);
    message.success(`当前播放：${randomList[index]}`, 1)
  }

  const getBeforeSong = () => {
    let index = randomList.findIndex(item => item === active);
    index = index === 0 ? randomList.length - 1 : index - 1;
    return randomList[index]
  }

  const getAfterSong = () => {
    let index = randomList.findIndex(item => item === active);
    index = index === randomList.length - 1 ? 0 : index + 1;
    return randomList[index]
  }

  return (
    <div
      className={styles.music}
      onMouseEnter={() => {
        setShowList(true);
      }}
      onMouseLeave={() => {
        setShowList(false);
        setTimeout(() => {
          setShowList(null);
        }, 300);
      }}
    >
      <Icon className={styles.playIcon} type="arrow-left" title={`上一首：${getBeforeSong()}`} onClick={playBeforeSong} />
      <Icon className={styles.playIcon} type="arrow-right" title={`下一首：${getAfterSong()}`} onClick={playAfterSong} />
      {/* 播放 */}
      <div
        className={styles.musicBox}
        ref={musicBox}
      >
        <audio controls>
          <source src={""} />
        </audio>
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
              key={item}
              onClick={() => choiceSong(item)}
              className={active === item ? styles.active : ""}
            >
              {item}
            </span>
          ))}
      </div>
    </div>
  );
};

export default Music;
