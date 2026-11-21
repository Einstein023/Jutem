import { useEffect, useState } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import Home from "./components/Home/Home"
import About from "./components/About/About"
import Nav from "./components/Home/Nav"
import EnquiryPage from "./components/EnquiryPage"
import { normalizeURL, updatePageSEO } from "./utils/seo"

function App() {
  const [path, setPath] = useState(() => {
    normalizeURL()
    return window.location.pathname.replace(/\/+$/, "")
  })

  // Initial Luxury Reveal Curtain Animation (Blocks screen until ready like Haven Constructions)
  useEffect(() => {
    const curtain = document.getElementById("initial-curtain")
    if (!curtain) return

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (motionPreference) {
      curtain.style.transition = "opacity 0.3s ease"
      curtain.style.opacity = "0"
      setTimeout(() => curtain.remove(), 300)
      return
    }

    const bar = curtain.querySelector(".curtain-loader-bar")
    const inner = curtain.querySelector(".curtain-inner")

    // Progress bar fills to 100%
    if (bar) bar.style.width = "100%"

    const tl = gsap.timeline({
      delay: 0.35,
      onComplete: () => {
        curtain.remove()
      },
    })

    // 1. Center logo and brand gently elevate and fade
    tl.to(inner, {
      y: -24,
      opacity: 0,
      duration: 0.45,
      ease: "power3.in",
    })
    // 2. Full-screen curtain sweeps upward revealing the website
    .to(
      curtain,
      {
        yPercent: -100,
        duration: 0.95,
        ease: "power4.inOut",
      },
      "-=0.1"
    )
  }, [])

  useEffect(() => {
    // Normalizes duplicate URL patterns (/about/ -> /about, /index.html -> /)
    normalizeURL()
    updatePageSEO(path)

    const handleLocationChange = () => {
      normalizeURL()
      const cleanPath = window.location.pathname.replace(/\/+$/, "")
      setPath(cleanPath)
      updatePageSEO(cleanPath)
    }

    window.addEventListener("popstate", handleLocationChange)
    return () => window.removeEventListener("popstate", handleLocationChange)
  }, [path])

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
    let lenis
    let animationFrame

    const stopLenis = () => {
      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame)
        animationFrame = undefined
      }

      lenis?.destroy()
      lenis = undefined
    }

    const startLenis = () => {
      if (motionPreference.matches || lenis) return

      lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.85,
      })

      const animate = (time) => {
        lenis.raf(time)
        animationFrame = requestAnimationFrame(animate)
      }

      animationFrame = requestAnimationFrame(animate)
    }

    const updateMotionPreference = () => {
      if (motionPreference.matches) {
        stopLenis()
      } else {
        startLenis()
      }
    }

    startLenis()
    motionPreference.addEventListener("change", updateMotionPreference)

    return () => {
      motionPreference.removeEventListener("change", updateMotionPreference)
      stopLenis()
    }
  }, [])

  return (
    <div className="site-wrapper">
      <a href="#main-content" className="sr-skip-link">Skip to main content</a>
      <Nav />
      {path === "/about" ? (
        <About />
      ) : path === "/contact" ? (
        <EnquiryPage />
      ) : (
        <Home />
      )}
    </div>
  )
}

export default App
