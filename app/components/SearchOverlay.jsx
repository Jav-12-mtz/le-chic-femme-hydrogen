import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Search } from 'lucide-react'
import { Link } from 'react-router'
import catalogo from '../data/catalogo.json'

const allProducts = [
  ...catalogo.productos.bolsos.map(p => ({ ...p, cat: 'Bags' })),
  ...catalogo.productos.zapatos.map(p => ({ ...p, cat: 'Shoes' })),
  ...catalogo.productos.joyas_relojes.map(p => ({ ...p, cat: 'Jewelry & Watches' })),
  ...catalogo.productos.tops.map(p => ({ ...p, cat: 'Tops' })),
]

const suggestions = ['Black bag', 'Gold watch', 'Burgundy stilettos', 'Nuit Parisienne look', 'Bridal']

export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
    if (!open) setQ('')
  }, [open])

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  const results = useMemo(() => {
    if (!q.trim()) return []
    const term = q.toLowerCase()
    return allProducts.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.cat.toLowerCase().includes(term) ||
      p.tags?.some(t => t.toLowerCase().includes(term))
    ).slice(0, 8)
  }, [q])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="search-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="search-panel"
            initial={{ y: -40 }} animate={{ y: 0 }} exit={{ y: -40 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="search-head">
              <Search size={20} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search pieces, looks, collections…"
                className="search-input"
              />
              <button className="search-close" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="search-body">
              {!q && (
                <div className="search-suggestions">
                  <div className="search-label">Suggestions</div>
                  <div className="search-chips">
                    {suggestions.map(s => (
                      <button key={s} className="search-chip" onClick={() => setQ(s)}>{s}</button>
                    ))}
                  </div>
                  <div className="search-label" style={{ marginTop: 32 }}>Most loved</div>
                  <div className="search-grid">
                    {allProducts.slice(0, 4).map(p => (
                      <Link key={p.sku} to={`/producto/${p.sku}`} onClick={onClose} className="search-card">
                        <img src={`/images/${p.img}`} alt={p.nombre} />
                        <div className="search-card-meta">
                          <span className="search-card-cat">{p.cat}</span>
                          <span className="search-card-name">{p.nombre}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {q && results.length === 0 && (
                <div className="search-empty">
                  <p>No results for <em>"{q}"</em></p>
                  <p style={{ marginTop: 12, color: 'var(--c-smoke)' }}>Try another word or browse the <Link to="/shop" onClick={onClose} style={{ borderBottom: '1px solid currentColor' }}>boutique</Link></p>
                </div>
              )}

              {results.length > 0 && (
                <div>
                  <div className="search-label">{results.length} {results.length === 1 ? 'result' : 'results'}</div>
                  <div className="search-results">
                    {results.map((p, i) => (
                      <motion.div
                        key={p.sku}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.04 }}
                      >
                        <Link to={`/producto/${p.sku}`} onClick={onClose} className="search-result">
                          <img src={`/images/${p.img}`} alt={p.nombre} />
                          <div className="search-result-meta">
                            <span className="search-card-cat">{p.cat}</span>
                            <span className="search-card-name">{p.nombre}</span>
                          </div>
                          <span className="search-result-arrow">→</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
