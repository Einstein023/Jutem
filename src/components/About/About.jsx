import Footer from "../Footer/Footer"
import BlockBuild from "./BlockBuild"
import "./About.css"

/* ==========================================================================
   ABOUT PAGE  (/about)
   ========================================================================== */

const ICONS = {
    arrow: ["M5 12h14", "m12 5 7 7-7 7"],
}

function Icon({ name, size = 16 }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {ICONS[name].map((d) => <path d={d} key={d} />)}
        </svg>
    )
}

const values = [
    { title: "Purely Indigenous", text: "A wholly homegrown business built by Nigerians, for Nigeria." },
    { title: "Collaborative Culture", text: "A dedicated team that works together on every project." },
    { title: "Highest Standards", text: "Products and services delivered at edge-cutting standards." },
]

export default function About() {
    return (
        <div className="abs">
            {/* SECTION 1: Editorial Top Intro matching reference layout */}
            <section className="abs-hero" aria-label="About Jutem Global Resources">
                <div className="abs-hero-inner">
                    <h1 className="abs-hero-headline">
                        Solid Foundations.<br></br> Straightforward Service.
                    </h1>

                    <div className="abs-hero-divider" aria-hidden="true" />

                    <div className="abs-hero-grid">
                        <div className="abs-hero-label-col">
                            <span className="abs-tag">
                                <span className="abs-tag-bullet" aria-hidden="true" />
                                About us
                            </span>
                        </div>
                        <div className="abs-hero-text-col">
                            <p className="abs-hero-lead">
                                Through meticulous planning and hands-on execution, we collaborate closely to bring ideas and blueprints into reality. Every project reflects our commitment to creating spaces that are not only visually striking but structurally sound.
                            </p>
                            <p className="abs-hero-lead">
                                At Jutem, we don’t just build structures—we craft enduring spaces.
                            </p>
                        </div>
                    </div>

                    <div className="abs-hero-banner">
                        <img
                            className="abs-hero-banner-img"
                            src="/about/site-hero.webp"
                            alt="Jutem modern construction site"
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 2: Who we are & Values */}
            <section className="abs-story" id="who-we-are">
                <div className="abs-story-text">
                    <h2>Who we are</h2>
                    <p>
                        We are a purely indigenous company of young, enterprising professionals
                        in the building and construction industry, coming together to deliver
                        products and services at edge-cutting standards.
                    </p>
                    <p>
                        With our dedicated and collaborative corporate culture, we come together
                        to provide services and structures that meet the highest standards.
                    </p>

                    <div className="abs-values">
                        {values.map((value, index) => (
                            <div className="abs-value" key={value.title}>
                                <span className="abs-value-number">{String(index + 1).padStart(2, "0")}</span>
                                <div>
                                    <h3>{value.title}</h3>
                                    <p>{value.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <BlockBuild />
            </section>

            {/* SECTION 3: Managing Director */}
            <section className="abs-md">
                <img
                    className="abs-md-photo"
                    src="/md-julius-airhia.jpg"
                    alt="Engr Julius Airhia, Managing Director of Jutem Global Resources"
                />
                <div className="abs-md-text">
                    <p className="abs-md-role">Managing Director</p>
                    <h2>Engr Julius Airhia</h2>
                    <p>
                        Engr Julius Airhia is the MD of Jutem Global Resources. He holds a
                        Bachelor's degree (with honours) in Civil Engineering from Nnamdi
                        Azikiwe University and is a registered member of the Council for the
                        Regulation of Engineering Practice in Nigeria (COREN).
                    </p>
                    <p>
                        His active professional experience spans over 17 years in the
                        construction industry in Nigeria, and he has managed and overseen
                        construction projects in both the private and public sectors.
                    </p>
                </div>
            </section>

            {/* SECTION 4: Closing CTA */}
            <section className="abs-closing">
                <div className="abs-closing-inner">
                    <div>
                        <h2>Have a project in mind?</h2>
                        <p>Talk to us and let's build something that lasts.</p>
                    </div>
                    <a className="abs-button" href="/contact">
                        Make an enquiry <Icon name="arrow" size={15} />
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    )
}
