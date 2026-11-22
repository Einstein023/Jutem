import { useRef, useState } from "react"
import Footer from "./Footer/Footer"
import "./EnquiryPage.css"

/* ==========================================================================
   CONTACT PAGE (/contact)
   Layout matching Haven Constructions aesthetic:
   - Clean architectural white canvas
   - "Let's explore your vision" primary headline
   - Crisp full-width hairline divider
   - Two-column grid: left contact details with dividers, right minimalist form
   ========================================================================== */

const EMAIL = "uhunomaof@gmail.com"
const PHONE = "0483 987 479"
const ADDRESS = "21/46 Graingers Rd, West Footscray VIC 3012, Australia"

export default function EnquiryPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Refs for each field so we can advance focus on Enter
  const firstNameRef = useRef(null)
  const lastNameRef  = useRef(null)
  const phoneRef     = useRef(null)
  const emailRef     = useRef(null)
  const messageRef   = useRef(null)

  /* Advance focus to the next field when Enter is pressed in a text / tel / email input.
     The textarea intentionally keeps default Enter behaviour (new line). */
  const advanceTo = (nextRef) => (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      nextRef.current?.focus()
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const firstName = formData.get("firstName") || ""
    const lastName  = formData.get("lastName")  || ""
    const phone     = formData.get("phone")     || ""
    const email     = formData.get("email")     || ""
    const message   = formData.get("message")   || ""

    const body = [
      `Name: ${firstName} ${lastName}`.trim(),
      `Phone: ${phone}`,
      `Email: ${email}`,
      "",
      "Project details:",
      message,
    ].join("\n")

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      "Website enquiry - " + (firstName || "New Project")
    )}&body=${encodeURIComponent(body)}`

    /* After the mailto link fires we show success. A short delay lets the
       browser open the mail client before we swap the UI. */
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <div className="contact">
      <main id="main-content" className="contact-container">
        {/* Top Headline */}
        <header className="contact-header">
          <h1 className="contact-headline">Let's explore your vision</h1>
        </header>

        {/* Full-width Divider Line */}
        <div className="contact-divider" aria-hidden="true" />

        {/* Two-Column Grid */}
        <div className="contact-grid">
          {/* Left Column: Team tag and contact details */}
          <aside className="contact-left-col" aria-label="Direct contact details">
            <div className="contact-team-tag">
              <span className="contact-square" aria-hidden="true">■</span>
              <span>Speak with our team</span>
            </div>

            <div className="contact-details-list">
              <div className="contact-detail-row">
                <a
                  href={`tel:${PHONE.replace(/\s+/g, "")}`}
                  className="contact-detail-link"
                  aria-label={`Call us at ${PHONE}`}
                >
                  {PHONE}
                </a>
              </div>

              <div className="contact-detail-row">
                <a
                  href={`mailto:${EMAIL}`}
                  className="contact-detail-link"
                  aria-label={`Email us at ${EMAIL}`}
                >
                  {EMAIL}
                </a>
              </div>

              <div className="contact-detail-row">
                <span className="contact-detail-text">
                  {ADDRESS}
                </span>
              </div>
            </div>
          </aside>

          {/* Right Column: Enquiry form or success message */}
          <section className="contact-right-col" aria-label="Enquiry Form">

            {/* ── Success screen ───────────────────────────────────────── */}
            {submitted ? (
              <div className="contact-success" role="alert" aria-live="polite">
                <h2 className="contact-success-heading">Thank you!</h2>
                <p className="contact-success-body">
                  We appreciate you taking the time to reach out. Your enquiry has
                  been received and a member of our team will be in touch with you
                  shortly.
                </p>
                <p className="contact-success-sub">
                  In the meantime, feel free to call us at{" "}
                  <a href={`tel:${PHONE.replace(/\s+/g, "")}`} className="contact-success-link">
                    {PHONE}
                  </a>
                  .
                </p>
              </div>
            ) : (
              /* ── Form ──────────────────────────────────────────────── */
              <>
                <p className="contact-lead-text">
                  Provide your project details below and we'll be in touch.
                </p>

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-field">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      ref={firstNameRef}
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      required
                      autoComplete="given-name"
                      enterKeyHint="next"
                      onKeyDown={advanceTo(lastNameRef)}
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      ref={lastNameRef}
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      required
                      autoComplete="family-name"
                      enterKeyHint="next"
                      onKeyDown={advanceTo(phoneRef)}
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="phone">Phone</label>
                    <input
                      ref={phoneRef}
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Phone"
                      autoComplete="tel"
                      enterKeyHint="next"
                      onKeyDown={advanceTo(emailRef)}
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="email">Email</label>
                    <input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email"
                      required
                      autoComplete="email"
                      enterKeyHint="next"
                      onKeyDown={advanceTo(messageRef)}
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="message">Message</label>
                    <textarea
                      ref={messageRef}
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Tell us about your project..."
                      required
                    />
                  </div>

                  <div className="contact-submit-row">
                    <button
                      type="submit"
                      className={`contact-submit-btn${submitting ? " is-loading" : ""}`}
                      disabled={submitting}
                      aria-label={submitting ? "Sending your enquiry…" : "Send your enquiry"}
                    >
                      {submitting ? (
                        <>
                          <span className="contact-btn-spinner" aria-hidden="true" />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <svg
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}