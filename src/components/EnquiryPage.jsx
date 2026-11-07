import "./EnquiryPage.css"

export default function EnquiryPage() {
  return (
     
   <section className="enquiry-page">
      <div className="enquiry-layout">
        <img
          className="enquiry-image"
          src="/slideshow-image/hero-bg5.webp"
          alt="A construction project"
        />

        <div className="enquiry-card">
          <p className="enquiry-eyebrow">LET'S TALK ABOUT YOUR PROJECT</p>
          <h1>Make an enquiry</h1>
          <p className="enquiry-intro">
            Tell us what you have in mind and our team will be in touch.
          </p>

          <form className="enquiry-form">
            <div className="enquiry-name-fields">
              <label>
                First Name
                <input name="firstName" type="text" placeholder="Enter your first name" required />
              </label>

              <label>
                Last Name
                <input name="lastName" type="text" placeholder="Enter your last name" required />
              </label>
            </div>

            <label>
              Email
              <input name="email" type="email" placeholder="you@example.com" required />
            </label>

            <label>
              How can we help?
              <textarea name="message" rows="5" placeholder="Tell us a little about your project..." required />
            </label>

            <button type="submit">Send enquiry</button>
          </form>
        </div>
      </div>
    </section>
  )
}