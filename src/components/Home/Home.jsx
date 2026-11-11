import About from "./About";
import ConstructionTapePitch from "./ConstructionTape";
import Hero from "./Hero";
import Nav from "./Nav";
import Services from "./Services"

export default function Home() {
    return (
        <>
        <Nav />
        <Hero />
        <About />
        <ConstructionTapePitch />
        <Services />
        </>
    )
}