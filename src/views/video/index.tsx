import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { IsLoginContext } from "@/context/IsLoginContext";
import { getVideoList } from "@/client/VideoHelper";
import { baseUrl } from "@/env_config";

const Video: React.FC = () => {
  const { isLogin } = useContext(IsLoginContext);

  useEffect(() => {
    getList();
  }, []);

  const [list, setList] = useState<string[]>([]);
  const getList = async () => {
    const res: any = await getVideoList();
    if (res) {
      setList(res);
    }
  };

  const videoBox = useRef(null);
  const [activeVideo, setActiveVideo] = useState<string>();
  const choiceVideo = (item: string) => {
    setActiveVideo(item);
  };

  useEffect(() => {
    if (activeVideo) {
      const dom: any = videoBox;
      if (dom.current) {
        dom.current.removeChild(dom.current.childNodes[0]);
        const video: any = document.createElement("video");
        video.controls = true;
        // video.autoplay = true;
        video.name = "media";
        const source = document.createElement("source");
        source.src = `${baseUrl}/api/video?videoName=${activeVideo}`;
        source.type = "video/mp4";
        video.appendChild(source);
        dom.current.appendChild(video);
      }
    }
  }, [activeVideo]);

  return (
    <div className={styles.video}>
      {/* 视频列表 */}
      <div className={styles.videoList}>
        {list &&
          list.map((item) => (
            <span key={item} onClick={() => choiceVideo(item)} className={activeVideo === item ? styles.active : ''}>
              {item}
            </span>
          ))}
      </div>
      {/* 视频播放 */}
      <div className={styles.videoBox} ref={videoBox}>
        <video width='100%' height='100%' controls src={``}></video>
      </div>
    </div>
  );
};

export default Video;
