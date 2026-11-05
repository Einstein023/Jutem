import { useEffect, useState } from "react"
import Button from "./Button"

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMenu()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [menuOpen])

  return (
    <div className="nav-fixed">
      <header className="site-header">
        <div className="nav-container">
          <div className="logo">
            <a href="/" aria-label="JUTEM home">
              <span className="logo-text">
                <img src="logo.svg" alt="" />
                <span className="company-name">JUTEM CONSTRUCTION</span>
              </span>
            </a>
          </div>

          <nav
            id="primary-navigation"
            className={`nav-links${menuOpen ? " is-open" : ""}`}
            aria-label="Main navigation"
          >
            <a href="/about" onClick={closeMenu}>About</a>
            <a href="/services" onClick={closeMenu}>Services</a>
            <a href="/contact" onClick={closeMenu}>Contact</a>
            <div className="mobile-menu-cta">
              <Button />
            </div>
          </nav>

          <div className="nav-actions">
            <div className="desktop-menu-cta">
              <Button />
            </div>
            <button
              className={`menu-toggle${menuOpen ? " is-open" : ""}`}
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
              onClick={() => setMenuOpen((isOpen) => !isOpen)}
            >
              <span className="menu-toggle-bar" aria-hidden="true" />
              <span className="menu-toggle-bar" aria-hidden="true" />
              <span className="menu-toggle-bar" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
    </div>
  )
}