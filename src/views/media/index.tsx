import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { IsLoginContext } from "@/context/IsLoginContext";
import { getMediaList } from "@/client/VideoHelper";
import { cdnUrl } from "@/env_config";
import { Drawer, Icon, message } from "antd";
import MusicPlayer, { FileType } from "@/components/music-player";

const Video: React.FC = () => {
  const { isLogin } = useContext(IsLoginContext);

  useEffect(() => {
    getList();
  }, []);

  const [activeTab, setActiveTab] = useState("音乐");

  const [list, setList] = useState<FileType[]>([]); // 当前播放列表
  const [videoList, setVideoList] = useState<FileType[]>([]);
  const [musicList, setMusicList] = useState<FileType[]>([]);
  const getList = async () => {
    const res: FileType[] | false = await getMediaList();
    if (res) {
      const music = res.filter((item: FileType) =>
        item.mimeType.includes("audio")
      );
      setMusicList(music);
      setList(music);

      const video = res.filter((item: FileType) =>
        item.mimeType.includes("video")
      );
      setVideoList(video);
    }
  };

  const videoBox = useRef(null);
  const [active, setActive] = useState<FileType>();

  useEffect(() => {
    if (active && activeTab === "视频") {
      const dom: any = videoBox;
      if (dom.current) {
        dom.current.childNodes[0].pause();
        dom.current.childNodes[0].src = "";
        dom.current.childNodes[0].childNodes[0].src = "";
        dom.current.removeChild(dom.current.childNodes[0]);

        const video: any = document.createElement("video");
        video.controls = true;

        const source = document.createElement("source");
        source.src = `${cdnUrl}/${active.key}`;
        source.type = active.mimeType;
        video.appendChild(source);
        dom.current.appendChild(video);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleChoiceTab = (item: string) => {
    setActiveTab(item);
    setActive(undefined);
    setList(item === "音乐" ? musicList : videoList);
  };

  const handleChoiceSong = (item: any) => {
    setActive(item);
    setVisible(false);
  };

  const VideoList = () => (
    <>
      {list &&
        list.map((item) => (
          <span
            key={item.key}
            onClick={handleChoiceSong.bind(null, item)}
            className={active === item ? styles.active : ""}
          >
            {item.key}
          </span>
        ))}
    </>
  );

  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className={`${styles.video} ScrollBar`}>
      {activeTab === "音乐" && (
        <div className={styles.musicBox}>
          <MusicPlayer activeSong={active} />
        </div>
      )}
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
      <div className={`${styles.videoList} ScrollBar`}>
        <VideoList />
      </div>
      {/* 播放 */}
      {activeTab === "视频" && (
        <div className={styles.videoBox} ref={videoBox}>
          <audio controls>
            <source src={""} />
          </audio>
        </div>
      )}

      {/* 移动端展示 */}
      {window.screen.availWidth <= 720 && (
        <>
          {/* 展开歌曲列表 */}
          <div className={styles.songList} onClick={() => setVisible(true)}>
            <Icon type="unordered-list" />
          </div>
          {/* 切换音乐/视频 */}
          <div
            className={styles.mediaType}
            onClick={() => {
              let tab = activeTab === "音乐" ? "视频" : "音乐";
              handleChoiceTab(tab);
              message.info(tab, 0.5);
            }}
          >
            {activeTab === "音乐" ? (
              <Icon type="bell" />
            ) : (
              <Icon type="youtube" />
            )}
          </div>
          {/* 歌曲列表抽屉 */}
          <Drawer
            title={activeTab + "列表"}
            placement="bottom"
            closable={true}
            onClose={() => {
              setVisible(!visible);
            }}
            className={styles.drawer}
            height={"calc(100% - 150px)"}
            visible={visible}
          >
            <div className={styles.drawerVideoList}>
              <VideoList />
            </div>
          </Drawer>
        </>
      )}
    </div>
  );
};

export default Video;
