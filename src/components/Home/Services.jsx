import { useEffect, useRef, useState } from "react"
import "./services.css"

const services = [
    {
        id: "building",
        title: "Building Construction",
        intro: "Residential and commercial buildings, delivered from planning to completion.",
        video: "/slider-assets/Construction.mp4",
    },
    {
        id: "interior",
        title: "Interior Finishing",
        intro: "Quality finishing work that turns a structure into a space you can live and work in.",
        video: "/slider-assets/Interior-Finishing-Video.mp4",
    },
    {
        id: "renovation",
        title: "Maintenance & Renovation",
        intro: "Keeping existing buildings in shape and giving them a fresh new look.",
        video: "/slider-assets/Renovation-Video.mp4",
    },
    {
        id: "civil",
        title: "General Civil Works",
        intro: "Civil engineering works handled with professional care.",
        video: "/slider-assets/Civil.mp4",
    },
]

const ARROW = ["M5 12h14", "m12 5 7 7-7 7"]

const WHEEL_THRESHOLD = 55
const TOUCH_THRESHOLD = 45
const STEP_COOLDOWN = 380

function RiseText({ text }) {
    let count = 0
    return (
        <>
            <span className="svc-sr">{text}</span>
            <span aria-hidden="true">
                {text.split(" ").map((word, wordIndex, words) => (
                    <span className="svc-word" key={`${word}-${wordIndex}`}>
                        {word.split("").map((letter) => {
                            const index = count++
                            return (
                                <span className="svc-mask" key={index}>
                                    <span className="svc-letter" style={{ "--i": index }}>{letter}</span>
                                </span>
                            )
                        })}
                        {wordIndex < words.length - 1 ? "\u00a0" : ""}
                    </span>
                ))}
            </span>
        </>
    )
}

export default function Services() {
    const [active, setActive] = useState(0)
    const [inView, setInView] = useState(false)
    const [cursorVisible, setCursorVisible] = useState(false)
    const [headingIn, setHeadingIn] = useState(false)
    const headingRef = useRef(null)
    const sectionRef = useRef(null)
    const panelRef = useRef(null)
    const cursorRef = useRef(null)
    const tabRefs = useRef([])
    const videoRefs = useRef([])
    const activeRef = useRef(0)
    const lockedRef = useRef(false)
    const lockTimerRef = useRef(null)
    const wheelTotalRef = useRef(0)
    const wheelDirectionRef = useRef(null)
    const touchStartRef = useRef(null)

    const tabNumber = (index) => String(index + 1).padStart(2, "0")

    useEffect(() => {
        const jump = () => {
            const path = window.location.pathname.replace(/\/+$/, "")
            if (path !== "/services" && window.location.hash !== "#services") return
            requestAnimationFrame(() => {
                sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            })
        }
        jump()
        window.addEventListener("hashchange", jump)
        return () => window.removeEventListener("hashchange", jump)
    }, [])

    useEffect(() => {
        const node = sectionRef.current
        if (!node || !("IntersectionObserver" in window)) {
            setInView(true)
            return
        }
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.15 }
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const node = headingRef.current
        if (!node || !("IntersectionObserver" in window)) {
            setHeadingIn(true)
            return
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHeadingIn(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.5 }
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        videoRefs.current.forEach((video, index) => {
            if (!video) return
            if (index === active && inView && !reduceMotion) {
                video.play().catch(() => {})
            } else {
                video.pause()
            }
        })
    }, [active, inView])

    useEffect(() => {
        return () => {
            if (lockTimerRef.current) clearTimeout(lockTimerRef.current)
        }
    }, [])

    const goTo = (index) => {
        const clamped = Math.max(0, Math.min(services.length - 1, index))
        activeRef.current = clamped
        setActive(clamped)
    }

    const canMove = (direction) => {
        const next = activeRef.current + (direction === "down" ? 1 : -1)
        return next >= 0 && next < services.length
    }

    const step = (direction) => {
        if (lockedRef.current) return false
        const next = activeRef.current + (direction === "down" ? 1 : -1)
        if (next < 0 || next >= services.length) return false

        lockedRef.current = true
        if (lockTimerRef.current) clearTimeout(lockTimerRef.current)
        lockTimerRef.current = setTimeout(() => {
            lockedRef.current = false
        }, STEP_COOLDOWN)

        goTo(next)
        return true
    }

    const releaseScroll = (panel) => {
        panel?.removeAttribute("data-lenis-prevent")
        wheelTotalRef.current = 0
        wheelDirectionRef.current = null
    }

    // Only hijack wheel/arrow tab switching when the panel is substantially in view
    const isPanelEngaged = (panel) => {
        if (!panel) return false
        const rect = panel.getBoundingClientRect()
        const vh = window.innerHeight || document.documentElement.clientHeight
        const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
        return visibleHeight >= Math.min(rect.height * 0.5, vh * 0.45)
    }

    useEffect(() => {
        const panel = panelRef.current
        if (!panel) return undefined

        const onWheel = (event) => {
            if (event.deltaY === 0 || event.ctrlKey) return
            const direction = event.deltaY > 0 ? "down" : "up"

            if (!isPanelEngaged(panel)) {
                releaseScroll(panel)
                return
            }

            if (lockedRef.current) {
                if (canMove(direction)) {
                    panel.setAttribute("data-lenis-prevent", "")
                    event.preventDefault()
                } else {
                    releaseScroll(panel)
                }
                return
            }

            const movable = canMove(direction)
            if (!movable) {
                releaseScroll(panel)
                return
            }

            panel.setAttribute("data-lenis-prevent", "")
            event.preventDefault()

            if (wheelDirectionRef.current !== direction) {
                wheelTotalRef.current = 0
                wheelDirectionRef.current = direction
            }

            wheelTotalRef.current += Math.abs(event.deltaY)
            if (wheelTotalRef.current >= WHEEL_THRESHOLD) {
                wheelTotalRef.current = 0
                wheelDirectionRef.current = null
                step(direction)
            }
        }

        const onTouchStart = (event) => {
            const touch = event.touches[0]
            if (touch) touchStartRef.current = { x: touch.clientX, y: touch.clientY }
        }

        const onTouchMove = (event) => {
            const start = touchStartRef.current
            const touch = event.touches[0]
            if (!start || !touch) return
            const dy = start.y - touch.clientY
            const dx = start.x - touch.clientX
            if (Math.abs(dy) <= Math.abs(dx) || dy === 0) return

            const direction = dy > 0 ? "down" : "up"
            const hold = isPanelEngaged(panel) && (lockedRef.current || canMove(direction))

            if (hold) {
                panel.setAttribute("data-lenis-prevent", "")
                event.preventDefault()
            } else {
                panel.removeAttribute("data-lenis-prevent")
            }
        }

        const onTouchEnd = (event) => {
            const start = touchStartRef.current
            const touch = event.changedTouches[0]
            touchStartRef.current = null
            panel.removeAttribute("data-lenis-prevent")
            if (!start || !touch) return

            const dy = start.y - touch.clientY
            const dx = start.x - touch.clientX
            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > TOUCH_THRESHOLD && isPanelEngaged(panel)) {
                step(dy > 0 ? "down" : "up")
            }
        }

        const onKeyDown = (event) => {
            if (event.altKey || event.ctrlKey || event.metaKey) return
            const target = event.target
            if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable='true']")) {
                return
            }

            const section = sectionRef.current
            if (!section || !section.contains(document.activeElement) && !isPanelEngaged(panel)) {
                return
            }

            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                const direction = event.key === "ArrowDown" ? "down" : "up"
                if (canMove(direction)) {
                    event.preventDefault()
                    step(direction)
                }
            }
        }

        panel.addEventListener("wheel", onWheel, { passive: false })
        panel.addEventListener("touchstart", onTouchStart, { passive: true })
        panel.addEventListener("touchmove", onTouchMove, { passive: false })
        panel.addEventListener("touchend", onTouchEnd, { passive: true })
        window.addEventListener("keydown", onKeyDown)

        return () => {
            releaseScroll(panel)
            panel.removeEventListener("wheel", onWheel)
            panel.removeEventListener("touchstart", onTouchStart)
            panel.removeEventListener("touchmove", onTouchMove)
            panel.removeEventListener("touchend", onTouchEnd)
            window.removeEventListener("keydown", onKeyDown)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const moveCursor = (event) => {
        if (event.pointerType === "touch" || !cursorRef.current) return
        cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`
    }

    const onTabKeyDown = (event, index) => {
        const last = services.length - 1
        let next = null

        if (event.key === "ArrowRight") next = index === last ? 0 : index + 1
        else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1
        else if (event.key === "ArrowDown") next = index < last ? index + 1 : null
        else if (event.key === "ArrowUp") next = index > 0 ? index - 1 : null
        else if (event.key === "Home") next = 0
        else if (event.key === "End") next = last

        if (next === null) return
        event.preventDefault()
        event.stopPropagation()
        goTo(next)
        tabRefs.current[next]?.focus()
    }

    const current = services[active]

    return (
        <section className="svc" id="services" ref={sectionRef}>
            <h2 className={`svc-header${headingIn ? " is-in" : ""}`} ref={headingRef}>
                <RiseText text="Our Services" />
            </h2>

            <div className="svc-panel" ref={panelRef}>
                <div className="svc-text">
                    <div className="svc-tabs" role="tablist" aria-label="Our services">
                        {services.map((service, index) => (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={index === active}
                                aria-label={`${tabNumber(index)}, ${service.title}`}
                                title={service.title}
                                tabIndex={index === active ? 0 : -1}
                                className={`svc-tab${index === active ? " is-active" : ""}`}
                                onClick={() => goTo(index)}
                                onKeyDown={(event) => onTabKeyDown(event, index)}
                                ref={(el) => { tabRefs.current[index] = el }}
                                key={service.id}
                            >
                                <span className="svc-tab-number" aria-hidden="true">{tabNumber(index)}</span>
                                <span className="svc-tab-bar" aria-hidden="true" />
                            </button>
                        ))}
                    </div>

                    <div className="svc-detail" key={current.id} role="tabpanel">
                        <h3>{current.title}</h3>
                        <p>{current.intro}</p>
                        <a className="svc-button" href="/contact">
                            Make an enquiry
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                {ARROW.map((d) => <path d={d} key={d} />)}
                            </svg>
                        </a>
                    </div>
                </div>

                <div
                    className="svc-media"
                    onPointerEnter={(event) => {
                        if (event.pointerType !== "touch") {
                            moveCursor(event)
                            setCursorVisible(true)
                        }
                    }}
                    onPointerMove={moveCursor}
                    onPointerLeave={() => setCursorVisible(false)}
                >
                    {services.map((service, index) => (
                        <video
                            className={`svc-video${index === active ? " is-active" : ""}`}
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

            <div className="svc-cursor" ref={cursorRef} data-visible={cursorVisible} aria-hidden="true">
                Scroll
            </div>
        </section>
    )
}