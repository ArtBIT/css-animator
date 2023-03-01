import React, { useState, useMemo, useRef, useCallback } from "react";
import useEvent from "beautiful-react-hooks/useEvent";
import { SnackbarProvider, useSnackbar } from "notistack";

import Logo from "./components/Logo";
import Stage from "./components/Stage";
import Flex from "./components/Flex";
import FrameForm from "./components/FrameForm";
import AnimationCSS from "./components/AnimationCSS";
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
  const [cssVersion, setCSSVersion] = useState(1);
  const [totalFrames, setTotalFrames] = useState(101);
  const animation = useAnimation({ totalFrames, keyframes });
  const [clipboard, setClipboard] = useState();
  const { currentFrame, currentKeyframe } = animation;
  const { setCurrentFrame, setAnimationOptions, animationOptions } = animation;
  const { enqueueSnackbar } = useSnackbar();
  const showSnackBar = (text, variant) => enqueueSnackbar(text, { variant });

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
      setCSSVersion(cssVersion + 1);
    },
    [currentKeyframe, keyframes, cssVersion]
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
      setCSSVersion(cssVersion + 1);
    },
    [keyframes, currentKeyframe.data.id, cssVersion]
  );

  const handleKeyframeChange = useCallback(
    (css) => {
      updateFrame(currentFrame, css, true);
    },
    [currentFrame, keyframes]
  );

  const handleKeyframeRemoval = useCallback(() => {
    setKeyframes([...keyframes.filter(({ index }) => index !== currentFrame)]);
    setCSSVersion(cssVersion + 1);
  }, [currentFrame, keyframes, cssVersion]);

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

  const animationCSS = useMemo(() => {
    const indent = "  ";
    const name = "custom";
    const cssKeyframes = keyframes
      .sort((a, b) => a.index > b.index)
      .map(({ index, data }) => {
        const percent = ((index / (totalFrames - 1)) * 100).toFixed(0) + "%";
        return data.toCSS(percent, indent);
      })
      .join("\n");

    return `
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
`;
  }, [keyframes, cssVersion, animationOptions]);

  const handleAnimationExport = useCallback(() => {
    copyTextToClipboard(animationCSS);
    showSnackBar("CSS snippet copied to clipboard");
  }, [animationCSS, showSnackBar]);

  const prevFrame = useCallback(
    () => setCurrentFrame((totalFrames + currentFrame - 1) % totalFrames),
    [currentFrame, totalFrames]
  );
  const nextFrame = useCallback(
    () => setCurrentFrame((totalFrames + currentFrame + 1) % totalFrames),
    [currentFrame, totalFrames]
  );

  const handleCopyFrame = useCallback(() => {
    setClipboard({ type: "frame", data: currentKeyframe });
  }, [currentKeyframe]);

  const handleCutFrame = useCallback(() => {
    setClipboard({ type: "frame", data: currentKeyframe });
    handleKeyframeRemoval();
  }, [currentKeyframe, handleKeyframeRemoval]);

  const handlePasteFrame = useCallback(() => {
    handleFrameDataUpdate(clipboard.data.data.data);
  }, [handleFrameDataUpdate, clipboard]);

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
          prevFrame();
          break;
        case "ArrowRight":
          if (e.shiftKey) {
            shiftCurrentKeyFrame(+1);
            break;
          }
          nextFrame();
          break;
        case "Delete":
          handleKeyframeRemoval();
          break;
        case " ":
          animation.isPlaying ? animation.pause() : animation.start();
          break;
        case "c":
          if (!e.ctrlKey) break;
          handleCopyFrame();
          break;
        case "x":
          if (!e.ctrlKey) break;
          handleCutFrame();
          break;
        case "v":
          if (!e.ctrlKey) break;
          handlePasteFrame();
          break;
        default:
          preventDefault = false;
      }
      preventDefault && e.preventDefault();
      console.log(e);
    },
    [
      prevFrame,
      nextFrame,
      animation,
      shiftCurrentKeyFrame,
      handleKeyframeRemoval,
      handleCopyFrame,
      handleCutFrame,
      handlePasteFrame,
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
            isPlaying={animation.isPlaying}
          />
          <Flex column className={s["frame-form"]}>
            <FrameForm
              frame={currentKeyframe}
              totalFrames={totalFrames}
              onCopy={handleCopyFrame}
              onCut={handleCutFrame}
              onPaste={handlePasteFrame}
              onChange={handleKeyframeChange}
              onRemove={handleKeyframeRemoval}
              onExport={handleAnimationExport}
            />
            <AnimationCSS text={animationCSS} onCopy={handleAnimationExport} />
          </Flex>
        </Flex>
        <AnimationTimeline
          keyframes={keyframes}
          isPlaying={animation.isPlaying}
          onMouseDown={setCurrentFrame}
          currentFrame={animation.currentFrame}
          prev={prevFrame}
          start={animation.start}
          stop={animation.stop}
          pause={animation.pause}
          next={nextFrame}
          totalFrames={totalFrames}
          onScrub={handleScrub}
        />
      </section>
    </div>
  );
}

export default App;
