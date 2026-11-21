const SITE_URL = "https://www.jutemglobal.com"

export const PAGE_METADATA = {
  "/": {
    title: "JUTEM Global Resources | Building & Civil Engineering Construction in Nigeria",
    description: "JUTEM Global Resources is a premier Nigerian building and civil engineering construction firm. Specializing in residential & commercial construction, interior finishing, renovations, and civil works.",
    path: "/",
  },
  "/about": {
    title: "About Us | JUTEM Global Resources - Construction & Civil Engineering",
    description: "Learn about JUTEM Global Resources, our indigenous Nigerian engineering team, company values, and leadership by Managing Director Engr Julius Airhia (COREN registered).",
    path: "/about",
  },
  "/contact": {
    title: "Contact & Enquiries | JUTEM Global Resources Construction",
    description: "Get in touch with JUTEM Global Resources for residential and commercial construction enquiries across Nigeria. Message on WhatsApp or send an email.",
    path: "/contact",
  },
}

/**
 * Normalizes URL in browser address bar to eliminate duplicate content issues:
 * - Strips trailing slashes (e.g. /about/ -> /about)
 * - Strips /index.html (e.g. /index.html -> /)
 */
export function normalizeURL() {
  if (typeof window === "undefined") return

  const { pathname, search, hash } = window.location
  let normalized = pathname

  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.replace(/\/+$/, "")
  }

  if (normalized.endsWith("/index.html")) {
    normalized = normalized.replace(/\/index\.html$/, "") || "/"
  }

  if (normalized !== pathname) {
    window.history.replaceState(null, "", (normalized || "/") + search + hash)
  }
}

/**
 * Dynamically updates document title, canonical link, and social tags on route changes.
 */
export function updatePageSEO(currentPath) {
  if (typeof document === "undefined") return

  const cleanPath = !currentPath || currentPath === "" ? "/" : currentPath.replace(/\/+$/, "") || "/"
  const seo = PAGE_METADATA[cleanPath] || PAGE_METADATA["/"]

  // 1. Update Title
  document.title = seo.title

  // 2. Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement("meta")
    metaDesc.name = "description"
    document.head.appendChild(metaDesc)
  }
  metaDesc.content = seo.description

  // 3. Update Canonical Tag
  const canonicalHref = `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`
  let canonicalLink = document.querySelector('link[rel="canonical"]')
  if (!canonicalLink) {
    canonicalLink = document.createElement("link")
    canonicalLink.rel = "canonical"
    document.head.appendChild(canonicalLink)
  }
  canonicalLink.href = canonicalHref

  // 4. Update Open Graph Tags
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.content = seo.title

  const ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc) ogDesc.content = seo.description

  const ogUrl = document.querySelector('meta[property="og:url"]')
  if (ogUrl) ogUrl.content = canonicalHref

  // 5. Update Twitter Cards
  const twTitle = document.querySelector('meta[name="twitter:title"]')
  if (twTitle) twTitle.content = seo.title

  const twDesc = document.querySelector('meta[name="twitter:description"]')
  if (twDesc) twDesc.content = seo.description
}
