class Stylesheet {
  constructor(id) {
    this.id = id;
    this.create(id);
  }

  insertRule(rule, position) {
    this.stylesheet.sheet.insertRule(rule, position);
  }
  addAnimation(name, styles) {
    this.insertRule(`@keyframes ${name} {${styles}}`, this.stylesheet.length);
  }
  create(id) {
    const s = document.createElement("style");
    s.setAttribute("id", id);
    s.setAttribute("type", "text/css");
    s.setAttribute("rel", "stylesheet");
    document.head.appendChild(s);
    this.stylesheet = s;
  }
  delete() {
    this.stylesheet.remove();
  }
  reset() {
    this.delete();
    this.create(this.id);
  }
}

export default Stylesheet;
