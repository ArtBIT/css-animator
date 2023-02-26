import SpeechBubble from "../SpeechBubble";
import Arnie from "../../assets/arnie.png";
import s from "./Logo.module.css";

export function Logo(props) {
  return (
    <div className={s["root"]}>
      <img src={Arnie} className={s["arnie"]} />
      <SpeechBubble className={s["text"]}>{"I'll be black!"}</SpeechBubble>
    </div>
  );
}
export default Logo;
