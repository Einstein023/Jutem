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
    const previousSlideIndexRef = useRef(null)
    const slideDirectionRef = useRef("down")
    const isAnimatingRef = useRef(false)
    const wheelAccumulatorRef = useRef(0)
    const wheelDirectionRef = useRef(null)
    const touchStartRef = useRef(null)

    useEffect(() => {
        const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
        const updateMotionPreference = (event) => setPrefersReducedMotion(event.matches)

        motionPreference.addEventListener("change", updateMotionPreference)
        return () => motionPreference.removeEventListener("change", updateMotionPreference)
    }, [])

    useLayoutEffect(() => {
        const slides = slideRefs.current.filter(Boolean)

        gsap.set(slides, {
            xPercent: -50,
            yPercent: -50,
            opacity: 0,
        })

        const previousIndex = previousSlideIndexRef.current
        const incomingSlide = slides[frontSlideIndex]
        const outgoingSlide = previousIndex === null ? null : slides[previousIndex]

        if (
            prefersReducedMotion
            || previousIndex === null
            || previousIndex === frontSlideIndex
            || !incomingSlide
            || !outgoingSlide
        ) {
            gsap.set(incomingSlide, { opacity: 1 })
            previousSlideIndexRef.current = frontSlideIndex
            isAnimatingRef.current = false
            return undefined
        }

        const direction = slideDirectionRef.current
        gsap.set(incomingSlide, {
            yPercent: direction === "down" ? -150 : 50,
            opacity: 1,
        })
        gsap.set(outgoingSlide, { opacity: 1 })

        const timeline = gsap.timeline({
            onComplete: () => {
                gsap.set(outgoingSlide, {
                    xPercent: -50,
                    yPercent: -50,
                    opacity: 0,
                })
                previousSlideIndexRef.current = frontSlideIndex
                isAnimatingRef.current = false
            },
        })

        timeline.to(incomingSlide, {
            yPercent: -50,
            duration: 0.9,
            ease: "power3.inOut",
        }, 0)
        timeline.to(outgoingSlide, {
            yPercent: direction === "down" ? 50 : -150,
            opacity: 0,
            duration: 0.75,
            ease: "power3.inOut",
        }, 0)

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

            if (isAnimatingRef.current) {
                event.preventDefault()
                return
            }

            const nextIndex = frontSlideIndexRef.current + (direction === "down" ? 1 : -1)
            if (nextIndex < 0 || nextIndex >= slideData.length) {
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
            if (isAnimatingRef.current || (nextIndex >= 0 && nextIndex < slideData.length)) {
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
                <div className="service-container" ref={serviceContainerRef} data-lenis-prevent>
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
                                    style={{ zIndex: isActive ? 2 : 1 }}
                                    aria-label={slide.title}
                                    aria-hidden={!isActive}
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
        </section>
    )
}
