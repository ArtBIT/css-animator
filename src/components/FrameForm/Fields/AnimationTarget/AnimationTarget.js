import c from "classnames";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Flex from "../../../Flex";
import fileToHtml from "../../../../utils/fileToHtml";
import useDropFile from "../../../../hooks/useDropFile";

import s from "./AnimationTarget.module.css";

const AnimationTarget = ({ className, name, value }) => {
  const [value, setValue] = useState();
  const onChange = (file) => fileToHtml(file).then((html) => setValue(html));
  const { ref, active } = useDropFile(onChange);
  return (
    <div className={c(s["root"], className, active && s["hovered"])} ref={ref}>
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
};

Unknown template.
export default AnimationTarget;
