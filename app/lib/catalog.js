import catalogo from '~/data/catalogo.json';

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

export function findBySku(sku) {
  return getAllLocal().find((p) => p.sku === sku) || null;
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
