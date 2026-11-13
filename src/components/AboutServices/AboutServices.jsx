import { useEffect, useRef, useState } from "react"
import "./AboutServices.css"

// PLACEHOLDER: the tab labels and the three "points" under each service are sample text.
// Replace them with Jutem's real details. The "intro" lines come from the old About page.
const services = [
    {
        id: "building",
        short: "Building",
        label: "Homes and offices",
        title: "Building Construction",
        intro: "Residential and commercial buildings, delivered from planning to completion.",
        video: "/slider-assets/Construction.mp4",
        points: ["Residential buildings", "Commercial buildings", "Project management"],
    },
    {
        id: "interior",
        short: "Interior",
        label: "Finishing work",
        title: "Interior Finishing",
        intro: "Quality finishing work that turns a structure into a space you can live and work in.",
        video: "/slider-assets/Interior-Finishing-Video.mp4",
        points: ["Floors, walls and ceilings", "Doors, windows and fittings", "Electrical and plumbing finishes"],
    },
    {
        id: "renovation",
        short: "Renovation",
        label: "Repairs and refits",
        title: "Maintenance & Renovation",
        intro: "Keeping existing buildings in shape and giving them a fresh new look.",
        video: "/slider-assets/Renovation-Video.mp4",
        points: ["Repairs and upkeep", "Full renovations", "Repainting and refurbishing"],
    },
    {
        id: "civil",
        short: "Civil Works",
        label: "Roads and drainage",
        title: "General Civil Works",
        intro: "Civil engineering works handled with professional care.",
        video: "/slider-assets/Civil.mp4",
        points: ["Roads and drainage", "Site preparation", "Fencing and external works"],
    },
]

const values = [
    { title: "Purely Indigenous", text: "A wholly homegrown business built by Nigerians, for Nigeria." },
    { title: "Collaborative Culture", text: "A dedicated team that works together on every project." },
    { title: "Highest Standards", text: "Products and services delivered at edge-cutting standards." },
]

const smallScreenQuery = "(max-width: 900px), (prefers-reduced-motion: reduce)"

export default function AboutServices() {
    const trackRef = useRef(null)
    const sceneRef = useRef(null)
    const panelRef = useRef(null)
    const videoRefs = useRef([])

    // Small screens and "reduce motion" get a plain stacked layout (no scroll animation).
    const [isStatic, setIsStatic] = useState(() => window.matchMedia(smallScreenQuery).matches)
    // 0 = full hero, 1 = hero is shrinking, 2 = shrunk and the tabs panel is showing.
    const [stage, setStage] = useState(0)
    // True while the tabs panel is on screen. Videos and the tab timer only run then.
    const [isReady, setIsReady] = useState(false)
    const [active, setActive] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    // index.css sets overflow-x: hidden on <body>, which stops position: sticky from working.
    // This page switches that off while it is on screen (see "body.abs-page" in the CSS).
    useEffect(() => {
        document.body.classList.add("abs-page")
        return () => document.body.classList.remove("abs-page")
    }, [])

    useEffect(() => {
        const query = window.matchMedia(smallScreenQuery)
        const update = () => setIsStatic(query.matches)
        query.addEventListener("change", update)
        return () => query.removeEventListener("change", update)
    }, [])

    // Scroll animation: turn the scroll position into a number from 0 to 1 (--p) that the CSS uses.
    useEffect(() => {
        const track = trackRef.current
        const scene = sceneRef.current
        const panel = panelRef.current

        if (isStatic) {
            const observer = new IntersectionObserver(([entry]) => setIsReady(entry.isIntersecting), { threshold: 0.3 })
            observer.observe(panel)
            return () => observer.disconnect()
        }

        let frame
        const update = () => {
            frame = undefined
            const rect = track.getBoundingClientRect()
            const distance = track.offsetHeight - window.innerHeight
            const p = Math.min(1, Math.max(0, -rect.top / distance))

            scene.style.setProperty("--p", p.toFixed(3))
            setStage(p > 0.9 ? 2 : p > 0.25 ? 1 : 0)
            setIsReady(p > 0.9 && rect.bottom > window.innerHeight * 0.3)
        }
        const onScroll = () => {
            if (frame === undefined) frame = requestAnimationFrame(update)
        }

        update()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        return () => {
            if (frame !== undefined) cancelAnimationFrame(frame)
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [isStatic])

    // The Services link in the nav goes to /services: jump straight to the tabs.
    useEffect(() => {
        if (window.location.pathname.replace(/\/+$/, "") !== "/services") return
        if (isStatic) {
            panelRef.current.scrollIntoView()
        } else {
            const track = trackRef.current
            const top = track.getBoundingClientRect().top + window.scrollY
            window.scrollTo(0, top + track.offsetHeight - window.innerHeight)
        }
    }, [])

    // Only the video of the open tab plays, and only while the panel is on screen.
    useEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        videoRefs.current.forEach((video, index) => {
            if (!video) return
            if (isReady && index === active && !reduceMotion) {
                video.play().catch(() => {})
            } else {
                video.pause()
            }
        })
    }, [active, isReady])

    const goToNextTab = (index) => {
        // The progress bar finishing is what moves to the next tab.
        if (index === active) setActive((index + 1) % services.length)
    }

    const current = services[active]

    return (
        <div className="abs">
            <div className={`abs-track${isStatic ? " abs-track--static" : ""}`} ref={trackRef}>
                <div
                    className={`abs-scene${isStatic ? "" : ` abs-scene--stage-${stage}`}`}
                    ref={sceneRef}
                >
                    <section className="abs-hero">
                        <div className="abs-hero-first">
                            <h1>A homegrown team, building across Nigeria.</h1>
                            <p>
                                Jutem Global Resources is made up of energetic young professionals
                                in the building and construction sector.
                            </p>
                            <a className="abs-button abs-button--orange" href="/contact">Make an enquiry</a>
                        </div>
                        <div className="abs-hero-second">
                            <h2>Four services. One dependable team.</h2>
                        </div>

                        {/* The card rises up from behind the grass when the page loads. */}
                        <div className="abs-card-wrap" aria-hidden="true">
                            <div className="abs-card">
                                <p className="abs-card-title">What we do</p>
                                <div className="abs-card-grid">
                                    {services.map((service) => (
                                        <div className="abs-card-tile" key={service.id}>
                                            <strong>{service.short}</strong>
                                            <span>{service.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* The grass sits in front of the card. Three hills, back to front. */}
                        <svg className="abs-grass" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
                            <defs>
                                <linearGradient id="abs-hill-back" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0" stopColor="#8fc266" />
                                    <stop offset="1" stopColor="#5f9a3c" />
                                </linearGradient>
                                <linearGradient id="abs-hill-mid" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0" stopColor="#5f9a3c" />
                                    <stop offset="1" stopColor="#3f7d2c" />
                                </linearGradient>
                                <linearGradient id="abs-hill-front" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0" stopColor="#3f7d2c" />
                                    <stop offset="1" stopColor="#245019" />
                                </linearGradient>
                            </defs>
                            <path fill="url(#abs-hill-back)" d="M0 120 C240 40 420 30 640 80 C860 130 1060 50 1260 60 C1360 66 1410 90 1440 100 L1440 260 L0 260 Z" />
                            <path fill="url(#abs-hill-mid)" d="M0 180 C260 110 520 100 760 140 C1000 180 1220 110 1440 140 L1440 260 L0 260 Z" />
                            <path fill="url(#abs-hill-front)" d="M0 225 C300 185 700 195 1000 215 C1200 228 1340 210 1440 200 L1440 260 L0 260 Z" />
                        </svg>
                    </section>

                    <div
                        className={`abs-panel${isReady ? " is-ready" : ""}${isPaused ? " is-paused" : ""}`}
                        ref={panelRef}
                    >
                        <div
                            className="abs-panel-text"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <div className="abs-tabs" role="tablist">
                                {services.map((service, index) => (
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={index === active}
                                        className={`abs-tab${index === active ? " is-active" : ""}`}
                                        onClick={() => setActive(index)}
                                        key={service.id}
                                    >
                                        <span className="abs-tab-title">{service.short}</span>
                                        <span className="abs-tab-label">{service.label}</span>
                                        <span className="abs-tab-bar" onAnimationEnd={() => goToNextTab(index)} />
                                    </button>
                                ))}
                            </div>

                            <div className="abs-detail" key={current.id} role="tabpanel">
                                <h2>{current.title}</h2>
                                <p>{current.intro}</p>
                                <ul className="abs-points">
                                    {current.points.map((point) => (
                                        <li key={point}>{point}</li>
                                    ))}
                                </ul>
                                <a className="abs-button abs-button--dark" href="/contact">Make an enquiry</a>
                            </div>
                        </div>

                        <div className="abs-panel-media">
                            {services.map((service, index) => (
                                <video
                                    className={`abs-video${index === active ? " is-active" : ""}`}
                                    ref={(el) => { videoRefs.current[index] = el }}
                                    src={service.video}
                                    aria-label={`${service.title} at work`}
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    key={service.id}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <section className="abs-story">
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
                </div>
                <div className="abs-values">
                    {values.map((value) => (
                        <div className="abs-value" key={value.title}>
                            <h3>{value.title}</h3>
                            <p>{value.text}</p>
                        </div>
                    ))}
                </div>
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
                    <a className="abs-button abs-button--orange" href="/contact">Make an enquiry</a>
                </div>
            </section>
        </div>
    )
}