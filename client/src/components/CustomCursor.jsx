import { useEffect, useId, useRef, useState } from 'react';

function canUseCustomCursor() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return false;
  return true;
}

function isInteractive(el) {
  if (!el || !(el instanceof Element)) return false;
  return Boolean(
    el.closest(
      'a, button, [role="button"], input, select, textarea, label, .movie-card, .browse-tile, .search-result-item, .nav-link, .btn, .genre-chip, .text-link, .back-link, summary, .mi-select, .mi-select-trigger, .mi-select-option, .mi-checkbox, .mi-input, .mi-file, .mi-file-btn, .nav-search-input, .search-overlay-input, .trending-lead, .trending-side-card'
    )
  );
}

/** Dark-theme gooey blob with an extended blurred motion tail. */
export default function CustomCursor() {
  const uid = useId().replace(/:/g, '');
  const gooId = `cursor-goo-${uid}`;
  const fillId = `cursor-fill-${uid}`;
  const sheenId = `cursor-sheen-${uid}`;
  const tailBlurId = `cursor-tail-blur-${uid}`;

  const wrapRef = useRef(null);
  const headA = useRef(null);
  const headB = useRef(null);
  const trail = useRef([null, null, null, null, null]);
  const sheenRef = useRef(null);
  const rafRef = useRef(0);

  const mouse = useRef({ x: -200, y: -200 });
  const head = useRef({ x: -200, y: -200 });
  const trailPos = useRef(
    Array.from({ length: 5 }, () => ({ x: -200, y: -200 }))
  );
  const vel = useRef({ x: 0, y: 0 });
  const prev = useRef({ x: -200, y: -200 });
  const tRef = useRef(0);
  const hoverRef = useRef(false);
  const pressRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(canUseCustomCursor());
    sync();
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pq = window.matchMedia('(hover: none), (pointer: coarse)');
    mq.addEventListener?.('change', sync);
    pq.addEventListener?.('change', sync);
    return () => {
      mq.removeEventListener?.('change', sync);
      pq.removeEventListener?.('change', sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('has-custom-cursor');
      return undefined;
    }
    document.documentElement.classList.add('has-custom-cursor');

    const syncClass = () => {
      const root = wrapRef.current;
      if (!root) return;
      root.classList.toggle('is-hover', hoverRef.current);
      root.classList.toggle('is-press', pressRef.current);
    };

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      setVisible(true);
      hoverRef.current = isInteractive(e.target);
      syncClass();
    };
    const onLeave = () => setVisible(false);
    const onDown = () => {
      pressRef.current = true;
      syncClass();
    };
    const onUp = () => {
      pressRef.current = false;
      syncClass();
    };

    const place = (el, x, y, r, opacity) => {
      if (!el) return;
      el.setAttribute('cx', x.toFixed(2));
      el.setAttribute('cy', y.toFixed(2));
      el.setAttribute('r', r.toFixed(2));
      if (opacity != null) el.setAttribute('opacity', opacity.toFixed(3));
    };

    const tick = () => {
      tRef.current += 0.045;
      const t = tRef.current;
      const headEase = hoverRef.current ? 0.28 : 0.2;

      head.current.x += (mouse.current.x - head.current.x) * headEase;
      head.current.y += (mouse.current.y - head.current.y) * headEase;

      vel.current.x = head.current.x - prev.current.x;
      vel.current.y = head.current.y - prev.current.y;
      prev.current.x = head.current.x;
      prev.current.y = head.current.y;

      const speed = Math.min(Math.hypot(vel.current.x, vel.current.y), 45);
      const scale = hoverRef.current ? 1.35 : pressRef.current ? 0.78 : 1;
      const hx = head.current.x;
      const hy = head.current.y;
      const vx = vel.current.x;
      const vy = vel.current.y;

      // Head blob (dark gooey mass)
      place(
        headA.current,
        hx + Math.sin(t * 0.9) * 1.6 - vx * 0.2,
        hy + Math.cos(t * 0.75) * 1.4 - vy * 0.2,
        11 * scale * (1 + Math.sin(t * 1.1) * 0.05)
      );
      place(
        headB.current,
        hx + Math.cos(t * 1.25 + 0.7) * (5.5 + speed * 0.12) + vx * 0.35,
        hy + Math.sin(t * 1.1 + 0.5) * (4.8 + speed * 0.1) + vy * 0.35,
        7.5 * scale * (0.92 + Math.cos(t * 1.4) * 0.08)
      );

      // Extended lagging tail - slower ease farther back, soft blur group in SVG
      const eases = [0.22, 0.14, 0.09, 0.06, 0.04];
      const radii = [7.5, 6.2, 5, 3.8, 2.6].map((r) => r * scale);
      const opacities = [0.85, 0.62, 0.42, 0.26, 0.14];

      let followX = hx;
      let followY = hy;
      for (let i = 0; i < trailPos.current.length; i += 1) {
        // Pull behind motion direction for a comet-like trail
        const targetX = followX - vx * (1.8 + i * 1.1) + Math.sin(t + i) * (0.4 + i * 0.15);
        const targetY = followY - vy * (1.8 + i * 1.1) + Math.cos(t * 0.9 + i) * (0.35 + i * 0.12);
        trailPos.current[i].x += (targetX - trailPos.current[i].x) * eases[i];
        trailPos.current[i].y += (targetY - trailPos.current[i].y) * eases[i];
        place(
          trail.current[i],
          trailPos.current[i].x,
          trailPos.current[i].y,
          radii[i] * (1 + speed * 0.008 * (i + 1)),
          opacities[i]
        );
        followX = trailPos.current[i].x;
        followY = trailPos.current[i].y;
      }

      if (sheenRef.current) {
        place(sheenRef.current, hx - 2.8, hy - 3.2, 3.2 * scale, 0.75);
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={wrapRef}
      className={`custom-cursor${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg className="custom-cursor-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={gooId} x="-90%" y="-90%" width="280%" height="280%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
          </filter>

          <filter id={tailBlurId} x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="soft" />
            <feColorMatrix
              in="soft"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 14 -6"
              result="gooTail"
            />
          </filter>

          {/* Theme accent fill - bright core → Netflix red → deep crimson edge */}
          <radialGradient id={fillId} cx="32%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#ff6b73" />
            <stop offset="28%" stopColor="#e50914" />
            <stop offset="62%" stopColor="#b20710" />
            <stop offset="100%" stopColor="#6e060c" />
          </radialGradient>

          <radialGradient id={sheenId} cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#fff5f5" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#ffb3b8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#e50914" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft extended tail (more blur) */}
        <g filter={`url(#${tailBlurId})`} className="cursor-tail-group">
          {trail.current.map((_, i) => (
            <circle
              key={`tail-${i}`}
              ref={(el) => {
                trail.current[i] = el;
              }}
              fill={`url(#${fillId})`}
              className="cursor-tail-lobe"
            />
          ))}
        </g>

        {/* Sharper gooey head */}
        <g filter={`url(#${gooId})`} className="cursor-head-group">
          <circle ref={headA} fill={`url(#${fillId})`} className="cursor-lobe" />
          <circle ref={headB} fill={`url(#${fillId})`} className="cursor-lobe" />
        </g>

        <circle ref={sheenRef} fill={`url(#${sheenId})`} className="cursor-sheen" />
      </svg>
    </div>
  );
}
