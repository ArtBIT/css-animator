import React from "react";

import c from "classnames";
import AnimationTarget from "../AnimationTarget";
import s from "./Stage.module.css";

const Stage = ({ className, innerRef }) => {
  return (
    <div className={c(s["root"], className)}>
      <AnimationTarget ref={innerRef} />
    </div>
  );
};

export default Stage;
