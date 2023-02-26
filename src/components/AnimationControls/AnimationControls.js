import React from "react";

import Container from "@material-ui/core/Container";
import Button from "@mui/material/Button";
import s from "./AnimationControls";

const AnimationControls = ({ start, stop, pause, ...props }) => {
  return (
    <Container>
      <div className={s["root"]}>
        <Button onClick={start}>Play</Button>
        <Button onClick={pause}>Pause</Button>
        <Button onClick={stop}>Stop</Button>
      </div>
    </Container>
  );
};

export default AnimationControls;
