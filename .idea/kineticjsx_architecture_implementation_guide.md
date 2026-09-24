# KineticJSX: The Complete Architecture & Implementation Guide

A blueprint for building and deploying a lightweight, code-driven video synthesis platform on Vercel that animates SVGs, PNGs, and typography into short clips (≤ 60 seconds).

---

## 1. Project Overview & Vision

* **App Name:** KineticJSX
* **Core Function:** Generate smooth motion graphics, kinetic typography, and vector animations using React/JSX, with in-browser frame-accurate video export.
* **Target Clip Length:** Up to 60 seconds (typically 5–30 second high-impact clips).
* **Target Deployment:** 100% serverless, zero-maintenance hosting on **Vercel** for low friction and zero server costs.
* **Key Use Cases:**
  * Product launch teasers and feature callouts.
  * Animated metric counters and Bento grids.
  * Kinetic typography reels for social media (TikTok, Instagram Reels, X/Twitter).
  * Programmatic SVG morphing and branded motion assets.

---

## 2. Fundamental Architectural Decision: Client vs. Server Rendering

A 60-second clip at $30\text{ fps}$ produces **1,800 discrete frames**; at $60\text{ fps}$, that jumps to **3,600 frames**.

| Characteristic | Option A: In-Browser Client Engine (Recommended) | Option B: Server Headless Chromium |
| :--- | :--- | :--- |
| **Hosting Cost** | **$0** (Runs entirely on user's hardware) | High (Requires Docker, GPU, or AWS Lambda) |
| **Vercel Suitability** | **Native** (Static or Next.js App Router) | Fails (Serverless functions timeout after 10–60s) |
| **Setup Complexity** | Low (Single repository, no infrastructure) | High (Requires Redis queue, Puppeteer, S3) |
| **Export Format** | WebM / Canvas capture / WebCodecs MP4 | Native MP4 via system FFmpeg |
| **Rendering Speed** | Dependent on user CPU/GPU | Scalable across distributed workers |

> **Conclusion:** By using an **in-browser deterministic loop** via HTML5 Canvas, WebCodecs, or `MediaRecorder`, KineticJSX can be deployed directly to Vercel as a static SPA or standard Next.js app. Your friends can use it immediately with zero infrastructure cost to you.

---

## 3. The Math of Deterministic Animation

Traditional web animations use wall-clock time (`requestAnimationFrame`, `Date.now()`, or CSS transitions like `transition: all 0.3s ease`). **These will fail during video export** because headless or step-by-step rendering advances frame-by-frame regardless of real-world elapsed time.

In KineticJSX, **every visual property is a pure mathematical function of the current frame number ($f$):**

$$\text{Property} = \mathcal{F}(\text{frame})$$

### 3.1 Linear and Clamped Interpolation

Maps a frame range $[a, b]$ to an output value range $[x, y]$:

$$\text{progress} = \frac{f - a}{b - a}, \quad \text{clamped to } [0, 1]$$
$$\text{output} = x + \text{progress} \cdot (y - x)$$

Used for:
* Fading opacity from $0$ to $1$ over frames 15 to 30.
* Translating text vertically from $Y = 60\text{px}$ to $Y = 0\text{px}$.
* Rotating an SVG vector from $0^\circ$ to $360^\circ$.

### 3.2 Physics-Based Damped Harmonic Spring

To get snappy, Apple-style animations without manual Bézier curve tuning, use a damped spring equation:

$$m \frac{d^2x}{dt^2} + c \frac{dx}{dt} + k x = 0$$

Where:
* $m$ = mass
* $k$ = stiffness (spring constant)
* $c$ = damping coefficient
* $\zeta = \frac{c}{2\sqrt{km}}$ (damping ratio)
* $\omega_0 = \sqrt{\frac{k}{m}}$ (undamped natural frequency)

When underdamped ($\zeta < 1$):

$$\omega_d = \omega_0 \sqrt{1 - \zeta^2}$$
$$x(t) = 1 - e^{-\zeta \omega_0 t} \left[ \cos(\omega_d t) + \frac{\zeta \omega_0}{\omega_d} \sin(\omega_d t) \right]$$

In code, this calculates the exact scale or position at frame $f$ without accumulating delta-time drift.

---

## 4. Asset Management (SVGs, PNGs, Fonts)

When generating video clips from code, assets must be loaded deterministically before recording begins:

1. **Local Asset Uploads:**
   * Allow users to upload SVG vectors and transparent PNG files via an `<input type="file" />`.
   * Convert uploads to local Object URLs (`URL.createObjectURL(file)`) or base64 strings so they render instantaneously without hitting external storage buckets.
2. **SVG Handling:**
   * Render SVGs as vector paths inside the canvas or directly in an offscreen DOM tree.
   * Path lengths can be animated deterministically using `stroke-dasharray` and `stroke-dashoffset` driven by `interpolate(frame, [0, 60], [pathLength, 0])`.
3. **Typography:**
   * Ensure web fonts (e.g., Inter, Montserrat, JetBrains Mono) are preloaded using the `document.fonts.ready` API before the export starts to prevent Flash of Unstyled Text (FOUT) in rendered frames.

---

## 5. Timeline, Canvas & Export Pipeline

### 5.1 Playback Loop (Preview Mode)
* Uses `requestAnimationFrame` to step `currentFrame` forward at real-world $30\text{ fps}$.
* Provides scrubbable timeline slider, play/pause, jump-to-start, and loop controls.

### 5.2 Export Pipeline (Render Mode)
1. **Pause playback** and reset `currentFrame = 0`.
2. **Initialize Recorder:**
   * Capture stream from the canvas: `const stream = canvas.captureStream(fps);`
   * Open `MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' })`.
3. **Step-by-Step Frame Drawing:**
   * For frame $f = 0$ to $f = \text{totalFrames}$:
     * Calculate spring and interpolation math for frame $f$.
     * Clear and paint background, SVGs, images, and text onto the canvas context.
     * Call `MediaRecorder.requestData()` or wait for next canvas tick.
4. **Finalization:**
   * Compile gathered `Blob` chunks into a downloadable `.webm` or `.mp4` file.
   * Trigger automatic browser download via dynamic `<a>` tag.

---

## 6. Aspect Ratio Presets

KineticJSX supports standard social and web dimensions:

| Format | Resolution | Aspect Ratio | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **Landscape** | $1920 \times 1080$ / $1280 \times 720$ | 16:9 | YouTube, Web banners, Pitch decks |
| **Vertical / Reel** | $1080 \times 1920$ / $720 \times 1280$ | 9:16 | TikTok, Instagram Reels, YouTube Shorts |
| **Square** | $1080 \times 1080$ / $720 \times 720$ | 1:1 | LinkedIn, Instagram feeds, X posts |

---

## 7. Recommended Technology Stack

* **Core Framework:** React 18+ / Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + Lucide React (Icons)
* **Code Editor (Optional Upgrade):** `@monaco-editor/react` (for VS Code-style editing in-browser)
* **Video Primitives:** Remotion (`remotion` & `@remotion/player`) or custom deterministic Canvas engine
* **Encoding:**
  * Native: HTML5 `canvas.captureStream()` + `MediaRecorder` (Fastest, zero dependencies)
  * Advanced: `@ffmpeg/ffmpeg` (Wasm) or `@mediacoder` for client-side MP4 transcode

---

## 8. Deployment on Vercel

Because the app performs all rendering inside the browser:

1. Push your repository to GitHub / GitLab.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. Set Build Command to standard Next.js (`next build`) or Vite (`vite build`).
4. **Deploy.** 
   * Zero environment variables required for basic usage.
   * No Docker containers or background worker costs.
   * Share the generated Vercel URL with your friends to start creating clips immediately.

---

## 9. Phased Roadmap for Scaling

* **Phase 1 (MVP - Current):** Single-page studio with preset scenes, parameter controls, local SVG/PNG upload, interactive scrubber, and client-side WebM recording.
* **Phase 2 (Code Sandboxing):** Add Monaco Editor to allow typing arbitrary JSX and compiling live via Babel Standalone in a Web Worker.
* **Phase 3 (Audio Support):** Synchronize background music tracks and waveform visualizers to frame indices.
* **Phase 4 (Cloud Lambda Export - Optional):** If friends require guaranteed 4K ProRes or H.264 MP4 renders, attach `@remotion/lambda` running on AWS Lambda for multi-threaded distributed frame compilation.