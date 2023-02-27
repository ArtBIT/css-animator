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

  useEffect(() => {
    if (!isPlaying) return;
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, update]);

  // Reset animation
  useEffect(() => {
    if (ref.current) {
      try {
        animation.current = new Animation(
          new KeyframeEffect(
            ref.current,
            keyframes
              .sort((a, b) => a.index > b.index)
              .map(({ index, css }) => ({
                ...JSON.parse(css),
                offset: index / (totalFrames - 1),
              })),
            animationOptions
          )
        );
        animation.current.pause();
        window.anim = animation;
      } catch (e) {
        console.log(e);
      }
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

    const offset = currentFrame / (totalFrames - 1);
    const { duration, direction } =
      animation.current.effect.getComputedTiming();
    //const iterations = direction.startsWith("alternate") ? 2 : 1;
    animation.current.effect.updateTiming({
      delay: -1 * offset * duration,
      //iterations,
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
