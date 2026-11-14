import { useEffect, useRef } from "react"

/* ==========================================================================
   BLOCK BUILD  (About page, "Who we are")

   A small modern house made of blocks that goes up as you scroll: foundation,
   ground floor, floor slab, upper floor, roof. Scroll back up and it comes apart again.

   - Drawn on a <canvas> with plain 2D (isometric cubes). No extra library.
   - Colours come from the blue tokens in index.css, so it always matches the site.
   - Reduced motion: the finished house is shown, nothing animates.
   - Only draws while it is on screen.

   To change the building, edit buildModel() below. Each block is one cube at (x, y, z).
   ========================================================================== */

const DROP = 5 // how far above its spot a block starts, in cube heights
const BLOCK_TIME = 0.1 // how long one block takes to land (share of the whole build)
const SMOOTHING = 0.1 // how quickly the picture catches up with the scroll

function buildModel() {
    const cubes = []
    const add = (x, y, z, kind = "wall") => cubes.push({ x, y, z, kind })
    const slab = (x0, x1, y0, y1, z, kind) => {
        for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) add(x, y, z, kind)
    }
    // A ring of walls. `specials` are [x, y, kind] spots that become a window ("glass") or a door.
    const walls = (x0, x1, y0, y1, z, specials = []) => {
        for (let x = x0; x <= x1; x++) {
            for (let y = y0; y <= y1; y++) {
                if (!(x === x0 || x === x1 || y === y0 || y === y1)) continue
                const special = specials.find(([sx, sy]) => sx === x && sy === y)
                add(x, y, z, special ? special[2] : "wall")
            }
        }
    }

    slab(0, 7, 0, 7, 0, "base") // foundation
    walls(1, 6, 1, 6, 1, [[6, 4, "door"], [2, 6, "glass"], [5, 6, "glass"]]) // ground floor
    walls(1, 6, 1, 6, 2, [[6, 4, "door"], [6, 2, "glass"], [3, 6, "glass"], [5, 6, "glass"]]) // upper course
    slab(1, 6, 1, 6, 3, "roof") // roof, stepped like a gable: wide...
    slab(1, 6, 2, 5, 4, "roof") // ...narrower...
    slab(1, 6, 3, 4, 5, "roof") // ...ridge
    add(2, 5, 5, "wall") // chimney
    add(2, 5, 6, "wall")

    // Build bottom to top; inside a layer, back to front with a little natural variation.
    const jitter = (c) => ((c.x * 73 + c.y * 151 + c.z * 37) % 10) / 10 - 0.5
    cubes.sort((a, b) => a.z - b.z || (a.x + a.y + jitter(a)) - (b.x + b.y + jitter(b)))
    cubes.forEach((cube, index) => { cube.order = index / cubes.length })

    // Draw order for the picture: far blocks first, near blocks last.
    const paint = [...cubes].sort((a, b) => (a.x + a.y + a.z) - (b.x + b.y + b.z) || a.z - b.z)
    return { cubes, paint }
}

const COS = Math.cos(Math.PI / 6)
const SIN = 0.5
const project = (x, y, z) => ({ sx: (x - y) * COS, sy: (x + y) * SIN - z })

const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

export default function BlockBuild({ trackRef, buildEnd = 0.55 }) {
    const boxRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(() => {
        const box = boxRef.current
        const canvas = canvasRef.current
        if (!box || !canvas) return undefined
        const ctx = canvas.getContext("2d")
        const { paint } = buildModel()
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        const css = getComputedStyle(document.documentElement)
        const color = (name, fallback) => css.getPropertyValue(name).trim() || fallback
        const shade = (token, fallback) => color(`--color-primary-${token}`, fallback)
        const palettes = {
            base: { top: shade(200, "#b3c9e4"), left: shade(300, "#8caed6"), right: shade(400, "#5587c4") },
            wall: { top: shade(300, "#8caed6"), left: shade(400, "#5587c4"), right: shade(500, "#2b558c") },
            glass: { top: shade(50, "#f0f4f9"), left: shade(100, "#d9e4f1"), right: shade(200, "#b3c9e4") },
            door: { top: shade(700, "#193355"), left: shade(800, "#112239"), right: shade(900, "#08111d") },
            roof: { top: shade(500, "#2b558c"), left: shade(600, "#224470"), right: shade(700, "#193355") },
        }
        const line = color("--color-primary-800", "#112239")

        // Fit the finished house inside the box, centred.
        let bounds = { minX: 0, maxX: 1, minY: 0, maxY: 1 }
        const measure = () => {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
            paint.forEach((c) => {
                for (const dx of [0, 1]) for (const dy of [0, 1]) for (const dz of [0, 1]) {
                    const { sx, sy } = project(c.x + dx, c.y + dy, c.z + dz)
                    minX = Math.min(minX, sx); maxX = Math.max(maxX, sx)
                    minY = Math.min(minY, sy); maxY = Math.max(maxY, sy)
                }
            })
            bounds = { minX, maxX, minY, maxY }
        }
        measure()

        let width = 0
        let height = 0
        let scale = 1
        let originX = 0
        let originY = 0
        let shown = reduceMotion ? 1 : 0
        let target = reduceMotion ? 1 : 0
        let lastDrawn = -1
        let visible = false
        let frame = 0

        const resize = () => {
            const rect = box.getBoundingClientRect()
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            width = rect.width
            height = rect.height
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            const w = bounds.maxX - bounds.minX
            const h = bounds.maxY - bounds.minY
            scale = Math.min((width * 0.86) / w, (height * 0.8) / h)
            originX = width / 2 - ((bounds.minX + bounds.maxX) / 2) * scale
            originY = height * 0.56 - ((bounds.minY + bounds.maxY) / 2) * scale
            lastDrawn = -1
        }

        const point = (x, y, z) => {
            const { sx, sy } = project(x, y, z)
            return [originX + sx * scale, originY + sy * scale]
        }

        const face = (corners, fill) => {
            ctx.beginPath()
            corners.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)))
            ctx.closePath()
            ctx.fillStyle = fill
            ctx.fill()
            ctx.stroke()
        }

        const draw = (progress) => {
            ctx.clearRect(0, 0, width, height)

            // soft ground shadow
            const [gx, gy] = point(4, 4, 0)
            ctx.save()
            ctx.globalAlpha = 0.16 * clamp01(progress * 6)
            ctx.fillStyle = line
            ctx.beginPath()
            ctx.ellipse(gx, gy + scale * 0.9, scale * 5.8, scale * 2.4, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()

            ctx.lineWidth = Math.max(0.6, scale * 0.035)
            ctx.lineJoin = "round"
            ctx.strokeStyle = line

            const span = 1 + BLOCK_TIME
            paint.forEach((c) => {
                const t = clamp01((progress * span - c.order) / BLOCK_TIME)
                if (t <= 0) return
                const z = c.z + (1 - easeOut(t)) * DROP
                ctx.globalAlpha = clamp01(t * 2.5)
                const colors = palettes[c.kind]
                face([point(c.x, c.y, z + 1), point(c.x + 1, c.y, z + 1), point(c.x + 1, c.y + 1, z + 1), point(c.x, c.y + 1, z + 1)], colors.top)
                face([point(c.x, c.y + 1, z), point(c.x + 1, c.y + 1, z), point(c.x + 1, c.y + 1, z + 1), point(c.x, c.y + 1, z + 1)], colors.left)
                face([point(c.x + 1, c.y, z), point(c.x + 1, c.y + 1, z), point(c.x + 1, c.y + 1, z + 1), point(c.x + 1, c.y, z + 1)], colors.right)
            })
            ctx.globalAlpha = 1
        }

        // How far through the build we are, from where the box sits on screen:
        // starts as it enters the bottom of the screen, finished a little before it is centred.
        const readScroll = () => {
            const track = trackRef && trackRef.current
            if (track) {
                // pinned layout: how far we are through the tall track, then the build finishes at buildEnd
                const rect = track.getBoundingClientRect()
                const range = rect.height - window.innerHeight
                return range <= 0 ? 1 : clamp01(-rect.top / range / buildEnd)
            }
            const rect = box.getBoundingClientRect()
            const vh = window.innerHeight
            const start = vh * 0.92
            const end = vh * 0.62 - rect.height / 2
            return clamp01((start - rect.top) / (start - end))
        }

        const tick = () => {
            if (!reduceMotion) {
                target = readScroll()
                shown += (target - shown) * SMOOTHING
                if (Math.abs(target - shown) < 0.0005) shown = target
            }
            if (Math.abs(shown - lastDrawn) > 0.0002) {
                draw(shown)
                lastDrawn = shown
            }
            if (visible) frame = requestAnimationFrame(tick)
        }

        const start = () => {
            if (!visible) return
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(tick)
        }

        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            if (visible) start()
        }, { rootMargin: "200px 0px" })
        observer.observe(box)

        const resizeObserver = new ResizeObserver(() => { resize(); start() })
        resizeObserver.observe(box)
        resize()
        draw(shown)

        return () => {
            visible = false
            cancelAnimationFrame(frame)
            observer.disconnect()
            resizeObserver.disconnect()
        }
    }, [])

    return (
        <figure className="abs-build">
            <div className="abs-build-box" ref={boxRef}>
                <canvas ref={canvasRef} role="img" aria-label="A house going up block by block as you scroll" />
            </div>
        </figure>
    )
}
