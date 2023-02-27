import React, { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import Flex from "../Flex";
import copyTextToClipboard from "../../utils/copy";

import c from "classnames";
import s from "./FrameForm.module.css";

const FrameForm = ({
  className,
  frame,
  totalFrames,
  onChange,
  onRemove,
  onExport,
}) => {
  const handleChange = useCallback(
    (e) => {
      if (e.target.value) {
        onChange(e.target.value);
        return;
      }
      onRemove();
    },
    [onChange, onRemove]
  );

  const handleCopy = useCallback(() => {
    copyTextToClipboard(frame.css);
  }, [frame.css]);

  return (
    <div className={c(s["root"], className)}>
      <Flex row center>
        <Button>
          {((frame.index / (totalFrames - 1)) * 100).toFixed(0)} %
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button onClick={handleCopy} disabled={!frame.css}>
          Copy
        </Button>
        <Button onClick={onRemove}>Clear</Button>
      </Flex>
      <div>
        <textarea
          name="css"
          value={frame.css}
          className={s["textarea"]}
          placeholder="Add KeyframeEffect json here"
          onChange={handleChange}
        ></textarea>
      </div>
      <Flex row>
        <Button onClick={onExport}>Export CSS Animation</Button>
      </Flex>
    </div>
  );
};

export default FrameForm;
