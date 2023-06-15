import { useEffect, useRef } from "react";

function useInterval<T extends Function>(callback: T, delay: number | null) {
  const intervalRef = useRef<number>();
  const savedCallback = useRef<T>(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === "number") {
      intervalRef.current = window.setInterval(tick, delay);
      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);
  return intervalRef;
}

export default useInterval;
