import React from "react";

import Container from "@material-ui/core/Container";
import KeyframeTimeline from "../KeyframeTimeline";
import AnimationControls from "../AnimationControls";
import s from "./AnimationTimeline";

const AnimationTimeline = ({ start, stop, pause, prev, next, ...props }) => {
  return (
    <Container>
      <div className={s["root"]}>
        <AnimationControls {...{ start, stop, pause, prev, next }} />
        <KeyframeTimeline {...props} />
      </div>
    </Container>
  );
};

export default AnimationTimeline;
