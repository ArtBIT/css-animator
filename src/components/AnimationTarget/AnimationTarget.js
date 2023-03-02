import c from "classnames";
import React, { useState, useEffect, useCallback } from "react";
import fileToHtml from "../../utils/fileToHtml";
import useDropFile from "../../hooks/useDropFile";
import Dummy from "../../assets/wasp.png";
import MovableProxy from "../MovableProxy";

import s from "./AnimationTarget.module.css";

const AnimationTarget = React.forwardRef(
  ({ className, frame, updateFrame, isPlaying, ...props }, ref) => {
    const [value, setValue] = useState(null);
    const [width, setWidth] = useState(500);
    const [height, setHeight] = useState(500);
    const onChange = (file) =>
      fileToHtml(file).then(({ html, width, height }) => {
        setWidth(width);
        setHeight(height);
        setValue(html);
      });
    const { ref: dropRef, canDrop } = useDropFile(onChange);

    const [isMovable, setIsMovable] = useState(false);

    const handleMouseDown = useCallback((e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      setIsMovable(true);
    }, []);

    useEffect(() => {
      const stopMoving = (e) => setIsMovable(false);
      document.addEventListener("mousedown", stopMoving);
      return () => document.removeEventListener("mousedown", stopMoving);
    }, []);

    const enabled = isMovable && !isPlaying;

    return (
      <div {...props} className={c(s["root"], className)}>
        <div
          ref={ref}
          className={s["target"]}
          style={{ width: width + "px", height: height + "px" }}
          onMouseDown={handleMouseDown}
        >
          {value && <div dangerouslySetInnerHTML={{ __html: value }} />}
          {!value && (
            <img src={Dummy} alt="Drop files here..." width={width + "px"} />
          )}
          {enabled && <div>Drop image or SVG files here...</div>}
        </div>
        <MovableProxy
          onMouseDown={handleMouseDown}
          className={c(s["target"], canDrop && s["hovered"])}
          ref={dropRef}
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
