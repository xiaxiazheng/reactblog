import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { IsLoginContext } from "@/context/IsLoginContext";
import { getMusicList } from "@/client/VideoHelper";
import { staticUrl } from "@/env_config";

const Music: React.FC = () => {
  // const { isLogin } = useContext(IsLoginContext);

  useEffect(() => {
    getList();
  }, []);

  const [list, setList] = useState<string[]>([]);
  const [musicList, setMusicList] = useState<string[]>([]);
  const getList = async () => {
    const res2: any = await getMusicList();
    if (res2) {
      setMusicList(res2);
      setList(res2);
    }
  };

  const musicBox = useRef(null);
  const [active, setActive] = useState<string>();
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
        // console.log('dom.current.childNodes[0]', dom.current.childNodes[0])

        const audio: any = document.createElement("audio");
        audio.controls = true;
        audio.autoplay = true;

        // 播放完随机播放下一首
        audio.addEventListener("ended", () => {
          let index = Math.floor(Math.random() * musicList.length);
          if (musicList[index] === active) {
            index = Math.floor(Math.random() * musicList.length);
          }
          console.log(musicList[index]);
          setActive(musicList[index]);
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

  return (
    <div
      className={styles.music}
      onMouseLeave={() => {
        setShowList(false);
        setTimeout(() => {
          setShowList(null);
        }, 300);
      }}
    >
      {/* 播放 */}
      <div
        className={styles.musicBox}
        ref={musicBox}
        onMouseEnter={() => {
          setShowList(true);
        }}
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
        {list &&
          list.map((item) => (
            <span
              key={item}
              onClick={() => setActive(item)}
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
