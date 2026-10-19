# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Static HTML/CSS/JS in a single repository, no build step, no framework, served by GitHub Pages at the custom domain `alpefe.me` (CNAME in repo root). Subpages are directories (`/projects/`, `/certs/`, `/about/`) rather than subdomains: a subdomain would need a second repository plus a DNS record and adds nothing here. Decided with the user, revisable.

## Users
People who arrive from a handle, a business card, a repo, a CV, or a chat: peers and developers checking who `alpefe` is, and recruiters or clients checking what he builds. They arrive with one question — who is this and what does he actually do — and leave with either a project worth opening or a way to make contact. Small screen and desktop both in play; visits are seconds long.

## Product Purpose
A personal identity landing that states who `alpefe` / `polaper` is and what he does in the fewest possible words, then routes to three subpages: projects, certifications, about. Success is a visitor who understood the one-line answer and took exactly one of two actions: opened a project, or made contact.

## Positioning
The honest personal site of a working engineer: identity, a plain statement of practice, the real project list including the closed, non-public work, and the certifications that back the security and cloud claims — with no personal narrative, no blog, no marketing.

## Operating Context
Content is edited by the owner directly in the repository; certificates arrive as image files supplied by the owner. The GitHub account carries roughly 100 repositories, of which a curated subset (approximately fifteen) is presented: substantial product, app, and tooling work, with closed-source projects marked as such and explained in one plain sentence about what they do, never about their stack. Future content, copy, and curation are expected to be iterated by the owner after the first build.

## Capabilities and Constraints
- No build step, no framework, no package manager: everything must run from static files committed to the repository.
- Deploy is GitHub Pages through `CNAME` → `alpefe.me`; the apex domain is the canonical host.
- Subpages share one visual world with the landing and must stay reachable without JavaScript.
- Contact channels, confirmed: X, Instagram, LinkedIn, GitHub. The X and LinkedIn handles are still to be supplied by the owner; Instagram is `alpefe.exe`.
- Public email on the site is still open; the current `mailto:` is `alexpf.me@gmail.com`.
- Certificate pages wait on images the owner provides; the page structure ships without them.
- Deliberately minimal personal disclosure: no location, no legal name, no portrait, no dated personal narrative, no blog.

## Brand Commitments
- `alpefe` and `polaper` are the names the site carries; both read as identity tags, not as one being the person and the other a project.
- Binding visual constraint volunteered by the owner: retro / Y2K, dark mode, console typography, wobble on selection, distortion at the edges, CRT screens with impure (never fully pure) colours, Undertale, black-and-white 1990s manuals, 1990s Japanese visual novels, Y2K anime, and a simple repeating background pattern. This is a constraint to honour, not a direction to expand — the visual world is chosen later.
- The delivery must be extremely simple and low-density: the reference they gave for scope is `micr.dev/es` (simple, but capturing the essence).
- Existing assets on hand: `favicon.png` / `favicon.ico` (a pixel `a@`), `assets/avatar.png`, and twelve 88×31 retro "dab" GIFs (`dab_*.gif`). The owner asked to drop the badge and the image, and to reduce density; the 88×31 GIFs are therefore retired from the landing by default.

## Evidence on Hand
- GitHub account `AlPeFe`: real public and private repositories with descriptions, stars, and dates, already inventoried.
- Certifications held and to be displayed: Microsoft SC-900 and Google Cybersecurity Professional Certificate. Reference repositories exist (`SC-900-Notes`, `Google-Cybersecurity-Professional-Certificate`). Certificate images are pending from the owner.
- Real repositories with substance worth showing, including `fuji-ptp-android` (5★), `fuji-ptp-core`, `xiaomi-tv-debloat`, `kivotos`, `gesipan`, `HanniGram`, `music-grabber`, `tui-server-setup`, `SqlServerMcp`, `WindowsServerAgent`, and closed work such as `tsnu-plataforma`, `gam-mcp`, `Nagomi`, `GamFleet`, `monitor-agent`, `konbini-psx`.
- Absent and not to be fabricated: testimonials, client names, prices, benchmarks, metrics, press, or any claim about users or scale. The GitHub descriptions are the only factual source for project copy.
- The previous build (an event ID badge with a flip card, avatar, and Instagram link) is retired.

## Product Principles
1. Fewest words that are still true: the landing states who and what, and stops.
2. Everything factual comes from real assets — real repositories, real certifications; nothing is embellished, nothing is invented.
3. Closed-source work is shown, not hidden, and explained by what it does.
4. Nothing personal is volunteered beyond the identity and the contact channels the owner chose.
5. The interface stays out of the way of the content and stays openable and readable without JavaScript.

## Accessibility & Inclusion
No product-specific standard was established by the owner. Standard web expectations apply: readable contrast on a dark ground, full keyboard reachability, visible focus, and respect for `prefers-reduced-motion` — the previous build already honoured the last two, so the replacement must not regress them.
