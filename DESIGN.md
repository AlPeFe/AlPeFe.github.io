# Design — alpefe.me

Plain HTML, like a personal homepage from the 90s, in its own style.

## Pages
- `/` landing: block wordmark, one line, links `stack // gear // about // blog`, contact.
- `/stack/`, `/gear/`, `/about/`: one page each, `dl` lists.
- `/blog/`: list of posts. New post: copy `blog/_template.html` to `blog/YYYY-MM-DD-title.html` and add a `<li>` to `blog/index.html` (instructions in a comment there). Files starting with `_` are not published by GitHub Pages.

## Rules
- **No classes, no ids for styling, no JavaScript.** `assets/site.css` only targets elements. If something needs a class to look right, change the markup instead.
- `header`, `nav` and `footer` are centred; `main` is a left-aligned column (`max-width: 34em`) centred on the page.
- Links go in `[ brackets ]` separated by `&middot;`. Subpages start with a breadcrumb `alpefe / <page>` and end with the link row, the current page in bold.

## Look — "homepage 1998"
- Background: black with the tiled 90s confetti GIF, `assets/confetti.gif`.
- Type: Times New Roman, 18px. `h1` large and italic.
- Colours: white text, yellow links, orange visited, grey `#aaa` for dates and asides.
- `hr`: 60% wide, 3px ridge.
- `dl` keeps the browser's default look: bold `dt`, indented `dd`.
