import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import MusicPlayer from "@/components/music-player";

const MiniMusicPlayer: React.FC = () => {
  const [offsetX, setOffsetX] = useState<any>();
  const [offsetY, setOffsetY] = useState<any>();
  const [left, setLeft] = useState<number>();
  const [top, setTop] = useState<number>();

  // 初始化播放器位置，整个播放器都超出了可视范围的话就设置为 0
  useEffect(() => {
    const prevLeft = Number(localStorage.getItem("musicLeft"));
    const prevTop = Number(localStorage.getItem("musicTop"));
    const initLeft =
      prevLeft < 0
        ? 0
        : prevLeft > document.body.clientWidth - 268
        ? document.body.clientWidth - 268
        : prevLeft;
    const initTop =
      prevTop < 0
        ? 0
        : prevTop > document.body.clientHeight - 116.5
        ? document.body.clientHeight - 116.5
        : prevTop;
    setLeft(initLeft);
    setTop(initTop);
    localStorage.setItem("musicLeft", String(initLeft));
    localStorage.setItem("musicTop", String(initTop));
  }, []);

  return (
    <div
      className={`${styles.miniMusicPlayer}`}
      draggable
      onDragStart={(e) => {
        setOffsetX(e.nativeEvent.offsetX);
        setOffsetY(e.nativeEvent.offsetY);
      }}
      onDrag={(e) => {
        setLeft(e.nativeEvent.x - offsetX);
        setTop(e.nativeEvent.y - offsetY);
      }}
      onDragEnd={(e) => {
        const newLeft = e.nativeEvent.x - offsetX;
        const newTop = e.nativeEvent.y - offsetY;
        setLeft(newLeft);
        setTop(newTop);
        localStorage.setItem("musicLeft", String(newLeft));
        localStorage.setItem("musicTop", String(newTop));
      }}
      onDragOver={(e) => {
        e.dataTransfer.dropEffect = "move";
        e.preventDefault();
      }}
      style={{
        left: left,
        top: top,
      }}
    >
      <MusicPlayer />
    </div>
  );
};

export default MiniMusicPlayer;
