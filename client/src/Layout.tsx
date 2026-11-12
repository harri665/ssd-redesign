import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Icon from './Icon.tsx'
import MainNav from './MainNav.tsx'
import { EMAIL, HOME, JOIN, MAP, SEARCH, SOCIAL, SSD } from './links.ts'
import './styles.css'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const { pathname } = useLocation()

  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setMenuOpen(false)
    setSearchOpen(false)
  }

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  return (
    <div className="ssd">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="notice">
          <div className="wrap">
            <p>
              This is my student redesign of the Solid State Depot website for ATLS CSCI 3150 and it is not the
              official site. Pages I didn&apos;t rebuild link to the <a href={SSD}>real SSD website</a>.
            </p>
          </div>
        </div>

        <div className="top-bar">
          <div className="wrap">
            <ul className="social" aria-label="Social media">
              {SOCIAL.map((s) => (
                <li key={s.icon}>
                  <a href={s.href}>
                    <Icon name={s.icon} size={16} />
                    <span className="visually-hidden">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            <address className="contact">
              <a href={MAP}>
                <Icon name="send" size={16} />
                5765 Arapahoe Ave Unit B, Boulder CO
              </a>
              <a href={`mailto:${EMAIL}`}>
                <Icon name="mail" size={16} />
                {EMAIL}
              </a>
            </address>
          </div>
        </div>

        <div className="header-main">
          <div className="wrap">
            <div className="brand">
              <Link className="logo" to={HOME}>
                <img src="/ssd-img/logo-long.png" width="202" height="51" alt="Solid State Depot home" />
              </Link>
              <p className="site-description">A Boulder, Colorado Makerspace</p>
            </div>

            <MainNav open={menuOpen} onClose={() => setMenuOpen(false)} />

            <div className="header-actions">
              <button
                type="button"
                className="round-button"
                aria-expanded={searchOpen}
                aria-controls="site-search"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Icon name={searchOpen ? 'close' : 'search'} size={18} />
                <span className="visually-hidden">Search</span>
              </button>
              <Link className="join-button" to={JOIN}>
                <Icon name="send" size={16} />
                Join
                <span className="join-arrow" aria-hidden="true">
                  <Icon name="chevronRight" size={16} />
                </span>
              </Link>
              <button
                type="button"
                className="round-button menu-toggle"
                aria-expanded={menuOpen}
                aria-controls="main-menu"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
                <span className="visually-hidden">Menu</span>
              </button>
            </div>
          </div>

          <div className="search-panel" id="site-search" hidden={!searchOpen}>
            <div className="wrap">
              <form role="search" action={SEARCH} method="get" aria-label="Search the SSD website">
                <label htmlFor="search-input">Search the SSD website</label>
                <div className="search-row">
                  <input
                    ref={searchRef}
                    id="search-input"
                    type="search"
                    name="s"
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') setSearchOpen(false)
                    }}
                  />
                  <button type="submit" className="pill-button">
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <p className="join-today">
            <Link to={JOIN}>Join Today!</Link>
          </p>
          <p className="copyright">Copyright &copy; 2026 Solid State Depot</p>
        </div>
      </footer>
    </div>
  )
}
