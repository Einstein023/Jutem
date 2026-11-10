import Home from "./components/Home/Home"
import About from "./components/About"
import Nav from "./components/Home/Nav"
import EnquiryPage from "./components/EnquiryPage"

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