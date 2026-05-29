import {Link} from 'react-router';
import {motion} from 'framer-motion';
import HeroSlider from '~/components/HeroSlider';
import ProductCard from '~/components/ProductCard';
import LookCard from '~/components/LookCard';
import {catalogo, getFeatured, getConjuntos, imgUrl} from '~/lib/catalog';

export const meta = () => [
  {title: "Le Chic Femme — L'art de la femme moderne"},
];

export default function Index() {
  const destacados = getFeatured(8);
  const conjuntosTop = getConjuntos(4);

  return (
    <>
      <HeroSlider />

      {/* Manifesto */}
      <section className="section" style={{background: 'var(--c-cream)'}}>
        <div className="container">
          <div style={{maxWidth: 920, margin: '0 auto', textAlign: 'center'}}>
            <motion.div
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 1}}
            >
              <span className="section-eyebrow">Manifeste</span>
              <h2 className="section-title">
                <em>
                  &quot;L&apos;élégance est la seule beauté qui ne se fane
                  jamais.&quot;
                </em>
              </h2>
              <p
                style={{
                  marginTop: 24,
                  fontSize: 16,
                  color: 'var(--c-graphite)',
                  maxWidth: 640,
                  margin: '24px auto 0',
                }}
              >
                Le Chic Femme is born from an obsession with perfect pieces.
                Every bag, every watch, every top is chosen for its capacity
                to elevate the day — and the night — of whoever wears it.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Looks */}
      {conjuntosTop.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-eyebrow">Édition Limitée</div>
                <h2 className="section-title">Curated looks</h2>
              </div>
              <Link to="/conjuntos" className="section-link">
                See all looks
              </Link>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
              }}
            >
              {conjuntosTop.map((c, i) => (
                <LookCard key={c.id} conjunto={c} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="section" style={{background: 'var(--c-pearl)'}}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Sélection du moment</div>
              <h2 className="section-title">Most coveted</h2>
            </div>
            <Link to="/shop" className="section-link">
              Shop the boutique
            </Link>
          </div>
          <div className="product-grid">
            {destacados.map((p, i) => (
              <ProductCard
                key={p.sku}
                product={p}
                index={i}
                badge={i === 0 ? 'Nouveau' : null}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories cinematic */}
      <section
        className="section"
        style={{background: 'var(--c-ink)', color: 'var(--c-cream)'}}
      >
        <div className="container">
          <div className="section-head">
            <div>
              <div
                className="section-eyebrow"
                style={{color: 'var(--c-mist)'}}
              >
                Catégories
              </div>
              <h2 className="section-title">L&apos;univers</h2>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
            }}
          >
            {[
              {
                name: 'Bags',
                to: '/shop/bolsos',
                img: catalogo.productos.bolsos?.[10]?.img,
              },
              {
                name: 'Shoes',
                to: '/shop/zapatos',
                img: catalogo.productos.zapatos?.[5]?.img,
              },
              {
                name: 'Jewelry & Watches',
                to: '/shop/joyas',
                img: catalogo.productos.joyas_relojes?.[18]?.img,
              },
              {
                name: 'Tops',
                to: '/shop/tops',
                img: catalogo.productos.tops?.[0]?.img,
              },
            ].map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{opacity: 0, y: 40}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.8, delay: i * 0.1}}
              >
                <Link
                  to={cat.to}
                  className="look-card"
                  style={{aspectRatio: '3/4', display: 'block'}}
                >
                  {cat.img && (
                    <img
                      className="look-bg"
                      src={imgUrl(cat.img)}
                      alt={cat.name}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <div
                    className="look-content"
                    style={{justifyContent: 'flex-end'}}
                  >
                    <h3 className="look-title">{cat.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
