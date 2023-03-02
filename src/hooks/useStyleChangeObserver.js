import { useRef, useState } from "react";
import useMutationObserver from "beautiful-react-hooks/useMutationObserver";

export const useStyleChangeObserver = () => {
  const ref = useRef();
  const [styleChangesCounter, setStyleChangesCounter] = useState(0);

  const increaseStyleChangesCounter = () =>
    setStyleChangesCounter((prev) => prev + 1);

  useMutationObserver(ref, increaseStyleChangesCounter, {
    attributes: true,
    characterData: false,
    childList: false,
    subtree: false,
  });

  return { ref, version: styleChangesCounter };
};

export default useStyleChangeObserver;
