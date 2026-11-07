import Hero from "./components/Hero"
import About from "./components/About"
import Nav from "./components/Nav"
import ConstructionTape from "./components/ConstructionTape"
import Services from "./components/Services"

function App() {
  const path = window.location.pathname.replace(/\/+$/, "")

  return (
    <main>
    <Nav />
    {path === "/about" ? <About /> : <Hero />}
    <ConstructionTape />
    <Services />
    </main>
  )
}

export default App