import { useEffect, useState } from "react";

export const useResizeObserver = (ref: React.RefObject<HTMLDivElement>) => {
  const [dimensions, setDimensions] = useState<DOMRectReadOnly | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });

    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);

  return {
    width: dimensions?.width,
    height: dimensions?.height,
  };
};
