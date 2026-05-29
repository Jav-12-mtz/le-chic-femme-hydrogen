import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0
    const move = (e) => { mx = e.clientX; my = e.clientY
      if (dot.current) { dot.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)` }
    }
    const loop = () => {
      rx += (mx - rx) * 0.15
      ry += (my - ry) * 0.15
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`
      requestAnimationFrame(loop)
    }
    const hover = (e) => {
      const t = e.target
      if (t.closest && t.closest('a, button, .product-card, .look-card')) ring.current?.classList.add('hover')
      else ring.current?.classList.remove('hover')
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', hover)
    loop()
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', hover) }
  }, [])

  return (<>
    <div ref={dot} className="cursor-dot" />
    <div ref={ring} className="cursor-ring" />
  </>)
}
