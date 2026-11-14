import { Fragment, useEffect, useRef } from "react"
import Footer from "./Footer/Footer"
import "./EnquiryPage.css"

/* ==========================================================================
   CONTACT PAGE  (/contact)

   One light-blue screen, like the rest of the site: the heading rises in letter by
   letter, the buttons and details sit on the left and the enquiry form sits in a
   white card on the right. Blocks fade up one after another (layout and motion come
   from the reference video). The same footer as the other pages follows.

   The form still opens the visitor's email app, exactly as before.

   PLACEHOLDER: add your real WhatsApp number and social page links in the block
   below. Until then the icons open each site's home page.
   ========================================================================== */

const EMAIL = "uhunomaof@gmail.com"

// WhatsApp number in international format with no + or spaces, e.g. "2348012345678"
const WHATSAPP_NUMBER = ""

const WHATSAPP_URL = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/"

const socials = [
  { label: "WhatsApp", href: WHATSAPP_URL, icon: "whatsapp" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
]

/* Line icons are stroked paths; brand icons are filled paths. */
const ICONS = {
  arrow: { stroke: ["M5 12h14", "m12 5 7 7-7 7"] },
  mail: { stroke: ["M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z", "m3 7 9 6 9-6"] },
  instagram: {
    stroke: [
      "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z",
      "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
      "M17.5 6.5h.01",
    ],
  },
  linkedin: {
    fill: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  facebook: {
    fill: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647z",
  },
  whatsapp: {
    fill: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z",
  },
}

function Icon({ name, size = 16 }) {
  const icon = ICONS[name]
  if (icon.fill) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d={icon.fill} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icon.stroke.map((d) => <path d={d} key={d} />)}
    </svg>
  )
}

/* Heading that rises in letter by letter. Each letter sits in a mask and slides up.
   Words stay together so the line wraps between words, never inside one. */
function RiseText({ text }) {
  let count = 0
  return (
    <>
      <span className="contact-sr">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, wordIndex) => (
          <Fragment key={wordIndex}>
            {wordIndex > 0 && " "}
            <span className="contact-word">
              {word.split("").map((letter) => {
                const index = count++
                return (
                  <span className="contact-mask" key={index}>
                    <span className="contact-letter" style={{ "--i": index }}>{letter}</span>
                  </span>
                )
              })}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  )
}

export default function EnquiryPage() {
  const pageRef = useRef(null)

  /* Fade each block up the first time it scrolls into view. */
  useEffect(() => {
    const page = pageRef.current
    if (!page) return undefined

    const items = page.querySelectorAll(".contact-reveal")
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-in"))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add("is-in")
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const body = [
      `Name: ${formData.get("firstName")} ${formData.get("lastName")}`,
      `Email: ${formData.get("email")}`,
      "",
      "Project details:",
      formData.get("message")
    ].join("\n")

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="contact" ref={pageRef}>
      <section className="contact-main" id="get-in-touch">
        <div className="contact-info">
          <p className="contact-eyebrow contact-reveal">LET'S TALK ABOUT YOUR PROJECT</p>
          <h2 className="contact-title"><RiseText text="Make an enquiry" /></h2>
          <p className="contact-lead contact-reveal" style={{ "--d": "0.16s" }}>
            Tell us what you have in mind and our team will be in touch.
          </p>

          <div className="contact-actions contact-reveal" style={{ "--d": "0.24s" }}>
            <a className="contact-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Message on WhatsApp <Icon name="whatsapp" size={16} />
            </a>
            <a className="contact-button contact-button-outline" href={`mailto:${EMAIL}`}>
              Send an email <Icon name="mail" size={16} />
            </a>
          </div>

          <div className="contact-rows">
            <div className="contact-row contact-reveal" style={{ "--d": "0.32s" }}>
              <span className="contact-row-label">Email</span>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </div>
            <div className="contact-row contact-reveal" style={{ "--d": "0.4s" }}>
              <span className="contact-row-label">Serving</span>
              <p>Residential and commercial projects across Nigeria</p>
            </div>
            <div className="contact-row contact-reveal" style={{ "--d": "0.48s" }}>
              <span className="contact-row-label">Elsewhere</span>
              <ul className="contact-socials">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} title={social.label}>
                      <Icon name={social.icon} size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="contact-card contact-reveal" style={{ "--d": "0.2s" }}>
          <form className="contact-form" onSubmit={handleSubmit} aria-describedby="enquiry-submit-note">
            <div className="contact-name-fields">
              <label>
                First Name
                <input name="firstName" type="text" autoComplete="given-name" placeholder="Enter your first name" required />
              </label>

              <label>
                Last Name
                <input name="lastName" type="text" autoComplete="family-name" placeholder="Enter your last name" required />
              </label>
            </div>

            <label>
              Email
              <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </label>

            <label>
              How can we help?
              <textarea name="message" rows="5" placeholder="Tell us a little about your project..." required />
            </label>

            <button className="contact-button contact-submit" type="submit">
              Send enquiry <Icon name="arrow" size={16} />
            </button>
            <p className="contact-note" id="enquiry-submit-note">
              This opens your email app with your enquiry ready to send.
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}