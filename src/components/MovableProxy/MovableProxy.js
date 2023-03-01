import React, { useState, useLayoutEffect, useRef, useCallback } from "react";
import { decomposeMatrix } from "../../utils/matrix.js";

import c from "classnames";
import Moveable from "react-moveable";

const simplifyTransform = (transform) => {
  if (transform.startsWith("matrix")) {
    const { scaleX, scaleY, translateX, translateY, rotation } =
      decomposeMatrix(transform);
    const scale =
      scaleX == scaleY && scaleX == 1 ? "" : `scale(${scaleX}, ${scaleY})`;
    const translate =
      translateX == 0 && translateY == 0
        ? ""
        : `translate(${translateX}px,${translateY}px)`;
    const rotate = rotation == 0 ? "" : `rotate(${rotation}deg)`;
    return [translate, rotate, scale].join(" ");
  }
  return transform;
};

const MovableProxy = ({
  className,
  proxyRef,
  onChange,
  frame,
  enabled = false,
}) => {
  const ref = useRef();
  useLayoutEffect(() => {
    if (ref.current && proxyRef.current) {
      const targetProps = ["transform", "width", "height", "position"];
      // copy styles
      const computedStyle = window.getComputedStyle(proxyRef.current);
      Array.from(computedStyle)
        .filter((key) => targetProps.includes(key))
        .forEach((key) => {
          ref.current.style.setProperty(
            key,
            simplifyTransform(computedStyle.getPropertyValue(key)),
            computedStyle.getPropertyPriority(key)
          );
        });
    }
  }, [ref.current, proxyRef.current, frame.data.id, enabled]);

  const handleChange = useCallback(
    (props) => onChange && onChange(props),
    [onChange, ref]
  );
  return (
    <>
      <div ref={ref} className={className} />
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
