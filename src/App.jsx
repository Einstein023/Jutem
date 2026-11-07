// import Hero from "./components/Home/component/Hero"
import Home from "./components/Home/Home"
import About from "./components/About"
import Nav from "./components/Home/component/Nav"
// import ConstructionTape from "./components/Home/component/ConstructionTape"
// import Services from "./components/Home/component/Services"

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
  <Home />
)}
    </main>
  )
}



export default App