export default function Marquee() {
  const items = [
    "Complimentary shipping on orders over $3,000",
    "Nouvelle collection · Couture 2026",
    "Le Chic Femme · L'art de la femme moderne",
    "Free returns within 30 days",
    "Complimentary gift wrap",
  ]
  const loop = [...items, ...items, ...items]
  return (
    <div className="marquee">
      <div className="marquee-track">
        {loop.map((t, i) => (<span key={i} className="marquee-item">{t}</span>))}
      </div>
    </div>
  )
}
