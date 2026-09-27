import { useRef, useState, useCallback, useEffect } from 'react';

export function useCarousel<T>(items: T[], autoPlayInterval = 0) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) return;
    const boundedIndex = Math.max(0, Math.min(index, items.length - 1));
    setCurrentIndex(boundedIndex);
    const container = containerRef.current;
    const card = container.children[boundedIndex] as HTMLElement;
    if (card) {
      card.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest',
      });
    }
  }, [items.length]);

  const next = useCallback(() => {
    scrollToIndex((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, scrollToIndex]);

  const prev = useCallback(() => {
    scrollToIndex((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, scrollToIndex]);

  useEffect(() => {
    if (!autoPlayInterval || items.length <= 1) return;
    const timer = setInterval(() => {
      next();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlayInterval, items.length, next]);

  return {
    containerRef,
    currentIndex,
    scrollToIndex,
    next,
    prev,
    hasPrev: currentIndex > 0,
    hasNext: currentIndex < items.length - 1,
  };
}
