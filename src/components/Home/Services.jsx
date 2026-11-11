import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import "./services.css"

const slideData = [
    { title: "Building Construction", image: "/slider-assets/Construction.webp", type: "image" },
    { title: "Interior Finishing", image: "/slider-assets/Interior-Finishing-Video.mp4", type: "video" },
    { title: "Maintenance & Renovation", image: "/slider-assets/Renovation-Video.mp4", type: "video" },
    { title: "General Civil Works", image: "/slider-assets/Civil-Work.webp", type: "image" },
]

const WHEEL_THRESHOLD = 100
const TOUCH_THRESHOLD = 50

export default function Services() {
    const [frontSlideIndex, setFrontSlideIndex] = useState(0)
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    )
    const frontSlideIndexRef = useRef(0)
    const serviceContainerRef = useRef(null)
    const slideRefs = useRef([])
    const videoRefs = useRef([])
    const scrollCursorRef = useRef(null)
    const previousSlideIndexRef = useRef(null)
    const slideDirectionRef = useRef("down")
    const isAnimatingRef = useRef(false)
    const wheelAccumulatorRef = useRef(0)
    const wheelDirectionRef = useRef(null)
    const touchStartRef = useRef(null)
    const [isScrollCursorVisible, setIsScrollCursorVisible] = useState(false)

    useEffect(() => {
        const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
        const updateMotionPreference = (event) => setPrefersReducedMotion(event.matches)

        motionPreference.addEventListener("change", updateMotionPreference)
        return () => motionPreference.removeEventListener("change", updateMotionPreference)
    }, [])

    useLayoutEffect(() => {
        const slides = slideRefs.current.filter(Boolean)
        const getPosition = (index, activeIndex = frontSlideIndex) => (
            (index - activeIndex + slideData.length) % slideData.length
        )
        const setStackPosition = (slide, index) => {
            const depth = getPosition(index)

            gsap.set(slide, {
                xPercent: -50 + depth * 1.2,
                yPercent: -50 + depth * 2.5,
                scale: 1 - depth * 0.025,
                opacity: 1,
            })
        }

        const previousIndex = previousSlideIndexRef.current
        const incomingSlide = slides[frontSlideIndex]
        if (!incomingSlide) return undefined

        if (previousIndex === null || previousIndex === frontSlideIndex || prefersReducedMotion) {
            slides.forEach((slide, index) => setStackPosition(slide, index))
            previousSlideIndexRef.current = frontSlideIndex
            isAnimatingRef.current = false
            return undefined
        }

        gsap.set(incomingSlide, {
            xPercent: -50,
            yPercent: slideDirectionRef.current === "down" ? -150 : 50,
            scale: 0.94,
            opacity: 1,
        })

        const timeline = gsap.timeline({
            onComplete: () => {
                previousSlideIndexRef.current = frontSlideIndex
                isAnimatingRef.current = false
            },
        })

        slides.forEach((slide, index) => {
            const depth = getPosition(index)

            timeline.to(slide, {
                xPercent: -50 + depth * 1.2,
                yPercent: -50 + depth * 2.5,
                scale: 1 - depth * 0.025,
                opacity: 1,
                duration: 0.95,
                ease: "power3.inOut",
            }, 0)
        })

        const activeTitleWords = incomingSlide.querySelectorAll(".slide-title-word")
        if (activeTitleWords?.length) {
            timeline.fromTo(activeTitleWords,
                { yPercent: 100 },
                {
                    yPercent: 0,
                    duration: 0.65,
                    ease: "power4.out",
                    stagger: 0.06,
                },
                0.15,
            )
        }

        return () => timeline.kill()
    }, [frontSlideIndex, prefersReducedMotion])

    const moveScrollCursor = (event) => {
        if (event.pointerType === "touch" || !scrollCursorRef.current) return

        scrollCursorRef.current.style.transform = (
            `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`
        )
    }

    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (!video) return

            if (index === frontSlideIndex && !prefersReducedMotion) {
                video.play().catch((error) => {
                    if (error.name !== "NotAllowedError") {
                        console.error("Could not play the active service video.", error)
                    }
                })
            } else {
                video.pause()
                video.currentTime = 0
            }
        })
    }, [frontSlideIndex, prefersReducedMotion])

    const changeSlide = (direction) => {
        if (isAnimatingRef.current) return false

        const nextIndex = frontSlideIndexRef.current + (direction === "down" ? 1 : -1)
        if (nextIndex < 0 || nextIndex >= slideData.length) return false

        isAnimatingRef.current = true
        slideDirectionRef.current = direction
        frontSlideIndexRef.current = nextIndex
        setFrontSlideIndex(nextIndex)
        return true
    }

    useEffect(() => {
        const container = serviceContainerRef.current
        if (!container) return undefined

        const handleWheel = (event) => {
            if (event.deltaY === 0) return

            const direction = event.deltaY > 0 ? "down" : "up"
            const nextIndex = frontSlideIndexRef.current + (direction === "down" ? 1 : -1)
            const canChangeSlide = nextIndex >= 0 && nextIndex < slideData.length

            if (isAnimatingRef.current) {
                container.setAttribute("data-lenis-prevent", "")
                event.preventDefault()
                return
            }

            container.toggleAttribute("data-lenis-prevent", canChangeSlide)
            if (!canChangeSlide) {
                wheelAccumulatorRef.current = 0
                wheelDirectionRef.current = null
                return
            }

            event.preventDefault()
            if (wheelDirectionRef.current !== direction) {
                wheelAccumulatorRef.current = 0
                wheelDirectionRef.current = direction
            }

            wheelAccumulatorRef.current += Math.abs(event.deltaY)
            if (wheelAccumulatorRef.current >= WHEEL_THRESHOLD) {
                wheelAccumulatorRef.current = 0
                wheelDirectionRef.current = null
                changeSlide(direction)
            }
        }

        const handleTouchStart = (event) => {
            const touch = event.touches[0]
            if (touch) {
                touchStartRef.current = { x: touch.clientX, y: touch.clientY }
            }
        }

        const handleTouchMove = (event) => {
            const start = touchStartRef.current
            const touch = event.touches[0]
            if (!start || !touch) return

            const deltaY = start.y - touch.clientY
            const deltaX = start.x - touch.clientX
            if (Math.abs(deltaY) <= Math.abs(deltaX) || Math.abs(deltaY) <= 0) return

            const direction = deltaY > 0 ? "down" : "up"
            const nextIndex = frontSlideIndexRef.current + (direction === "down" ? 1 : -1)
            const canChangeSlide = nextIndex >= 0 && nextIndex < slideData.length
            container.toggleAttribute("data-lenis-prevent", isAnimatingRef.current || canChangeSlide)
            if (isAnimatingRef.current || canChangeSlide) {
                event.preventDefault()
            }
        }

        const handleTouchEnd = (event) => {
            const start = touchStartRef.current
            const touch = event.changedTouches[0]
            touchStartRef.current = null

            if (!start || !touch || isAnimatingRef.current) return

            const deltaY = start.y - touch.clientY
            const deltaX = start.x - touch.clientX
            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > TOUCH_THRESHOLD) {
                changeSlide(deltaY > 0 ? "down" : "up")
            }
        }

        container.addEventListener("wheel", handleWheel, { passive: false })
        container.addEventListener("touchstart", handleTouchStart, { passive: true })
        container.addEventListener("touchmove", handleTouchMove, { passive: false })
        container.addEventListener("touchend", handleTouchEnd, { passive: true })

        return () => {
            container.removeEventListener("wheel", handleWheel)
            container.removeEventListener("touchstart", handleTouchStart)
            container.removeEventListener("touchmove", handleTouchMove)
            container.removeEventListener("touchend", handleTouchEnd)
        }
    }, [])

    return (
        <section className="services-container">
            <div className="services-wrapper">
                <h2 className="services-header">Our Services/</h2>
                <div className="service-container" ref={serviceContainerRef}>
                    <div className="slider">
                        {slideData.map((slide, index) => {
                            const titleWords = slide.title.split(" ")
                            const position = (index - frontSlideIndex + slideData.length) % slideData.length
                            const isActive = position === 0

                            return (
                                <article
                                    className="slide"
                                    key={slide.title}
                                    ref={(element) => {
                                        slideRefs.current[index] = element
                                    }}
                                    style={{
                                        zIndex: slideData.length - position,
                                        pointerEvents: isActive ? "auto" : "none",
                                    }}
                                    aria-label={slide.title}
                                    aria-hidden={!isActive}
                                    onPointerEnter={(event) => {
                                        if (event.pointerType !== "touch") {
                                            moveScrollCursor(event)
                                            setIsScrollCursorVisible(true)
                                        }
                                    }}
                                    onPointerMove={moveScrollCursor}
                                    onPointerLeave={() => setIsScrollCursorVisible(false)}
                                >
                                    {slide.type === "video" ? (
                                        <video
                                            className="slider-image"
                                            src={slide.image}
                                            ref={(element) => {
                                                videoRefs.current[index] = element
                                            }}
                                            autoPlay={isActive}
                                            muted
                                            loop
                                            playsInline
                                            preload="metadata"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <img
                                            className="slider-image"
                                            src={slide.image}
                                            alt=""
                                        />
                                    )}
                                    <h3 className="slide-title">
                                        {titleWords.map((word, wordIndex) => (
                                            <Fragment key={`${word}-${wordIndex}`}>
                                                <span className="slide-title-mask">
                                                    <span className="slide-title-word">{word}</span>
                                                </span>
                                                {wordIndex < titleWords.length - 1 ? " " : ""}
                                            </Fragment>
                                        ))}
                                    </h3>
                                </article>
                            )
                        })}
                    </div>
                    <div className="service-controls" aria-label="Service navigation">
                        <button
                            type="button"
                            onClick={() => changeSlide("up")}
                            aria-label="Previous service"
                            disabled={frontSlideIndex === 0}
                        >
                            Previous
                        </button>
                        <span aria-live="polite">
                            {String(frontSlideIndex + 1).padStart(2, "0")} / {String(slideData.length).padStart(2, "0")}
                        </span>
                        <button
                            type="button"
                            onClick={() => changeSlide("down")}
                            aria-label="Next service"
                            disabled={frontSlideIndex === slideData.length - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <div
                className="service-scroll-cursor"
                ref={scrollCursorRef}
                data-visible={isScrollCursorVisible}
                aria-hidden="true"
            >
                Scroll
            </div>
        </section>
    )
}
