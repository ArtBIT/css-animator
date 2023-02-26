import React, { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import Flex from "../Flex";
import useFormFields from "../../hooks/useFormFields";

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
  const { values, setValue } = useFormFields({
    css: "",
  });

  useEffect(() => {
    setValue("css", frame.css);
  }, [frame.index]);

  const handleChange = useCallback((e) => {
    setValue(e.target.name, e.target.value);
  }, []);

  return (
    <div className={c(s["root"], className)}>
      <div>
        <strong>
          {((frame.index / (totalFrames - 1)) * 100).toFixed(0)} %
        </strong>
      </div>
      <div>
        <textarea
          name="css"
          value={values.css}
          className={s["textarea"]}
          placeholder="Add KeyframeEffect json here"
          onChange={handleChange}
        ></textarea>
      </div>
      <Flex row>
        <Button onClick={() => onChange(values.css)}>Update</Button>
        <Button onClick={onRemove}>Delete</Button>
        <Button onClick={onExport}>Export</Button>
      </Flex>
    </div>
  );
};

export default FrameForm;
