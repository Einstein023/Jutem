import About from "./About";
import ConstructionTapePitch from "./ConstructionTape";
import Hero from "./Hero";
import Services from "./Services"
import Footer from "../Footer/Footer"

export default function Home() {
    return (
        <>
        <Hero />
        <About />
        <ConstructionTapePitch />
        <Services />
        <Footer />
        </>
    )
}