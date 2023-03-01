import React, { useState, useLayoutEffect, useRef, useCallback } from "react";

import c from "classnames";
import AnimationTarget from "../AnimationTarget";
import useStageTransforms from "../../hooks/useStageTransforms.js";
import s from "./Stage.module.css";

const Stage = ({ className, innerRef, frame, updateFrame, isPlaying }) => {
  const { stageContainerRef, stageRef } = useStageTransforms();
  return (
    <div className={c(s["root"], className)}>
      <div
        ref={stageContainerRef}
        className={s["content-wrapper"]}
        style={{
          backgroundImage: `url(${
            process.env.PUBLIC_URL + "/assets/grid.png"
          })`,
        }}
      >
        <div className={s["content"]} ref={stageRef}>
          <AnimationTarget
            ref={innerRef}
            frame={frame}
            updateFrame={updateFrame}
            isPlaying={isPlaying}
          />
        </div>
      </div>
    </div>
  );
};

export default Stage;
