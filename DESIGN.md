---
name: alpefe.me
description: A personal index built as a 1998 homepage — two inks, one plate, zero JavaScript.
colors:
  ink-structure: "#ff3d8b"
  ink-state: "#7dff3d"
  ink-reserved: "#ffcc33"
  ground: "#0b0912"
  plate: "#141126"
  plate-deep: "#100e1e"
  stock: "#e8e0ff"
  structure-rule: "rgba(255,61,139,.34)"
  structure-hair: "rgba(255,61,139,.2)"
  prose-soft: "rgba(232,224,255,.72)"
typography:
  display:
    fontFamily: "Doto, ui-monospace, 'Courier New', monospace"
    fontSize: "clamp(54px, 7.6vw, 112px)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "0.005em"
    fontVariation: "'ROND' 0"
  headline:
    fontFamily: "Doto, ui-monospace, 'Courier New', monospace"
    fontSize: "clamp(44px, 7vw, 84px)"
    fontWeight: 900
    lineHeight: 0.9
    fontVariation: "'ROND' 0"
  title:
    fontFamily: "'DotGothic16', ui-monospace, 'Courier New', monospace"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "0.2em"
  body:
    fontFamily: "'DotGothic16', ui-monospace, 'Courier New', monospace"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "'DotGothic16', ui-monospace, 'Courier New', monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.16em"
  numeral:
    fontFamily: "Doto, ui-monospace, 'Courier New', monospace"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1
rounded:
  none: "0px"
spacing:
  bezel-inset: "12px"
  sheet-padding: "22px"
  sheet-max: "940px"
  plate-gap: "20px"
  plate-band-gap: "12px"
  block-gap: "14px"
  section-top: "52px"
  bead-inset: "5px"
components:
  plate:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.stock}"
    rounded: "{rounded.none}"
    height: "74px"
  plate-primary:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink-reserved}"
    rounded: "{rounded.none}"
    height: "74px"
  plate-hover:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.stock}"
    rounded: "{rounded.none}"
  contact-plate:
    backgroundColor: "{colors.plate-deep}"
    textColor: "{colors.ink-state}"
    rounded: "{rounded.none}"
    height: "60px"
  ring-current:
    backgroundColor: "{colors.ink-state}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  page-bezel:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.stock}"
    rounded: "{rounded.none}"
    padding: "22px"
  project-row:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.prose-soft}"
    rounded: "{rounded.none}"
    padding: "14px 0"
  log-row:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.prose-soft}"
    rounded: "{rounded.none}"
    padding: "12px 0"
---

# Design System: alpefe.me

## Overview

**Creative North Star: "The Index of One"**

A directory listing with exactly one person in it. The site behaves like a file index rendered in two inks: a bezelled sheet, an `index of /` header, rows that carry dates, and a navigation made of the one control the late-nineties personal web actually had — the 88×31 button, drawn at its true proportion and scaled up until it can hold a word. Nothing here is a brochure. Every element is an entry, and every entry is either a fact or a way out.

The material is two fluorescent inks printed slightly out of register on an impure violet-white stock, sitting inside a dark tube. Depth is not light; depth is misregistration. Where a contemporary interface would drop a soft shadow, this one separates two printed layers by a hard offset with no blur, and collapses them flush when pressed. Hovering pulls them apart. The effect is the wobble of a CRT edge and the slip of a bad print run at the same time, and it is the only motion the site has.

Density stays deliberately low — this world could carry ten times the elements it does, and the brief's whole request was to resist that. Two sentences of prose, three plates, one log, four doors. What carries the character is commitment: the inks are saturated and unreconciled, the numerals are set in a dot matrix that echoes the ground's dot tile, and nothing is grey.

**Key Characteristics:**
- Two inks own every structural mark: hot magenta and acid green. No neutral draws a rule.
- One impure violet-white stock carries prose, so the two inks never have to soften.
- One reserved amber exists, and it is spent once, on the landing's primary plate.
- Depth is registration: hard-offset ink layers, no blur anywhere.
- Zero JavaScript, zero cookies, zero third-party requests.
- Faces are a dot-matrix display and a 16px bitmap gothic — screen materials, not a console costume.

## Colors

A committed two-ink system on a violet-black ground, with a single reserved third that exists to mark one thing.

### Primary
- **Hot Magenta Ink** (#ff3d8b): The structural ink. Plate borders, dotted inset frames, section rules, section headings, index numerals and every log state that means "closed". Rarely used as a fill; a magenta fill is reserved for the skip link and for text selection.
- **Acid Green State** (#7dff3d): The state ink. Dates, quantities, bands under the plates, hover colours, focus rings, links in body text, and the solid chip that marks the current page in the ring bar.

### Tertiary
- **Reserved Amber** (#ffcc33): Spent exactly once on the landing, on the primary plate's border and label. It marks the one action the visitor came to take. It appears nowhere on the subpages.

### Neutral
- **Impure Violet-Black** (#0b0912): The ground. Never pure black; it is a violet that reads as dark with a bias you feel rather than see.
- **Plate Violet** (#141126): The raised face of every plate and of the contact buttons.
- **Plate Deep** (#100e1e): The recessed face of certificate documents and ficha blocks.
- **Violet-White Stock** (#e8e0ff): Prose, wordmark and row titles. Never pure white.
- **Structure Rule** (rgba(255,61,139,.34)): The dotted inset line inside a bezel or a plate, and the soft rules that frame a surface.
- **Structure Hair** (rgba(255,61,139,.2)): Row separators inside a log, a table or a ficha — the structure ink at low alpha, so that no neutral ever draws a line.
- **Prose Soft** (rgba(232,224,255,.72)): Secondary prose — descriptions, ledes, table cells. The only neutral with a job, and its job is reading.

### Named Rules
**The Two Inks Rule.** Every rule, border, box and label is magenta or acid green. A neutral never draws structure; it only carries prose. Row separators are the structure ink at 20% alpha, and a plate's dotted interior is the same ink at 34%. If an element needs a line and neither ink fits, the element is wrong, not the palette.

**The Once Rule.** The reserved amber appears a single time in the whole site, on the landing's primary plate. A second appearance is a bug, not a flourish.

**The Impure Ink Rule.** No colour reaches purity. The black is violet, the white is violet-tinged, the green is a chartreuse, the magenta stops short of full saturation, and the amber is a gold. Pure #000, #fff, #00ff00 and #ff00ff are forbidden.

**The One Action Rule.** The landing owns the site's single action. The three subpages are reading surfaces: they spend no reserved ink and they never compete with the landing's plate.

## Typography

**Display Font:** Doto (with ui-monospace, 'Courier New', monospace)
**Body Font:** DotGothic16 (with ui-monospace, 'Courier New', monospace)

**Character:** A dot-matrix display and a bitmap gothic, both screen materials from the same era as the world they describe. Doto's dots rhyme with the 4px dot tile in the ground, so the wordmark looks printed by the same machine that textured the page. DotGothic16 is a real 16px dot-matrix Japanese gothic: it renders Latin at half-width, which gives prose the fixed pitch of a text-mode screen without asking a neutral mono to pretend.

### Hierarchy
- **Display** (900, clamp(54px, 7.6vw, 112px), line-height 0.86, 'ROND' 0): The wordmark on the landing, and nothing else. Square dots, tight leading, one chromatic shadow pair.
- **Headline** (900, clamp(44px, 7vw, 84px), line-height 0.9): Page titles on the three subpages.
- **Title** (400, 19px, letter-spacing .2em, uppercase): Section headings, in magenta. Also the certificate names, in stock.
- **Body** (400, 16px, line-height 1.7): All prose. Measure stays between 60ch and 72ch.
- **Label** (400, 12px, letter-spacing .16em, uppercase): System bars, plate bands, table headers, log dates, footer.
- **Numeral** (700, 15–26px): The numbered bands under the plates and the index column of the project tables. Numerals are always Doto, never DotGothic16.

### Named Rules
**The Two Voices Rule.** Doto speaks only for the wordmark and for numerals; DotGothic16 speaks for every other word in the site. A third face is a regression.

**The Half-Width Rule.** Prose runs at 16px and never below 13px, because DotGothic16 is drawn for a 16px cell and anything smaller loses its grid.

## Layout

One column inside a bezelled sheet. The bezel is a 1px magenta frame inset 12px from the viewport with a dotted magenta line 5px inside it; the page itself is therefore the first plate in the system, and the sheet is capped at 940px and centred with 22px of internal padding.

Vertical rhythm is generous and one-directional: 52px above a section heading and 10px below it, so a heading always belongs to what follows and never to what precedes. Plates sit in a three-across grid with a 20px gap on desktop; below 860px the rack becomes a single column capped at 420px and centred, so a plate never loses its proportion. Below 620px the page padding drops to 16px and the bezel margin to 8px.

Tables are real tables on desktop and become labelled blocks below 620px, where each row stacks number, name, description, state and year in reading order. Long content never scrolls sideways.

## Elevation & Depth

There are no soft shadows in this system. Depth is registration: two printed ink layers separated by a hard offset with zero blur, exactly as a badly aligned print run would show. A plate rests with a 3px green layer peeking out behind it; hover separates the layers to 6px and swaps the visible layer to magenta; pressing collapses them flush to 0 so the plate reads as physically depressed. Nothing casts a blurred shadow anywhere on the site.

The ground carries the tube: a radial vignette darkening the outer edge, a 4px dot tile at 15% magenta, and a fixed scanline overlay at 2% violet-white drawn above all content. Together they read as a screen surface rather than a background image.

### Shadow Vocabulary
- **Ink layer at rest** (`box-shadow: 3px 3px 0 rgba(125,255,61,.55)`): The green layer behind a plate, out of register.
- **Ink layer separated** (`box-shadow: 6px 6px 0 #ff3d8b`): Hover and keyboard focus. The layers pull apart and the visible layer turns magenta.
- **Ink layer flush** (`box-shadow: 0 0 0 #ff3d8b`): Active. The plate is pressed down onto its own layer.
- **Primary plate layer** (`box-shadow: 3px 3px 0 rgba(255,204,51,.5)`): The reserved amber plate, the one place the system prints in gold.

### Named Rules
**The Registration Rule.** Depth is misregistration. An offset shadow always has zero blur and always represents a second printed layer. Introducing a blurred shadow to "add depth" breaks the world.

**The Freeze Rule.** Under `prefers-reduced-motion: reduce` every transition and animation is removed and the plate stops translating. Registration becomes a static 1px state change; the hierarchy must still read.

## Shapes

Everything is a rectangle with square corners and a hard 1px edge. There is not a single border radius in the system, and no diagonal, circle or curved mask anywhere — the two exception-shaped things in the world, a dot-matrix glyph and a crosshair in an empty certificate frame, are drawn as ink on a rectangular field.

The recurring silhouette is the plate: a box at the true 88×31 proportion of a web button, edged in 1px ink with a dotted inset line 5px in from the edge, drawn in the structure ink at 34% alpha — the same construction as the page bezel, one scale down. The same silhouette, unaltered, is used for navigation, for contact doors, for the rack, and — scaled to the whole viewport — for the page bezel. A second silhouette is the sheet: a rectangle with a dotted inner frame, used for certificate documents and ficha blocks.

## Components

### Buttons
- **Shape:** Square cornered, 1px ink border, dotted inset line, zero blur offset layer behind. The plate is 88:31 by proportion, minimum 74px tall.
- **Primary:** Background `{colors.plate}`, 1px border and label in `{colors.ink-reserved}`, an ink layer behind in the same gold. This is the only amber element in the site.
- **Secondary plate:** Background `{colors.plate}`, 1px border in `{colors.ink-structure}`, stock label, green ink layer behind.
- **Hover / Focus:** The plate translates 2px up and left with a 2-step step transition, the layer separates to 6px and turns magenta, and the label runs a 400ms two-step jitter for exactly two iterations. Keyboard focus adds a 2px green focus ring at 3px offset.
- **Active:** The plate translates 3px down and right, the layer collapses to 0. Reads as pressed.
- **Contact door:** Same grammar at a smaller height, resting on `{colors.plate-deep}` with a green label; hover turns border, label and layer green.

### Navigation
Two components, both functional and both world-native. The **rack** is the section navigation: three plates, each with a numbered band beneath carrying its facts. The **ring bar** is a bordered strip that walks the site's own four pages — a previous link, the route as a bordered green chip for the current page, and a next link, ending in a text arrow rather than an icon.

### Tables
Project lists are real tables with an uppercase magenta header row, a magenta Doto index numeral per row, the project name as a stock link with a green underline, the description in prose soft, the state as an uppercase label — green for open, magenta for closed — and the repository's own last-change date in the final column. Row separators use the structure ink at 20% alpha.

### Rows / Lists
The landing's log is a three-column row: a green label date, a name with its one-line description, and a state label aligned right. Every row carries the repository's own last-change date, and the section heading says so.

### Empty Frames
Certificate documents ship with a real 4:3 frame holding a drawn crosshair, the words "imagen pendiente", and a caption. This is a deliberate placeholder component, not a broken image: it states that the asset is the owner's to supply.

## Do's and Don'ts

### Do:
- **Do** draw every rule, border and box in one of the two inks — magenta for structure, acid green for state.
- **Do** spend the reserved amber exactly once, on the landing's primary plate, and never on a subpage.
- **Do** keep depth as a zero-blur offset layer that separates on hover and collapses on press.
- **Do** set the wordmark and every numeral in Doto, and everything else in DotGothic16 at 16px.
- **Do** keep prose measure between 60ch and 72ch and cap display at 112px.
- **Do** label a date with what it actually is — the repository's last change — rather than implying a release.
- **Do** mark a closed-source project in magenta and explain it by what it does.

### Don't:
- **Don't** add a third ink, a grey, or a gradient. If a line needs a colour, it is magenta or green.
- **Don't** add a border radius, a blurred shadow, a glass panel or a coloured left border. The system is square, flat and printed.
- **Don't** spend the amber twice, or move the primary action below the fold.
- **Don't** ship JavaScript, a cookie, an analytics tag or a third-party font request. The claim in the top bar has to stay true.
- **Don't** name a technology on the projects page. The list is about what things do.
- **Don't** put location, legal name, portrait, or a blog on any page.
- **Don't** let a subpage compete with the landing for the visitor's one action.
