export const SVG = {
  parse: (text) => new DOMParser().parseFromString(text, "image/svg+xml"),
  stringify: (svg) => new XMLSerializer().serializeToString(svg),
};

export default SVG;
