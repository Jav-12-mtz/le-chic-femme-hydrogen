import {Suspense} from 'react';
import {Await, Link, NavLink} from 'react-router';

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const Instagram = (props) => (
  <svg {...iconProps} {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const Facebook = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const Youtube = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.35z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);
const Send = (props) => (
  <svg {...iconProps} width={16} height={16} {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense fallback={<FooterShell />}>
      <Await resolve={footerPromise} errorElement={<FooterShell />}>
        {(footer) => (
          <FooterShell
            shopifyMenu={footer?.menu}
            primaryDomainUrl={header?.shop?.primaryDomain?.url}
            publicStoreDomain={publicStoreDomain}
          />
        )}
      </Await>
    </Suspense>
  );
}

function FooterShell({shopifyMenu, primaryDomainUrl, publicStoreDomain}) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Le Chic Femme</div>
            <p className="footer-tag">
              L&apos;art de la femme moderne. A curation of singular pieces in
              bags, tops, jewelry, watches and shoes of luxury.
            </p>
            <form
              className="newsletter"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Merci !');
              }}
            >
              <input
                type="email"
                placeholder="Your email for early access"
                required
              />
              <button type="submit" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </form>
          </div>

          <div>
            <h4>Boutique</h4>
            {shopifyMenu?.items?.length ? (
              <ShopifyMenuList
                menu={shopifyMenu}
                primaryDomainUrl={primaryDomainUrl}
                publicStoreDomain={publicStoreDomain}
              />
            ) : (
              <ul>
                <li><Link to="/collections">All the collection</Link></li>
                <li><Link to="/collections/bolsos">Bags</Link></li>
                <li><Link to="/collections/joyas">Jewelry &amp; Watches</Link></li>
                <li><Link to="/collections/zapatos">Shoes</Link></li>
                <li><Link to="/collections/tops">Tops</Link></li>
              </ul>
            )}
          </div>

          <div>
            <h4>Maison</h4>
            <ul>
              <li><Link to="/pages/historia">Notre histoire</Link></li>
              <li><Link to="/pages/contacto">Contact</Link></li>
              <li><Link to="/pages/tiendas">Boutiques</Link></li>
              <li><Link to="/pages/atelier">Atelier privé</Link></li>
            </ul>
          </div>

          <div>
            <h4>Client Service</h4>
            <ul>
              <li><Link to="/policies/shipping-policy">Shipping</Link></li>
              <li><Link to="/policies/refund-policy">Returns</Link></li>
              <li><Link to="/pages/cuidados">Garment care</Link></li>
              <li><Link to="/pages/faq">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Le Chic Femme · Tous droits réservés
          </div>
          <div className="socials">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ShopifyMenuList({menu, primaryDomainUrl, publicStoreDomain}) {
  return (
    <ul>
      {menu.items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          (publicStoreDomain && item.url.includes(publicStoreDomain)) ||
          (primaryDomainUrl && item.url.includes(primaryDomainUrl))
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return (
          <li key={item.id}>
            {isExternal ? (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            ) : (
              <NavLink to={url} prefetch="intent" end>
                {item.title}
              </NavLink>
            )}
          </li>
        );
      })}
    </ul>
  );
}
