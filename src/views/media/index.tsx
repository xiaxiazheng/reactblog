import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { IsLoginContext } from "@/context/IsLoginContext";
import { getMediaList } from "@/client/VideoHelper";
import { cdnUrl } from "@/env_config";

interface FileType {
  key: string;
  mimeType: string;
}

const Video: React.FC = () => {
  const { isLogin } = useContext(IsLoginContext);

  useEffect(() => {
    getList();
  }, []);

  const [activeTab, setActiveTab] = useState("音乐");

  const [list, setList] = useState<FileType[]>([]);  // 当前播放列表
  const [videoList, setVideoList] = useState<FileType[]>([]);
  const [musicList, setMusicList] = useState<FileType[]>([]);
  const getList = async () => {
    const res: FileType[] | false = await getMediaList();
    if (res) {
      const music = res.filter((item: FileType) => item.mimeType.includes('audio')) 
      setMusicList(music)
      setList(music)
      
      const video = res.filter((item: FileType) => item.mimeType.includes('video')) 
      setVideoList(video)
    }
  };

  const videoBox = useRef(null);
  const [active, setActive] = useState<FileType>();

  useEffect(() => {
    if (active) {
      const dom: any = videoBox;
      if (dom.current) {
        dom.current.childNodes[0].pause()
        dom.current.childNodes[0].src = ''
        dom.current.childNodes[0].childNodes[0].src = ''
        dom.current.removeChild(dom.current.childNodes[0]);
        // console.log('dom.current.childNodes[0]', dom.current.childNodes[0])

        const audio: any = document.createElement(activeTab === '音乐' ? "audio" : "video");
        audio.controls = true;
        activeTab === '音乐' && (audio.autoplay = true);

        // 播放完随机播放下一首
        audio.addEventListener('ended', () => {
          if (activeTab === '音乐') {
            let index = Math.floor(Math.random() * (musicList.length))
            if (musicList[index].key === active.key) {
              index = Math.floor(Math.random() * (musicList.length))
            }
            // console.log(musicList[index])
            setActive(musicList[index])
          }
        })

        const source = document.createElement("source");
        source.src = `${cdnUrl}/${active.key}`;
        source.type = active.mimeType;
        audio.appendChild(source);
        dom.current.appendChild(audio);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleChoiceTab = (item: string) => {
    setActiveTab(item)
    setList(item === "音乐" ? musicList : videoList)
  };

  return (
    <div className={styles.video}>
      <div className={styles.tabs}>
        {["音乐", "视频"].map((item) => (
          <span
            key={item}
            className={item === activeTab ? styles.active : ""}
            onClick={() => handleChoiceTab(item)}
          >
            {item}
          </span>
        ))}
      </div>
      {/* 列表 */}
      <div className={styles.videoList}>
        {list &&
          list.map((item) => (
            <span
              key={item.key}
              onClick={() => setActive(item)}
              className={active === item ? styles.active : ""}
            >
              {item.key}
            </span>
          ))}
      </div>
      {/* 播放 */}
      <div className={styles.videoBox} ref={videoBox}>
        <audio controls>
          <source src={''} />
        </audio>
      </div>
    </div>
  );
};

export default Video;
