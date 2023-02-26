import s from "./SpeechBubble.module.css";
import classnames from "classnames";

export function SpeechBubble({ children, className, position = "right" }) {
  return (
    <div className={classnames(s["wrapper"], className)}>
      <div
        className={classnames(
          s["speechbubble"],
          position == "right" && s["right"]
        )}
      >
        {children}
      </div>
    </div>
  );
}
export default SpeechBubble;
