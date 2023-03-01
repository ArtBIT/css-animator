import React, { useState, useMemo, useRef, useCallback } from "react";
import useEvent from "beautiful-react-hooks/useEvent";

import Logo from "./components/Logo";
import Stage from "./components/Stage";
import Flex from "./components/Flex";
import FrameForm from "./components/FrameForm";
import AnimationForm from "./components/AnimationForm";
import AnimationTimeline from "./components/AnimationTimeline";

import useAnimation from "./hooks/useAnimation";
import copyTextToClipboard from "./utils/copy";
import kebabize from "./utils/kebabize";
import Frame, { FrameData } from "./lib/Frame";

import s from "./App.module.css";

function App() {
  const [keyframes, setKeyframes] = useState([
    new Frame(0, {
      transform: "rotateY(0deg)",
      filter: "blur(0)",
    }),
    new Frame(50, {
      transform: "rotateY(360deg)",
      filter: "blur(5px) drop-shadow(0 0 10px #FF0)",
    }),
    new Frame(100, {
      transform: "rotateY(0)",
      filter: "blur(0)",
    }),
  ]);
  const [totalFrames, setTotalFrames] = useState(101);
  const animation = useAnimation({ totalFrames, keyframes });
  const { currentFrame, currentKeyframe } = animation;
  const { setCurrentFrame, setAnimationOptions, animationOptions } = animation;

  const shiftCurrentKeyFrame = useCallback(
    (numFrames) => {
      const newKeyframe = currentKeyframe.clone();
      newKeyframe.index += numFrames;

      const newKeyframes = [
        ...keyframes.filter(
          ({ index }) =>
            index !== currentKeyframe.index && index !== newKeyframe.index
        ),
        newKeyframe,
      ].sort((a, b) => a.index > b.index);

      setKeyframes(newKeyframes);
      setCurrentFrame(newKeyframe.index);
    },
    [currentKeyframe, keyframes]
  );

  const updateFrame = useCallback(
    (frameIndex, data, replace = false) => {
      const fd = new FrameData(data);
      const keyframe = new Frame(
        frameIndex,
        replace ? fd.data : { ...currentKeyframe.data.data, ...fd.data }
      );
      const newKeyframes = [
        ...keyframes.filter(({ index }) => index !== frameIndex),
        keyframe,
      ].sort((a, b) => a.index > b.index);

      setKeyframes(newKeyframes);
    },
    [keyframes, currentKeyframe.data.id]
  );

  const handleKeyframeChange = useCallback(
    (css) => {
      updateFrame(currentFrame, css, true);
    },
    [currentFrame, keyframes]
  );

  const handleKeyframeRemoval = useCallback(() => {
    setKeyframes([...keyframes.filter(({ index }) => index !== currentFrame)]);
  }, [currentFrame, keyframes]);

  const handleOptionsChange = useCallback(
    (options) => {
      setAnimationOptions(options);
    },
    [setAnimationOptions]
  );

  const handleScrub = useCallback(
    (e) => {
      setCurrentFrame(parseInt(e.target.value));
    },
    [setCurrentFrame]
  );

  const handleFrameDataUpdate = useCallback(
    (data) => updateFrame(currentFrame, data),
    [currentFrame]
  );

  const indent = "  ";
  const handleAnimationExport = useCallback(() => {
    const name = window.prompt("Enter animation name:");
    const cssKeyframes = keyframes
      .sort((a, b) => a.index > b.index)
      .map(({ index, data }) => {
        const percent = ((index / (totalFrames - 1)) * 100).toFixed(0) + "%";
        return data.toCSS(percent, indent);
      })
      .join("\n");

    copyTextToClipboard(`
.animation-${name} {
${indent}animation-duration: ${animationOptions.duration}ms;
${indent}animation-timing-function: ${animationOptions.easing};
${indent}animation-iteration-count: ${
      animationOptions.iterations ?? "infinite"
    };
${indent}animation-direction: ${animationOptions.direction};
${indent}animation-fill: ${animationOptions.fill};
${indent}animation-name: ${name};
}

@keyframes ${name} {
${cssKeyframes}
}
`);
  }, [keyframes, animationOptions, totalFrames]);

  const onKeyDown = useEvent({ current: window.document }, "keydown");
  const handleKeyboardShortcuts = useCallback(
    (e) => {
      let preventDefault = true;
      switch (e.key) {
        case "ArrowLeft":
          if (e.shiftKey) {
            shiftCurrentKeyFrame(-1);
            break;
          }
          setCurrentFrame((totalFrames + currentFrame - 1) % totalFrames);
          break;
        case "ArrowRight":
          if (e.shiftKey) {
            shiftCurrentKeyFrame(+1);
            break;
          }
          setCurrentFrame((totalFrames + currentFrame + 1) % totalFrames);
          break;
        case "Delete":
          handleKeyframeRemoval();
          break;
        case " ":
          animation.isPlaying ? animation.pause() : animation.start();
          break;
        default:
          preventDefault = false;
      }
      preventDefault && e.preventDefault();
      console.log(e);
    },
    [
      currentFrame,
      totalFrames,
      animation,
      shiftCurrentKeyFrame,
      handleKeyframeRemoval,
    ]
  );
  onKeyDown(handleKeyboardShortcuts);

  return (
    <div className={s["root"]}>
      <header className={s["header"]}>
        <h1>CSS Animator</h1>
        <Logo />
      </header>
      <section>
        <Flex row className={s["main"]}>
          <AnimationForm
            className={s["animation-form"]}
            onChange={handleOptionsChange}
          />
          <Stage
            className={s["stage"]}
            innerRef={animation.ref}
            frame={currentKeyframe}
            updateFrame={handleFrameDataUpdate}
          />
          <FrameForm
            frame={currentKeyframe}
            totalFrames={totalFrames}
            className={s["frame-form"]}
            onChange={handleKeyframeChange}
            onRemove={handleKeyframeRemoval}
            onExport={handleAnimationExport}
          />
        </Flex>
        <AnimationTimeline
          keyframes={keyframes}
          onMouseDown={setCurrentFrame}
          currentFrame={animation.currentFrame}
          start={animation.start}
          stop={animation.stop}
          pause={animation.pause}
          totalFrames={totalFrames}
          onScrub={handleScrub}
        />
      </section>
    </div>
  );
}

export default App;
