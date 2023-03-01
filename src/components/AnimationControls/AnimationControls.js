import React from "react";

import Container from "@material-ui/core/Container";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import PrevFrameIcon from "@mui/icons-material/FastRewind";
import NextFrameIcon from "@mui/icons-material/FastForward";

import IconButton from "@mui/material/IconButton";
import s from "./AnimationControls";

const AnimationControls = ({ start, stop, pause, prev, next, ...props }) => {
  return (
    <Container>
      <div className={s["root"]}>
        <IconButton onClick={prev}>
          <PrevFrameIcon />
        </IconButton>
        <IconButton onClick={start}>
          <PlayArrowIcon />
        </IconButton>
        <IconButton onClick={pause}>
          <PauseIcon />
        </IconButton>
        <IconButton onClick={stop}>
          <StopIcon />
        </IconButton>
        <IconButton onClick={next}>
          <NextFrameIcon />
        </IconButton>
      </div>
    </Container>
  );
};

export default AnimationControls;
