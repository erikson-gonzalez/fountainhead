import { useState, useCallback } from "react";

const VISIBLE = 3;

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
}

export function useTestimonialsCarousel(testimonials: Testimonial[]) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = testimonials.length;

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (total > 0 ? (i - 1 + total) % total : 0));
  }, [total]);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (total > 0 ? (i + 1) % total : 0));
  }, [total]);

  const goTo = useCallback(
    (newIndex: number) => {
      setDirection(newIndex > index ? 1 : -1);
      setIndex(newIndex);
    },
    [index]
  );

  const visible =
    total > 0
      ? Array.from({ length: Math.min(VISIBLE, total) }, (_, k) =>
          testimonials[(index + k) % total]
        )
      : [];

  return { index, direction, visible, total, prev, next, goTo };
}
