import React, {
  useState,
  useRef,
  createRef,
  useCallback,
  useEffect,
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
    setCurrentFrame(0);
  }, [pause]);

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
        setCurrentFrame(Math.floor(currentFrame + framesToAdd) % totalFrames);
      }
    }
    requestRef.current = requestAnimationFrame(update);
  }, [currentFrame, totalFrames, duration]);

  useLayoutEffect(() => {
    if (!isPlaying) return;
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, update]);

  const setAnimationToCurrentFrame = useCallback(
    (anim) => {
      const offset = currentFrame / (totalFrames - 1);
      const { duration, direction } = anim.effect.getComputedTiming();
      //const iterations = direction.startsWith("alternate") ? 2 : 1;
      anim.effect.updateTiming({
        delay: -1 * offset * duration,
        //iterations,
      });
    },
    [currentFrame, totalFrames]
  );

  // Reset animation
  useEffect(() => {
    if (ref.current) {
      try {
        console.log("Reset");
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
        setAnimationToCurrentFrame(animation.current);
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
    ref,
    animation,
    keyframes,
    setAnimationToCurrentFrame,
    animationOptions,
    totalFrames,
  ]);

  const currentKeyframe = useMemo(() => {
    return (
      keyframes.find(({ index }) => index === currentFrame) ||
      new Frame(currentFrame, {})
    );
  }, [currentFrame, keyframes]);

  // Update animation
  useEffect(() => {
    if (!animation.current) return;
    setAnimationToCurrentFrame(animation.current);
  }, [animation, setAnimationToCurrentFrame, currentKeyframe.data.id]);

  return {
    animationOptions,
    ref,

    isPlaying,
    currentFrame,
    currentKeyframe,
    setCurrentFrame,
    setAnimationOptions,
    pause,
    start,
    stop,
  };
};

export default useAnimation;
