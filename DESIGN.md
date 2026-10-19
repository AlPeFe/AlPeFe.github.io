---
name: alpefe.me
description: A 4:3 phosphor tube showing a teletext service of exactly one person. Zero JavaScript.
colors:
  room: "#03050a"
  glass: "#04060b"
  ink: "#eef0ff"
  ink-dim: "rgba(238,240,255,.62)"
  bar-ink: "rgba(4,6,11,.72)"
  yellow: "#e8d84a"
  cyan: "#3ce8ff"
  green: "#3ce86a"
  red: "#ff5442"
  magenta: "#ff58c8"
  blue: "#3c6cff"
  rule: "rgba(60,232,255,.38)"
  hair: "rgba(60,232,255,.13)"
typography:
  display:
    fontFamily: "Doto, ui-monospace, 'Courier New', monospace"
    fontSize: "1.15em"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "0"
    fontVariation: "'ROND' 0"
  headline:
    fontFamily: "'DotGothic16', ui-monospace, 'Courier New', monospace"
    fontSize: "1.45em"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0.16em"
  logo:
    fontFamily: "'DotGothic16', ui-monospace, 'Courier New', monospace"
    fontSize: "min(.78em, 2.25cqi)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0"
  body:
    fontFamily: "'DotGothic16', ui-monospace, 'Courier New', monospace"
    fontSize: "clamp(11px, 1.45cqi, 17px)"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "'DotGothic16', ui-monospace, 'Courier New', monospace"
    fontSize: ".86em"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
  numeral:
    fontFamily: "Doto, ui-monospace, 'Courier New', monospace"
    fontSize: ".95em"
    fontWeight: 700
    lineHeight: 1
rounded:
  none: "0px"
spacing:
  edge: "clamp(18px, 3.2vmin, 54px)"
  column: "118ch"
  column-pad: "0 5ch"
  row-pad: ".28em .5ch"
  row-gap: ".1em"
  bar-pad: ".3em .7em"
  block-gap: ".35em"
components:
  window:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  column:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 5ch"
  page-bar:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.glass}"
    rounded: "{rounded.none}"
    padding: ".3em .7em"
  row:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: ".16em .5ch"
  row-hover:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.glass}"
    rounded: "{rounded.none}"
  key-index:
    backgroundColor: "{colors.red}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.none}"
  key-projects:
    backgroundColor: "{colors.green}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.none}"
  key-certs:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.none}"
  key-about:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.none}"
  slot:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.red}"
    rounded: "{rounded.none}"
    padding: ".5em .8ch"
---

# Design System: alpefe.me

## Overview

**Creative North Star: "The Teletext Tube"**

This is not a web page dressed as a monitor. It is what the monitor shows. The whole window is the tube: a phosphor field whose edges darken and bow, and inside it a teletext service with exactly one subscriber — a numbered page index, a dated log, four keyed destinations, and a block-mosaic wordmark built out of solid cells. Every mark on the screen is made of the same stuff: the eight inks a broadcast teletext decoder had, none of them pure, laid on phosphor black.

The signal is bent, not painted. A generated radial displacement map warps the live page through an SVG filter, so straight rules bow downward at the centre, verticals splay, and the top edge of the page bar arcs. It is real geometry: a 3 KB map computed from `u·r²`, applied with zero JavaScript, and switching off in one media query when the glass gets small. Nothing here is a photograph of a monitor, and nothing is a CSS bevel pretending to be one.

The density is deliberately low but the grid is strict: everything sits in a fixed-pitch character cell, set at 11–17px depending on how big the tube is. The window is the frame, not the page. Where a modern site would scroll a document, this one shows one screenful and, when a list is longer than the glass, scrolls inside it the way a terminal does.

**Key Characteristics:**
- One 4:3 glass, centred in a dark room; the phone grows it taller so nothing is trapped.
- Eight teletext inks, none pure, plus a dimmed phosphor white for prose.
- Curvature from a computed displacement map, never from an image of a monitor.
- Aperture grille in vertical RGB stripes and horizontal scanlines, above the signal.
- Every word in a bitmap gothic; every numeral and the page number in a dot matrix.
- Zero JavaScript, zero cookies, zero third-party requests.

## Colors

The eight colours a teletext decoder could actually print, their purity removed, plus a dimmed white for reading. Each one has a job and none of them is decorative.

### Primary
- **Page Yellow** (#e8d84a): The page bar, every section caption, every quantity and every index numeral. It is the colour of a heading on a teletext page.
- **Signal Cyan** (#3ce8ff): Structure and reading. Rules, table headers, the field labels of a record, and every link inside prose.
- **Open Green** (#3ce86a): The state that means the code is public.

### Secondary
- **Closed Red** (#ff5442): The state that means the code is not public, and the frame of an asset that is still missing.
- **Route Magenta** (#ff58c8): Appears once in the system — the magenta fastext key. It carries no other meaning anywhere.

### Neutral
- **Room Black** (#03050a): The dark around the tube, and the socket the tube sits in.
- **Phosphor Black** (#04060b): The inside of the glass and the field every page is written on. Never pure black; it is a blue-black that reads warm under the vignette.
- **Phosphor White** (#eef0ff): Row titles, the wordmark, and closed descriptions. Never pure white.
- **Dim Phosphor** (rgba(238,240,255,.62)): Secondary prose — descriptions, ledes, table cells — and the label of every fastext key.
- **Frame Ink** (rgba(4,6,11,.72)): The small right-hand label inside the yellow page bar, which must stay readable against yellow.
- **Rule** (rgba(60,232,255,.38)) and **Hair** (rgba(60,232,255,.13)): The cyan line under a heading and the row separator. Both are the signal ink at low alpha; nothing neutral ever draws a line.

### Named Rules
**The Eight Inks Rule.** Only the eight teletext colours plus a dimmed phosphor white may appear. A colour outside that set is a decoder that never existed.

**The No-Pure-Ink Rule.** Nothing reaches purity. The black is blue-black, the white is phosphor-tinted, and every saturated ink stops short of the primaries. Pure #000, #fff, #00ff00, #ff0000 and #0000ff are forbidden.

**The Blue Is Not Text Rule.** Blue (#3c6cff) is a fill and a frame, never a body colour: on phosphor black it does not reach AA contrast, so it never carries reading.

**The Once-Magenta Rule.** Magenta appears in exactly one place in the whole site: the magenta route key. Anywhere else it is a bug.

## Typography

**Display Font:** Doto (with ui-monospace, 'Courier New', monospace)
**Body Font:** DotGothic16 (with ui-monospace, 'Courier New', monospace)

**Character:** A dot-matrix face for numerals and a 16px bitmap gothic for words — both screen materials from the era the tube belongs to. DotGothic16 is a real Japanese bitmap gothic: its Latin sits on a half-width cell, which is what makes a character grid possible at all and what gives the page its teletext rhythm. Doto's dot matrix marks anything countable — a page number, a row index, a date — so a reader can tell a quantity from a word at a glance without reading it.

### Hierarchy
- **Display** (900, 1.15em, line-height 1, 'ROND' 0): The page number in the yellow bar. Doto, and nothing else, sits there.
- **Headline** (400, 1.45em, letter-spacing .16em, uppercase): The page title on a subpage, in yellow — the one place a heading is allowed to stand visibly larger than the cell.
- **Logo** (400, min(.78em, 2.25cqi), line-height 1): The wordmark, drawn out of `█` in the character cell. It is text, so it scales, it selects, and it needs no asset.
- **Body** (400, clamp(11px, 1.45cqi, 17px), line-height 1.4): All reading. The size tracks the tube, not the viewport, so the page fills the glass it is in.
- **Label** (400, .86em, letter-spacing .08em, uppercase): Section captions, table headers, states, and the fastext keys.
- **Numeral** (700, .95em): Row indices, dates, status counts. Always Doto, never the gothic.

### Named Rules
**The Character Cell Rule.** Every word sits in a fixed-pitch cell and the layout is measured in characters — `ch` for columns, `em` for rhythm. A proportionally-set word anywhere in this site breaks the screen.

**The Flush Mosaic Rule.** The wordmark sets `line-height: 1` on purpose: its rows of `█` must touch, because the leading *is* the artwork. This is the only place in the system where leading is allowed under 1.3, and it is text rather than an image so that it scales and selects.

## Layout

The glass is the window: it fills the viewport with no bezel, no radius and no room around it, and the page's own scroll is the only one. The content does not fill it — it sits in a centred column of `118ch` with `5ch` of slack on each side, and that slack is what keeps the bowing from being clipped at the column's corner.

Type is sized in a container query unit (`0.95cqi` of the tube, capped at 14px) and the column is measured in `ch`, so the character grid stays the same number of cells whatever the window does; only its rendering scales. On a phone the column takes the full width and the size floor rises to 12px, because a phone is read at arm's length, not from across a desk.

Two-column records (`ficha`, certificates, project tables) keep their banded order: label in cyan at a fixed character width, value in dim phosphor beside it. Below 820px every banded row stacks, one fact per line.

## Elevation & Depth

There is no elevation in this system. Nothing is layered, nothing floats, and no shadow anywhere represents a light source above a surface. Depth is a physical fact of the object: a recessed glass inside a raised plastic bezel, held by an inset ring highlight and a wide inset vignette that darkens toward the tube's edge.

The tube and the window are the same object: there is no case around the glass, only the glass, its vignette and its grille. There is no glow anywhere either — the only light in the site comes from the phosphor itself, and a halo on any element would be decoration pretending to be emission.

The screen adds two depth cues that are not shadows: a fixed 3px aperture grille and 3px scanlines drawn above the signal, and a slow vertical-retrace band that travels up the glass every 13 seconds.

### Named Rules
**The No-Lift Rule.** Nothing casts a shadow to imply it sits above the page. A blurred shadow on a border, a card or a button is a regression.

**The Grille-Above Rule.** Aperture stripes and scanlines always sit above the content, never behind it, at low alpha. Below the content they become a background pattern and the screen stops being glass.

## Shapes

Two shapes exist: the tube and the character. The tube is a rounded rectangle whose corner radii are elliptical percentages, so the top and bottom edges bow differently from the sides — the silhouette of glass that was blown, not cut. On a phone the same tube takes fixed 16px and 20px radii, because a tall panel with percentage radii stops reading as a screen.

Everything inside is a rectangle with square corners: rows, bars, rules, table cells, keys. Not one border radius appears inside the glass. The recurring inner form is the banded record — a fixed-width cyan label and a dim value on one line, separated by a cyan hair below.

## Components

### The Tube
- **Shape:** Elliptical-cornered rectangle, 4:3, with a proportional bezel inset and a 1px inset ring highlight. A green pilot lens sits inside the bezel at the bottom right. The plastic is drawn by a pseudo-element behind the glass, so the set is one enclosure rather than a container inside a container.
- **Glass:** Inset by the bezel, with a wide inset vignette and a diagonal reflection at 5% white in the upper left.
- **Phone:** Height follows content, radii become fixed, and the page scrolls normally instead of the glass.

### The Warp
- **What it is:** An SVG filter on the content column: a 96×72 radial displacement map, `primitiveUnits="objectBoundingBox"` with the map stretched over the column, `scale="0.042"` on the desk and `0.035` on the phone, region clipped to the column's own box.
- **Why the column and not the window:** the displacement is a function of `r²` from the centre, so a signal sitting in the middle of a wide screen would not bend at all. The map has to stretch over the thing that must curve.
- **Why objectBoundingBox:** one map then works at every width — the displacement stays a fixed fraction of the column instead of a fixed pixel count.
- **Boundary:** The grille, scanlines, vignette and reflection are never warped: they belong to the glass, not to the signal. The `5ch` of slack is what the corners need so the bowing is not cut off.

### Page Bar
- **Shape:** A full-width bar with no radius, yellow field, phosphor-black text.
- **Contents:** Page number in Doto, the page's path, and a right-hand claim in dimmed frame ink.
- **Padding:** .3em vertical so the bar has a body; children never touch its edges.

### Rows
- **Index row:** Four cells — a Doto number in yellow, a name in phosphor white, a dim note, and a cyan arrow. Hover and keyboard focus invert to a solid cyan field with black text.
- **Log row:** Four cells — a Doto date in cyan, a name, a dim description, and an uppercase state in green or red, right-aligned.
- **Current page:** Marked with a 16% cyan wash and a cyan numeral, never with colour alone.

### Fastext Keys
- **Shape:** Four inline labels with a 1.5ch square in the key's own colour, on the page's bottom edge above a cyan hair.
- **Order:** Red index, green projects, yellow certificates, cyan about. The current page's key goes phosphor white.
- **Socials:** The right end of the same row carries the four doors as two-letter labels — `gh`, `x`, `ig`, `li` — pushed right with `margin-left:auto`. Contact is part of the furniture, not a section with its own heading.
- **Why:** The keys are the navigation, on the bottom edge where a remote expected them, and the doors live beside them instead of occupying a block of their own.

### Tables
- **Banded records:** A Doto yellow index, a phosphor-white name (a link where there is a repository), the plain description in dim phosphor, an uppercase state in green or red, and the repository's own last-change date in Doto cyan.
- **Below 820px:** Header row hidden from the eye but kept for screen readers, and every row becomes a stacked block.

### Empty Slots
- **Shape:** A 1px dashed red frame with uppercase red text inside.
- **Purpose:** A deliberate placeholder for an asset the owner still owes — a certificate image. It states the absence; it does not pretend to be a broken image.

## Do's and Don'ts

### Do:
- **Do** keep the glass edge-to-edge with the content in a centred `118ch` column and `5ch` of slack for the bowing.
- **Do** keep the warp on the content column alone, and let the grille and vignette stay flat on the glass.
- **Do** size type in `cqi` so the character grid tracks the tube, not the window.
- **Do** give every quantity Doto and every word DotGothic16.
- **Do** keep contact in the bottom key row, right-aligned, rather than in a section of its own.
- **Do** keep a hairline's row padded — .26em above and below is the floor, never .12em.
- **Do** spend yellow on structure, cyan on reading, green on open, red on closed, and magenta exactly once.
- **Do** label a date with what it is — the repository's last change — rather than implying a release.

### Don't:
- **Don't** add a case, a bezel, a radius or a background behind the glass: the tube is the window.
- **Don't** add a shadow that implies something floats, or a glow anywhere. The phosphor is the only light.
- **Don't** move the warp back onto the whole window, or give it a filter region wider than its own box.
- **Don't** use blue for text, magenta for anything but the route key, or any pure primary.
- **Don't** put a border radius inside the glass.
- **Don't** replace the displacement map with a photo of a monitor, or a CSS bevel pretending to be plastic.
- **Don't** ship JavaScript, a cookie, an analytics tag or a third-party font request.
- **Don't** name a technology on the projects page. The list is about what things do.
- **Don't** let a fixed glass height trap content on a phone.
