import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Link } from 'react-router'
import { useCart, useFavs } from '../store/cart'

export default function ProductCard({ product, index = 0, badge }) {
  const add = useCart(s => s.add)
  const toggleFav = useFavs(s => s.toggle)
  const isFav = useFavs(s => s.has(product.sku))

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {badge && <span className="product-badge">{badge}</span>}
      <button className={`product-fav ${isFav ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); toggleFav(product.sku) }} aria-label="Wishlist">
        <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
      </button>

      <Link to={`/producto/${product.sku}`}>
        <div className="product-img-wrap">
          <img className="product-img" src={product._fromShopify ? product.img : `/images/${product.img}`} alt={product.nombre} loading="lazy" />
          <div className="product-overlay">
            <button
              className="product-quick-add"
              onClick={(e) => { e.preventDefault(); add(product) }}
            >Add · ${product.precio.toLocaleString('en-US')}</button>
          </div>
        </div>
        <div className="product-meta">
          <div className="product-name">{product.nombre}</div>
          <div className="product-price">$ {product.precio.toLocaleString('en-US')} USD</div>
        </div>
      </Link>
    </motion.article>
  )
}
