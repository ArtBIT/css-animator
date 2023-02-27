import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
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
  const [value, setValue] = useState();
  const [cursor, setCursor] = useState(null);
  const [error, setError] = useState(false);
  const ref = useRef(null);

  const handleChange = useCallback(
    (e) => {
      if (!e.target.value) onRemove();
      try {
        setCursor(e.target.selectionStart);
        // if valid JSON
        JSON.parse(e.target.value);
        // update the frame data
        onChange(e.target.value);
        setError(false);
      } catch (err) {
        setValue(e.target.value);
        setError(true);
      }
    },
    [onChange, onRemove]
  );

  useEffect(() => {
    setValue(frame.data.toString());
  }, [frame.data.id]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.setSelectionRange(cursor, cursor);
  }, [ref, cursor, value]);

  const handleCopy = useCallback(() => {
    copyTextToClipboard(frame.data.toString());
  }, [frame.data.id]);

  return (
    <div className={c(s["root"], className)}>
      <Flex row center>
        <Button>
          {((frame.index / (totalFrames - 1)) * 100).toFixed(0)} %
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button onClick={handleCopy} disabled={!frame.data}>
          Copy
        </Button>
        <Button onClick={onRemove}>Clear</Button>
      </Flex>
      <div>
        <textarea
          ref={ref}
          name="css"
          value={value}
          className={c(s["textarea"], error && s["error"])}
          placeholder="Add KeyframeEffect json here"
          onChange={handleChange}
        />
      </div>
      <Flex row>
        <Button onClick={onExport}>Export CSS Animation</Button>
      </Flex>
    </div>
  );
};

export default FrameForm;
