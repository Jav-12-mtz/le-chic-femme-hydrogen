import {motion} from 'framer-motion';
import {Link} from 'react-router';

const HeartIcon = ({filled}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function ProductCard({product, index = 0, badge}) {
  const handle = product.handle || product.sku;
  const imgSrc = product._fromShopify
    ? product.img
    : `/images/${product.img}`;
  const price = Number(product.precio || 0);

  return (
    <motion.article
      className="product-card"
      initial={{opacity: 0, y: 40}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {badge && <span className="product-badge">{badge}</span>}
      <Link to={`/producto/${handle}`}>
        <div className="product-img-wrap">
          <img
            className="product-img"
            src={imgSrc}
            alt={product.nombre}
            loading="lazy"
          />
          <div className="product-overlay">
            <span className="product-quick-add">
              Découvrir · ${price.toLocaleString('en-US')}
            </span>
          </div>
        </div>
        <div className="product-meta">
          <div className="product-name">{product.nombre}</div>
          <div className="product-price">
            $ {price.toLocaleString('en-US')} USD
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
