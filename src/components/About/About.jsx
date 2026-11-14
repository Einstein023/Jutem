import Footer from "../Footer/Footer"
import House3D from "./House3D"
import "./About.css"

/* ==========================================================================
   ABOUT PAGE  (/about)

   1. A construction photo with the same blue-dark overlay as the homepage hero.
      ABOUT is big at the bottom right, a short story sits at the top left.
      The letters rise in on load.
   2. Who we are, the Managing Director, a closing call to action, and the same footer as the homepage.

   The services (tabs 01 to 04) now live on the homepage, not here.
   ========================================================================== */

const ICONS = {
    arrow: ["M5 12h14", "m12 5 7 7-7 7"],
    down: ["M12 5v14", "m19 12-7 7-7-7"],
}

function Icon({ name, size = 16 }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {ICONS[name].map((d) => <path d={d} key={d} />)}
        </svg>
    )
}

/* Headline that rises in letter by letter. Each letter sits in a mask and slides up;
   the order comes from --i and the timing is set in the CSS. */
function RiseText({ text }) {
    let count = 0
    return (
        <>
            <span className="abs-sr">{text}</span>
            <span aria-hidden="true">
                {text.split("").map((letter) => {
                    const index = count++
                    return (
                        <span className="abs-mask" key={index}>
                            <span className="abs-letter" style={{ "--i": index }}>{letter}</span>
                        </span>
                    )
                })}
            </span>
        </>
    )
}

const values = [
    { title: "Purely Indigenous", text: "A wholly homegrown business built by Nigerians, for Nigeria." },
    { title: "Collaborative Culture", text: "A dedicated team that works together on every project." },
    { title: "Highest Standards", text: "Products and services delivered at edge-cutting standards." },
]

export default function About() {
    const scrollDown = () => {
        document.getElementById("who-we-are")?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div className="abs">
            <section className="abs-hero">
                <div className="abs-hero-first">
                    <div className="abs-story-top">
                        <span className="abs-rule" aria-hidden="true" />
                        <p>We are a homegrown team of young builders. We stay with you until it is done right.</p>
                    </div>
                    <h1 className="abs-title"><RiseText text="ABOUT" /></h1>
                </div>

                <button type="button" className="abs-scroll-cue" onClick={scrollDown} aria-label="Scroll to who we are">
                    Scroll <Icon name="down" size={14} />
                </button>
            </section>

            {/* The left text and the 3D house are both pinned on screen while you scroll through this
                section: the house builds, then keeps turning, then the page carries on. */}
            <section className="abs-story" id="who-we-are">
                <div className="abs-story-left">
                    <div className="abs-pin">
                        <div className="abs-story-text">
                            <p className="abs-eyebrow">About Jutem</p>
                            <h2>Who we are</h2>
                            <p className="abs-lead">
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
                    </div>
                </div>

                <House3D />
            </section>

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