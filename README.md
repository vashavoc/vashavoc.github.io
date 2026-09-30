# VAS.gg

Local recreation of https://vas.gg, captured September 30, 2026.

## Preview

From this directory, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://localhost:8000. Stop the server with Ctrl+C.

## Editing

- `index.html`: content, links, embedded Twitch and Discord widgets.
- `assets/css/site.css`: live site styles and responsive layouts.
- `assets/js/site.js`: live site animations and interactions.
- `assets/images/`: downloaded live site images.

Google Fonts, Google Analytics, Twitch, and Discord still use their original online services. Twitch now uses the current hostname as its embed parent so local previews are supported. Some embeds may be unavailable due to their service policies or browser settings.

The older template files remain for reference but are not used by the recreated homepage. No changes have been published.
