import { useState, useCallback, useEffect } from "react";
import Flex from "../Flex";
import TextField from "@mui/material/TextField";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";

function AnimationCSS({ text, onCopy }) {
  return (
    <Flex column>
      <Flex row>
        <IconButton onClick={onCopy} aria-label="Export CSS Animation">
          <FileDownloadIcon />
        </IconButton>
        <IconButton onClick={onCopy} aria-label="Copy">
          <ContentCopyIcon />
        </IconButton>
      </Flex>
      <TextField
        label="Animation CSS"
        multiline
        maxRows={10}
        value={text}
        variant="filled"
      />
    </Flex>
  );
}

export default AnimationCSS;
