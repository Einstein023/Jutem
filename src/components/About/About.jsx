import Footer from "../Footer/Footer"
import BlockBuild from "./BlockBuild"
import "./About.css"

/* ==========================================================================
   ABOUT PAGE  (/about)
   ========================================================================== */



const values = [
    {
        title: "Purely Indigenous",
        text: "A proud, homegrown Nigerian enterprise built by local professionals, dedicated to delivering enduring spaces for Nigeria.",
    },
    {
        title: "Collaborative Culture",
        text: "A dedicated, multidisciplinary team collaborating closely on every build to eliminate friction and guesswork from start to finish.",
    },
    {
        title: "Highest Standards",
        text: "Rigorous engineering fidelity, premium materials, and edge-cutting structural craftsmanship delivered with absolute accountability on every site.",
    },
]

export default function About() {
    return (
        <>
            <main id="main-content" className="abs">
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
                {/* Row 1: Who we are intro and Block house aligned horizontally */}
                <div className="abs-story-main">
                    <div className="abs-story-intro">
                        <h2>Who we are</h2>
                        <p className="abs-story-p">
                            We are a purely indigenous company of young, enterprising professionals
                            in the building and construction industry, coming together to deliver
                            products and services at edge-cutting standards.
                        </p>
                        <p className="abs-story-p">
                            With our dedicated and collaborative corporate culture, we come together
                            to provide services and structures that meet the highest standards.
                        </p>
                    </div>

                    <div className="abs-story-visual">
                        <BlockBuild />
                    </div>
                </div>

                {/* Row 2: Values aligned horizontally across 3 columns without numbering */}
                <div className="abs-values">
                    {values.map((value) => (
                        <div className="abs-value" key={value.title}>
                            <div className="abs-value-body">
                                <h3>{value.title}</h3>
                                <p>{value.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 3: Managing Director */}
            <section className="abs-md">
                <img
                    className="abs-md-photo"
                    src="/image.png"
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
            {/* <section className="abs-closing">
                <div className="abs-closing-inner">
                    <div>
                        <h2>Have a project in mind?</h2>
                        <p>Talk to us and let's build something that lasts.</p>
                    </div>
                    <a className="abs-button" href="/contact">
                        Make an enquiry <Icon name="arrow" size={15} />
                    </a>
                </div>
            </section> */}

            </main>
            <Footer />
        </>
    )
}