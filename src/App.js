import React, { useState, useMemo, useRef, useCallback } from "react";

import Logo from "./components/Logo";
import Stage from "./components/Stage";
import Flex from "./components/Flex";
import FrameForm from "./components/FrameForm";
import AnimationForm from "./components/AnimationForm";
import AnimationTimeline from "./components/AnimationTimeline";

import useAnimation from "./hooks/useAnimation";
import copyTextToClipboard from "./utils/copy";
import kebabize from "./utils/kebabize";

import s from "./App.module.css";

function App() {
  const [keyframes, setKeyframes] = useState([
    {
      index: 0,
      css: JSON.stringify(
        {
          transform: "rotate(0)",
          filter: "blur(0)",
        },
        null,
        2
      ),
    },
    {
      index: 49,
      css: JSON.stringify(
        {
          transform: "rotate(180deg)",
          filter: "blur(5px) drop-shadow(0 0 10px #FF0)",
        },
        null,
        2
      ),
    },
    {
      index: 99,
      css: JSON.stringify(
        {
          transform: "rotate(360deg)",
          filter: "blur(0)",
        },
        null,
        2
      ),
    },
  ]);
  const [totalFrames, setTotalFrames] = useState(100);
  const [selectedKeyframeIndex, setSelectedKeyframeIndex] = useState(0);
  const animation = useAnimation({ totalFrames, keyframes });
  const { setCurrentFrame, setAnimationOptions, animationOptions } = animation;

  const selectedKeyframe = useMemo(() => {
    return (
      keyframes.find(({ index }) => index === selectedKeyframeIndex) || {
        index: selectedKeyframeIndex,
        css: "",
      }
    );
  }, [selectedKeyframeIndex, keyframes]);

  const handleKeyframeChange = useCallback(
    (css) => {
      const keyframe = {
        index: selectedKeyframeIndex,
        css,
      };
      setKeyframes([
        ...keyframes.filter(({ index }) => index !== selectedKeyframeIndex),
        keyframe,
      ]);
    },
    [selectedKeyframeIndex, keyframes]
  );

  const handleKeyframeRemoval = useCallback(() => {
    setKeyframes([
      ...keyframes.filter(({ index }) => index !== selectedKeyframeIndex),
    ]);
  }, [selectedKeyframeIndex, keyframes]);

  const handleOptionsChange = useCallback(
    (options) => {
      setAnimationOptions(options);
    },
    [setAnimationOptions]
  );

  const handleScrub = useCallback(
    (e) => {
      const value = parseInt(e.target.value);
      setCurrentFrame(value);
      setSelectedKeyframeIndex(value);
    },
    [setCurrentFrame]
  );

  const handleAnimationExport = useCallback(() => {
    const name = window.prompt("Enter animation name:");
    const cssKeyframes = keyframes
      .sort((a, b) => a.index > b.index)
      .map(({ index, css: jsonString }) => {
        const json = JSON.parse(jsonString);
        const percent = ((index / (totalFrames - 1)) * 100).toFixed(0) + "%";
        const rules = Object.keys(json)
          .map((ruleName) => {
            const rule = json[ruleName];
            return `    ${kebabize(ruleName)}: ${rule};`;
          })
          .join("\n");
        return `  ${percent} {
${rules}
  }`;
      })
      .join("\n");

    copyTextToClipboard(`
.animation-${name} {
    animation-duration: ${animationOptions.duration}ms;
    animation-iteration-count: ${animationOptions.iterations ?? "infinite"};
    animation-direction: ${animationOptions.direction};
    animation-fill: ${animationOptions.fill};
    animation-name: ${name};
}

@keyframes ${name} {
${cssKeyframes}
}
`);
  }, [keyframes, animationOptions, totalFrames]);

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
          <Stage className={s["stage"]} innerRef={animation.ref} />
          <FrameForm
            frame={selectedKeyframe}
            totalFrames={totalFrames}
            className={s["frame-form"]}
            onChange={handleKeyframeChange}
            onRemove={handleKeyframeRemoval}
            onExport={handleAnimationExport}
          />
        </Flex>
        <AnimationTimeline
          currentIndex={selectedKeyframeIndex}
          keyframes={keyframes}
          onMouseDown={setSelectedKeyframeIndex}
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
