import {useNavigate, useParams} from 'react-router';
import {motion} from 'framer-motion';
import ProductCard from '~/components/ProductCard';
import {CATEGORIES, getBySlug} from '~/lib/catalog';

export const meta = ({params}) => {
  const slug = params.categoria || '';
  const cat = CATEGORIES.find((c) => c.slug === slug) || CATEGORIES[0];
  return [{title: `Le Chic Femme · ${cat.label}`}];
};

export default function Shop() {
  const {categoria} = useParams();
  const nav = useNavigate();
  const current =
    CATEGORIES.find((c) => c.slug === (categoria || '')) || CATEGORIES[0];
  const productos = getBySlug(current.slug);

  return (
    <main style={{paddingTop: 'calc(var(--header-h) + 80px)'}}>
      <div className="container">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
        >
          <div className="section-eyebrow">Boutique</div>
          <h1 className="section-title" style={{marginBottom: 32}}>
            {current.label}
          </h1>

          <div className="cat-chips">
            {CATEGORIES.map((c) => (
              <button
                key={c.slug || 'all'}
                className={`cat-chip ${
                  c.slug === (categoria || '') ? 'active' : ''
                }`}
                onClick={() => nav(c.slug ? `/shop/${c.slug}` : '/shop')}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div
            style={{
              paddingBottom: 24,
              marginBottom: 60,
              borderBottom: '1px solid rgba(11,11,11,0.08)',
              fontSize: 13,
              color: 'var(--c-smoke)',
            }}
          >
            {productos.length} pieces
          </div>
        </motion.div>

        <div className="product-grid">
          {productos.map((p, i) => (
            <ProductCard key={p.sku} product={p} index={i} />
          ))}
        </div>
      </div>
      <div style={{height: 120}} />
    </main>
  );
}
