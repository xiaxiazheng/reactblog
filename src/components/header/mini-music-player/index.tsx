import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import MusicPlayer from '@/components/music-player'

const MiniMusicPlayer: React.FC = () => {
  const [offsetX, setOffsetX] = useState<any>();
  const [offsetY, setOffsetY] = useState<any>();
  const [left, setLeft] = useState(
    Number(localStorage.getItem("musicLeft") || 0)
  );
  const [top, setTop] = useState(Number(localStorage.getItem("musicTop") || 0));

  return (
    <div
      className={`${styles.miniMusicPlayer}`}
      draggable
      onDragStart={(e) => {
        setOffsetX(e.nativeEvent.offsetX)
        setOffsetY(e.nativeEvent.offsetY)
      }}
      onDrag={(e) => {
        setLeft(e.nativeEvent.x - offsetX)
        setTop(e.nativeEvent.y - offsetY)
      }}
      onDragEnd={(e) => {
        const newLeft = e.nativeEvent.x - offsetX
        const newTop = e.nativeEvent.y - offsetY
        setLeft(newLeft)
        setTop(newTop)
        localStorage.setItem("musicLeft", String(newLeft));
        localStorage.setItem("musicTop", String(newTop));
      }}
      onDragOver={(e) => {
        e.dataTransfer.dropEffect = 'move';
        e.preventDefault()
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
