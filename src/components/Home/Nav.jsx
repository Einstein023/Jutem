import { useEffect, useState } from "react"
import Button from "../Button"

export default function Nav() {
  // Drives the mobile menu and its open/close button state.
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return undefined

    const bodyOverflow = document.body.style.overflow
    const rootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = rootOverflow
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return undefined

    // Let keyboard users dismiss the open menu with Escape.
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMenu()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [menuOpen])

  // The wrapper positions the header over the hero.
  return (
    <div className="nav-fixed">
      <header className={`site-header${menuOpen ? " is-menu-open" : ""}`}>
        <div className="nav-container">
          {/* Brand stays at the start of the desktop navigation row. */}
          <div className="logo">
            <a href="/" aria-label="JUTEM home">
              <span className="logo-text">
                <img src="logo.svg" alt="" />
                <span className="company-name">JUTEM CONSTRUCTION</span>
              </span>
            </a>
          </div>

          {/* The same links become a full-screen menu on smaller screens. */}
          <nav
            id="primary-navigation"
            className={`nav-links${menuOpen ? " is-open" : ""}`}
            aria-label="Main navigation"
          >
            <a href="/about" onClick={closeMenu}>About</a>
            <a href="/services" onClick={closeMenu}>Services</a>
            <a href="/contact" onClick={closeMenu}>Contact Us</a>
          </nav>

          {/* Desktop CTA and mobile menu toggle share the right-hand area. */}
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