import { useEffect, useRef, useState } from "react"
import BlockBuild from "./BlockBuild"

/* ==========================================================================
   HOUSE 3D  (About page, "Who we are")

   A real 3D house that goes up as you scroll, brick by brick: foundation, walls laid
   course by course, windows and door, roof tiles, chimney.

   The section is PINNED on screen (see .abs-build-track in About.css), so the house stays
   in view while you scroll. How far you are through the section decides everything:
     0% to BUILD_END   the house is built, and the camera turns slowly around it
     BUILD_END to 100% the house is finished and keeps turning one full circle as you scroll on
   Then the page carries on. To make the build slower or faster, change --abs-track in About.css
   (the scroll length) or BUILD_END below (how much of it is the build).
   Move the mouse over the house and it tilts a little.

   - Built with three.js (real WebGL lighting + shadows). three.js is loaded ONLY when this
     section is close to the screen, so it does not slow down the rest of the site.
   - If the browser has no WebGL, it falls back to the flat block version (BlockBuild.jsx).
   - Colours come from the blue tokens in index.css.
   - Reduced motion: the finished house is shown, nothing animates.
   - Only draws while on screen.

   Sizes are in metres. To change the house, edit the "THE HOUSE" block in buildHouse().
   ========================================================================== */

const BUILD_END = 0.6 // share of the pinned scroll used for building; the rest is the spin
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const phase = (p, from, to) => clamp01((p - from) / (to - from))

export default function House3D() {
    const trackRef = useRef(null)
    const boxRef = useRef(null)
    const canvasRef = useRef(null)
    const [fallback, setFallback] = useState(false)

    useEffect(() => {
        const track = trackRef.current
        const box = boxRef.current
        const canvas = canvasRef.current
        if (!track || !box || !canvas) return undefined
        let disposed = false
        let cleanup = () => {}

        const start = async () => {
            try {
                const THREE = await import("three")
                if (disposed) return
                cleanup = buildHouse(THREE, track, box, canvas)
            } catch (error) {
                console.warn("3D house not available, using the flat version.", error)
                if (!disposed) setFallback(true)
            }
        }

        // Wait until the section is near the screen before downloading three.js.
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                observer.disconnect()
                start()
            }
        }, { rootMargin: "800px 0px" })
        observer.observe(track)

        return () => {
            disposed = true
            observer.disconnect()
            cleanup()
        }
    }, [])

    return (
        <div className="abs-build-track" ref={trackRef}>
            <div className="abs-pin">
                {fallback ? (
                    <BlockBuild trackRef={trackRef} buildEnd={BUILD_END} />
                ) : (
                    <figure className="abs-build">
                        <div className="abs-build-box" ref={boxRef}>
                            <canvas ref={canvasRef} role="img" aria-label="A house being built brick by brick as you scroll, then turning round" />
                        </div>
                    </figure>
                )}
            </div>
        </div>
    )
}

/* -------------------------------------------------------------------------- */

function buildHouse(THREE, track, box, canvas) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const css = getComputedStyle(document.documentElement)
    const tone = (n, fallback) => new THREE.Color(css.getPropertyValue(`--color-primary-${n}`).trim() || fallback)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    const target = new THREE.Vector3(0, 2.0, 0)

    // ---------- Light: soft sky + one sun that casts the shadows ----------
    scene.add(new THREE.HemisphereLight(tone(50, "#f0f4f9"), tone(300, "#8caed6"), 1.5))
    const sun = new THREE.DirectionalLight(0xffffff, 2.6)
    sun.position.set(-3, 14, 6)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.camera.left = -9
    sun.shadow.camera.right = 9
    sun.shadow.camera.top = 9
    sun.shadow.camera.bottom = -9
    sun.shadow.bias = -0.0004
    sun.shadow.normalBias = 0.03
    scene.add(sun)

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.ShadowMaterial({ color: tone(800, "#112239"), opacity: 0.17 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.31
    ground.receiveShadow = true
    scene.add(ground)

    const disposables = []
    const material = (color, extra = {}) => {
        const m = new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...extra })
        disposables.push(m)
        return m
    }
    const unitBox = new THREE.BoxGeometry(1, 1, 1)
    disposables.push(unitBox)

    // ======================== THE HOUSE (edit here) ========================
    const HX = 3.5 // half length  (house is 7 m long)
    const HZ = 2.5 // half width   (and 5 m wide)
    const T = 0.25 // wall thickness = brick depth
    const BL = 0.5 // brick length
    const CH = 0.25 // brick height (one course)
    const COURSES = 12 // wall height: 12 x 0.25 = 3 m
    const GABLE = 6 // extra courses in the triangle ends
    const WALL_TOP = COURSES * CH
    const RISE = GABLE * CH // roof rise, 1.5 m

    // Openings, as [from, to, bottom, top] along the wall.
    const openings = {
        front: [[1.0, 2.0, 0, 2.0, "door"], [-2.75, -1.25, 1.0, 2.5, "window"]],
        back: [[-0.75, 0.75, 1.0, 2.5, "window"]],
        right: [[-0.75, 0.75, 1.0, 2.5, "window"]],
        left: [[-0.75, 0.75, 1.0, 2.5, "window"]],
    }
    // =======================================================================

    // ---------- Bricks: lay a run of wall, course by course, with a running bond ----------
    const bricks = []
    const layRun = (axis, fixed, a, b, course, cuts, extra = {}) => {
        const y0 = course * CH
        const y1 = y0 + CH
        let segments = [[a, b]]
        cuts.forEach(([from, to, bottom, top]) => {
            if (y1 <= bottom + 1e-6 || y0 >= top - 1e-6) return
            segments = segments.flatMap(([s, e]) => {
                if (to <= s || from >= e) return [[s, e]]
                const out = []
                if (from > s) out.push([s, from])
                if (to < e) out.push([to, e])
                return out
            })
        })
        const offset = (course % 2) * (BL / 2)
        segments.forEach(([s, e]) => {
            for (let k = Math.floor((s - offset) / BL) - 1; k <= Math.ceil((e - offset) / BL); k++) {
                const g0 = Math.max(offset + BL * k, s)
                const g1 = Math.min(offset + BL * (k + 1), e)
                if (g1 - g0 < 0.04) continue
                const mid = (g0 + g1) / 2
                const length = (g1 - g0) * 0.965
                const x = axis === "x" ? mid : fixed
                const z = axis === "x" ? fixed : mid
                bricks.push({
                    x, y: y0 + CH / 2, z,
                    sx: axis === "x" ? length : T * 0.97,
                    sy: CH * 0.94,
                    sz: axis === "x" ? T * 0.97 : length,
                    course,
                    ...extra,
                })
            }
        })
    }

    for (let course = 0; course < COURSES + GABLE; course++) {
        const odd = course % 2 === 1
        const inWall = course < COURSES
        if (inWall) {
            // Corners interlock: front/back run through on even courses, the sides on odd ones.
            const fa = odd ? -HX + T : -HX
            const fb = odd ? HX - T : HX
            const sa = odd ? -HZ : -HZ + T
            const sb = odd ? HZ : HZ - T
            layRun("x", HZ - T / 2, fa, fb, course, openings.front)
            layRun("x", -HZ + T / 2, fa, fb, course, openings.back)
            layRun("z", HX - T / 2, sa, sb, course, openings.right)
            layRun("z", -HX + T / 2, sa, sb, course, openings.left)
        } else {
            // The triangle ends under the roof get narrower course by course.
            const top = (course + 1) * CH
            const half = HZ * (1 - (top - WALL_TOP) / RISE)
            if (half > 0.3) {
                layRun("z", HX - T / 2, -half, half, course, [])
                layRun("z", -HX + T / 2, -half, half, course, [])
            }
        }
    }
    // The chimney: two rows of bricks, solid, passing through the roof.
    for (let course = 14; course < 22; course++) {
        layRun("x", 1.125, -2.1, -1.1, course, [], { chimney: true })
        layRun("x", 0.875, -2.1, -1.1, course, [], { chimney: true })
    }

    // Lay order: bottom to top, sweeping round the house inside each course.
    const walls = bricks.filter((b) => !b.chimney)
    const chimney = bricks.filter((b) => b.chimney)
    walls.sort((p, q) => p.course - q.course || Math.atan2(p.z, p.x) - Math.atan2(q.z, q.x))
    chimney.sort((p, q) => p.course - q.course)
    walls.forEach((b, i) => { b.order = i / walls.length })
    // The wall phase value at which every brick of a course has landed.
    const courseDone = []
    walls.forEach((b) => { courseDone[b.course] = Math.max(courseDone[b.course] || 0, b.order) })
    courseDone.forEach((order, course) => { courseDone[course] = (order + 0.05) / (1 + 0.05) })
    chimney.forEach((b, i) => { b.order = i / chimney.length })

    // Walls are one calm blue with a very small variation, and an occasional slightly deeper brick.
    const brickColors = [tone(400, "#5587c4"), tone(400, "#5587c4"), tone(400, "#5587c4"), tone(400, "#5587c4"), tone(500, "#2b558c")]
    const chimneyColors = [tone(600, "#224470")]
    const pick = (list, i) => list[(i * 7 + (i % 5)) % list.length].clone().offsetHSL(0, 0, (((i * 37) % 9) - 4) * 0.006)

    const makeInstanced = (items, colors, castShadow = true) => {
        const mesh = new THREE.InstancedMesh(unitBox, material(0xffffff), items.length)
        items.forEach((item, i) => mesh.setColorAt(i, pick(colors, i)))
        mesh.castShadow = castShadow
        mesh.receiveShadow = true
        mesh.frustumCulled = false
        scene.add(mesh)
        return mesh
    }
    const brickMesh = makeInstanced(walls, brickColors)
    const chimneyMesh = makeInstanced(chimney, chimneyColors)

    // ---------- Foundation slab and the solid core behind the bricks ----------
    const slab = new THREE.Mesh(unitBox, material(tone(200, "#b3c9e4")))
    slab.castShadow = true
    slab.receiveShadow = true
    scene.add(slab)

    const core = new THREE.Mesh(unitBox, material(tone(700, "#193355")))
    core.receiveShadow = true
    scene.add(core)

    // ---------- Roof: tile strips from the eaves up to the ridge, both sides ----------
    const slope = Math.atan(RISE / HZ)
    const eave = 0.3
    const run = HZ + eave
    const roofLength = Math.hypot(run, run * (RISE / HZ))
    const STRIPS = 8
    const roof = []
    for (let i = 0; i < STRIPS; i++) {
        for (const side of [1, -1]) {
            const f = (i + 0.5) / STRIPS
            roof.push({
                x: 0,
                y: WALL_TOP - eave * (RISE / HZ) + run * (RISE / HZ) * f + 0.06,
                z: side * run * (1 - f),
                rx: side * slope,
                sx: HX * 2 + 0.8,
                sy: 0.11,
                sz: roofLength / STRIPS + 0.05,
                order: (i * 2 + (side === 1 ? 0 : 1)) / (STRIPS * 2),
            })
        }
    }
    const roofMesh = makeInstanced(roof, [tone(600, "#224470"), tone(700, "#193355")])
    const ridge = new THREE.Mesh(unitBox, material(tone(800, "#112239")))
    ridge.scale.set(HX * 2 + 0.9, 0.16, 0.4)
    ridge.position.set(0, WALL_TOP + RISE + 0.13, 0)
    ridge.castShadow = true
    scene.add(ridge)
    const chimneyCap = new THREE.Mesh(unitBox, material(tone(800, "#112239")))
    chimneyCap.scale.set(1.25, 0.1, 0.75)
    chimneyCap.position.set(-1.6, 22 * CH + 0.05, 1.0)
    chimneyCap.castShadow = true
    scene.add(chimneyCap)

    // ---------- Windows and door (frame + glass or door leaf), they pop in after the walls ----------
    const frameMat = material(tone(50, "#f0f4f9"))
    const glassMat = material(tone(200, "#b3c9e4"), { transparent: true, opacity: 0.55, roughness: 0.15 })
    const doorMat = material(tone(800, "#112239"))
    const stepMat = material(tone(300, "#8caed6"))
    const parts = []
    const addPart = (group, order) => {
        group.userData.order = order
        scene.add(group)
        parts.push(group)
    }
    const addBox = (group, w, h, d, x, y, z, mat) => {
        const m = new THREE.Mesh(unitBox, mat)
        m.scale.set(w, h, d)
        m.position.set(x, y, z)
        m.castShadow = true
        m.receiveShadow = true
        group.add(m)
    }
    const wallPlanes = {
        front: { fixed: HZ - T / 2, axis: "x", rot: 0 },
        back: { fixed: -HZ + T / 2, axis: "x", rot: Math.PI },
        right: { fixed: HX - T / 2, axis: "z", rot: Math.PI / 2 },
        left: { fixed: -HX + T / 2, axis: "z", rot: -Math.PI / 2 },
    }
    let partIndex = 0
    Object.entries(openings).forEach(([wall, list]) => {
        const plane = wallPlanes[wall]
        list.forEach(([from, to, bottom, top, kind]) => {
            const w = to - from
            const h = top - bottom
            const group = new THREE.Group()
            const mid = (from + to) / 2
            group.position.set(plane.axis === "x" ? mid : plane.fixed, bottom + h / 2, plane.axis === "x" ? plane.fixed : mid)
            group.rotation.y = plane.rot
            const f = 0.1
            addBox(group, w + 0.04, f, 0.34, 0, h / 2 - f / 2 + 0.02, 0, frameMat)
            addBox(group, f, h, 0.34, -w / 2 + f / 2 - 0.02, 0, 0, frameMat)
            addBox(group, f, h, 0.34, w / 2 - f / 2 + 0.02, 0, 0, frameMat)
            if (kind === "window") {
                addBox(group, w + 0.04, f, 0.34, 0, -h / 2 + f / 2 - 0.02, 0, frameMat)
                addBox(group, w, h, 0.04, 0, 0, 0, glassMat)
                addBox(group, w + 0.3, 0.07, 0.45, 0, -h / 2 - 0.02, 0.06, frameMat)
                addBox(group, 0.05, h, 0.06, 0, 0, 0, frameMat)
            } else {
                addBox(group, w - f * 2 + 0.06, h - f + 0.02, 0.1, 0, -f / 2, -0.03, doorMat)
                addBox(group, 0.07, 0.07, 0.1, w / 2 - 0.25, -0.05, 0.05, frameMat)
                const step = new THREE.Mesh(unitBox, stepMat)
                step.scale.set(w + 0.5, 0.12, 0.5)
                step.position.set(0, -h / 2 + 0.06, 0.45)
                step.castShadow = true
                step.receiveShadow = true
                group.add(step)
            }
            addPart(group, partIndex++ / 5)
        })
    })

    // ---------- Animation ----------
    const dummy = new THREE.Object3D()
    const BRICK_TIME = 0.05
    const applyItems = (mesh, items, q, drop) => {
        items.forEach((item, i) => {
            const t = clamp01((q * (1 + BRICK_TIME) - item.order) / BRICK_TIME)
            if (t <= 0) {
                dummy.scale.setScalar(0.0001)
                dummy.position.set(item.x, item.y, item.z)
            } else {
                const pop = clamp01(t * 3)
                dummy.position.set(item.x, item.y + (1 - easeOut(t)) * drop, item.z)
                dummy.scale.set(item.sx * pop, item.sy * pop, item.sz * pop)
            }
            dummy.rotation.set(item.rx || 0, 0, 0)
            dummy.updateMatrix()
            mesh.setMatrixAt(i, dummy.matrix)
        })
        mesh.instanceMatrix.needsUpdate = true
    }

    const render = (p, pointer) => {
        const b = clamp01(p / BUILD_END) // build progress
        const spin = phase(p, BUILD_END, 1) // turning after the build
        const smooth = spin * spin * (3 - 2 * spin)
        const slabT = easeOut(phase(b, 0, 0.08))
        slab.scale.set(8.3 * (0.85 + 0.15 * slabT), 0.3 * slabT + 0.0001, 6.3 * (0.85 + 0.15 * slabT))
        slab.position.set(0, -0.3 + 0.15 * slabT, 0)

        const wallQ = phase(b, 0.06, 0.64)
        applyItems(brickMesh, walls, wallQ, 0.8)
        // the dark core grows with the finished courses, so the gaps between bricks read as mortar
        let laid = 0
        while (laid < COURSES && wallQ >= courseDone[laid]) laid++
        core.visible = laid > 0
        const coreHeight = Math.max(laid * CH - 0.18, 0.001) // a little below the wall tops, like an inner floor
        core.scale.set(HX * 2 - T * 2 + 0.02, coreHeight, HZ * 2 - T * 2 + 0.02)
        core.position.set(0, coreHeight / 2, 0)

        const partsQ = phase(b, 0.5, 0.7)
        parts.forEach((part) => {
            const t = clamp01((partsQ * 1.4 - part.userData.order) / 0.4)
            part.scale.setScalar(Math.max(easeOut(t), 0.0001))
            part.visible = t > 0
        })

        const roofQ = phase(b, 0.64, 0.88)
        applyItems(roofMesh, roof, roofQ, 1.6)
        ridge.visible = roofQ > 0.92
        const chimneyQ = phase(b, 0.84, 0.97)
        applyItems(chimneyMesh, chimney, chimneyQ, 1.0)
        chimneyCap.visible = chimneyQ > 0.96

        // The camera turns slowly round the house as it goes up.
        const azimuth = THREE.MathUtils.degToRad(16 + 40 * b + 360 * smooth + pointer * 7)
        const elevation = THREE.MathUtils.degToRad(23)
        // Stand far enough back that the whole house fits at every angle, whatever shape the box is.
        const aspect = camera.aspect || 1.25
        const vfov = THREE.MathUtils.degToRad(camera.fov)
        const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect)
        const distance = 5.4 / Math.sin(Math.min(vfov, hfov) / 2)
        camera.position.set(
            target.x + Math.sin(azimuth) * Math.cos(elevation) * distance,
            target.y + Math.sin(elevation) * distance,
            target.z + Math.cos(azimuth) * Math.cos(elevation) * distance,
        )
        camera.lookAt(target)
        renderer.render(scene, camera)
    }

    // ---------- Scroll, size and loop ----------
    // How far through the pinned section we are: 0 when it pins, 1 when it lets go.
    const readScroll = () => {
        const rect = track.getBoundingClientRect()
        const range = rect.height - window.innerHeight
        return range <= 0 ? 1 : clamp01(-rect.top / range)
    }

    let shown = reduceMotion ? 1 : 0
    let pointer = 0
    let pointerShown = 0
    let lastKey = ""
    let visible = false
    let frame = 0

    const resize = () => {
        const rect = box.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.setSize(rect.width, rect.height, false)
        camera.aspect = rect.width / rect.height
        camera.updateProjectionMatrix()
        lastKey = ""
    }

    const tick = () => {
        if (!reduceMotion) {
            const goal = readScroll()
            shown += (goal - shown) * 0.1
            if (Math.abs(goal - shown) < 0.0005) shown = goal
            pointerShown += (pointer - pointerShown) * 0.08
        }
        const key = `${shown.toFixed(4)}|${pointerShown.toFixed(3)}`
        if (key !== lastKey) {
            render(shown, pointerShown)
            lastKey = key
        }
        if (visible) frame = requestAnimationFrame(tick)
    }
    const begin = () => {
        if (!visible) return
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(tick)
    }

    const onPointerMove = (event) => {
        if (reduceMotion || event.pointerType === "touch") return
        const rect = box.getBoundingClientRect()
        pointer = (event.clientX - rect.left) / rect.width - 0.5
        begin()
    }
    const onPointerLeave = () => { pointer = 0; begin() }

    const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible) begin()
    }, { rootMargin: "200px 0px" })
    visibility.observe(track)
    const sizeWatcher = new ResizeObserver(() => { resize(); begin() })
    sizeWatcher.observe(box)
    box.addEventListener("pointermove", onPointerMove)
    box.addEventListener("pointerleave", onPointerLeave)

    resize()
    render(shown, 0)

    return () => {
        visible = false
        cancelAnimationFrame(frame)
        visibility.disconnect()
        sizeWatcher.disconnect()
        box.removeEventListener("pointermove", onPointerMove)
        box.removeEventListener("pointerleave", onPointerLeave)
        disposables.forEach((item) => item.dispose())
        ground.geometry.dispose()
        ground.material.dispose()
        renderer.dispose()
    }
}