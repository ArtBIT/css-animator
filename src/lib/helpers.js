export const isObject = (o) =>
  typeof o === "object" && !Array.isArray(o) && o !== null;
