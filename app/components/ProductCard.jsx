import {motion} from 'framer-motion';
import {Link} from 'react-router';
import {imgUrl} from '~/lib/catalog';

export default function ProductCard({product, index = 0, badge}) {
  const handle = product.handle || product.sku;
  const imgSrc = product._fromShopify ? product.img : imgUrl(product.img);
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
