'use client';

import { useEffect, useRef, useState } from 'react';

/** Cheap visibility gate so off-screen canvases stop burning frames. */
export function useInViewport<T extends HTMLElement>(margin = '200px') {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: margin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, visible };
}
