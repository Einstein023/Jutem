import Hero from "./component/Hero";
import Nav from "./component/Nav";
import Services from "./component/Services";

export default function Home() {
    return (
        <section>
            <Nav />
            <Hero />
            <Services />
        </section>
    )
}