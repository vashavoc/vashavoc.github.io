# Streaming redesign preview

The approved redesign is now the production `index.html`, including the hand-drawn VAS logo and swapped photos. The existing analytics and canonical URL are preserved. `preview.html` remains a noindex, analytics-free design preview.

Open `preview.html` directly, or serve the repository:

    python3 -m http.server 8765 --bind 127.0.0.1

Then open http://127.0.0.1:8765/preview.html.

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
