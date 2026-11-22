import "./footer.css"

/* ==========================================================================
   FOOTER (home page)

   Dark blue, same family as the rest of the site. Links go to the real pages.
   PLACEHOLDER: no phone number or office address is listed yet. When you have them,
   add them in the "Visit / call" column below, the layout will take them.
   ========================================================================== */

const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/#services" },
    { label: "Contact", href: "/contact" },
]

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="foot">
            <div className="foot-inner">
                <div className="foot-top">
                    <p className="foot-statement">
                        Solid foundations.<br />Straightforward service.
                    </p>

                    <div className="foot-columns">
                        <nav aria-label="Footer">
                            <h2>Pages</h2>
                            <ul>
                                {links.map((link) => (
                                    <li key={link.label}><a href={link.href}>{link.label}</a></li>
                                ))}
                            </ul>
                        </nav>

                        <div>
                            <h2>Let's talk</h2>
                            <a className="foot-button" href="/contact">
                                Make an enquiry
                                <div className="foot-btn-arrow-wrapper" aria-hidden="true">
                                    <div className="foot-btn-arrow" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="foot-bottom">
                <a className="foot-brand" href="/" aria-label="Jutem home">
                        <img src="/logo.svg" alt="JUTEM Global Resources Logo" width="25" height="25" />
                        <span>Jutem</span>
                    </a>
                    <p>© {year} Jutem Global Resources. All rights reserved.</p>
                    <a className="foot-top-link" href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }}>
                        Back to top
                    </a>
                </div>
            </div>
        </footer>
    )
}
