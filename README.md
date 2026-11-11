# JUTEM Construction

A modern, responsive marketing site for JUTEM Global Resources, a Nigerian building and construction business. The site presents the company’s brand, core values, and service offering through a construction-focused landing page and supporting informational sections.

## Features

- **Home page** with a full-bleed hero section, company introduction, and layered construction imagery.
- **Animated image-trail hero effect** using GSAP for a dynamic pointer-driven motion experience.
- **Services showcase** on the home page with a multi-slide carousel and custom scroll cursor.
- **About section** featuring company background, service categories, and leadership profile.
- **Responsive navigation** with a mobile menu, `Escape` dismissal, and scroll locking while the menu is open.
- **Lenis-powered smooth scrolling** with automatic fallback when reduced motion is enabled.
- **Contact CTA** linking to a prefilled enquiry page and email draft flow.
- **Reusable construction-themed graphic components** for the brand treatment across pages.
- **Responsive styling** tuned for desktop, tablet, and mobile layouts.

## Tech stack

- React 19
- Vite 8
- JavaScript with JSX
- CSS and Tailwind CSS 4
- GSAP for motion effects
- Lenis for smooth scrolling
- styled-components for the contact CTA button
- Oxlint for linting

## Getting started

### Requirements

- Node.js 20.19+ or 22.12+
- npm

### Install and run

```bash
git clone https://github.com/Einstein023/Jutem.git
cd Jutem
npm install
npm run dev
```

Vite will print a local URL in the terminal, usually `http://localhost:5173/`.

To expose the app on the local network:

```bash
npm run dev -- --host 0.0.0.0
```

Then open the network URL shown in the terminal from another device on the same network.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run dev -- --host 0.0.0.0` | Start the app and make it accessible on the local network. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run Oxlint. |

## Pages and navigation

| URL | Current content |
| --- | --- |
| `/` | Home page with hero, About summary, and service carousel |
| `/about` | About page with company profile and values |
| `/contact` | Enquiry form that opens a prefilled email draft |

The navigation includes a Services link in the header, but the site currently renders the services section as part of the home page rather than as a dedicated `/services` route.

## Project structure

```text
.
├── public/
│   ├── hero-bg7.webp
│   ├── logo.svg
│   ├── md-julius-airhia.jpg
│   ├── slider-assets/
│   │   ├── Civil-Work.webp
│   │   ├── Construction.webp
│   │   ├── Interior-Finishing-Video.mp4
│   │   └── Renovation-Video.mp4
│   ├── slideshow-image/
│   └── trail-images/
├── src/
│   ├── components/
│   │   ├── About.css
│   │   ├── About.jsx
│   │   ├── Button.jsx
│   │   ├── EnquiryPage.css
│   │   ├── EnquiryPage.jsx
│   │   ├── Home/
│   │   │   ├── About.css
│   │   │   ├── About.jsx
│   │   │   ├── ConstructionTape.css
│   │   │   ├── ConstructionTape.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── ImageTrail.css
│   │   │   ├── ImageTrail.jsx
│   │   │   ├── Nav.jsx
│   │   │   ├── Services.jsx
│   │   │   └── services.css
│   │   └── ...
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── assets/
├── components.json
├── index.html
├── package.json
├── README.md
├── vite.config.js
└── public/
```

### Main components

- `Home.jsx` composes the landing page, including the hero, about section, construction tape, and services carousel.
- `Nav.jsx` handles the responsive site navigation and mobile menu behaviour.
- `Hero.jsx` renders the home-page hero and configures the animated image trail.
- `ImageTrail.jsx` manages pointer and touch movement and animates trail images with GSAP.
- `Services.jsx` contains the slide-based services showcase and custom wheel/touch navigation.
- `About.jsx` contains the company overview, values, and leadership profile.
- `ConstructionTape.jsx` renders the repeating JUTEM brand treatment used below the page content.
- `EnquiryPage.jsx` renders the contact/request form experience.

## Assets and external resources

Brand, hero, and service media assets are stored in `public/`. The current hero image, service media, and profile image are served from that folder, while the site styling imports Montserrat, Nunito, and Abril Fatface from Google Fonts.

If the project needs to run without external internet access, replace any external font URLs and image references with locally hosted assets.

## Build and deployment

To validate the app before release:

```bash
npm run lint
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static host. Configure the hosting platform to serve `index.html` for client-side routes so direct visits to `/about` and `/contact` work correctly.

## Current content note

Some marketing copy is still best treated as placeholder content until final brand copy is approved by the business owner before launch.
