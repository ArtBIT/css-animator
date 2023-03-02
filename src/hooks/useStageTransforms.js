import { useLayoutEffect, useRef } from "react";
import { decomposeMatrix } from "../utils/matrix.js";

export const useStageTransforms = () => {
  const resetRef = useRef();
  const stageRef = useRef();
  const stageContainerRef = useRef();
  const initialOffset = useRef();

  const reset = () => {
    resetRef.current && resetRef.current();
  };

  useLayoutEffect(() => {
    if (!stageRef.current) return;

    const { translateX = 0, translateY = 0 } = decomposeMatrix(
      window.getComputedStyle(stageRef.current).transform
    );

    if (!initialOffset.current) {
      initialOffset.current = { x: translateX, y: translateY };
    }

    let dragStart = { x: 0, y: 0 },
      dragEnd = { x: 0, y: 0 },
      isDragging = false,
      scale = 1,
      offset = { x: translateX, y: translateY },
      clickOffset = { x: 0, y: 0 };

    const getRelativeCoords = (e, el = stageContainerRef.current) => {
      const rect = el.getBoundingClientRect();
      const x = e.pageX - rect.left;
      const y = e.pageY - rect.top;
      return { x, y };
    };

    const updateTransform = () => {
      debugger;
      const dx = dragEnd.x - dragStart.x + clickOffset.x;
      const dy = dragEnd.y - dragStart.y + clickOffset.y;
      const m = new DOMMatrix();
      m.translateSelf(offset.x + dx * scale, offset.y + dy * scale);
      //m.scaleSelf(scale);
      stageRef.current.style.transform = m.toString();

      // Move the grid background
      const rect = stageContainerRef.current.getBoundingClientRect();
      stageContainerRef.current.style.backgroundPosition = `${
        (rect.width + m.e) % rect.width
      }px ${(rect.height + m.f) % rect.height}px`;
      stageContainerRef.current.style.backgroundSize = `${scale * 100}%`;
    };

    resetRef.current = () => {
      offset.x = initialOffset.current.x;
      offset.y = initialOffset.current.y;
      dragStart = { x: 0, y: 0 };
      dragEnd = { x: 0, y: 0 };
      clickOffset = { x: 0, y: 0 };
      updateTransform();
    };

    const handleMouseWheel = (e) => {
      // disable for now
      //e.preventDefault();
      //scale += e.deltaY * -0.001;
      //scale = Math.min(Math.max(0.125, scale), 4);
      //updateTransform();
    };

    const handleMouseDown = (e) => {
      if (e.button !== 1) return;
      isDragging = true;
      dragStart = getRelativeCoords(e);
      clickOffset = getRelativeCoords(e, stageRef.current);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      dragEnd = getRelativeCoords(e);
      updateTransform();
    };

    const handleMouseUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      offset.x += dragEnd.x - dragStart.x + clickOffset.x;
      offset.y += dragEnd.y - dragStart.y + clickOffset.y;
      dragStart = { x: 0, y: 0 };
      dragEnd = { x: 0, y: 0 };
      clickOffset = { x: 0, y: 0 };
    };

    // Bind Events
    const elem = stageContainerRef.current;
    elem.addEventListener("wheel", handleMouseWheel);
    elem.addEventListener("mousedown", handleMouseDown);
    elem.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      elem.removeEventListener("wheel", handleMouseWheel);
      elem.removeEventListener("mousedown", handleMouseDown);
      elem.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [stageRef, stageContainerRef]);

  return {
    stageContainerRef,
    stageRef,
    reset,
  };
};
export default useStageTransforms;
