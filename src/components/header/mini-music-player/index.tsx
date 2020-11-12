import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import MusicPlayer from '@/components/music-player'

const MiniMusicPlayer: React.FC = () => {
  const circle = useRef(null);

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

  return (
    <div
      ref={circle}
      className={`${styles.miniMusicPlayer}`}
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
      <MusicPlayer />
    </div>
  );
};

export default MiniMusicPlayer;
