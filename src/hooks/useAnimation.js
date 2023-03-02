import React, {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useMemo,
} from "react";
import { DEFAULT_ANIMATION_OPTIONS } from "../constants";
import Frame from "../lib/Frame";

export const useAnimation = ({
  totalFrames = 100,
  keyframes = [],
  ...initialState
}) => {
  const ref = useRef();
  const animation = useRef();
  const lastUpdate = useRef();
  const requestRef = React.useRef();

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationOptions, setAnimationOptions] = useState({
    ...DEFAULT_ANIMATION_OPTIONS,
    initialState,
  });

  // Callbacks
  const start = useCallback(() => {
    setIsPlaying(true);
    lastUpdate.current = Date.now();
  }, []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const stop = useCallback(() => {
    pause();
    setCurrentFrameImpl(0);
  }, [pause]);
  const setCurrentFrameImpl = useCallback(
    (newCurrentFrame) => {
      const anim = animation.current;
      const offset = newCurrentFrame / (totalFrames - 1);
      const { duration } = anim.effect.getComputedTiming();
      anim.effect.updateTiming({
        delay: -1 * offset * duration,
      });
      console.log(currentFrame, newCurrentFrame);
      setCurrentFrame(newCurrentFrame);
    },
    [currentFrame, totalFrames]
  );

  const { duration } = animationOptions;

  const update = useCallback(() => {
    if (!lastUpdate.current) {
      lastUpdate.current = Date.now();
    } else {
      const now = Date.now();
      const elapsedMiliseconds = now - lastUpdate.current;
      const timePerFrame = duration / totalFrames;
      const framesToAdd = elapsedMiliseconds / timePerFrame;
      if (framesToAdd > 1) {
        lastUpdate.current = now;
        const newCurrentFrame =
          Math.floor(currentFrame + framesToAdd) % totalFrames;
        setCurrentFrameImpl(newCurrentFrame);
      }
    }
    requestRef.current = requestAnimationFrame(update);
  }, [currentFrame, totalFrames, duration]);

  // Animation Loop
  useLayoutEffect(() => {
    if (!isPlaying) return;
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, update]);

  // Reset animation
  useLayoutEffect(() => {
    if (ref.current) {
      try {
        console.log("Update animation");
        animation.current && animation.current.cancel();
        animation.current = new Animation(
          new KeyframeEffect(
            ref.current,
            keyframes.map(({ index, data: { data } }) => ({
              ...data,
              offset: index / (totalFrames - 1),
            })),
            animationOptions
          )
        );
        animation.current.pause();
        setCurrentFrameImpl(currentFrame);
        window.anim = animation.current;
      } catch (e) {
        console.error(e);
      }
    }
    return () => {
      if (animation.current) {
        animation.current.cancel();
        animation.current = null;
      }
    };
  }, [
    keyframes,
    setCurrentFrameImpl,
    currentFrame,
    animationOptions,
    totalFrames,
  ]);

  const currentKeyframe = useMemo(() => {
    return (
      keyframes.find(({ index }) => index === currentFrame) ||
      new Frame(currentFrame, {})
    );
  }, [currentFrame, keyframes]);

  return {
    animationOptions,
    ref,

    isPlaying,
    currentFrame,
    setCurrentFrame: setCurrentFrameImpl,
    currentKeyframe,
    setAnimationOptions,
    pause,
    start,
    stop,
  };
};

export default useAnimation;
