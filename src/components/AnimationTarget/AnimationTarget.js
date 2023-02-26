import c from "classnames";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Flex from "../Flex";
import fileToHtml from "../../utils/fileToHtml";
import useDropFile from "../../hooks/useDropFile";
import Dummy from "../../assets/wasp.png";

import s from "./AnimationTarget.module.css";

const AnimationTarget = React.forwardRef(({ className, name }, ref) => {
  const [value, setValue] = useState(null);
  const onChange = (file) => fileToHtml(file).then((html) => setValue(html));
  const { ref: dropRef, active } = useDropFile(onChange);
  return (
    <div
      className={c(s["root"], className, active && s["hovered"])}
      ref={dropRef}
    >
      {value && <div ref={ref} dangerouslySetInnerHTML={{ __html: value }} />}
      {!value && (
        <div ref={ref}>
          <img src={Dummy} alt="Drop image files here..." width="300px" />
          <div>Drop image or SVG files here...</div>
        </div>
      )}
    </div>
  );
});
AnimationTarget.displayName = "AnimationTarget";

export default AnimationTarget;
