import catalogo from '~/data/catalogo.json';

/**
 * Returns the optimized image URL for a catalog item.
 * Catalog stores paths like "01_bolsos/B01_Foo.jpg" — we serve the
 * pre-converted WebP variant from /images-webp/.
 */
export function imgUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `/images-webp/${path.replace(/\.(jpe?g|png)$/i, '.webp')}`;
}

export const CATEGORIES = [
  {slug: '', key: 'all', label: 'All'},
  {slug: 'bolsos', key: 'bolsos', label: 'Bags'},
  {slug: 'zapatos', key: 'zapatos', label: 'Shoes'},
  {slug: 'joyas', key: 'joyas_relojes', label: 'Jewelry & Watches'},
  {slug: 'tops', key: 'tops', label: 'Tops'},
];

export function getAllLocal() {
  const p = catalogo.productos;
  return [
    ...(p.bolsos || []),
    ...(p.zapatos || []),
    ...(p.joyas_relojes || []),
    ...(p.tops || []),
  ];
}

export function getBySlug(slug) {
  if (!slug) return getAllLocal();
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat || cat.key === 'all') return getAllLocal();
  return catalogo.productos[cat.key] || [];
}

export function findBySku(skuOrHandle) {
  if (!skuOrHandle) return null;
  const needle = String(skuOrHandle).toLowerCase();
  return (
    getAllLocal().find(
      (p) =>
        p.sku?.toLowerCase() === needle ||
        p.handle?.toLowerCase() === needle,
    ) || null
  );
}

export function getFeatured(count = 8) {
  const p = catalogo.productos;
  return [
    ...(p.bolsos || []).slice(0, 2),
    ...(p.zapatos || []).slice(0, 2),
    ...(p.joyas_relojes || []).slice(18, 20),
    ...(p.tops || []).slice(0, 2),
  ].slice(0, count);
}

export function getConjuntos(limit) {
  const c = catalogo.conjuntos || [];
  return typeof limit === 'number' ? c.slice(0, limit) : c;
}

export function findConjunto(id) {
  return (catalogo.conjuntos || []).find((c) => String(c.id) === String(id)) || null;
}

export {catalogo};
