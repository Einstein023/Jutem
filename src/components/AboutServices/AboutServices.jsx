import { useEffect, useRef, useState } from "react"
import "./AboutServices.css"

/* ==========================================================================
   ABOUT + SERVICES PAGE  (/about and /services)

   What happens on this page, in the order you see it:
   1. A full-screen construction photo. The project board rises from behind the
      ground in the foreground.
   2. Each scroll moves one step: the first scroll shrinks the hero and opens the
      tabs (Building), then one scroll per tab: Interior, Renovation, Civil Works.
   3. Only after the 4th tab does the next scroll carry the page down to
      "Who we are", the Managing Director, and the closing call to action.

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
    down: ["M12 5v14", "m19 12-7 7-7-7"],
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

/* ---------- The page ---------- */

const smallScreenQuery = "(max-width: 900px), (prefers-reduced-motion: reduce)"

// The first screen has 5 steps: 0 is the hero, then 1 to 4 are the four tabs.
// One scroll (wheel, swipe or arrow key) moves exactly one step. After step 4, the next
// scroll carries the page down to "Who we are".
const LAST_STEP = services.length
const STEP_COOLDOWN = 750
const SCROLL_TO_TIME = 900

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export default function AboutServices() {
    const sceneRef = useRef(null)
    const panelRef = useRef(null)
    const videoRefs = useRef([])
    const tabRefs = useRef([])

    // Small screens and "reduce motion" get a plain stacked layout (no pinned steps).
    const [isStatic, setIsStatic] = useState(() => window.matchMedia(smallScreenQuery).matches)
    const [step, setStep] = useState(0)
    const [staticActive, setStaticActive] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const query = window.matchMedia(smallScreenQuery)
        const update = () => setIsStatic(query.matches)
        query.addEventListener("change", update)
        return () => query.removeEventListener("change", update)
    }, [])

    const stepRef = useRef(0)
    const changeStep = (value) => {
        stepRef.current = value
        setStep(value)
    }

    // Stepped scrolling. The scroll position is never turned into animation (that was the lag):
    // a scroll only changes the step number, and CSS transitions do the moving.
    useEffect(() => {
        if (isStatic) return

        const scene = sceneRef.current
        const previousRestoration = window.history.scrollRestoration
        window.history.scrollRestoration = "manual"

        let lockedUntil = 0
        let animating = false
        let frame
        let wheelSum = 0
        let wheelDir = 0
        let wheelTime = 0
        let wheelSize = 0
        let wheelStart = 0
        let armed = true

        const tweenTo = (target) => {
            const from = window.scrollY
            const startTime = performance.now()
            animating = true
            const tick = (now) => {
                const t = Math.min(1, (now - startTime) / SCROLL_TO_TIME)
                window.scrollTo(0, from + (target - from) * easeInOut(t))
                if (t < 1) {
                    frame = requestAnimationFrame(tick)
                } else {
                    animating = false
                    lockedUntil = performance.now() + 300
                }
            }
            frame = requestAnimationFrame(tick)
        }

        const inScene = (dir) => {
            const height = scene.offsetHeight
            const y = window.scrollY
            return y < height - 2 || (dir < 0 && y <= height + 2)
        }

        // Returns true when the scroll was used here (so the browser should not scroll).
        const handle = (dir) => {
            const height = scene.offsetHeight
            const y = window.scrollY
            const now = performance.now()

            if (animating || now < lockedUntil) return true

            // Below the first screen: normal scrolling, except going back up into it.
            if (y >= height - 2) {
                if (dir < 0 && y <= height + 2) {
                    tweenTo(0)
                    return true
                }
                return false
            }
            // In between (for example after dragging the scrollbar): settle on one side.
            if (y > 2) {
                tweenTo(dir > 0 ? height : 0)
                return true
            }
            // At the top: one scroll, one step.
            if (dir > 0) {
                if (stepRef.current < LAST_STEP) {
                    lockedUntil = now + STEP_COOLDOWN
                    changeStep(stepRef.current + 1)
                } else {
                    tweenTo(height)
                }
                return true
            }
            if (stepRef.current > 0) {
                lockedUntil = now + STEP_COOLDOWN
                changeStep(stepRef.current - 1)
                return true
            }
            return false
        }

        const onWheel = (event) => {
            if (event.ctrlKey) return
            // Firefox reports wheel clicks in "lines": convert to pixels.
            const delta = event.deltaY * (event.deltaMode === 1 ? 40 : event.deltaMode === 2 ? 800 : 1)
            if (delta === 0) return
            const dir = delta > 0 ? 1 : -1
            if (!inScene(dir)) return
            event.preventDefault()

            const now = performance.now()
            const size = Math.abs(delta)
            const locked = now < lockedUntil || animating

            // A trackpad keeps sending small, fading events for about a second after the finger
            // lifts. Those must not count as a new scroll. A new scroll is a pause followed by
            // events, a mouse-wheel click (big event), or a sudden jump in strength.
            if (now - wheelTime > 100 || size >= 90 || (!locked && size > wheelSize * 2 + 10)) armed = true
            wheelTime = now
            wheelSize = size

            if (locked) {
                wheelSum = 0
                return
            }
            if (!armed) return
            // Add up the small events of one swipe (within a quarter of a second); a step needs
            // a little push, not a big one. A long, weak tail never adds up to a step.
            if (dir !== wheelDir || now - wheelStart > 250) {
                wheelSum = 0
                wheelStart = now
            }
            wheelDir = dir
            wheelSum += size
            if (wheelSum >= 30) {
                wheelSum = 0
                armed = false
                handle(dir)
            }
        }

        let touchY = null
        const onTouchStart = (event) => {
            touchY = event.touches[0].clientY
        }
        const onTouchMove = (event) => {
            if (touchY === null) return
            if (inScene(touchY - event.touches[0].clientY > 0 ? 1 : -1)) event.preventDefault()
        }
        const onTouchEnd = (event) => {
            if (touchY === null) return
            const delta = touchY - event.changedTouches[0].clientY
            touchY = null
            if (Math.abs(delta) > 40) handle(delta > 0 ? 1 : -1)
        }

        const onKeyDown = (event) => {
            const tag = event.target.tagName
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return
            const down = event.key === "ArrowDown" || event.key === "PageDown" || (event.key === " " && tag !== "BUTTON" && tag !== "A")
            const up = event.key === "ArrowUp" || event.key === "PageUp"
            if (!down && !up) return
            if (inScene(down ? 1 : -1) && handle(down ? 1 : -1)) event.preventDefault()
        }

        // Start at the top. The Services link in the nav (/services) opens on the first tab.
        window.scrollTo(0, 0)
        if (window.location.pathname.replace(/\/+$/, "") === "/services" && stepRef.current === 0) changeStep(1)

        window.addEventListener("wheel", onWheel, { passive: false })
        window.addEventListener("touchstart", onTouchStart, { passive: true })
        window.addEventListener("touchmove", onTouchMove, { passive: false })
        window.addEventListener("touchend", onTouchEnd, { passive: true })
        window.addEventListener("keydown", onKeyDown)
        return () => {
            cancelAnimationFrame(frame)
            window.history.scrollRestoration = previousRestoration
            window.removeEventListener("wheel", onWheel)
            window.removeEventListener("touchstart", onTouchStart)
            window.removeEventListener("touchmove", onTouchMove)
            window.removeEventListener("touchend", onTouchEnd)
            window.removeEventListener("keydown", onKeyDown)
        }
    }, [isStatic])

    // Static layout only: play the video while the panel is on screen.
    useEffect(() => {
        if (!isStatic) return
        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.3 })
        observer.observe(panelRef.current)
        return () => observer.disconnect()
    }, [isStatic])

    const active = isStatic ? staticActive : Math.max(0, step - 1)
    const isReady = isStatic ? isVisible : step >= 1

    // Only the video of the open tab plays, and only while the panel is showing.
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

    const selectTab = (index) => {
        if (isStatic) setStaticActive(index)
        else changeStep(index + 1)
    }

    // Left and right arrow keys move between tabs.
    const onTabKeyDown = (event, index) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
        event.preventDefault()
        const next = (index + (event.key === "ArrowRight" ? 1 : -1) + services.length) % services.length
        selectTab(next)
        tabRefs.current[next]?.focus()
    }

    const current = services[active]
    const Mock = current.Mock

    return (
        <div className="abs">
            <div className={`abs-track${isStatic ? " abs-track--static" : ""}`}>
                <div
                    className={`abs-scene${isStatic ? "" : ` abs-scene--step-${Math.min(step, 1)}`}`}
                    ref={sceneRef}
                >
                    <section className="abs-hero">
                        {/* Everything in the stage shares the photo's own coordinates, so the board
                            always lines up with the pile of blocks, whatever the screen shape. */}
                        <div className="abs-stage" aria-hidden="true">
                            {/* Back layer: the construction site photo. */}
                            <div className="abs-photo" />

                            {/* The board sits between the two photo layers. */}
                            <div className="abs-card-wrap">
                                <div className="abs-card">
                                    <ProjectBoard />
                                </div>
                            </div>

                            {/* Front layer: the same photo, cut out to just the pile of blocks. It covers the
                                bottom right of the board, so the board looks like it is behind the pile. */}
                            <div className="abs-photo abs-photo--pile" />
                        </div>
                        <div className="abs-shade" aria-hidden="true" />

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

                        <button type="button" className="abs-scroll-cue" onClick={() => changeStep(1)} aria-label="Scroll to our services">
                            Scroll <Icon name="down" size={14} />
                        </button>
                    </section>

                    <div
                        className={`abs-panel${isReady ? " is-ready" : ""}`}
                        ref={panelRef}
                    >
                        <div className="abs-panel-text">
                            <div className="abs-tabs" role="tablist">
                                {services.map((service, index) => (
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={index === active}
                                        tabIndex={index === active ? 0 : -1}
                                        className={`abs-tab${index === active ? " is-active" : ""}`}
                                        onClick={() => selectTab(index)}
                                        onKeyDown={(event) => onTabKeyDown(event, index)}
                                        ref={(el) => { tabRefs.current[index] = el }}
                                        key={service.id}
                                    >
                                        <span className="abs-tab-title">{service.short}</span>
                                        <span className="abs-tab-label">{service.label}</span>
                                        <span className="abs-tab-bar" />
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