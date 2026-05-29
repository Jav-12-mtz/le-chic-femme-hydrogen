import {Suspense, useEffect, useState} from 'react';
import {Await, Link, NavLink, useAsyncValue, useLocation} from 'react-router';
import {motion, AnimatePresence} from 'framer-motion';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

const NAV_ITEMS = [
  {to: '/shop', label: 'Boutique'},
  {to: '/shop/bolsos', label: 'Bags'},
  {to: '/shop/zapatos', label: 'Shoes'},
  {to: '/shop/joyas', label: 'Jewelry'},
  {to: '/shop/tops', label: 'Tops'},
  {to: '/conjuntos', label: 'Looks'},
];

const iconBase = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const SearchIcon = () => (
  <svg {...iconBase}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const UserIcon = () => (
  <svg {...iconBase}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const BagIcon = () => (
  <svg {...iconBase}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const {open} = useAside();
  const location = useLocation();
  const brand = header?.shop?.name || 'Le Chic Femme';

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className={`header ${scrolled || menuOpen ? 'scrolled' : ''}`}
        initial={{y: -100}}
        animate={{y: 0}}
        transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
      >
        <div className="header-inner">
          <Link to="/" className="logo" prefetch="intent">
            {brand}
          </Link>

          <nav className="nav-center" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                prefetch="intent"
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-right">
            <button
              className="icon-btn"
              aria-label="Search"
              onClick={() => open('search')}
            >
              <SearchIcon />
            </button>
            <Link to="/account" className="icon-btn" aria-label="Account" prefetch="intent">
              <Suspense fallback={<UserIcon />}>
                <Await resolve={isLoggedIn} errorElement={<UserIcon />}>
                  {() => <UserIcon />}
                </Await>
              </Suspense>
            </Link>
            <CartButton cart={cart} />
            <button
              className={`menu-btn ${menuOpen ? 'open' : ''}`}
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.4}}
            aria-label="Mobile navigation"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.to}
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.1 + i * 0.06}}
              >
                <NavLink
                  to={item.to}
                  end
                  prefetch="intent"
                  className={({isActive}) => (isActive ? 'active' : '')}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
            <div className="mobile-nav-foot">L&apos;art de la femme moderne</div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * HeaderMenu kept for backwards compatibility (PageLayout MobileMenuAside
 * still imports it). We render NAV_ITEMS instead of Shopify menu to keep
 * branded navigation everywhere.
 */
export function HeaderMenu() {
  const {close} = useAside();
  return (
    <nav className="header-menu-mobile" role="navigation">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          prefetch="intent"
          onClick={close}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function CartButton({cart}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
  return (
    <button
      className="icon-btn"
      aria-label={`Cart (${count} items)`}
      style={{position: 'relative'}}
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: typeof window !== 'undefined' ? window.location.href : '',
        });
      }}
    >
      <BagIcon />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            className="cart-badge"
            initial={{scale: 0}}
            animate={{scale: 1}}
            exit={{scale: 0}}
            transition={{type: 'spring', stiffness: 500, damping: 25}}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/**
 * @typedef {Object} HeaderProps
 * @property {Object} header
 * @property {Promise<any>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */
