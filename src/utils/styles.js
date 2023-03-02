import { decomposeMatrix } from "./matrix";

export const simplifyTransform = (transform) => {
  if (transform.startsWith("matrix")) {
    const { scaleX, scaleY, translateX, translateY, rotation } =
      decomposeMatrix(transform);
    const scale =
      scaleX === scaleY && scaleX === 1 ? "" : `scale(${scaleX}, ${scaleY})`;
    const translate =
      translateX === 0 && translateY === 0
        ? ""
        : `translate(${translateX}px,${translateY}px)`;
    const rotate = rotation === 0 ? "" : `rotate(${rotation}deg)`;
    return [translate, rotate, scale].join(" ");
  }
  return transform;
};

export const copyStyles = (from, to, styleList = []) => {
  if (!from || !to) return;
  const computedStyle = window.getComputedStyle(from);
  Array.from(computedStyle)
    .filter((key) => styleList.includes(key))
    .forEach((key) => {
      to.style.setProperty(
        key,
        simplifyTransform(computedStyle.getPropertyValue(key)),
        computedStyle.getPropertyPriority(key)
      );
    });
};
