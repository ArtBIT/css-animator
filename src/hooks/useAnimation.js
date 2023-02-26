import React, {
  useState,
  useRef,
  createRef,
  useCallback,
  useEffect,
} from "react";
import { DEFAULT_ANIMATION_OPTIONS } from "../constants";

export const useAnimation = ({
  totalFrames = 100,
  keyframes = [],
  ...initialState
}) => {
  const ref = createRef();
  const animation = useRef();

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationOptions, setAnimationOptions] = useState({
    ...DEFAULT_ANIMATION_OPTIONS,
    initialState,
  });

  // Callbacks
  const start = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const stop = useCallback(() => {
    pause();
    setCurrentFrame(0);
  }, [pause]);

  const update = useCallback(() => {
    setCurrentFrame((currentFrame + 1) % totalFrames);
  }, [currentFrame, totalFrames]);

  // Animation Loop
  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = requestAnimationFrame(update);
    }
    return () => {
      intervalId && cancelAnimationFrame(intervalId);
    };
  }, [isPlaying, update]);

  // Reset animation
  useEffect(() => {
    if (ref.current) {
      animation.current = new Animation(
        new KeyframeEffect(
          ref.current,
          keyframes
            .sort((a, b) => a.index > b.index)
            .map(({ index, css }) => ({
              ...JSON.parse(css),
              offset: index / totalFrames,
            })),
          animationOptions
        )
      );
      animation.current.pause();
    }
    return () => {
      if (animation.current) {
        animation.current.cancel();
        animation.current = null;
      }
    };
  }, [ref, animation, keyframes, animationOptions, totalFrames]);

  // Update animation
  useEffect(() => {
    if (!animation.current) return;

    const offset = currentFrame / totalFrames;
    const { duration, direction } =
      animation.current.effect.getComputedTiming();
    const iterations = direction.startsWith("alternate") ? 2 : 1;
    animation.current.effect.updateTiming({
      delay: -1 * offset * duration,
      iterations,
    });
  }, [animation, currentFrame, totalFrames]);

  return {
    animationOptions,
    ref,

    currentFrame,
    setCurrentFrame,
    setAnimationOptions,
    pause,
    start,
    stop,
  };
};

export default useAnimation;
