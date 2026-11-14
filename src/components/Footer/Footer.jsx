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
                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="foot-bottom">
                    <a className="foot-brand" href="/" aria-label="Jutem home">
                        <img src="/logo.svg" alt="" width="28" height="28" />
                        <span>Jutem Global Resources</span>
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
