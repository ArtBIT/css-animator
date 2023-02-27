import React from "react";
import classnames from "classnames";
import s from "./KeyframeTimeline.module.css";

const KeyframeTimeline = ({
  totalFrames = 100,
  currentFrame = 0,
  keyframes = [],
  onClick,
  onMouseDown,
  onScrub,
}) => {
  const kfs = new Set(keyframes.map(({ index }) => index));
  const handleClick = (index) =>
    onClick
      ? (_) => {
          onClick(index);
        }
      : undefined;
  const handlePress = (index) =>
    onMouseDown
      ? (_) => {
          onMouseDown(index);
        }
      : undefined;
  return (
    <div className={s["root"]}>
      <div>
        <input
          type="range"
          min={0}
          max={totalFrames - 1}
          value={currentFrame}
          className={s["slider"]}
          onChange={onScrub}
        />
      </div>
      <div className={s["frames"]}>
        {[...Array(totalFrames).keys()].map((index) => (
          <div
            key={index}
            onMouseDown={handlePress(index)}
            onClick={handleClick(index)}
            className={classnames(
              s["frame"],
              kfs.has(index) && s["keyframe"],
              currentFrame === index && s["selected"]
            )}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default KeyframeTimeline;
