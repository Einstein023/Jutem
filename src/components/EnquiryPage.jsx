import "./EnquiryPage.css"

export default function EnquiryPage() {
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

    window.location.href = `mailto:uhunomaof@gmail.com?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="enquiry-page">
      <div className="enquiry-layout">
        <img
          className="enquiry-image"
          src="/slideshow-image/hero-bg5.webp"
          alt=""
        />

        <div className="enquiry-card">
          <p className="enquiry-eyebrow">LET'S TALK ABOUT YOUR PROJECT</p>
          <h1>Make an enquiry</h1>
          <p className="enquiry-intro">
            Tell us what you have in mind and our team will be in touch.
          </p>

          <form className="enquiry-form" onSubmit={handleSubmit} aria-describedby="enquiry-submit-note">
            <div className="enquiry-name-fields">
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

            <button type="submit">Send enquiry</button>
            <p className="enquiry-submit-note" id="enquiry-submit-note">
              This opens your email app with your enquiry ready to send.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}