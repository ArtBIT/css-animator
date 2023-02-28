import { isObject } from "../lib/helpers.js";
import kebabize from "../utils/kebabize";

let dataId = 0;
export class FrameData {
  constructor(data) {
    this.id = dataId++;
    if (isObject(data)) {
      this.data = data;
    } else if (typeof data == "string") {
      this.fromString(data);
    }
  }
  toString() {
    return JSON.stringify(this.data, null, 2);
  }
  toCSS(selector, indent = "  ") {
    const rules = Object.keys(this.data)
      .map((ruleName) => {
        const rule = this.data[ruleName];
        return `${indent}${indent}${kebabize(ruleName)}: ${rule};`;
      })
      .join("\n");

    return `${indent}${selector} {
${rules}
${indent}}`;
  }
  fromString(str) {
    this.data = JSON.parse(str);
  }
}

export class Frame {
  constructor(index, data) {
    this.index = index;
    this.data = new FrameData(data);
  }
}

export default Frame;
