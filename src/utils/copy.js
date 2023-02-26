export const copyTextToClipboard = (text) => {
  var elem = document.createElement("textarea");
  elem.textContent = text;

  document.body.appendChild(elem);
  elem.select();
  document.execCommand("Copy");

  document.body.removeChild(elem);
};

export default copyTextToClipboard;
