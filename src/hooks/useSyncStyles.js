import { useRef, useState, useEffect } from "react";
import useMutationObserver from "beautiful-react-hooks/useMutationObserver";
import { copyStyles } from "../utils/styles";

export const useSyncStyles = (sourceRef, destinationRef, targetProps = []) => {
  const [sourceChangeCounter, setSourceChangeCounter] = useState(0);

  const increaseSourceChangeCounter = () =>
    setSourceChangeCounter((prev) => prev + 1);

  useMutationObserver(sourceRef, increaseSourceChangeCounter, {
    attributes: true,
    characterData: false,
    childList: false,
    subtree: false,
  });

  // Initialize source styles by copying it from the destination
  useEffect(() => {
    copyStyles(destinationRef.current, sourceRef.current, targetProps);
  }, [sourceChangeCounter, targetProps]);

  // Copy the sourceRef transform to the destinationRef
  useEffect(() => {
    copyStyles(sourceRef.current, destinationRef.current, targetProps);
  }, [targetProps]);
};

export default useSyncStyles;
