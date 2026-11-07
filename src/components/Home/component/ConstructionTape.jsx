import "./ConstructionTape.css";

const repetitions = Array.from({ length: 8 });

export default function ConstructionTape() {
    return (
        <section
            className="construction-tape"
            role="img"
            aria-label="JUTEM construction branding"
        >
            <div className="construction-tape__band construction-tape__band--back" aria-hidden="true">
                <div className="construction-tape__track">
                    {[...repetitions, ...repetitions].map((_, index) => (
                        <span className="construction-tape__word" key={index}>
                            JUTEM<span className="construction-tape__separator">•</span>
                        </span>
                    ))}
                </div>
            </div>
            <div className="construction-tape__band construction-tape__band--front" aria-hidden="true">
                <div className="construction-tape__track">
                    {[...repetitions, ...repetitions].map((_, index) => (
                        <span className="construction-tape__word" key={index}>
                            JUTEM<span className="construction-tape__separator">•</span>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}