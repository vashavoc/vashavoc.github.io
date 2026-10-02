# Streaming redesign preview

The approved redesign is now the production `index.html`, including the hand-drawn VAS logo and swapped photos. The existing analytics and canonical URL are preserved. `preview.html` remains a noindex, analytics-free design preview.

Open `preview.html` directly, or serve the repository:

    python3 -m http.server 8765 --bind 127.0.0.1

Then open http://127.0.0.1:8765/preview.html.

## Latest local portrait rotation (awaiting review)

The attached streaming-setup photo (`vas-setup.webp`) is kept only in About, not in the hero rotation. The hero rotates through the other four supplied photos in their original order: `vas-shirt.webp`, `vas-purple-room.webp`, `vas-outdoors.webp`, and `vas-red-hoodie.webp`. The black-and-white VAS-shirt portrait is the default. The MW4 artwork and gradient blend stay fixed; portraits crossfade over one second, with eight seconds between advances. Each photo has its own face-preserving crop.

The controls provide Pause/Play and Previous/Next. Manual browsing stays paused. Autoplay pauses on hover, keyboard focus, or a hidden tab, and stops when the Twitch player replaces the poster. Reduced-motion mode starts paused and disables the fade; without JavaScript, the default VAS-shirt photo remains visible and slideshow controls stay hidden. Failed or not-yet-loaded photos are skipped without replacing the last good frame.

The five local WebP copies total 373016 bytes and contain no EXIF/XMP metadata. The original Photos Library files were only read; nothing in the library was modified. The smaller purple-room source remains at its original 480×360 resolution rather than being upscaled.

Verified: 12 Python tests and four Node suites; real browser navigation through the four remaining portraits in order, wraparound, and the unchanged About photo. The unchanged carousel behavior was previously checked for real autoplay/pause, keyboard Enter activation, light/dark display, reduced-motion startup, no-JavaScript fallback, player shutdown, and layouts from 320 to 1440px. This update has not been committed or pushed.

## Approved playful / press-image pass

The current local version keeps the hand-drawn-style headline underline, dotted backdrop, angled game tags and photo framing, offset panel shadows, and tactile navigation/social links. The rejected “SQUAD UP!” sticker has been removed entirely. Original VAS logo colors, copy, channel destinations, personal photo, hardware, and production metadata are retained. Both HTML pages share the same styling; the preview remains analytics-free and noindex.

Both images from the user-supplied `press-assets.zip` are incorporated:

- `MW4_MP_003_BRANDED.png` → `assets/images/MW4_MP_003_BRANDED.webp`: base of a static hero blend, with the original `image05.jpg` portrait on the left fading smoothly into the game artwork on the right. The portrait uses a CSS gradient mask, not a timed slideshow; the lower-right game branding stays uncovered.
- `MW4_CAM_010_BRANDED.png` → `assets/images/MW4_CAM_010_BRANDED.webp`: full-frame campaign image and caption below the community copy.

The 3840×2160 source frames were resized to 1920×1080 and encoded as WebP (237804 and 348110 bytes respectively). Original ZIP and extracted source PNGs are unchanged. Stream controls sit below the blended image at all sizes so neither face nor branding is covered. An active player keeps its required 300px minimum height. No release, sponsorship, live-gameplay, or schedule claims were added.

Verified this pass: 12 Python tests and all three Node suites; image loading, uncropped framing, clear branding, and no horizontal overflow at 320, 390, 500, 620, 768, 850, 1024, and 1440px; a simulated narrow player at 500px retains its 300px height; light-theme mobile and dark desktop screenshots; reduced-motion startup; visible content and working Twitch destination with JavaScript disabled. The latest static blend was additionally browser-checked at 320, 390, 500, 768, 851, 1024, and 1440px for portrait loading, active masking, uncovered game branding, and fully visible controls below the image. Twitch playback itself is not tested on localhost.

The blended hero was reviewed locally and approved for commit and push. The preview remains available at http://127.0.0.1:8765/preview.html.

## Included

- Dark charcoal design with the existing purple/cyan brand direction.
- Squad-focused Call of Duty / Warzone copy, real photos, and the existing Let's Go artwork.
- Existing Twitch and social destinations; original Discord widget/server ID.
- Short bio and expandable hardware list, preserving the source equipment names.
- No highlights, fabricated metrics, fake live indicator, release dates, or schedule claims.
- Preview is marked noindex and intentionally omits analytics.

## Player behavior

- Local file and HTTP previews use a direct Twitch link.
- On HTTPS at widths of at least 400px, the poster control loads the Twitch iframe on demand with autoplay disabled and the actual hosting hostname as parent.
- Narrow screens keep the direct channel link. Discord still uses the existing widget to join; no invite URL has been invented.
- The player-creation logic is tested. Actual Twitch playback needs a final check on the intended HTTPS host before publishing.

## Checks

    python3 -B -m unittest discover -s tests -v
    node tests/test_streaming.cjs
    node --check assets/js/streaming.js

Browser checks performed: desktop and mobile appearance; no horizontal overflow at 320, 390, 768, 1024, and 1440px; internal navigation; expandable hardware; real Discord widget loading; hidden stream overlay; no captured page JavaScript errors.

## Production deployment

`index.html` is the approved homepage. It omits the preview's noindex directive and preserves the production canonical URL, social URL metadata, and existing analytics. The existing GitHub Pages workflow deploys pushes to `main`; confirm its result and check Twitch on the live HTTPS site after pushing.

Files added: `preview.html`, `assets/css/streaming.css`, `assets/js/streaming.js`, the optimized hand-drawn logo, and tests. `index.html` is replaced with the approved design. No build step or new runtime dependencies.
