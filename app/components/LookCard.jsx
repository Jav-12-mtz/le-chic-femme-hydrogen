import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

export default function LookCard({ conjunto, index = 0 }) {
  return (
    <motion.article
      className="look-card"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <img className="look-bg" src={`/images/${conjunto.imagen_hero}`} alt={conjunto.nombre} loading="lazy" />
      <div className="look-content">
        <div>
          <div className="look-num">N° {String(index + 1).padStart(2, '0')}</div>
          <h3 className="look-title" style={{ marginTop: 16 }}>{conjunto.nombre}</h3>
          <p style={{ marginTop: 12, fontSize: 14, color: 'var(--c-mist)', maxWidth: 320 }}>{conjunto.concepto}</p>
        </div>
        <div className="look-info">
          <span>{conjunto.piezas.length} pieces · ${conjunto.precio_conjunto.toLocaleString('en-US')}</span>
          <Link className="look-cta" to={`/conjunto/${conjunto.id}`}>Découvrir <ArrowRight size={14} /></Link>
        </div>
      </div>
    </motion.article>
  )
}
