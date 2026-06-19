import Seal from "./Seal";

function Navbar({ cartCount = 0, onCartClick }) {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <Seal size={96} />
          <div>
            <div className="navbar__brand-title">MONARC</div>
            <div className="navbar__brand-subtitle">EST. 2026</div>
          </div>
        </div>

        <nav>
          <ul className="navbar__links">
            <li>
              <a className="navbar__link" href="/">HOME</a>
            </li>
            <li>
              <a className="navbar__link" href="/collections">COLLECTIONS</a>
            </li>
            <li>
              <a className="navbar__link" href="/manifesto">MANIFESTO</a>
            </li>
            <li>
              <a className="navbar__link" href="/contact">CONTACT</a>
            </li>
            <li>
              <a className="navbar__link" href="/admin">ADMIN</a>
            </li>
          </ul>
        </nav>

        <button className="button-pill" onClick={onCartClick}>
          CART ({cartCount})
        </button>
      </div>
    </header>
  );
}

export default Navbar;
