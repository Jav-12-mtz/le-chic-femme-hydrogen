import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router'

const slides = [
  {
    img: 'A01_Editorial-Boutique.jpg',
    eyebrow: 'Édition Atelier · 2026',
    title: "L'art de la femme moderne",
    sub: 'A curation of singular pieces',
    cta: 'Explore the boutique',
    to: '/shop',
    align: 'left',
  },
  {
    img: 'A02_Street-Femme-Chapeau.jpg',
    eyebrow: 'Nouveauté',
    title: 'Curated looks',
    sub: 'Ten looks conceived as works of art',
    cta: 'Discover the looks',
    to: '/conjuntos',
    align: 'right',
  },
  {
    img: 'A05_Mood-Brand-B.jpg',
    eyebrow: 'Runway 2026',
    title: 'Couture privée',
    sub: 'For our private list only',
    cta: 'Request access',
    to: '/shop',
    align: 'center',
  },
  {
    img: 'A09_Riviera-Floral-Bali.jpg',
    eyebrow: 'Resort Édition',
    title: 'Riviera Dorée',
    sub: 'The Mediterranean summer collection',
    cta: 'Shop Resort 2026',
    to: '/shop',
    align: 'left',
  },
]

export default function HeroSlider() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI(x => (x + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [paused])

  const s = slides[i]

  return (
    <section
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence>
        <motion.div
          key={i}
          className="slide"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={`/images-webp/06_anuncios/${s.img.replace(/\.(jpe?g|png)$/i, '.webp')}`}
            alt={s.title}
            className="slide-img"
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchpriority={i === 0 ? 'high' : 'low'}
            decoding="async"
          />
          <div className="slide-veil" />
        </motion.div>
      </AnimatePresence>

      <div className={`slide-content align-${s.align}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${i}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="slide-eyebrow">{s.eyebrow}</span>
            <h1 className="slide-title">{s.title}</h1>
            <p className="slide-sub">{s.sub}</p>
            <Link to={s.to} className="slide-cta">{s.cta} <span aria-hidden>→</span></Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="slide-nav">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`slide-dot ${idx === i ? 'active' : ''}`}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
          >
            <span className="slide-dot-fill" style={{ animationPlayState: paused ? 'paused' : 'running' }} />
          </button>
        ))}
      </div>

      <div className="slide-counter">
        <span>{String(i + 1).padStart(2, '0')}</span>
        <span className="slide-counter-line" />
        <span>{String(slides.length).padStart(2, '0')}</span>
      </div>
    </section>
  )
}
