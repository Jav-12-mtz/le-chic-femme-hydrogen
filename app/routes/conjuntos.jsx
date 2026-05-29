import {motion} from 'framer-motion';
import LookCard from '~/components/LookCard';
import {getConjuntos} from '~/lib/catalog';

export const meta = () => [
  {title: 'Curated looks · Le Chic Femme'},
];

export default function Conjuntos() {
  const conjuntos = getConjuntos();

  return (
    <main style={{paddingTop: 'calc(var(--header-h) + 80px)'}}>
      <div className="container">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
          style={{textAlign: 'center', marginBottom: 80}}
        >
          <div className="section-eyebrow">Édition Limitée 2026</div>
          <h1 className="section-title">Curated looks</h1>
          <p
            style={{
              maxWidth: 580,
              margin: '24px auto 0',
              color: 'var(--c-graphite)',
            }}
          >
            Ten complete looks, conceived as works of art. Each one brings
            together pieces that converse with one another — from the bag to
            the shoe, from the watch to the earring.
          </p>
        </motion.div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28,
          }}
        >
          {conjuntos.map((c, i) => (
            <LookCard key={c.id} conjunto={c} index={i} />
          ))}
        </div>
      </div>
      <div style={{height: 160}} />
    </main>
  );
}
