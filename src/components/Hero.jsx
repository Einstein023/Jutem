import Button from "./Button";
import ImageTrail from "./ImageTrail";

const constructionImages = [
    "https://picsum.photos/id/287/300/300",
    "https://picsum.photos/id/1001/300/300",
    "https://picsum.photos/id/1025/300/300",
    "https://picsum.photos/id/1026/300/300",
    "https://picsum.photos/id/1027/300/300",
    "https://picsum.photos/id/1028/300/300",
    "https://picsum.photos/id/1029/300/300",
    "https://picsum.photos/id/1030/300/300"
];

export default function Hero() {
    return (
        <section className="hero">
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
            <div className="hero-content">
                <h1>Welcome to JUTEM CONSTRUCTION</h1>
                {/* <Button /> */}
            </div>
                <p className="hero-content-p">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores atque molestiae consequatur deserunt autem hic, velit aliquid? Omnis, harum laborum?</p>
        </section>
    )
}