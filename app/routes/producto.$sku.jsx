import {Link, useLoaderData} from 'react-router';
import {motion} from 'framer-motion';
import {findBySku} from '~/lib/catalog';

export const meta = ({data}) => [
  {title: data?.product ? `${data.product.nombre} · Le Chic Femme` : 'Le Chic Femme'},
];

export async function loader({params}) {
  const product = findBySku(params.sku);
  if (!product) {
    throw new Response('Piece not found', {status: 404});
  }
  return {product};
}

const Icon = ({d, ...props}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d={d} />
  </svg>
);
const TruckIcon = () => (
  <Icon d="M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
);
const RotateIcon = () => (
  <Icon d="M1 4v6h6M23 20v-6h-6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
);
const ShieldIcon = () => (
  <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
);

export default function Product() {
  const {product} = useLoaderData();
  const imgSrc = product._fromShopify
    ? product.img
    : `/images/${product.img}`;
  const price = Number(product.precio || 0);

  return (
    <main className="container" style={{paddingTop: 'calc(var(--header-h) + 60px)'}}>
      <div className="pd-grid">
        <motion.div
          initial={{opacity: 0, scale: 1.02}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 1, ease: [0.16, 1, 0.3, 1]}}
        >
          <div className="pd-img">
            <img src={imgSrc} alt={product.nombre} />
          </div>
        </motion.div>
        <motion.div
          className="pd-info"
          initial={{opacity: 0, y: 40}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.9, delay: 0.2}}
        >
          <div className="pd-cat">{product.sku} · Édition Couture</div>
          <h1 className="pd-name">{product.nombre}</h1>
          <div className="pd-price">$ {price.toLocaleString('en-US')} USD</div>
          <p className="pd-desc">
            {product.descripcion ||
              'A piece selected by the Maison Le Chic Femme. Rigorous curation, noble materials, timeless elegance.'}
          </p>

          <div className="pd-actions">
            <button className="btn-primary" style={{flex: 1}} disabled>
              Add to bag — coming soon
            </button>
          </div>

          <div className="pd-meta">
            <div
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <TruckIcon /> Complimentary shipping across Mexico · 2-4 days
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <RotateIcon /> Free returns within 30 days
            </div>
            <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
              <ShieldIcon /> Authentic piece with certificate
            </div>
          </div>

          {product.tags?.length > 0 && (
            <div
              style={{
                marginTop: 24,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {product.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '6px 12px',
                    border: '1px solid rgba(11,11,11,0.2)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div style={{marginTop: 40}}>
            <Link
              to="/shop"
              style={{
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                borderBottom: '1px solid currentColor',
                paddingBottom: 4,
              }}
            >
              ← Continuer la sélection
            </Link>
          </div>
        </motion.div>
      </div>
      <div style={{height: 160}} />
    </main>
  );
}
