import Button from "./Button";
import "./About.css";

const values = [
    {
        title: "Purely Indigenous",
        text: "A wholly homegrown business built by Nigerians, for Nigeria.",
    },
    {
        title: "Collaborative Culture",
        text: "A dedicated team that works together on every project.",
    },
    {
        title: "Highest Standards",
        text: "Products and services delivered at edge-cutting standards.",
    },
];

const services = [
    {
        title: "Building Construction",
        text: "Residential and commercial buildings, delivered from planning to completion.",
    },
    {
        title: "Interior Finishing",
        text: "Quality finishing work that turns a structure into a space you can live and work in.",
    },
    {
        title: "Maintenance & Renovation",
        text: "Keeping existing buildings in shape and giving them a fresh new look.",
    },
    {
        title: "General Civil Works",
        text: "Civil engineering works handled with professional care.",
    },
];

export default function About() {
    return (
        <main className="about">
            <section className="about-hero">
                <div className="about-hero-background" aria-hidden="true"></div>
                <div className="about-hero-content">
                    <p className="about-label">About Us</p>
                    <h1>Jutem Global Resources</h1>
                    <p className="about-hero-p">
                        A wholly homegrown business made up of energetic young professionals
                        working in the building and construction sector.
                    </p>
                </div>
            </section>

            <section className="about-section about-who">
                <div className="about-who-text">
                    <h2>Who we are</h2>
                    <p>
                        We are a purely indigenous company of young, enterprising professionals
                        in the building and construction industry, coming together to deliver
                        products and services at edge-cutting standards.
                    </p>
                    <p>
                        With our dedicated and collaborative corporate culture, we come together
                        to provide services and structures that meet the highest standards.
                    </p>
                </div>

                <div className="about-values">
                    {values.map((value) => (
                        <div className="about-card" key={value.title}>
                            <h3>{value.title}</h3>
                            <p>{value.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="about-section">
                <h2>What we do</h2>
                <div className="about-services">
                    {services.map((service, index) => (
                        <div className="about-card" key={service.title}>
                            <span className="about-card-number">0{index + 1}</span>
                            <h3>{service.title}</h3>
                            <p>{service.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="about-section about-md">
                <img
                    className="about-md-photo"
                    src="/md-julius-airhia.jpg"
                    alt="Engr Julius Airhia, Managing Director of Jutem Global Resources"
                />
                <div className="about-md-text">
                    <p className="about-label">Meet the MD</p>
                    <h2>Engr Julius Airhia</h2>
                    <p>
                        Engr Julius Airhia is the MD of Jutem Global Resources. He holds a
                        Bachelor's degree (with honours) in Civil Engineering from Nnamdi
                        Azikiwe University and is a registered member of the Council for the
                        Regulation of Engineering Practice in Nigeria (COREN).
                    </p>
                    <p>
                        His active professional experience spans over 17 years in the
                        construction industry in Nigeria, and he has managed and overseen
                        construction projects in both the private and public sectors.
                    </p>
                </div>
            </section>

            <section className="about-section about-cta">
                <h2>Have a project in mind?</h2>
                <p>Talk to us and let's build something that lasts.</p>
                <Button />
            </section>
        </main>
    )
}