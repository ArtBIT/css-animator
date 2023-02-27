import React, { useState, useEffect, useRef, useCallback } from "react";

import c from "classnames";
import AnimationTarget from "../AnimationTarget";
import s from "./Stage.module.css";

const Stage = ({ className, innerRef, frame, updateFrame }) => {
  return (
    <div className={c(s["root"], className)}>
      <AnimationTarget ref={innerRef} frame={frame} updateFrame={updateFrame} />
    </div>
  );
};

export default Stage;
