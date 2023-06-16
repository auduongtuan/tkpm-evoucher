import { useEffect } from "react";
export default function useEventListener(
  event: keyof DocumentEventMap,
  handler: React.EventHandler<any>
) {
  useEffect(() => {
    document.addEventListener(event, handler);
    return () => {
      document.removeEventListener(event, handler);
    };
  }, []);
}
