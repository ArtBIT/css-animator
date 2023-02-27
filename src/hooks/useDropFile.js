import { useRef, useEffect, useState } from "react";
export const useDropFile = (onFileDrop) => {
  const ref = useRef();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "block";
    fileInput.style.position = "absolute";
    fileInput.style.zIndex = 100;
    fileInput.style.width = "100%";
    fileInput.style.height = "100%";
    fileInput.style.inset = "0";
    fileInput.style.visibility = "hidden";
    fileInput.style.display = "none";
    fileInput.style.opacity = 0;
    fileInput.accept = "image/png, image/jpeg";
    ref.current.appendChild(fileInput);

    const eventContainsFiles = (event) => {
      if (event.dataTransfer.types) {
        for (var i = 0; i < event.dataTransfer.types.length; i++) {
          if (event.dataTransfer.types[i] == "Files") {
            return true;
          }
        }
      }
      return false;
    };

    const onDragOver = (e) => {
      e.preventDefault();
      if (!eventContainsFiles(e)) return;
      fileInput.style.display = "block";
      fileInput.style.visibility = "visible";
      setActive(true);
    };

    const onDragleave = (e) => {
      e.preventDefault();
      fileInput.style.display = "none";
      fileInput.style.visibility = "hidden";
      setActive(false);
    };

    const onDrop = (e) => {
      e.preventDefault();
      const [file = undefined] = e.target.files;
      onFileDrop(file);
      fileInput.style.display = "none";
      fileInput.style.visibility = "hidden";
      setActive(false);
    };
    ref.current.addEventListener("dragover", onDragOver);
    ref.current.addEventListener("dragleave", onDragleave);
    fileInput.addEventListener("change", onDrop);

    return () => {
      fileInput.removeEventListener("change", onDrop);
      if (ref.current) {
        ref.current.removeEventListener("dragover", onDragOver);
        ref.current.removeEventListener("dragleave", onDragleave);
        ref.current.removeChild(fileInput);
      }
    };
  }, [ref.current, onFileDrop]);

  return { ref, active };
};

export default useDropFile;
