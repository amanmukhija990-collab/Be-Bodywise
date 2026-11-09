# Build Instructions for Google AI Studio — "Be Bodywise · The 90-Day Results System"

> Paste **Part A (the master prompt)** into AI Studio first. Then feed Parts B–H as follow-up prompts, one screen at a time (build order is in Part I). Everything below was derived frame-by-frame from your five screen recordings. Items I could not see in the recordings are marked **[INFERRED]** so you can correct them.

---

## PART A — MASTER PROMPT (paste this first)

You are a senior product designer and front-end engineer. Build a polished, responsive web app called **"Be Bodywise · The 90-Day Results System"** — a single connected system that helps people using hair, skin and body-care products get through the 90-day "results window" without quitting early.

**Core idea:** *Most products don't fail. They're judged too early.* The app tells the user whether it is **too early**, **on track**, or **time to change something**, using their product start dates, the product's verified timeline, their consistency, and their own check-ins.

**Five connected tools** (plus a landing page and auth):
1. **Personal Product Match** — 4-step assessment that ranks catalogue products with a "why this suits you" explanation.
2. **Routine Test** — test a product you're considering against what you already own; flags duplicates, overlaps and active clashes.
3. **My Shelf** — the *single source of truth*: every owned product with start date, instructions, consistency and daily logging.
4. **Results Decoder** — a plain-language status per product ("It is still too early.") using start date + verified timeline + consistency + check-ins, with an AI-written personalised explanation.
5. **Care Journey** — gamified 90-day path: XP, levels, streaks, daily/weekly missions, milestone path, 28-day consistency calendar.

**Tech stack:** React + TypeScript + Vite, Tailwind CSS, React Router, `lucide-react` icons, Framer Motion (subtle). Persist all user data in `localStorage` (multi-user: keyed by account email). Use the Gemini API (via the key AI Studio provides, e.g. `process.env.GEMINI_API_KEY`) **only** for the "Personalised explanation" card on the Results Decoder, with a deterministic template fallback if the call fails or no key exists.

**Tone of voice:** warm, honest, calm, slightly editorial. Never medical-diagnostic. Footer disclaimer everywhere: *"Guidance only — not a medical diagnosis. Consult a dermatologist for persistent concerns."* Currency is Indian Rupees (₹). Dates display as `7 Nov 2026`.

**Design language (must match exactly — details in Part B):** warm cream background, near-black forest-green ink, caramel/amber accent, **serif headlines (Lora) with one *italic amber word*** in almost every headline, DM Sans body, **monospace uppercase eyebrow labels** with wide letter-spacing, very rounded white cards (20–28px), pill buttons, soft shadows, mint-green success states, and an editorial/premium wellness feel.

Build the app in the order I give in follow-up prompts. Do not invent extra features. Keep code modular: `/components`, `/pages`, `/lib` (status engine, match scoring, routine-test engine, XP engine), `/data` (catalogue + seed).

---

## PART B — DESIGN SYSTEM (exact)

### B1. Colour tokens (sampled from the recordings)
| Token | Hex | Where it's used |
|---|---|---|
| `--cream` | `#FAF7F0` | Page background |
| `--cream-2` | `#F5F1E8` | Subtle section tint, input track |
| `--beige` | `#F0EBE1` | Chip backgrounds, "testing against my shelf" box, empty calendar cells |
| `--card` | `#FFFFFF` | Cards, modals |
| `--ink` | `#172319` | Headlines, primary dark buttons, dark sections, active nav pill |
| `--ink-2` | `#18231F` | Dark pill buttons |
| `--forest` | `#2C5044` | Progress bars, selected chips, avatar, check icons |
| `--forest-muted` | `#2E3E33` | Muted dark bars (curve W1–W2) |
| `--amber` | `#A46F39` | Primary CTA buttons, italic accent words, eyebrow text (hover `#8F5E2D`) |
| `--amber-light` | `#E29D52` | Level badge, curve bars W3–W8, calendar active, flame, XP |
| `--mint` | `#8EBEA6` | Curve bars W9–W13 |
| `--mint-bg` | `#E8F1EC` | Completed mission rows, "Logged today" button, "On your shelf" pill |
| `--toast-bg` | `#ECFEF2` | Toast background (text/icon in deep green `#1F7A4D`) |
| `--peach-from` → `--peach-to` | `#EADCC2` → `#EAC598` | Landing CTA band gradient (135°, cream-peach → warm peach) |
| `--lavender-bg` / `--lavender-text` | `#EEEAFB` / `#5B4BC4` **[INFERRED]** | "Too early" status chip (purple dot + text) |
| `--muted-text` | `#6B6F66` | Secondary copy |
| `--line` | `#E9E4D8` | Hairline borders |

Status colours **[INFERRED from landing ticker + decoder]**: Too early = lavender; Expected lag phase = amber-light; On track = forest/mint; Review usage = orange; Consider professional help = red-brown `#B4492E`. Routine-test meter gradient: green → yellow → orange → red.

### B2. Typography
- **Headings:** `Lora` (serif), weights 500–600. Hero H1 ≈ 64–72px/1.05 desktop, section H2 ≈ 40–48px, card titles 20–28px. Letter-spacing −0.01em.
- **Accent word:** one word per headline in *Lora Italic*, colour `--amber` (e.g. "Most products don't fail. They're judged *too early.*").
- **Body / UI:** `DM Sans` 400/500/600, 14–16px.
- **Eyebrows / labels / stat captions:** monospace (`JetBrains Mono` or `DM Mono`), 10–11px, **UPPERCASE**, letter-spacing 0.14–0.18em, colour `--amber` (eyebrows) or `--muted-text` (captions). Format: `02 · PERSONAL PRODUCT MATCH`.
- Big numbers (stats, match %, day counters) use Lora.

### B3. Shape, spacing, elevation
- Page max-width ~1200–1280px, side padding 24px (desktop 48px). Section vertical rhythm 96–120px on landing, 40–56px in app.
- Radius: inputs/buttons 12px and **full pill (9999px)** for CTAs/nav/chips; cards 20–24px; hero/level banner 28px; modal 24px; calendar cells 10px.
- Shadows: very soft, warm (`0 8px 30px rgba(23,35,25,0.06)`); selected cards get an amber 1.5px border plus a faint amber ring.
- Focus: 2px amber (`--amber`) ring on inputs; disabled buttons are flat grey (`#8D918A` bg, white text) or 50% opacity.
- Buttons: **Primary** = amber pill, white text, trailing arrow `→`. **Dark** = ink pill. **Outline** = white pill, 1px line border. **Ghost** = text only. All have 150ms hover lift (−1px) and darken.

### B4. Brand logo
Rounded-square/circle **dark ink badge with an amber leaf glyph**, followed by wordmark `be bodywise` (DM Sans 600, lowercase) with a tiny mono caption underneath: `RESULTS SYSTEM`. On dark panels the badge inverts to an **amber filled circle with a dark leaf**.

### B5. Imagery
- **Hero & auth portraits:** a woman with long brown hair in a black-and-white striped shirt, warm golden-hour light, soft background. Hero crops it in an **arch** (fully rounded top, flat bottom). On auth screens the same photo is darkened (≈75% ink overlay) and blurred as a full-height left panel.
- **Products:** editorial still-life photography — amber dropper bottles on an orange background, kraft-brown shampoo bottles on beige, a trio of bottles with dried-flower vase, a black-and-white macro of a serum dropper, white serum bottles on marble. Use consistent square-ish crops (≈4:3 in grids, tall in list cards). Use Unsplash-style stock URLs or let me upload my own.

### B6. Motion
- Page/section entrance: fade + 12px translate-up, 400ms, stagger 60ms.
- Landing marquee: continuous right-to-left scroll.
- Curve bars: grow from baseline on scroll-into-view, staggered.
- Progress bars: animate width 600ms ease-out.
- Toast: slide up from bottom-right, auto-dismiss after 3.5s.
- XP gain: a "+10 XP" toast and the header streak/level chip pulses once.
- Selecting a card: border colour + check badge pops in (scale 0.8 → 1).

### B7. Toasts (global)
Bottom-right, white-mint card (`--toast-bg`), 12px radius, green check-circle icon, green text, soft shadow. Used for success events (see each screen).

---

## PART C — APP SHELL, ROUTES & NAVIGATION

**Routes**
| Path | Screen | Auth |
|---|---|---|
| `/` | Landing | public |
| `/login` | Sign in | public |
| `/signup` | Create account | public |
| `/dashboard` | Overview **[INFERRED — not recorded]** | private |
| `/match` | Personal Product Match | private |
| `/routine-test` (`?product=<slug>`) | Routine Test | private |
| `/shelf` | My Shelf | private |
| `/decoder` (`?item=<shelfItemId>`) | Results Decoder | private |
| `/journey` | Care Journey | private |

**Landing nav (public):** left logo; centre links **"Why it 'didn't work'"**, **"The system"**, **"The 90-day curve"** (smooth-scroll anchors `#why`, `#system`, `#curve`; active link turns amber via scroll-spy); right **"Sign in"** (text) and **"Start free"** (dark pill).

**App nav (logged in):** sticky, cream, bottom hairline. Left: logo (links to `/dashboard`). Centre: pill links **Overview · Product Match · Routine Test · My Shelf · Results Decoder · Care Journey**; the **active** item is a filled ink pill with white text; inactive are plain text with hover tint. Right: **streak/level chip** (`🔥 {streak}` + tiny mono `LV {level}`, in a soft cream pill) and a **circular avatar** (forest background, white initial of first name). Avatar opens a small menu: Profile **[INFERRED]**, Sign out.

**Cross-link behaviour (important):**
- "Routine test first" on a Product Match card → `/routine-test?product=<slug>` with that product pre-selected.
- Clock/gauge icon button on a Shelf card → `/decoder?item=<id>`.
- Header chip reflects live streak + level everywhere.

---

## PART D — SCREENS

### D1. Landing page (`/`)

**Hero (two columns, cream bg)**
- Eyebrow: `THE 90-DAY RESULTS SYSTEM · BE BODYWISE`
- H1: **"Most products don't fail. They're judged *too early.*"** (3 lines; "too early." italic amber)
- Paragraph: "One connected system that starts before you buy and stays with you through the critical 90-day results window — so you always know whether it's too early, on track, or time to change something."
- CTAs: **"Find my product match →"** (amber pill) → `/signup`; **"Explore the live demo"** (white outline pill) → demo login.
- Stat row (Lora numerals + mono captions): **90** DAYS DECODED · **5** CONNECTED TOOLS · **4** ROOT CAUSES FIXED.
- Right: arch-cropped portrait with **three floating cards** (gentle float animation):
  1. Top-left glass card: mono `RESULTS DECODER · DAY 45`, quote *"You are in the expected lag phase."*, and a 4-segment progress bar (forest, amber, grey, grey).
  2. Bottom-right dark pill: flame icon, **"24 days"**, mono `STREAK · LV 4 RITUAL KEEPER`.
  3. Bottom-left white pill: **96%** (forest) · "10% Niacinamide Serum" · caption "Matched to oily, combination skin".

**Marquee band** (full-width ink strip, white serif text, amber `✦` separators, infinite scroll): `Too early ✦ Expected lag phase ✦ Review usage ✦ On track ✦ Consider professional help ✦ Day 1 → Day 90 ✦` (repeat).

**Section `#why` — "WHY 'IT DIDN'T WORK'"**
- Left: H2 **"Four factors drive almost every 'I saw nothing.'"** + paragraph: "No formulation changes. The system improves selection, usage, expectations and consistency — the four things that decide whether results ever get the chance to appear."
- Right: numbered list (01–04, mono numbers right-aligned), each with a title, one-line description, and a forest-tick chip:
  - **01 Selection accuracy** — "The product never suited her hair, skin or body in the first place." ✓ *Solved by Product Match + Routine Test*
  - **02 Usage correctness** — "Right product, wrong amount, wrong time, wrong contact time." ✓ *Solved by My Shelf instructions*
  - **03 Expectation setting** **[INFERRED]** — "Judged at week 1 when the timeline says week 6." ✓ *Solved by Results Decoder*
  - **04 Consistency** **[INFERRED]** — "Skipped days and quitting during the dip." ✓ *Solved by Care Journey*

**Section `#system` — "ONE CONNECTED SYSTEM · 02 · 03 · 04 · 11 · 12"**
- H2: **"My Shelf is the single source of truth. Everything else reads from it."**
- Bento grid: a tall **dark ink card** "04 · OWNERSHIP & SETUP — *My Shelf*" (product photo faded inside), plus white cards each with a mono tag, serif title, 1–2 line description and a small round beige icon button top-right:
  - `02 · PRE-PURCHASE` **Personal Product Match** — "A short assessment matches your hair, skin and body profile to the formulas that genuinely suit you — with a clear 'why this suits you.'"
  - `03 · PRE-PURCHASE` **Routine Test** **[INFERRED copy]** — "Check a product against your shelf before you buy."
  - `11 · DECODING` **Results Decoder** **[INFERRED copy]**
  - `12 · RETENTION` **Care Journey** **[INFERRED copy]**

**Section `#curve` — dark ink full-bleed**
- Eyebrow `THE 90-DAY CURVE` (amber mono). H2 (white serif): **"Weeks 3–8 are where results are won — or abandoned."**
- 13 rounded vertical bars labelled `W1 … W13` (tiny mono below): **W1–W2** muted dark green (adjustment), **W3–W8** amber-light (dropout danger zone), **W9–W13** mint (results visible). Bar heights increase gradually from W1 to W13. Animate on scroll-in.

**CTA band:** large 28px-radius card, peach gradient. H2 **"Know where you are on day 1, day 18 and day 90."** Sub: "Take the 60-second match, build your shelf and let the Decoder do the worrying." Buttons: **"Create my account ↗"** (dark pill) → `/signup`; **"Try the demo account"** (text link) → demo login.

**Footer:** logo left; right-aligned small muted text: "Guidance only — not a medical diagnosis. Consult a dermatologist for persistent concerns."

---

### D2. Auth screens (`/login`, `/signup`) — split layout (50/50, full height)

**Left panel (dark, shared by both):**
- Darkened/blurred portrait background.
- Top-left: inverted logo (amber badge + white wordmark + `RESULTS SYSTEM`).
- Mono amber label `DAY 1 → DAY 90`.
- H1 white serif: **"Stop guessing whether it's *working.*"** (amber italic on "working.").
- Paragraph (white 70%): "Your shelf, your start dates and your check-ins — decoded against each product's verified timeline."
- Frosted glass testimonial card with a flame icon: **"Day 45 — I almost quit at week 3."** / small: "The Care Journey kept me going through the lag phase."
- (Signup only) bottom mono caption: `GUIDANCE ONLY · NOT A MEDICAL DIAGNOSIS`.

**Right panel (cream), form centred, max-width ≈ 420px:**

*Sign in*: eyebrow `WELCOME BACK`; H2 **"Sign in to your results system"**; fields **Email** (placeholder `you@example.com`), **Password** (`Your password`); full-width amber button **"Sign in →"**; below it a ghost bordered button with a wand icon: **"One-tap demo login (Aanya · Day 52 · 24-day streak)"**; footer line: "New here? **Create an account**".

*Create account*: eyebrow `CREATE YOUR ACCOUNT`; H2 **"Begin your 90-day journey"**; fields **First name** (`Aanya`), **Email** (`you@example.com`), **Password** (`At least 6 characters`); amber **"Create account →"**; footer: "Already have an account? **Sign in**".

**Behaviour:** inline validation (email format, password ≥ 6), error text under field in red-brown; loading state on button. After signup → toast **"Welcome, {firstName} — let's find your match"** and redirect to `/match` (new users start empty: streak 0, LV 1). After login → `/dashboard`. Demo login loads the seeded "Aanya" account (see Part F).

---

### D3. Personal Product Match (`/match`)

**Header:** eyebrow `02 · PERSONAL PRODUCT MATCH`; H1 **"Find what truly *suits you.*"**; sub: "Four quick questions. We filter the catalogue down to what suits your hair, skin and body — before you spend a rupee."

**Layout:** left vertical **stepper** (4 items), right large white **wizard card**.
- Stepper items: `1 Focus`, `2 Skin type`, `3 Concerns`, `4 Your routine`. Active = white pill with amber numbered circle; completed = forest circle with white check; future = grey number, no pill.
- Card header: mono `STEP {n} OF 4`, serif question, muted hint.
- Footer row: **← Back** (ghost, disabled on step 1) · (**Cancel** ghost, shown when retaking) · **Continue →** (ink pill; **disabled grey until the step is valid**).

**Step 1 — "What would you like to work on?"** *Pick one or more.* Three selectable cards in a row: **Hair** (*Fall, thinning, dandruff, frizz*), **Skin** (*Acne, pores, spots, dryness*), **Body** (*Body acne, underarms, legs*). Selected = amber border, faint amber tint, amber circle with white check at top-right.

**Step 2 — "What's your skin type?"** **[INFERRED]** Only shown if Skin was chosen (otherwise auto-skipped, stepper marks it complete). Cards: Dry · Oily · Combination · Normal · Sensitive. Single-select.

**Step 3 — "What's bothering you most?"** *Choose every concern that applies.* Grouped by selected focus; each group has a mono label (e.g. `HAIR`) and **chips** (pill, multi-select, selected = ink fill):
- HAIR: Hair fall · Thinning / low density · Dandruff & itchy scalp · Frizz & dryness
- SKIN: Acne & breakouts · Open pores & oiliness · Pigmentation & dark spots · Dullness & uneven tone · Dryness & weak barrier
- BODY **[INFERRED]**: Body acne · Underarm darkness · Rough / bumpy skin · Leg dryness

**Step 4 — "Tell us about your routine"** — two single-select card rows:
- *How reactive is your skin to new actives?* → **Rarely reacts · Sometimes reacts · Reacts easily**
- *How many products do you want to commit to?* → **Minimal** (*Top 3 essentials*) · **Balanced** (*4 targeted products*) · **Complete** (*Up to 6 products*)
- Final button label: **"See my matches →"** **[INFERRED]**.

**Results view (same route, after step 4):**
- Toast **"Your matches are ready · +50 XP"** (one-time XP).
- Eyebrow `02 · PERSONAL PRODUCT MATCH`; H1 **"Your formulas, *matched.*"**; sub "Ranked for your profile, with the honest reason each one belongs in your routine."; top-right ghost link **"↻ Retake assessment"**.
- Profile chips: first filled ink (**Hair**), others outline (**Dry Skin**, **Dandruff & itchy scalp**) — summarises the answers.
- **Match card** (horizontal, white, 24px radius): left product image (≈ 200px wide, full height) with a **`BEST MATCH`** pill (top-left) on the first result. Right side:
  - mono `HAIR · 200 ML · ₹399`
  - serif product name; one-line tagline ("Clears flakes and calms itch without stripping")
  - top-right: big serif **69%** with mono caption `MATCH`; under the title a thin forest progress bar sized to the %
  - mono label `WHY THIS SUITS YOU` + 3 check-bullets (generated from the logic in Part G): *Targets your concern: dandruff & itchy scalp* · *Key actives: Piroctone Olamine, Salicylic Acid* · *Realistic timeline: first visible change around week 3*
  - buttons: outline **"⚗ Routine test first"** and amber **"+ I own it — add to shelf"**
  - after adding: the amber button becomes a mint pill **"✓ On your shelf"** and toast **"Scalp Clarify Anti-Dandruff Shampoo added to My Shelf — Day 1 starts today"**.
- Number of cards returned = routine commitment (Minimal 3 / Balanced 4 / Complete 6). Only the first card carries `BEST MATCH`.
- Returning to `/match` with saved results shows the results view directly; "Retake assessment" resets the wizard.

---

### D4. Routine Test (`/routine-test`)

**Header:** eyebrow `03 · ROUTINE TEST`; H1 **"Test it against your shelf *before* you buy."**; sub: "Pick any product you're considering. We compare its purpose and actives with everything on My Shelf and flag duplicates, overlapping purposes and active clashes."

**Two-column layout:** left = catalogue, right = sticky **Candidate** panel.

**Left:** filter row — segmented pills **All · Hair · Skin · Body** (active = white pill with shadow in a beige track) + search field with magnifier (`Search product or active`, matches name, category, actives; e.g. "hair" filters to hair products). Below, **3-column product grid**: image top (4:3, rounded top corners), mono `HAIR · ₹699`, bold product name. Selected card = amber border + slight lift. If the product is already on the shelf, show a small "On shelf" tag.

**Right Candidate card (white, 24px):**
- Empty: mono `CANDIDATE`, "Pick a product on the left."
- Selected: thumbnail + serif name + mono actives (e.g. `Argan Oil · Hydrolysed Keratin`).
- Beige box `TESTING AGAINST MY SHELF · {n}` listing shelf-product **chips**; if empty: "Your shelf is empty — add **what you own** (amber link) for an accurate test."
- Full-width ink button **"⚗ Run Routine Test"** (disabled grey until a candidate is chosen).
- **Result block** (appears below with fade/slide): a **horizontal meter** — gradient green → yellow → orange → red, marker dot positioned by verdict, tick labels `GOOD · CAUTION · OVERLAP · DUPLICATE`; a verdict pill (`✓ GOOD`); serif verdict title (**"Good addition"**), sub ("No duplicates or clashes with what you own."); then a row per shelf item: product name + right-aligned tag (`COMPLEMENTARY`, `OVERLAP`, `DUPLICATE`, `CLASH`) + one-line reason ("Different purpose — no conflict."). Primary action: amber **"+ Bought it — add to shelf"** → adds to shelf with start date today; toast **"{name} added to My Shelf"**.
- The "testing against shelf" count and chips update live after adding.

---

### D5. My Shelf (`/shelf`)

**Header:** eyebrow `04 · MY SHELF · SINGLE SOURCE OF TRUTH`; H1 **"Everything you own, *on the clock.*"**; sub: "Each product keeps its start date, instructions and consistency. The Decoder and your Care Journey read directly from here."; top-right amber pill **"+ Add product"**.

**Stat cards (3, white):** **{n}** `PRODUCTS` · **{pct}%** `AVG. CONSISTENCY` · **{done}/{total}** `LOGGED TODAY` (serif numerals, mono captions).

**Product card grid (3 columns):** each card —
- Image top with a **category pill** (`HAIR`/`SKIN`/`BODY`, white translucent, mono) top-left and a round **"⋯" menu** top-right (Edit start date, View in Decoder, Remove).
- Title row: serif product name; under it a small icon + **"Started 7 Nov 2026"** (book icon for catalogue items, pencil icon for manual items). Right: a **circular progress ring** showing **day / 90** (e.g. big "1" with tiny "/ 90"), ring stroke in purple→amber depending on status.
- Chip row: **status chip** (purple dot + "Too early"), **timing chip** (`Shower` / `AM` / `PM`), **frequency chip** (`Daily` / `2+ a week`).
- Instruction text (muted), e.g. "Lather on the scalp and leave for 3–5 minutes before rinsing. Use twice a week."
- `Consistency (28 days)` + right-aligned % and a forest progress bar.
- Actions: full-width ink **"Log today's application"** + a small round outlined icon button (gauge) → opens Decoder for this item.
- After logging: button becomes mint **"✓ Logged today"** (disabled), toast **"+10 XP · {product} logged"**, header streak/level update, "Logged today" stat updates.

**Add to My Shelf modal** (white, 24px radius, scrollable, overlay blur): title **"Add to My Shelf"**, sub "Your start date is the single piece of data that unlocks the Decoder and your Care Journey.", close ✕. Segmented tabs: **Catalogue · Scan barcode · Manual**.
- **Catalogue:** search `Search serum, shampoo, niacinamide…`; scrollable list rows (thumb, bold name, muted `Hair · Procapil + Redensyl · ₹699`); rows already owned are faded with a right-aligned "On shelf" label and are not clickable. Selecting a row adds it (start date = today) and shows the toast **"{name} is on your shelf — Day 1 starts your timeline"**.
- **Scan barcode:** dark ink rounded square (≈ 255×190) with **four amber corner brackets** and a dashed inner frame; centred scan icon and text **"Point the camera at the barcode on the pack"**. Use `getUserMedia` + the `BarcodeDetector` API where available; map EAN codes to catalogue items; fall back gracefully with a "Camera unavailable — try Catalogue or Manual" message.
- **Manual:** fields — `PRODUCT NAME` (`e.g. My vitamin C serum`), `CATEGORY` select (Hair/Skin/Body), `HOW OFTEN` select (Daily, 2+ a week, Weekly…), `WHAT IS IT FOR?` multi-select chips (Acne & breakouts · Open pores & oiliness · Pigmentation & dark spots · Dullness & uneven tone · Dryness & weak barrier — selected = forest fill), `KEY ACTIVES` (`Vitamin C, Ferulic Acid`), `WHEN` select (AM / PM / Shower…), `INSTRUCTIONS (OPTIONAL)` textarea (`How much, where, and for how long`), `START DATE` date input defaulting to today. Submit **"Add manual product"** amber, faded until Product Name is filled (invalid empty field shows a soft red border). Manual items use a generic placeholder photo (macro serum dropper) and the pencil icon.

---

### D6. Results Decoder (`/decoder`)

**Header:** eyebrow `11 · PERSONAL RESULTS DECODER`; H1 **"Is it working? Here's the *honest* answer."**; sub: "Your start date + the product's verified timeline + your consistency + your own check-ins, decoded into one clear status."

**Left column — shelf list:** each shelf product as a compact card (small progress ring `1 / 90`, name, status chip). Selected card has a white background, strong border and shadow; the selection is reflected in `?item=`.

**Right column — verdict card (white):**
- Top: status chip (e.g. purple-dot **Too early**) + mono product name (`SCALP CLARIFY ANTI-DANDRUFF SHAMPOO`).
- Big serif quote: **"It is still too early."** (verdict headline varies by status; see Part G).
- Explanation paragraph: "Day 1 of a product that typically shows first change around day 21. The first 7 days are about your scalp adjusting — no visible result is expected yet."
- Three stats (Lora numerals + mono captions): **1** `DAY ON PRODUCT` · **100%** `CONSISTENCY` · **1/0** `USES · 28 DAYS` **[the "1/0" reads as uses/expected; implement as logged-uses over expected-uses in 28 days]**.

**Two cards below (side by side):**
1. **Next steps** (white): mono `NEXT STEPS`, numbered list — *Keep applying twice a week (Shower) exactly as instructed* · *Take a baseline photo in the same light today* · *Book a check-in with yourself on day 8*. Then mono `CHECK-IN HISTORY` with timeline rows (`📍 Day 1 — No change`).
2. **Weekly check-in** (white): mono `WEEKLY CHECK-IN · +40 XP`, serif **"What are you seeing?"**, a 5-segment scale — **0 Worse · 1 No change · 2 Slight · 3 Noticeable · 4 Significant** (selected = ink fill), checkbox **"I've had irritation, redness, burning or unusual shedding"**, textarea `Note (optional)` (`e.g. less hair in the shower drain`), amber **"Save check-in"** → saves, adds a row to history, awards +40 XP, toast.

**Personalised explanation (full-width dark ink card, white text):** sparkle icon + mono amber `PERSONALISED EXPLANATION`; two short paragraphs written by Gemini, e.g. "It is day 1, so no change is exactly what we expect. Piroctone olamine works on the yeast that drives flaking and itch, and salicylic acid loosens existing flakes… Visible change usually begins around day 21, with fuller results around day 42. This week, take a baseline photo today in the same light you will use later…". Shows a shimmer skeleton while loading, a **"Regenerate"** ghost link, and awards +25 XP the first time per week (powers the "Run a Results Decoder review" weekly mission).

---

### D7. Care Journey (`/journey`)

**Hero banner (ink, 28px radius, subtle radial glow):**
- Left: **level badge** — amber-light rounded-square (≈ 76px, soft glow/shadow) with mono `LEVEL` over a big serif number.
- Centre: mono amber `12 · THE CARE JOURNEY`; giant white serif **level title** (e.g. **"Consistent Carer"**); below, XP bar: left `185 XP`, right `400 XP · Lag-Phase Survivor` (next level), amber fill.
- Right: three frosted stat tiles — 🔥 **1** `DAY STREAK` · 🏆 **1** `BEST STREAK` · **1** `OF 90 DAYS` with a thin progress bar.

**Two columns below:**

*Left — "YOUR 90-DAY PATH"* (mono eyebrow) + serif H2 **"Every milestone, one step at a time"**. A **vertical, centred timeline** of circular nodes connected by a thin line:
| Day | Title | Subtitle | Node |
|---|---|---|---|
| 1 | **Day one** | Baseline photo & first application | amber-light circle + dark star (current), mono `DAY 1 · YOU'RE ON DAY 1` |
| 7 | **First week** | Habit is forming — skin & scalp adjusting | locked (grey circle + lock) |
| 14 | **Adjustment exit** | Purging and shedding settle down | locked |
| 21 | **Danger zone begins** | Week 3: most people quit here. Not you. | locked + red pill `🛡 DROPOUT ZONE` |
| 42 **[INFERRED]** | **Visible change** | First visible results for most products | locked |
| 70 | **Momentum** | Changes become easy to see in photos | locked |
| 90 | **Transformation** | Full 90-day results review | locked |

Nodes unlock/animate to amber with a check as the user's day count passes them.

*Right — sticky stack:*
1. **Missions card:** mono `TODAY · 2026-11-07`, serif **Missions**, right "`6/6 done`". Sections `DAILY MISSIONS` and `WEEKLY MISSIONS`. Each mission row = rounded 14px pill-card with a circular checkbox, bold title, muted subtitle, and a right XP chip (`⚡ 10`).
   - Daily (one per shelf product): **"Apply {product}"** · `Shower · Day 1 · Adjustment` · ⚡10. Completing it here logs the shelf application (and vice-versa — same source of truth).
   - Weekly: **"Run a Results Decoder review"** · "Get your personalised AI explanation." · ⚡25; **"Take the Personal Product Match"** · "Know which formulas truly suit you." · ⚡50 (one-time).
   - **Done** rows = mint background, green filled check, green XP chip. **Open** rows = white with amber outline on hover/focus.
   - Toast on completion: **"+10 XP · {product} logged"**; counter `n/6 done` updates live.
2. **Consistency calendar · 28 days:** mono `CONSISTENCY CALENDAR · 28 DAYS`; 7×4 grid of rounded squares in beige; active days filled with a 4-step amber scale (light → dark), **today has a thick dark outline**; footer: left "`1 active days total`", right legend `Less ● ● ● More`.

---

### D8. Overview (`/dashboard`) **[INFERRED — not shown in the recordings]**
Keep the same visual system. Suggested layout: greeting H1 **"Good morning, {name}. *Day {n}* of your 90."**; a "Next best action" dark card; today's missions summary; shelf status strip (chips with status per product); 3 quick-links cards (Match, Routine Test, Decoder); mini streak + XP. Ask me to adjust once I've seen it.

---

## PART E — GLOBAL INTERACTION RULES
1. Buttons that depend on a selection are **disabled (flat grey)** until valid.
2. Every successful action shows a toast; XP awards always say `+{n} XP`.
3. Streak: a day counts as active if **≥ 1 application is logged**. Missing a day resets current streak to 0 (best streak stays).
4. Header chip (`🔥 streak · LV n`) must update instantly after any XP/log action.
5. All text inputs show the amber focus ring; invalid fields show a red-brown border + helper text.
6. Keyboard accessible (focus-visible styles, `aria-label`s on icon buttons, modal focus trap, ESC to close).
7. Respect `prefers-reduced-motion`.
8. **Responsive:** desktop 1280+, tablet 768, mobile 375. On mobile the top nav collapses into a hamburger drawer (or a bottom tab bar); two-column layouts stack; the Match stepper becomes a horizontal progress strip; shelf/product grids go 1-column (2 on tablet); auth screens hide the dark left panel except for a compact headline above the form.

---

## PART F — DATA MODEL & SEED DATA

```ts
type Category = 'hair' | 'skin' | 'body';
type Status = 'too_early' | 'lag_phase' | 'on_track' | 'review_usage' | 'professional_help';

interface CatalogueProduct {
  id: string; slug: string; name: string; category: Category;
  sizeMl?: number; price: number;            // ₹
  tagline: string; image: string;
  actives: string[];                         // e.g. ['Piroctone Olamine','Salicylic Acid']
  purposes: string[];                        // e.g. ['dandruff']
  concerns: string[];                        // matches the concern chips
  skinTypes?: string[];                      // best for
  reactivity: 1 | 2 | 3;                     // 1 gentle … 3 strong
  timeline: { adjustmentDays: number; firstChangeDay: number; fullResultDay: number };
  usage: { when: 'AM'|'PM'|'Shower'|'Any'; frequency: 'Daily'|'2+ a week'|'Weekly'; instructions: string };
}
interface ShelfItem {
  id: string; productId?: string; manual?: { name:string; category:Category; actives:string[]; purposes:string[]; };
  startDate: string; when: string; frequency: string; instructions?: string;
  logs: string[];                            // ISO dates applied
  checkIns: { date:string; score:0|1|2|3|4; irritation:boolean; note?:string }[];
}
interface UserState {
  profile: { firstName:string; email:string };
  xp: number; streak: number; bestStreak: number;
  shelf: ShelfItem[]; matchAnswers?: any; matchResults?: string[];
  missions: Record<string /*date*/, string[] /*completed mission ids*/>;
  oneTimeAwards: string[];                   // e.g. 'match_done'
}
```

**Catalogue (seed ≥ 12 items; the first 7 are exactly as seen):**
| Name | Cat | Price | Actives | Notes |
|---|---|---|---|---|
| Procapil + Redensyl Hair Growth Serum | hair | ₹699 | Procapil, Redensyl | amber dropper on orange bg; first change ≈ day 60 |
| Hair Fall Control Biotin Shampoo | hair | ₹449 | Biotin, Pea Protein | kraft bottles on beige |
| Scalp Clarify Anti-Dandruff Shampoo | hair | ₹399 · 200 ml | Piroctone Olamine, Salicylic Acid | first change ≈ day 21, full ≈ day 42; "Lather on the scalp and leave for 3–5 minutes before rinsing. Use twice a week." |
| Smooth & Shine Anti-Frizz Hair Serum | hair | ₹349 | Argan Oil, Hydrolysed Keratin | AM · Daily · "Warm 2 pumps between palms and smooth over mid-lengths and ends of damp or dry hair." |
| 2% Salicylic Acid Face Serum | skin | ₹499 | Salicylic Acid | white bottle, marble |
| 10% Niacinamide Clarifying Serum | skin | ₹549 | Niacinamide | black dropper on tray |
| Kojic + Alpha Arbutin Spot Correcting Cream | skin | ₹ **[set ~₹599]** | Kojic Acid, Alpha Arbutin | |
| + 5 more (skin: a vitamin C serum, a barrier moisturiser, a sunscreen; body: an AHA body lotion, an underarm roll-on) **[INFERRED]** | | | | |

**Demo account "Aanya"** (one-tap login): Day 52, 24-day streak, LV 4 "Ritual Keeper", 4 shelf items with different start dates so the Decoder shows **Too early / Expected lag phase / On track / Review usage** examples, check-in history, and a well-populated calendar heat-map.

---

## PART G — LOGIC SPECIFICATIONS

### G1. Day count & consistency
- `day = daysBetween(startDate, today) + 1` (Day 1 = start date).
- `expectedUses(28d)` from frequency (Daily = days on shelf up to 28; 2+/week ≈ 2 per week elapsed…). `consistency% = loggedUses / expectedUses`. Display `100%` when nothing is yet expected.

### G2. Results Decoder status engine (deterministic, then explained by Gemini)
Evaluate in this order:
1. **Consider professional help** — any check-in with `irritation = true` in the last 14 days, **or** day ≥ `fullResultDay` + 14 with latest score ≤ 1 and consistency ≥ 80%.
2. **Review usage** — day > 14 **and** consistency < 60%.
3. **On track** — latest check-in score ≥ 2 **and** consistency ≥ 70%.
4. **Too early** — day < `firstChangeDay`. (Day ≤ `adjustmentDays` adds the "adjustment period" sentence.)
5. **Expected lag phase** — otherwise (past first-change day but no visible change yet, consistency fine).

Headlines: Too early → *"It is still too early."* · Lag phase → *"You are in the expected lag phase."* · On track → *"You are on track."* · Review usage → *"Let's review how you're using it."* · Professional help → *"Consider professional help."*
The explanation paragraph is templated from the product timeline (e.g. "Day {d} of a product that typically shows first change around day {n}…").

**Gemini prompt (Personalised explanation):** send product name, category, actives, day, consistency, status, check-in history and the timeline; ask for **2 short paragraphs (≈ 90 words total)**, warm and plain-language, mention how the key actives work, what to do this week, and never give a medical diagnosis. Provide a templated fallback paragraph if the call fails.

### G3. Product Match scoring
`score = 100 × weighted sum`: concern overlap (40%) + focus/category fit (20%) + skin-type fit (15%) + reactivity tolerance (15%) + timeline realism/commitment fit (10%), clamped 40–98. Sort descending; return N = 3/4/6. The "Why this suits you" bullets are generated from the matched concern, the key actives, and the product's `firstChangeDay` ("first visible change around week {⌈d/7⌉}").

### G4. Routine Test engine
For the candidate vs each shelf item produce a pair verdict:
- **Duplicate** — same purpose **and** same primary active(s).
- **Overlap** — same purpose, different actives.
- **Clash** — known conflicting actives (e.g. retinoid + AHA/BHA, vitamin C + strong acids at the same time, benzoyl peroxide + retinoid) → recommend splitting AM/PM or alternate days.
- **Complementary** — different purpose, no conflict.
Overall verdict = worst pair: Good (all complementary) → Caution (clash/overlap in some) → Overlap → Duplicate. Marker position on the gradient meter follows the verdict. Empty shelf → "Good addition — nothing to clash with yet" plus the prompt to add what you own.

### G5. XP & levels
| Event | XP |
|---|---|
| Log an application | +10 |
| Run a Results Decoder review (AI explanation, weekly) | +25 |
| Weekly check-in | +40 |
| Complete Personal Product Match (one-time) | +50 |

Levels **[INFERRED titles/thresholds, seen: LV 2 "Consistent Carer", next at 400 XP "Lag-Phase Survivor", LV 4 "Ritual Keeper"]**: LV1 *Fresh Starter* 0 · LV2 *Consistent Carer* 100 · LV3 *Lag-Phase Survivor* 400 · LV4 *Ritual Keeper* 800 · LV5 *Results Realist* 1500.

### G6. Missions
Daily missions are generated from the shelf (one per product, due today, subtitle = `{when} · Day {d} · {phase}` where phase ∈ Adjustment / Lag / Visible). Weekly missions reset Monday. Mission completion and shelf logging share the same data.

---

## PART H — COPY RULES (keep these strings exact)
Headlines use a *single italic amber word*: "…judged *too early.*", "Find what truly *suits you.*", "Your formulas, *matched.*", "Test it against your shelf *before* you buy.", "Everything you own, *on the clock.*", "Is it working? Here's the *honest* answer.", "Stop guessing whether it's *working.*".
Eyebrow numbering is fixed: Match `02`, Routine Test `03`, My Shelf `04`, Decoder `11`, Care Journey `12`.
Button verbs: "Find my product match →", "Explore the live demo", "Create my account ↗", "Try the demo account", "Continue →", "Run Routine Test", "I own it — add to shelf", "Bought it — add to shelf", "Log today's application", "Save check-in", "Add manual product".

---

## PART I — SUGGESTED BUILD ORDER (one follow-up prompt per step)
1. Design system: Tailwind config with the tokens above, fonts, base components (Button, Chip, Card, Input, Toast, Modal, ProgressRing, ProgressBar, Eyebrow, Logo).
2. App shell + routing + auth (login/signup/demo) + localStorage state store.
3. Landing page (all sections + marquee + curve animation).
4. Data layer: catalogue, seed, demo account, status/XP/match/routine engines in `/lib` with unit-style sanity checks.
5. My Shelf (cards, add modal with 3 tabs, logging).
6. Product Match (wizard + results).
7. Routine Test.
8. Results Decoder (+ Gemini explanation with fallback).
9. Care Journey (hero, path, missions, calendar).
10. Overview dashboard, responsive pass, accessibility pass, polish animations.

---

## PART J — WHAT I COULD NOT SEE IN THE RECORDINGS (please confirm or send screenshots)
- The **Overview/dashboard** screen (cursor hovered the link but it wasn't opened).
- Product Match **Step 2 (Skin type)** options, and the Skin/Body concern lists on Step 3.
- Landing "Why it didn't work" items **03–04**, and the copy of the other system cards.
- Routine Test results for **Overlap / Duplicate / Clash** states (only "Good addition" was recorded).
- Decoder states other than **Too early** (copy for the other four statuses is written by me from the landing-page ticker).
- Avatar menu, the "⋯" card menu, empty states, error states and the mobile layout.
- Audio/voice-over: I can't transcribe audio here, so any narration in the videos has not been used.
