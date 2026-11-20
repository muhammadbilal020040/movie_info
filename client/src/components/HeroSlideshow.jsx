import { useEffect, useState } from 'react';

const INTERVAL_MS = 10000;

/** Quiet background crossfade - no controls, no carousel chrome. */
export default function HeroSlideshow({ slides = [] }) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  useEffect(() => {
    if (slides.length < 2 || reduceMotion) return undefined;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [slides, reduceMotion]);

  useEffect(() => {
    if (slides.length < 2) return;
    const next = slides[(index + 1) % slides.length];
    const img = new Image();
    img.src = next;
  }, [index, slides]);

  if (!slides.length) return null;

  return (
    <div className="hero-media" aria-hidden="true">
      <div className="hero-crossfade">
        {slides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`hero-slide${i === index ? ' is-active' : ''}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>
    </div>
  );
}
