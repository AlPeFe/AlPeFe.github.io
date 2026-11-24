# Design — alpefe.me

Plain HTML, like a personal homepage from the 90s, in its own style.

## Rules
- **No classes, no ids for styling, no JavaScript.** `assets/site.css` only targets elements (`h1`, `a`, `table`, `dl`…). If something needs a class to look right, change the markup instead.
- One narrow column (`max-width: 46em`), left-aligned, nothing positioned.
- Navigation is a line of links separated by ` // `, at the top of the landing and at the bottom of every subpage. Subpages start with a breadcrumb `alpefe / <page>`.

## Look
- Background: black (`#000`) with a tiled dark pattern, `assets/bg.gif` (32×32, dotted diamond lattice + a few stars). Regenerate with `python scripts/make-bg.py`.
- Font: DotGothic16 (self-hosted, `assets/fonts/`), monospace fallback.
- Colours, none pure white: text `#d6d6e4`, headings `#e8d84a`, links `#3ce8ff`, visited `#ff58c8`, muted `#8a8aa0`.
- `h2` is uppercase with a `»` prefix. Rules (`hr`) are dashed.
- The landing wordmark is the block-letter `<pre>`.

## Generated content
- `scripts/update-live.mjs` rewrites the contribution graph between `<!-- contribs:start/end -->` in `index.html` and the `data-repo` cells in `projects/index.html`.
- `scripts/update-tokens.mjs` rewrites the `<!-- tok:*:start/end -->` rows in `index.html`.
- Both emit classless markup; keep it that way.
