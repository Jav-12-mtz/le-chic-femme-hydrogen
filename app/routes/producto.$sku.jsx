import {Link, useLoaderData} from 'react-router';
import {motion} from 'framer-motion';
import {Money} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {findBySku, imgUrl} from '~/lib/catalog';

export const meta = ({data}) => [
  {
    title: data?.product
      ? `${data.product.title || data.product.nombre} · Le Chic Femme`
      : 'Le Chic Femme',
  },
];

const PRODUCT_BY_HANDLE_QUERY = `#graphql
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      featuredImage { url altText width height }
      tags
      productType
      variants(first: 1) {
        nodes {
          id
          availableForSale
          sku
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
        }
      }
    }
  }
`;

export async function loader({params, context}) {
  const param = params.sku;

  // The URL param may be either a SKU ("B01") or a Shopify handle
  // ("b01-voyageur-meraude"). findBySku now accepts both.
  const local = findBySku(param);
  // Prefer the local catalog's Shopify handle; otherwise treat the URL
  // param itself as a handle (covers products that exist only in Shopify).
  const handle = local?.handle || param?.toLowerCase();

  let shopifyProduct = null;
  if (handle) {
    try {
      const data = await context.storefront.query(PRODUCT_BY_HANDLE_QUERY, {
        variables: {handle},
      });
      shopifyProduct = data?.product || null;
    } catch (e) {
      console.error('Shopify product lookup failed', e);
    }
  }

  if (shopifyProduct) {
    return {product: shopifyProduct, source: 'shopify', local};
  }

  if (!local) {
    throw new Response('Piece not found', {status: 404});
  }
  return {product: local, source: 'local', local};
}

const Icon = ({d}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
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

export default function ProductDetail() {
  const {product, source, local} = useLoaderData();
  const isShopify = source === 'shopify';

  const title = isShopify ? product.title : product.nombre;
  const sku = isShopify ? product.variants?.nodes?.[0]?.sku : product.sku;
  // Prefer local (curated) image to keep the boutique aesthetic — Shopify
  // images often have white studio backgrounds, the catalog ones are editorial.
  const imgSrc = local?.img
    ? imgUrl(local.img)
    : isShopify
      ? product.featuredImage?.url
      : imgUrl(product.img);
  const description = isShopify ? product.descriptionHtml : null;
  const descriptionText = !isShopify ? product.descripcion : null;
  const tags = isShopify ? product.tags : product.tags;
  const variant = isShopify ? product.variants?.nodes?.[0] : null;
  const localPrice = !isShopify ? Number(product.precio || 0) : null;

  return (
    <main
      className="container"
      style={{paddingTop: 'calc(var(--header-h) + 60px)'}}
    >
      <div className="pd-grid">
        <motion.div
          initial={{opacity: 0, scale: 1.02}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 1, ease: [0.16, 1, 0.3, 1]}}
        >
          <div className="pd-img">
            <img
              src={imgSrc}
              alt={title}
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </div>
        </motion.div>

        <motion.div
          className="pd-info"
          initial={{opacity: 0, y: 40}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.9, delay: 0.2}}
        >
          <div className="pd-cat">{sku} · Édition Couture</div>
          <h1 className="pd-name">{title}</h1>

          <div className="pd-price">
            {variant ? (
              <Money data={variant.price} />
            ) : (
              <>$ {localPrice?.toLocaleString('en-US')} USD</>
            )}
          </div>

          {description ? (
            <div
              className="pd-desc"
              dangerouslySetInnerHTML={{__html: description}}
            />
          ) : (
            <p className="pd-desc">
              {descriptionText ||
                'A piece selected by the Maison Le Chic Femme. Rigorous curation, noble materials, timeless elegance.'}
            </p>
          )}

          <div className="pd-actions">
            {variant ? (
              <AddToCartButton
                className="btn-primary"
                style={{flex: 1}}
                disabled={!variant.availableForSale}
                lines={[{merchandiseId: variant.id, quantity: 1}]}
              >
                {variant.availableForSale ? 'Add to bag' : 'Sold out'}
              </AddToCartButton>
            ) : (
              <button className="btn-primary" style={{flex: 1}} disabled>
                Available once published in Shopify
              </button>
            )}
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

          {tags?.length > 0 && (
            <div
              style={{
                marginTop: 24,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {tags.map((t) => (
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
