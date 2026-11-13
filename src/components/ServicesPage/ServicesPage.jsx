import { useEffect, useRef, useState } from "react"
import "./ServicesPage.css"

// PLACEHOLDER: the short lists under each service are sample text.
// Replace the "details" with Jutem's real services. The "intro" lines come from the About page.
const services = [
    {
        id: "building",
        title: "Building Construction",
        intro: "Residential and commercial buildings, delivered from planning to completion.",
        video: "/slider-assets/Construction.mp4",
        details: [
            { title: "Residential buildings", text: "Homes and estates built to your design and your budget." },
            { title: "Commercial buildings", text: "Offices, shops and other business spaces built to last." },
            { title: "Project management", text: "One team looking after the work from the first day to handover." },
        ],
    },
    {
        id: "interior",
        title: "Interior Finishing",
        intro: "Quality finishing work that turns a structure into a space you can live and work in.",
        video: "/slider-assets/Interior-Finishing-Video.mp4",
        details: [
            { title: "Floors, walls and ceilings", text: "Tiling, plastering, painting and POP ceilings done neatly." },
            { title: "Doors, windows and fittings", text: "Fitted carefully so everything opens, closes and lasts." },
            { title: "Electrical and plumbing finishes", text: "Final fittings installed and tested before handover." },
        ],
    },
    {
        id: "renovation",
        title: "Maintenance & Renovation",
        intro: "Keeping existing buildings in shape and giving them a fresh new look.",
        video: "/slider-assets/Renovation-Video.mp4",
        details: [
            { title: "Repairs and upkeep", text: "Fixing leaks, cracks and wear before they become bigger problems." },
            { title: "Full renovations", text: "Remodelling old spaces to suit the way you use them today." },
            { title: "Repainting and refurbishing", text: "A fresh look inside and out without starting from scratch." },
        ],
    },
    {
        id: "civil",
        title: "General Civil Works",
        intro: "Civil engineering works handled with professional care.",
        video: "/slider-assets/Civil.mp4",
        details: [
            { title: "Roads and drainage", text: "Access roads, drains and culverts built to proper standards." },
            { title: "Site preparation", text: "Clearing, grading and levelling land before building starts." },
            { title: "Fencing and external works", text: "Boundary walls, pavements and compound works." },
        ],
    },
]

// These three come from the About page.
const values = [
    { title: "Purely Indigenous", text: "A wholly homegrown business built by Nigerians, for Nigeria." },
    { title: "Collaborative Culture", text: "A dedicated team that works together on every project." },
    { title: "Highest Standards", text: "Products and services delivered at edge-cutting standards." },
]

// Plays the video only while it is on screen, so four big videos don't all load at once.
function ServiceVideo({ src, label }) {
    const videoRef = useRef(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return undefined
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                video.play().catch(() => {})
            } else {
                video.pause()
            }
        }, { threshold: 0.3 })

        observer.observe(video)
        return () => observer.disconnect()
    }, [])

    return (
        <video
            ref={videoRef}
            className="services-page-video"
            src={src}
            aria-label={label}
            muted
            loop
            playsInline
            preload="metadata"
        />
    )
}

// One service: a video on one side, the text and the open/close list on the other.
function ServiceRow({ service, reverse }) {
    // Which list item is open. 0 = the first one. null = all closed.
    const [openIndex, setOpenIndex] = useState(0)

    return (
        <section className={`services-page-row${reverse ? " services-page-row--reverse" : ""}`}>
            <div className="services-page-media">
                <ServiceVideo src={service.video} label={`${service.title} at work`} />
            </div>

            <div className="services-page-info">
                <h2>{service.title}</h2>
                <p className="services-page-intro">{service.intro}</p>

                <ul className="services-page-list">
                    {service.details.map((detail, index) => {
                        const isOpen = openIndex === index
                        const panelId = `${service.id}-panel-${index}`

                        return (
                            <li className="services-page-item" key={detail.title}>
                                <button
                                    type="button"
                                    className="services-page-item-button"
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                >
                                    <span>{detail.title}</span>
                                    <span className="services-page-chevron" aria-hidden="true" />
                                </button>

                                <div
                                    className={`services-page-panel${isOpen ? " is-open" : ""}`}
                                    id={panelId}
                                    aria-hidden={!isOpen}
                                >
                                    <div className="services-page-panel-inner">
                                        <p>{detail.text}</p>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}

export default function ServicesPage() {
    return (
        <div className="services-page">
            <section className="services-page-hero">
                <div className="services-page-hero-content">
                    <h1>From the first foundation to the final finish.</h1>
                    <p>
                        Jutem handles building construction, interior finishing, renovation and
                        civil works with one dependable team.
                    </p>
                    <a className="services-page-button" href="/contact">Make an enquiry</a>
                </div>
            </section>

            {services.map((service, index) => (
                <ServiceRow service={service} reverse={index % 2 === 1} key={service.id} />
            ))}

            <section className="services-page-values">
                <div className="services-page-values-inner">
                    <h2>Why work with Jutem</h2>
                    <div className="services-page-values-grid">
                        {values.map((value) => (
                            <div className="services-page-value" key={value.title}>
                                <h3>{value.title}</h3>
                                <p>{value.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="services-page-closing">
                <div className="services-page-closing-inner">
                    <div>
                        <h2>Have a project in mind?</h2>
                        <p>Tell us what you need and our team will be in touch.</p>
                    </div>
                    <a className="services-page-button" href="/contact">Make an enquiry</a>
                </div>
            </section>
        </div>
    )
}
