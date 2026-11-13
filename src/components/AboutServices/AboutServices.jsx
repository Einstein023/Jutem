import { useEffect, useRef, useState } from "react"
import "./AboutServices.css"

/* ==========================================================================
   ABOUT + SERVICES PAGE  (/about and /services)

   What happens on this page, in the order you see it:
   1. A rounded hero card with a sky, drifting clouds, grass and a project
      board that rises up from behind the grass.
   2. Scroll: the hero shrinks into a band at the top and its headline swaps.
   3. A split panel opens underneath: tabs + text on the left, a service video
      with floating "UI cards" on the right. The tabs auto-advance every 7s.
   4. Who we are, the Managing Director, and a closing call to action.

   PLACEHOLDER: the tab labels, the three "points" for each service and the
   text inside the floating cards are sample wording. Replace them with
   Jutem's real details. The floating cards are illustrations, not live data.
   ========================================================================== */

/* ---------- Small icon set (24x24 outline icons, no extra library needed) ---------- */

const ICONS = {
    check: ["M20 6 9 17l-5-5"],
    building: ["M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", "M10 6h4", "M10 10h4", "M10 14h4", "M10 18h4"],
    layers: ["m12 2 10 5-10 5L2 7l10-5Z", "m2 17 10 5 10-5", "m2 12 10 5 10-5"],
    wrench: ["M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"],
    route: ["M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", "M18 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z", "M12 19h4.5a3.5 3.5 0 0 0 0-7h-8a3.5 3.5 0 0 1 0-7H12"],
    floor: ["M3 3h18v18H3Z", "M3 12h18", "M12 3v9", "M7.5 12v9", "M16.5 12v9"],
    wall: ["M3 3h18v18H3Z", "M3 9h18", "M3 15h18", "M9 9v6", "M15 3v6", "M15 15v6"],
    door: ["M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14", "M2 20h20", "M14 12v.01"],
    window: ["M3 3h18v18H3Z", "M12 3v18", "M3 12h18"],
    zap: ["M13 2 3 14h9l-1 8 10-12h-9l1-8Z"],
    drop: ["M12 2.7s6 6.1 6 10.3a6 6 0 0 1-12 0c0-4.2 6-10.3 6-10.3Z"],
    roller: ["M4 2h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z", "M20 5h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-8a1 1 0 0 0-1 1v2", "M10 14h3v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1Z"],
    arrow: ["M7 17 17 7", "M8 7h9v9"],
}

function Icon({ name, size = 16 }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {ICONS[name].map((d) => <path d={d} key={d} />)}
        </svg>
    )
}

/* ---------- Floating cards on the right-hand side of each tab ---------- */
// Each one is an illustration, like the little app windows in the reference video.

function StagesCard() {
    const stages = [
        { name: "Planning", value: 100 },
        { name: "Foundation", value: 100 },
        { name: "Structure", value: 72 },
        { name: "Roofing", value: 28 },
    ]
    return (
        <>
            <div className="abs-pop abs-mock-card" style={{ "--i": 0 }}>
                <div className="abs-mock-head">
                    <span className="abs-mock-icon"><Icon name="building" /></span>
                    <span><strong>Project stages</strong><small>Sample project</small></span>
                </div>
                <ul className="abs-stages">
                    {stages.map((stage) => (
                        <li key={stage.name}>
                            <span>{stage.name}</span>
                            <span className="abs-bar"><i style={{ "--w": `${stage.value}%` }} /></span>
                            <b>{stage.value}%</b>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="abs-pop abs-chip abs-chip--right" style={{ "--i": 3 }}>
                <span className="abs-dot" /> Handover ready
            </div>
        </>
    )
}

function GridCard() {
    const tiles = [
        ["floor", "Floors", "Surfaces"],
        ["wall", "Walls", "Surfaces"],
        ["layers", "Ceilings", "Surfaces"],
        ["door", "Doors", "Openings"],
        ["window", "Windows", "Openings"],
        ["wrench", "Fittings", "Fixtures"],
    ]
    return (
        <>
            <div className="abs-mock-grid">
                {tiles.map(([icon, name, group], index) => (
                    <div className="abs-pop abs-tile" style={{ "--i": index }} key={name}>
                        <span className="abs-mock-icon"><Icon name={icon} /></span>
                        <span><strong>{name}</strong><small>{group}</small></span>
                    </div>
                ))}
            </div>
            <div className="abs-pop abs-pill-row" style={{ "--i": 6 }}>
                <span title="Electrical"><Icon name="zap" size={15} /></span>
                <span title="Plumbing"><Icon name="drop" size={15} /></span>
                <span title="Painting"><Icon name="roller" size={15} /></span>
            </div>
        </>
    )
}

function ChatCard() {
    return (
        <>
            <div className="abs-pop abs-mock-card" style={{ "--i": 0 }}>
                <div className="abs-mock-head">
                    <span className="abs-mock-icon"><Icon name="wrench" /></span>
                    <span><strong>Renovation request</strong><small>Sample enquiry</small></span>
                </div>
                <div className="abs-msg">
                    <span className="abs-avatar">C</span>
                    <div>
                        <strong>Client</strong>
                        <p>The roof leaks and the paint is peeling. Can you help?</p>
                    </div>
                </div>
                <div className="abs-msg abs-msg--reply">
                    <div>
                        <span className="abs-status"><Icon name="check" size={12} /> Inspection booked</span>
                        <p>We will repair, repaint and update you after every stage.</p>
                    </div>
                </div>
            </div>
            <div className="abs-pop abs-chip abs-chip--left" style={{ "--i": 3 }}>
                <span className="abs-dot" /> Repairs in progress
            </div>
        </>
    )
}

function ChecklistCard() {
    const rows = [
        ["Roads and drainage", "Done"],
        ["Site preparation", "Done"],
        ["Fencing and external works", "In progress"],
    ]
    return (
        <>
            <div className="abs-pop abs-mock-card" style={{ "--i": 0 }}>
                <div className="abs-mock-head">
                    <span className="abs-mock-icon"><Icon name="route" /></span>
                    <span><strong>Site works</strong><small>Sample checklist</small></span>
                </div>
                <ul className="abs-checks">
                    {rows.map(([label, status], index) => (
                        <li className="abs-pop" style={{ "--i": index + 1 }} key={label}>
                            <span className={`abs-check${status === "Done" ? " is-done" : ""}`}>
                                {status === "Done" && <Icon name="check" size={12} />}
                            </span>
                            <span>{label}</span>
                            <em>{status}</em>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="abs-pop abs-chip abs-chip--right" style={{ "--i": 4 }}>
                <span className="abs-dot" /> Drainage cleared
            </div>
        </>
    )
}

/* ---------- The four services ---------- */

const services = [
    {
        id: "building",
        short: "Building",
        label: "Homes and offices",
        title: "Building Construction",
        intro: "Residential and commercial buildings, delivered from planning to completion.",
        video: "/slider-assets/Construction.mp4",
        points: ["Residential buildings", "Commercial buildings", "Project management"],
        Mock: StagesCard,
    },
    {
        id: "interior",
        short: "Interior",
        label: "Finishing work",
        title: "Interior Finishing",
        intro: "Quality finishing work that turns a structure into a space you can live and work in.",
        video: "/slider-assets/Interior-Finishing-Video.mp4",
        points: ["Floors, walls and ceilings", "Doors, windows and fittings", "Electrical and plumbing finishes"],
        Mock: GridCard,
    },
    {
        id: "renovation",
        short: "Renovation",
        label: "Repairs and refits",
        title: "Maintenance & Renovation",
        intro: "Keeping existing buildings in shape and giving them a fresh new look.",
        video: "/slider-assets/Renovation-Video.mp4",
        points: ["Repairs and upkeep", "Full renovations", "Repainting and refurbishing"],
        Mock: ChatCard,
    },
    {
        id: "civil",
        short: "Civil Works",
        label: "Roads and drainage",
        title: "General Civil Works",
        intro: "Civil engineering works handled with professional care.",
        video: "/slider-assets/Civil.mp4",
        points: ["Roads and drainage", "Site preparation", "Fencing and external works"],
        Mock: ChecklistCard,
    },
]

const values = [
    { title: "Purely Indigenous", text: "A wholly homegrown business built by Nigerians, for Nigeria." },
    { title: "Collaborative Culture", text: "A dedicated team that works together on every project." },
    { title: "Highest Standards", text: "Products and services delivered at edge-cutting standards." },
]

/* ---------- Hero project board (the card that rises from behind the grass) ---------- */

function ProjectBoard() {
    const stats = [
        ["17+", "Years of experience"],
        ["4", "Core services"],
        ["COREN", "Registered lead"],
    ]
    const rail = ["building", "layers", "wrench", "route"]
    const stages = [
        ["Planning", 100],
        ["Foundation", 100],
        ["Structure", 72],
        ["Finishing", 35],
    ]
    return (
        <div className="abs-board">
            <div className="abs-board-top">
                <span className="abs-board-user">
                    <span className="abs-board-logo">J</span>
                    <span><strong>Jutem Global</strong><small>Project board</small></span>
                </span>
                <span className="abs-board-title">Board: <b>Projects</b></span>
            </div>
            <div className="abs-board-body">
                <div className="abs-board-stats">
                    {stats.map(([value, label]) => (
                        <div key={label}><b>{value}</b><small>{label}</small></div>
                    ))}
                </div>
                <div className="abs-board-rail">
                    {rail.map((icon) => <span key={icon}><Icon name={icon} size={15} /></span>)}
                </div>
                <div className="abs-board-thread">
                    <strong>Sample project</strong>
                    {stages.map(([name, value]) => (
                        <div className="abs-board-row" key={name}>
                            <span>{name}</span>
                            <span className="abs-bar"><i style={{ "--w": `${value}%` }} /></span>
                        </div>
                    ))}
                    <span className="abs-status"><Icon name="check" size={12} /> On schedule</span>
                </div>
            </div>
        </div>
    )
}

/* ---------- Grass ----------
   Drawn once as SVG: three hills, each topped with hundreds of tiny blades.
   A seeded random number generator makes the blades the same on every visit. */

function seededRandom(seed) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

const GRASS_W = 1440
const GRASS_H = 260

const hillDefs = [
    { id: "back", y: (x) => 112 - 34 * Math.sin(x / 230 + 0.6) - 16 * Math.sin(x / 97 + 2), top: "#9bd070", bottom: "#62a03e", blades: ["#b4e083", "#86bb57", "#6fa646"], count: 300, height: [12, 30] },
    { id: "mid", y: (x) => 166 - 26 * Math.sin(x / 310 + 2.1) - 10 * Math.sin(x / 71), top: "#6aa843", bottom: "#438130", blades: ["#8cc45d", "#5f9a3c", "#4a8734"], count: 320, height: [12, 32] },
    { id: "front", y: (x) => 214 - 14 * Math.sin(x / 400 + 4) - 7 * Math.sin(x / 53), top: "#44842f", bottom: "#245019", blades: ["#5fa043", "#3f7d2c", "#2f6a22"], count: 360, height: [14, 36] },
]

const grassLayers = hillDefs.map((hill, layer) => {
    const random = seededRandom(layer * 977 + 13)
    let hillPath = `M0 ${GRASS_H}`
    for (let x = 0; x <= GRASS_W; x += 12) hillPath += ` L${x} ${hill.y(x).toFixed(1)}`
    hillPath += ` L${GRASS_W} ${GRASS_H} Z`

    const bladeBuckets = hill.blades.map(() => "")
    for (let i = 0; i < hill.count; i++) {
        const x = (i / hill.count) * GRASS_W + (random() - 0.5) * 8
        const baseY = hill.y(x) + 3
        const height = hill.height[0] + random() * (hill.height[1] - hill.height[0])
        const lean = (random() - 0.5) * 14
        const half = 1.2 + random() * 1.4
        const bucket = Math.floor(random() * hill.blades.length)
        bladeBuckets[bucket] +=
            `M${(x - half).toFixed(1)} ${baseY.toFixed(1)}` +
            `Q${(x + lean * 0.2).toFixed(1)} ${(baseY - height * 0.6).toFixed(1)} ${(x + lean).toFixed(1)} ${(baseY - height).toFixed(1)}` +
            `Q${(x + lean * 0.4 + half).toFixed(1)} ${(baseY - height * 0.5).toFixed(1)} ${(x + half).toFixed(1)} ${baseY.toFixed(1)}Z`
    }
    return { ...hill, hillPath, bladeBuckets }
})

function Grass() {
    return (
        <svg className="abs-grass" viewBox={`0 0 ${GRASS_W} ${GRASS_H}`} preserveAspectRatio="none" aria-hidden="true">
            <defs>
                {grassLayers.map((layer) => (
                    <linearGradient id={`abs-hill-${layer.id}`} x1="0" y1="0" x2="0" y2="1" key={layer.id}>
                        <stop offset="0" stopColor={layer.top} />
                        <stop offset="1" stopColor={layer.bottom} />
                    </linearGradient>
                ))}
            </defs>
            {grassLayers.map((layer) => (
                <g key={layer.id}>
                    <path fill={`url(#abs-hill-${layer.id})`} d={layer.hillPath} />
                    {layer.bladeBuckets.map((d, index) => (
                        <path fill={layer.blades[index]} d={d} key={index} />
                    ))}
                </g>
            ))}
        </svg>
    )
}

/* ---------- The page ---------- */

const smallScreenQuery = "(max-width: 900px), (prefers-reduced-motion: reduce)"

export default function AboutServices() {
    const trackRef = useRef(null)
    const sceneRef = useRef(null)
    const panelRef = useRef(null)
    const videoRefs = useRef([])
    const tabRefs = useRef([])

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

    // Left and right arrow keys move between tabs.
    const onTabKeyDown = (event, index) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
        event.preventDefault()
        const next = (index + (event.key === "ArrowRight" ? 1 : -1) + services.length) % services.length
        setActive(next)
        tabRefs.current[next]?.focus()
    }

    const current = services[active]
    const Mock = current.Mock

    return (
        <div className="abs">
            <div className={`abs-track${isStatic ? " abs-track--static" : ""}`} ref={trackRef}>
                <div
                    className={`abs-scene${isStatic ? "" : ` abs-scene--stage-${stage}`}`}
                    ref={sceneRef}
                >
                    <section className="abs-hero">
                        {/* Soft clouds drift slowly across the sky. */}
                        <div className="abs-sky" aria-hidden="true">
                            <span className="abs-cloud abs-cloud--a" />
                            <span className="abs-cloud abs-cloud--b" />
                            <span className="abs-cloud abs-cloud--c" />
                        </div>

                        <div className="abs-hero-first">
                            <span className="abs-badge"><i /> Jutem Global Resources</span>
                            <h1>A homegrown team, building across Nigeria.</h1>
                            <p>
                                Jutem Global Resources is made up of energetic young professionals
                                in the building and construction sector.
                            </p>
                            <a className="abs-button abs-button--orange" href="/contact">Make an enquiry</a>
                        </div>

                        <div className="abs-hero-second">
                            <h2>Four services.<span> One dependable team.</span></h2>
                        </div>

                        {/* The board rises up from behind the grass when the page loads. */}
                        <div className="abs-card-wrap" aria-hidden="true">
                            <div className="abs-card">
                                <ProjectBoard />
                            </div>
                        </div>

                        {/* The grass sits in front of the board. */}
                        <Grass />
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
                                        tabIndex={index === active ? 0 : -1}
                                        className={`abs-tab${index === active ? " is-active" : ""}`}
                                        onClick={() => setActive(index)}
                                        onKeyDown={(event) => onTabKeyDown(event, index)}
                                        ref={(el) => { tabRefs.current[index] = el }}
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
                                <a className="abs-button abs-button--dark" href="/contact">
                                    Make an enquiry <Icon name="arrow" size={15} />
                                </a>
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
                            <div className="abs-media-shade" aria-hidden="true" />

                            {/* The floating cards change with the tab and slide in one after another. */}
                            <div className={`abs-mock abs-mock--${current.id}`} key={current.id} aria-hidden="true">
                                <div className="abs-float">
                                    <Mock />
                                </div>
                            </div>

                            <div className="abs-media-caption" aria-hidden="true">
                                <span>{current.short}</span>
                                <span>0{active + 1} / 0{services.length}</span>
                            </div>
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