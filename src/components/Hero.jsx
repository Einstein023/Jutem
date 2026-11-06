import { useEffect, useState } from "react";
import ImageTrail from "./ImageTrail";

const slideshowImages = [
    "/slideshow-image/hero-bg1.jpg",
    "/slideshow-image/hero-bg2.jpg",
    "/slideshow-image/hero-bg3.jpg",
    "/slideshow-image/hero-bg4.jpg",
    "/slideshow-image/hero-bg5.jpg",
    "/slideshow-image/hero-bg6.jpg",
    "/slideshow-image/hero-bg7.webp"
];

const constructionImages = [
    "/trail-images/trail-01.jpg",
    "/trail-images/trail-02.jpg",
    "/trail-images/trail-03.jpg",
    "/trail-images/trail-04.jpg",
    "/trail-images/trail-05.jpg",
    "/trail-images/trail-06.jpg"
];

export default function Hero() {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

        const intervalId = window.setInterval(() => {
            setActiveSlide(current => (current + 1) % slideshowImages.length);
        }, 10000);

        return () => window.clearInterval(intervalId);
    }, []);

    return (
        <section className="hero">
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
                    lifetime={0.4}
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
                <h1>Welcome to Jutem Construction</h1>
                {/* <Button /> */}
                <p className="hero-content-p">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores atque molestiae consequatur deserunt autem hic, velit aliquid? Omnis, harum laborum?</p>
            </div>
            </div>
        </section>
    )
}