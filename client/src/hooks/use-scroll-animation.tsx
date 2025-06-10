import { useEffect, useRef } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px" } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            entry.target.classList.remove("opacity-0", "translate-y-12");
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Initial state
    element.classList.add("opacity-0", "translate-y-12", "transition-all", "duration-700");
    
    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return elementRef;
}
