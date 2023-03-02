import React, { useRef, useEffect, useState, useCallback } from "react";
import useTimeout from "beautiful-react-hooks/useTimeout";

import useSyncStyles from "../../hooks/useSyncStyles.js";

import Moveable from "react-moveable";

const MovableProxy = ({
  className,
  proxyRef,
  onChange,
  frame,
  enabled = false,
}) => {
  const ref = useRef();
  const [showMovable, setShowMovable] = useState(false);
  useSyncStyles(ref, proxyRef, ["transform"]);

  const handleChange = useCallback(
    (props) => onChange && onChange(props),
    [onChange]
  );

  return (
    <>
      {enabled && <div ref={ref} className={className} />}
      {enabled && (
        <Moveable
          target={ref}
          /* draggable */
          draggable={true}
          throttleDrag={0}
          onDrag={({
            target,
            beforeDelta,
            beforeDist,
            left,
            top,
            right,
            bottom,
            delta,
            dist,
            transform,
            clientX,
            clientY,
          }: OnDrag) => {
            target.style.transform = transform;
            handleChange({ transform });
          }}
          /* When resize or scale, keeps a ratio of the width, height. */
          keepRatio={false}
          /* scalable */
          /* Only one of resizable, scalable, warpable can be used. */
          scalable={true}
          throttleScale={0}
          onScale={({
            target,
            scale,
            dist,
            delta,
            transform,
            clientX,
            clientY,
          }: OnScale) => {
            target.style.transform = transform;
            handleChange({ transform });
          }}
          /* rotatable */
          rotatable={true}
          throttleRotate={0}
          onRotate={({
            target,
            delta,
            dist,
            transform,
            clientX,
            clientY,
          }: onRotate) => {
            target.style.transform = transform;
            handleChange({ transform });
          }}
        />
      )}
    </>
  );
};

export default MovableProxy;
