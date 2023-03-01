import c from "classnames";
import React, { useState, useEffect, useRef, useCallback } from "react";
import fileToHtml from "../../utils/fileToHtml";
import useDropFile from "../../hooks/useDropFile";
import Dummy from "../../assets/wasp.png";
import MovableProxy from "../MovableProxy";

import s from "./AnimationTarget.module.css";

const AnimationTarget = React.forwardRef(
  ({ className, frame, updateFrame, isPlaying, ...props }, ref) => {
    const [value, setValue] = useState(null);
    const onChange = (file) => fileToHtml(file).then((html) => setValue(html));
    const { ref: dropRef, active } = useDropFile(onChange);

    const [isMovable, setIsMovable] = useState(false);
    const handleMouseDown = useCallback((e) => {
      if (e.button != 0) return;
      e.preventDefault();
      e.stopPropagation();
      setIsMovable(true);
    }, []);

    useEffect(() => {
      const stopMoving = (e) => setIsMovable(false);
      document.addEventListener("mousedown", stopMoving);
      return () => document.removeEventListener("mousedown", stopMoving);
    }, []);

    return (
      <div
        {...props}
        className={c(s["root"], className, active && s["hovered"])}
        onMouseDown={handleMouseDown}
        ref={dropRef}
      >
        {value && (
          <div
            ref={ref}
            dangerouslySetInnerHTML={{ __html: value }}
            className={s["target"]}
          />
        )}
        {!value && (
          <div ref={ref} className={s["target"]}>
            <img src={Dummy} alt="Drop image files here..." width="500px" />
            <div>Drop image or SVG files here...</div>
          </div>
        )}
        <MovableProxy
          className={s["target"]}
          proxyRef={ref}
          enabled={isMovable && !isPlaying}
          onChange={updateFrame}
          frame={frame}
        />
      </div>
    );
  }
);
AnimationTarget.displayName = "AnimationTarget";

export default AnimationTarget;
