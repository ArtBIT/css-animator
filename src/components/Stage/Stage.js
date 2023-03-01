import React, { useState, useLayoutEffect, useRef, useCallback } from "react";

import c from "classnames";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import Grid3x3Icon from "@mui/icons-material/Grid3x3";
import IconButton from "@mui/material/IconButton";
import AnimationTarget from "../AnimationTarget";
import Flex from "../Flex";
import useStageTransforms from "../../hooks/useStageTransforms.js";
import s from "./Stage.module.css";

const Stage = ({ className, innerRef, frame, updateFrame, isPlaying }) => {
  const [showGrid, setShowGrid] = useState(true);
  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };
  const { stageContainerRef, stageRef, reset } = useStageTransforms();
  return (
    <div className={c(s["root"], className)}>
      <Flex column>
        <Flex row style={{ zIndex: 3 }}>
          <IconButton onClick={() => reset()} aria-label="Reset Viewport">
            <CenterFocusStrongIcon />
          </IconButton>
          <IconButton onClick={() => toggleGrid()} aria-label="Reset Viewport">
            <Grid3x3Icon />
          </IconButton>
        </Flex>
        <div
          ref={stageContainerRef}
          className={s["content-wrapper"]}
          style={
            showGrid
              ? {
                  backgroundImage: `url(${
                    process.env.PUBLIC_URL + "/assets/grid.png"
                  })`,
                }
              : undefined
          }
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
      </Flex>
    </div>
  );
};

export default Stage;
