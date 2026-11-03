import { useEffect, useState } from "react"
import Button from "./Button"

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMenu()
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="logo">
        <a href="/" aria-label="JUTEM home">
        <span className="logo-text">
            <img src="logo.svg" alt="logo" />
            <span className="company-name">
            JUTEM CONSTRUCTION
            </span>
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
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
        </button>
      </div>
    </header>
  )
}