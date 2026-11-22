import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "./About.css"

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const statementText =
  "At Jutem, we believe building should be clear, predictable, and dependable — eliminating friction and guesswork from contract to completion to deliver enduring spaces."

export default function About() {
  const sectionRef = useRef(null)
  const pinStageRef = useRef(null)
  const cardBoxRef = useRef(null)
  const wordsRef = useRef([])
  const lowerRef = useRef(null)

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isMobile = window.matchMedia("(max-width: 767px)").matches
    const words = wordsRef.current.filter(Boolean)

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion && words.length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinStageRef.current,
            start: "top top",
            end: isMobile ? "+=110%" : "+=160%",
            pin: true,
            scrub: isMobile ? 0.25 : 0.5,
            invalidateOnRefresh: true,
          },
        })

        // Animate transform (scale) only — no border-radius tweening during scroll
        tl.fromTo(
          cardBoxRef.current,
          { scale: isMobile ? 1.02 : 1.04 },
          {
            scale: isMobile ? 0.97 : 0.92,
            ease: "none",
            duration: 0.45,
          },
          0
        )

        tl.fromTo(
          words,
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "none",
            stagger: isMobile ? 0.02 : 0.04,
            duration: 0.75,
          },
          0
        )
      } else if (words.length) {
        gsap.set(words, { opacity: 1 })
      }

      if (lowerRef.current && !prefersReducedMotion) {
        const lowerElements = lowerRef.current.querySelectorAll(
          ".jutem-about__tag, .jutem-about__lower-heading, .jutem-about__subcopy"
        )

        gsap.fromTo(
          lowerElements,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: lowerRef.current,
              start: "top 82%",
              once: true,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const words = statementText.split(" ")

  return (
    <section className="jutem-about" ref={sectionRef} aria-label="About Jutem Construction">
      <div className="jutem-about__stage" ref={pinStageRef}>
        <div className="jutem-about__card" ref={cardBoxRef}>
          <div className="jutem-about__card-inner">
            <p className="jutem-about__manifesto">
              {words.map((word, index) => (
                <span key={`${word}-${index}`} className="jutem-about__word-wrap">
                  <span
                    className="jutem-about__word"
                    ref={(el) => {
                      wordsRef.current[index] = el
                    }}
                  >
                    {word}
                  </span>
                  {index < words.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="jutem-about__lower" ref={lowerRef}>
        <div className="jutem-about__lower-grid">
          <div className="jutem-about__left-col">
            <span className="jutem-about__tag">Who We Are</span>
            <h2 className="jutem-about__lower-heading">Solid Foundations. Straightforward Service.</h2>
          </div>

          <div className="jutem-about__right-col">
            <p className="jutem-about__subcopy">
              Jutem is a full-service construction and civil works firm built on transparent timelines,
              rigorous engineering, and absolute accountability on every site. We bring skilled teams together
              to handle residential and commercial execution with zero guesswork from start to finish.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}