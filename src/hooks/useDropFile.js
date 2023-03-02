import { useRef, useEffect, useState } from "react";
export const useDropFile = (onFileDrop) => {
  const ref = useRef();
  const [canDrop, setCanDrop] = useState(false);

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
      setCanDrop(true);
    };

    const onDragleave = (e) => {
      e.preventDefault();
      fileInput.style.display = "none";
      fileInput.style.visibility = "hidden";
      setCanDrop(false);
    };

    const onDrop = (e) => {
      e.preventDefault();
      const [file = undefined] = e.target.files;
      onFileDrop(file);
      fileInput.style.display = "none";
      fileInput.style.visibility = "hidden";
      setCanDrop(false);
    };

    const target = ref.current;
    fileInput.addEventListener("change", onDrop);
    target.addEventListener("dragover", onDragOver);
    target.addEventListener("dragleave", onDragleave);

    return () => {
      fileInput.removeEventListener("change", onDrop);
      target.removeEventListener("dragover", onDragOver);
      target.removeEventListener("dragleave", onDragleave);
      target.removeChild(fileInput);
    };
  }, [onFileDrop]);

  return { ref, canDrop };
};

export default useDropFile;
