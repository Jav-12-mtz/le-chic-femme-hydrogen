import {useEffect, useRef, useState} from 'react';
import {useFetchers} from 'react-router';
import {AnimatePresence, motion} from 'framer-motion';
import {CartForm} from '@shopify/hydrogen';

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * Listens to every cart LinesAdd submission and shows an elegant
 * confirmation chip that fades out after a short delay.
 */
export default function CartToast() {
  const fetchers = useFetchers();
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);
  const lastSeen = useRef(null);

  useEffect(() => {
    const addFetcher = fetchers.find((f) => {
      if (!f.formData) return false;
      const cartFormInput = f.formData.get('cartFormInput');
      if (!cartFormInput) return false;
      try {
        const parsed = JSON.parse(cartFormInput);
        return parsed?.action === CartForm.ACTIONS.LinesAdd;
      } catch {
        return false;
      }
    });
    if (!addFetcher) return;

    // Trigger only on transition into "loading" (request just sent),
    // and once per fetcher key.
    if (addFetcher.state === 'loading' && lastSeen.current !== addFetcher.key) {
      lastSeen.current = addFetcher.key;
      setVisible(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), 2400);
    }
  }, [fetchers]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cart-toast"
          initial={{opacity: 0, y: 24, scale: 0.96}}
          animate={{opacity: 1, y: 0, scale: 1}}
          exit={{opacity: 0, y: 12, scale: 0.98}}
          transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
          role="status"
          aria-live="polite"
        >
          <span className="cart-toast-icon">
            <CheckIcon />
          </span>
          <span className="cart-toast-text">
            <span className="cart-toast-eyebrow">Maison Le Chic Femme</span>
            <span className="cart-toast-title">Added to your bag</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
