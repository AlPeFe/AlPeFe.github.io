# Design — alpefe.me

Plain HTML, like a personal homepage from the 90s, in its own style.

## Pages
- `/` landing: block wordmark, one line, links `stack // gear // about // blog`, contact.
- `/stack/`, `/gear/`, `/about/`: one page each, `dl` lists.
- `/blog/`: list of posts. New post: copy `blog/_template.html` to `blog/YYYY-MM-DD-title.html` and add a `<li>` to `blog/index.html` (instructions in a comment there). Files starting with `_` are not published by GitHub Pages.

## Rules
- **No classes, no ids for styling, no JavaScript.** `assets/site.css` only targets elements. If something needs a class to look right, change the markup instead.
- One narrow column (`max-width: 42em`), left-aligned, nothing positioned.
- Links separated by ` // `. Subpages start with a breadcrumb `alpefe / <page>` and end with the same link row, the current page in bold.

## Look
- Background: black with the tiled 90s confetti GIF, `assets/confetti.gif`.
- Font: DotGothic16 (self-hosted, `assets/fonts/`), monospace fallback.
- Colours: text `#d6d6e4`, headings `#e8d84a`, links `#3ce8ff`, visited `#ff58c8`, muted `#8a8aa0`.
- `h2` is uppercase with a `»` prefix. Rules (`hr`) are dashed.
