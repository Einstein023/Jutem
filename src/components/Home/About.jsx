import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "./About.css"

gsap.registerPlugin(ScrollTrigger)

const statementText =
  "At Jutem, we believe building should be clear, predictable, and dependable — eliminating friction and guesswork from contract to completion to deliver enduring spaces."

export default function About() {
  const sectionRef = useRef(null)
  const pinStageRef = useRef(null)
  const cardBoxRef = useRef(null)
  const wordsRef = useRef([])

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const words = wordsRef.current.filter(Boolean)

    if (prefersReducedMotion || !words.length) {
      gsap.set(words, { opacity: 1 })
      return undefined
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinStageRef.current,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      })

      // Card shrink / scale-in effect matching the immersive frame
      tl.fromTo(
        cardBoxRef.current,
        {
          scale: 1.05,
          borderRadius: "0rem",
        },
        {
          scale: 0.92,
          borderRadius: "1rem",
          ease: "power2.inOut",
          duration: 0.4,
        },
        0
      )

      // Sequential word illumination
      tl.fromTo(
        words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          duration: 0.8,
        },
        0
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const words = statementText.split(" ")

  return (
    <section className="jutem-about" ref={sectionRef} aria-label="About Jutem Construction">
      {/* PINNED SHRINKING STAGE */}
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

      {/* LOWER EDITORIAL BAND (Aligned to your Left-Right Layout Grid) */}
      <div className="jutem-about__lower">
        <div className="jutem-about__lower-grid">
          {/* Left Column: Section Tag & Context */}
          <div className="jutem-about__left-col">
            <span className="jutem-about__tag">Who We Are</span>
            <h3 className="jutem-about__lower-heading">Solid Foundations. Straightforward Service.</h3>
          </div>
          
          {/* Right Column: Editorial Narrative (Matching Services Text Rhythm) */}
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