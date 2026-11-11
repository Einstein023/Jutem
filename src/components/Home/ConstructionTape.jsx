import "./ConstructionTape.css";

const statementItems = [
  "FROM FOUNDATION TO COMPLETION",
  "BUILT WITH ABSOLUTE CLARITY",
  "PRECISION ON SITE",
  "ZERO COMPROMISE"
];

const pitchMicroItems = [
  "STRUCTURE & CIVIL WORKS",
  "SCHEDULE FIDELITY",
  "FULL ACCOUNTABILITY",
  "QUALITY FINISHES"
];

export default function ConstructionTapePitch() {
  return (
    <section 
      className="pitch-tape-section" 
      aria-label="Jutem Construction Standards and Commitment"
    >
      {/* Kreisson-Style Oversized Editorial Headline Marquee */}
      <div className="editorial-marquee" aria-hidden="true">
        <div className="editorial-marquee__track">
          {[...statementItems, ...statementItems].map((text, idx) => (
            <div key={`statement-${idx}`} className="editorial-marquee__item">
              <span className="editorial-marquee__text">{text}</span>
              <span className="editorial-marquee__dot">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Intersecting / Layered Construction Brand Tape */}
      <div className="construction-tape__band" aria-hidden="true">
        <div className="construction-tape__track">
          {[...pitchMicroItems, ...pitchMicroItems, ...pitchMicroItems].map((item, idx) => (
            <span key={`tape-${idx}`} className="construction-tape__word">
              {item} <span className="construction-tape__separator">///</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}