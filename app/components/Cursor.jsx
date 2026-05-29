import {useEffect, useRef} from 'react';

const HOVER_SELECTOR = 'a, button, .product-card, .look-card';

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    // Skip on touch devices and when user prefers reduced motion
    if (typeof window === 'undefined') return;
    const isTouch =
      window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (isTouch || reducedMotion) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;
    let lastHoverTarget = null;

    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      const d = dot.current;
      if (d) d.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      const r = ring.current;
      if (r) r.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };

    // Use mouseover only for delegation; cache last result to avoid DOM walk each pixel
    const hover = (e) => {
      const t = e.target;
      if (t === lastHoverTarget) return;
      lastHoverTarget = t;
      const isInteractive = t.closest && t.closest(HOVER_SELECTOR);
      ring.current?.classList.toggle('hover', !!isInteractive);
    };

    window.addEventListener('mousemove', move, {passive: true});
    window.addEventListener('mouseover', hover, {passive: true});
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', hover);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}
