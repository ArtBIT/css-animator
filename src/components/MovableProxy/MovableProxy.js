import React, { useRef, useEffect, useState, useCallback } from "react";
import useTimeout from "beautiful-react-hooks/useTimeout";

import useSyncStyles from "../../hooks/useSyncStyles.js";
import { mergeRefs } from "../../utils/refs";

import Moveable from "react-moveable";

const MovableProxy = React.forwardRef(
  (
    { className, proxyRef, onChange, frame, enabled = false, onMouseDown },
    ref
  ) => {
    const targetRef = useRef();

    useSyncStyles(targetRef, proxyRef, ["transform"]);

    const handleChange = useCallback(
      (props) => onChange && onChange(props),
      [onChange]
    );

    return (
      <>
        {enabled && (
          <div
            ref={mergeRefs(targetRef, ref)}
            className={className}
            onMouseDown={onMouseDown}
          />
        )}
        {enabled && (
          <Moveable
            target={targetRef}
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
  }
);

export default MovableProxy;
