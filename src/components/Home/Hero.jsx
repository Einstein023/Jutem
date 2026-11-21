import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ImageTrail from "./ImageTrail";

const slideshowImages = [
    "/slideshow-image/hero-bg1.webp",
    "/slideshow-image/hero-bg3.webp",
    "/slideshow-image/hero-bg4.webp",
    "/slideshow-image/hero-bg5.webp",
];

const constructionImages = [
    "/trail-images/trail-01.jpg",
    "/trail-images/trail-02.jpg",
    "/trail-images/trail-03.jpg",
    "/trail-images/trail-04.jpg",
    "/trail-images/trail-05.jpg",
    "/trail-images/trail-06.jpg"
];

function RiseHeading({ text }) {
    let count = 0;
    return (
        <>
            <span className="hero-sr">{text}</span>
            <span aria-hidden="true">
                {text.split(" ").map((word, wordIndex, words) => (
                    <span className="hero-word" key={`${word}-${wordIndex}`}>
                        {word.split("").map((letter) => {
                            const index = count++;
                            return (
                                <span className="hero-mask" key={index}>
                                    <span className="hero-letter" data-index={index}>{letter}</span>
                                </span>
                            );
                        })}
                        {wordIndex < words.length - 1 ? "\u00a0" : ""}
                    </span>
                ))}
            </span>
        </>
    );
}

export default function Hero() {
    const [activeSlide, setActiveSlide] = useState(0);
    const heroRef = useRef(null);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

        const intervalId = window.setInterval(() => {
            setActiveSlide(current => (current + 1) % slideshowImages.length);
        }, 5000);

        return () => window.clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const node = heroRef.current;
        if (!node) return;

        const letters = node.querySelectorAll(".hero-letter");
        const paragraph = node.querySelector(".hero-content-p");
        const cta = node.querySelector(".hero-cta");

        const ctx = gsap.context(() => {
            const hasCurtain = Boolean(document.getElementById("initial-curtain"));
            const tl = gsap.timeline({ delay: hasCurtain ? 0.75 : 0.2 });

            if (letters.length) {
                gsap.set(letters, { yPercent: 110 });
                tl.to(
                    letters,
                    {
                        yPercent: 0,
                        duration: 1,
                        stagger: 0.025,
                        ease: "power3.out",
                    }
                );
            }

            if (paragraph) {
                tl.fromTo(
                    paragraph,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                    },
                    "-=0.5"
                );
            }

            if (cta && window.innerWidth <= 1023) {
                tl.fromTo(
                    cta,
                    { opacity: 0, y: 16 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: "power2.out",
                    },
                    "-=0.45"
                );
            }
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div>
            <section className="hero" ref={heroRef}>
                <div className="hero-background" aria-hidden="true">
                    {slideshowImages.map((image, index) => (
                        <div
                            className={`hero-background-image${index === activeSlide ? " is-active" : ""}`}
                            key={image}
                            style={{ backgroundImage: `url("${image}")` }}
                        />
                    ))}
                </div>
                <div className="hero-trail" aria-hidden="true">
                    <ImageTrail
                        items={constructionImages}
                        size={190}
                        threshold={80}
                        appearScale={1}
                        zoom={1}
                        flash={0}
                        radius={15}
                        lifetime={0.25}
                        exitScale={0.2}
                        drift={0}
                        rotation={0}
                        sizeVariance={0}
                        alignToMotion={false}
                        stack={0}
                        tilt={0}
                    />
                </div>
                <div className="hero-wrapper">
                    <div className="hero-content">
                        <h1>
                            <RiseHeading text="Solid Foundations. Straightforward Service." />
                        </h1>
                        <p className="hero-content-p">
                            We bring skilled teams together to handle residential and commercial construction
                            across Nigeria - focusing on clean execution, solid materials, and zero guesswork from start to finish.
                        </p>
                        <a className="hero-cta" href="/contact">
                            Let&apos;s Talk
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}