import Hero from "./components/Hero"
import About from "./components/About"
import Nav from "./components/Nav"
import ConstructionTape from "./components/ConstructionTape"

function App() {
  const path = window.location.pathname.replace(/\/+$/, "")

  return (
    <main>
    <Nav />
   {path === "/about" ? (
  <About />
) : path === "/contact" ? (
  <EnquiryPage />
) : (
  <Hero />
)}
    </main>
  )
}



export default App