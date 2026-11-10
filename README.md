# JUTEM Construction

A responsive company website for JUTEM Global Resources, a Nigerian building and construction business. The project currently includes a construction-focused home page and an About page, with responsive navigation, an animated image trail, and branded construction-tape artwork.

## Features

- **Home page** with a full-bleed construction image, introductory copy, and an interactive image trail.
- **About page** with company information, values, a services overview, and a Managing Director profile.
- **Responsive navigation** with a mobile dropdown, keyboard dismissal using `Escape`, and page-scroll locking while the menu is open.
- **Lenis-powered smooth page scrolling**, automatically disabled when reduced motion is requested.
- **Contact Us call to action** in the desktop navigation and on the About page.
- **Construction-tape graphic** built as a reusable React component.
- **Responsive styling** for desktop, tablet, and mobile layouts.
- **Reduced-motion support** for the animated image trail and navigation transitions.

## Tech stack

- React 19
- Vite 8
- JavaScript with JSX
- CSS, with Tailwind CSS 4 included in the stylesheet setup
- GSAP for image-trail animation
- Lenis for smooth page scrolling
- styled-components for the Contact Us button
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

Vite prints the local development URL in the terminal, usually `http://localhost:5173/`.

To access the development server from another device on the same local network, start it with:

```bash
npm run dev -- --host 0.0.0.0
```

Then open the network URL printed by Vite on the other device. Both devices must be connected to the same network, and the computer's firewall must allow the selected port.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run dev -- --host 0.0.0.0` | Start the server and make it accessible on the local network. |
| `npm run build` | Create the production build in `dist/`. |
| `npm run preview` | Preview the production build locally. Run `npm run build` first. |
| `npm run lint` | Run Oxlint. |

## Pages and navigation

| URL | Current content |
| --- | --- |
| `/` | Home page |
| `/about` | About page |
| `/contact` | Enquiry form that opens a prefilled email draft |

The navigation also includes a Services link, but a dedicated `/services` page has not been implemented yet.

## Project structure

```text
.
├── public/
│   ├── logo.svg
│   ├── hero-bg5.webp
│   ├── hero-bg6.webp
│   ├── hero-bg7.webp
│   ├── md-julius-airhia.jpg
│   └── trail-images/
├── src/
│   ├── components/
│   │   ├── About.jsx
│   │   ├── About.css
│   │   ├── Button.jsx
│   │   ├── ConstructionTape.jsx
│   │   ├── ConstructionTape.css
│   │   ├── Hero.jsx
│   │   ├── ImageTrail.jsx
│   │   ├── ImageTrail.css
│   │   └── Nav.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

### Main components

- `Nav.jsx` contains the responsive site navigation and menu state.
- `Hero.jsx` renders the home-page hero and configures the image trail.
- `ImageTrail.jsx` handles pointer and touch movement and animates trail images with GSAP.
- `About.jsx` contains the company overview, service summaries, values, and leadership profile.
- `ConstructionTape.jsx` renders the repeated JUTEM branding below the page content.
- `index.css` contains global design tokens, navigation styles, and home-page styling.

## Assets and external resources

Brand and profile assets are stored in `public/`. The current hero image is `/hero-bg7.webp`, and the About page uses `/md-julius-airhia.jpg`.

The image-trail examples in `Hero.jsx` currently load from Picsum Photos, and the stylesheet imports Montserrat, Nunito, and Abril Fatface from Google Fonts. These resources require internet access. Replace those URLs with approved local or production assets if the site needs to work without external requests.

## Build and deployment

Create and verify a production build:

```bash
npm run lint
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static hosting provider. Configure the host to serve `index.html` for client-side routes so direct visits and refreshes at `/about` continue to work.

## Current content note

The home-page paragraph is placeholder copy. Review and replace it with approved company messaging before publishing the site.
