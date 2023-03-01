import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";

import Flex from "../Flex";

import c from "classnames";
import s from "./FrameForm.module.css";

const FrameForm = ({
  className,
  frame,
  totalFrames,
  onCopy,
  onCut,
  onPaste,
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

  return (
    <div className={c(s["root"], className)}>
      <Flex row center>
        <Button>
          {((frame.index / (totalFrames - 1)) * 100).toFixed(0)} %
        </Button>
        <div style={{ flexGrow: 1 }} />

        <IconButton
          onClick={onCopy}
          disabled={!frame.data}
          aria-label="Copy Frame"
        >
          <ContentCopyIcon />
        </IconButton>
        <IconButton
          onClick={onCut}
          disabled={!frame.data}
          aria-label="Cut Frame"
        >
          <ContentCutIcon />
        </IconButton>
        <IconButton
          onClick={onPaste}
          disabled={!frame.data}
          aria-label="Paste Frame CSS"
        >
          <ContentPasteIcon />
        </IconButton>
        <IconButton
          onClick={onRemove}
          disabled={!frame.data}
          aria-label="Clear Frame CSS"
        >
          <DeleteForeverIcon />
        </IconButton>
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
    </div>
  );
};

export default FrameForm;
