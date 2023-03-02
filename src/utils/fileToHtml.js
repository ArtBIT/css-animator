import SVG from "./svg";

const fileToHtml = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      const extension = file.name.split(".").pop().toLowerCase();
      switch (extension) {
        case "svg":
          reader.onload = (e) => {
            const svg = SVG.parse(reader.result);
            const doc = svg.documentElement;
            doc.setAttribute("width", "100px");
            doc.setAttribute("height", "100px");
            resolve({ html: SVG.stringify(svg), width: 500, height: 500 });
          };
          reader.readAsText(file);
          break;
        case "webp":
        case "gif":
        case "png":
        case "jpg":
        case "jpeg":
          reader.onload = function (e) {
            const image = new Image();
            image.src = reader.result;
            image.onload = () => {
              const ratio = image.width / image.height;
              resolve({
                html: `<img src="${reader.result}" width="500px"/>`,
                width: 500,
                height: 500 / ratio,
              });
            };
          };
          reader.readAsDataURL(file);
          break;
      }
    } catch (e) {
      reject(e);
    }
  });
};

export default fileToHtml;
