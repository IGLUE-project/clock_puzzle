import { useEffect, useRef, useState } from "react";
import "./../assets/scss/Clock.scss";

export default function Clock({ theme, setTime, dropHandle, solved, config }) {
  const [angles, setAngles] = useState({
    hour: 0,
    minute: 0,
    second: 0,
  });
  const dropTimeout = useRef(null);
  const dragging = useRef(null);

  useEffect(() => {
    setTime(
      angleToTime(angles.hour, 12),
      angleToTime(angles.second, 60),
      angleToTime(angles.minute, 60),
      dragging.current,
    );
  }, [angles]);

  useEffect(() => {
    if (solved) {
      setTimeout(() => {
        new Audio(theme.winAudio).play();
        setAngles({
          hour: 0,
          minute: 0,
          second: 0,
        });
      }, 100);
    }
  }, [solved]);

  useEffect(() => {
    if (config.initialTime === "actual") {
      const now = new Date();
      const h = now.getHours() % 12;
      const m = now.getMinutes();
      const s = now.getSeconds();

      setAngles({
        hour: (h / 12) * 360,
        minute: (m / 60) * 360,
        second: (s / 60) * 360,
      });
    } else if (config.initialTime) {
      const [h, m, s] = config.initialTime.split(":").map(Number);
      setAngles({
        hour: (h / 12) * 360,
        minute: (m / 60) * 360,
        second: (s / 60) * 360,
      });
    }
  }, [config]);

  const startDrag = (hand) => () => {
    if (solved) return;
    dragging.current = hand;
  };

  const stopDrag = () => {
    if (dragging.current) {
      if (dropTimeout.current) clearTimeout(dropTimeout.current);
      dropTimeout.current = setTimeout(() => {
        dropHandle();
        dropTimeout.current = null;
      }, 1000);
      dragging.current = null;
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;

    const clockRect = e.currentTarget.getBoundingClientRect();
    const cx = clockRect.left + clockRect.width / 2;
    const cy = clockRect.top + clockRect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    setAngles((prev) => ({
      ...prev,
      [dragging.current]: angle,
    }));
  };

  const angleToTime = (angle, max) => {
    let adjusted = ((angle % 360) + 360) % 360;
    return Math.floor((adjusted / 360) * max) % max;
  };

  return (
    <div
      className="clock"
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      style={{ backgroundImage: `url(${theme.clockImg})` }}
    >
      {/* Hour hand */}
      {theme.hourImg ? (
        <img
          src={theme.hourImg}
          className={`hand hour ${dragging.current === "hour" ? "dragging" : ""} ${solved ? "solved" : ""}`}
          style={{ transform: `rotate(${angles.hour}deg)` }}
          onMouseDown={startDrag("hour")}
          draggable={false}
        />
      ) : (
        <div
          className={`hand neon hour ${dragging.current === "hour" ? "dragging" : ""} ${solved ? "solved" : ""}`}
          style={{ transform: `rotate(${angles.hour}deg)` }}
          onMouseDown={startDrag("hour")}
        />
      )}

      {/* Minute hand */}
      {theme.minuteImg ? (
        <img
          src={theme.minuteImg}
          className={`hand minute ${dragging.current === "minute" ? "dragging" : ""} ${solved ? "solved" : ""}`}
          style={{ transform: `rotate(${angles.minute}deg)` }}
          onMouseDown={startDrag("minute")}
          draggable={false}
        />
      ) : (
        <div
          className={`hand neon minute ${dragging.current === "minute" ? "dragging" : ""} ${solved ? "solved" : ""}`}
          style={{ transform: `rotate(${angles.minute}deg)` }}
          onMouseDown={startDrag("minute")}
        />
      )}

      {/* Second hand */}
      {config.useSeconds && (
        <>
          {theme.secondImg ? (
            <img
              src={theme.secondImg}
              className={`hand second ${dragging.current === "second" ? "dragging" : ""} ${solved ? "solved" : ""}`}
              style={{ transform: `rotate(${angles.second}deg)` }}
              onMouseDown={startDrag("second")}
              draggable={false}
            />
          ) : (
            <div
              className={`hand neon second ${dragging.current === "second" ? "dragging" : ""} ${
                solved ? "solved" : ""
              }`}
              style={{ transform: `rotate(${angles.second}deg)` }}
              onMouseDown={startDrag("second")}
            />
          )}
        </>
      )}
      <img className="center" draggable={false} src={theme.clockCenterImg} alt="" />
    </div>
  );
}
