import { useEffect } from "react"
import Lenis from "lenis"
import Home from "./components/Home/Home"
import About from "./components/About/About"
import Nav from "./components/Home/Nav"
import EnquiryPage from "./components/EnquiryPage"

function App() {
  const path = window.location.pathname.replace(/\/+$/, "")

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
    <main>
      <Nav />
      {path === "/about" ? (
        <About />
      ) : path === "/contact" ? (
        <EnquiryPage />
      ) : (
        <Home />
      )}
    </main>
  )
}



export default App
