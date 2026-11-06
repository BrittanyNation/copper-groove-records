# Copper Groove Records — Independent Vinyl Store & Listening Bar

**Live site:** https://brittanynation.github.io/copper-groove-records/

A fully functional website for **Copper Groove Records**, a fictional independent vinyl record store and listening bar: browse 12 records rendered from data, filter by genre, search, sort, open a record to its tracklist, choose New or Used (Used is always 20% off), save a wishlist, fill a crate that persists between visits, and check out with full validation, a working promo code, and a real confirmation. The visit page adds listening-night RSVPs, FAQ accordions, and a duplicate-aware newsletter. Every interactive element works — no dead buttons, no placeholder links.

This is an original portfolio concept by Brittany Nation. No affiliation with any real business is claimed. Design workflow: Sketch / Webflow for layout thinking, built with HTML, CSS and JavaScript.

## Course track: complete — combined-skills build

The daily projects followed Dr. Angela Yu's *Full-Stack Web Development Bootcamp* (Udemy) one skill at a time: live APIs + async JavaScript (Solstice Skies), Node.js + Express (Willow Bend Paddle Co.), databases + REST API design (Tinker Commons), authentication (Haven Desk Collective), and React (Saffron & Sage Kitchen, deepened by Fieldnotes Studio). With all five steps complete, this build combines the front-end patterns from across the course in plain JavaScript, with the code commented as study material:

- **Data-driven rendering** — the catalogue is an array of objects in `shop.js`; cards, counts and the empty state are all built from data.
- **State + persistence** — crate and wishlist are saved to localStorage on every change and restored on load, so they survive page changes and reloads.
- **Derived state** — the visible list (genre + search + sort) and every total (subtotal, promo, shipping, 7% tax) are computed from state, never stored.
- **Option-driven pricing** — the detail modal's condition selector reprices live: Used is 20% off New, rounded to whole dollars.
- **Validated checkout** — name, email, address, city, 5-digit ZIP, 16-digit card, future MM/YY expiry and CVC are all validated inline before a `CG-XXXXXX` confirmation is generated, the order saved, and the crate cleared.

## What works on the site

- **Shop** — 12 records from data; genre chips (Soul / Jazz / Rock / Funk / Blues / Indie), live search, four sort orders, live result count and an honest empty state; detail modal with tracklist, condition pricing and quantity; wishlist hearts persisted in localStorage.
- **Crate** — slide-in drawer with quantity increase/decrease and remove; the same crate powers the checkout page and persists in localStorage across pages.
- **Checkout** — promo code `GROOVE10` takes 10% off; shipping is $5.95 and free once the discounted subtotal reaches $75; tax is 7% as its own line; full inline validation ends in a confirmation with a generated `CG-XXXXXX` reference.
- **Visit & Listening Nights** — hours table, two listening-night events, a validated RSVP form (1 to 6 seats) ending in a `CG-R-XXXXX` reference saved to localStorage, working FAQ accordions, and a validated Needle Drop newsletter signup that recognises repeat subscribers.

## Verified

Automated DOM checks against the built files (see the run log in the goal workspace): 12 cards render from data, the Soul filter narrows 12 to 2 and All restores 12, search narrows to 1, the modal Used price is 20% off, adding to the crate updates the count and persists it, checkout math is exact (Velvet Static $32.00 + Copper Skyline $26.00 = $58.00 subtotal; GROOVE10 −$5.80; shipping $5.95; tax $4.07; total $62.22), an invalid submit shows field errors, a valid submit shows a `CG-XXXXXX` confirmation and clears the crate, the FAQ accordion opens, the RSVP confirms, and the newsletter signup succeeds and recognises a duplicate.

## Palette

Charcoal ink `#1C1A17`, copper `#C06B3E`, mustard `#D9A441`, cream `#FDF6E9`, deep teal `#23403A`, warm sand `#EADFC6`.

## Files

- `index.html` — shop page shell with Open Graph tags
- `cart.html` — crate and checkout page
- `visit.html` — visit, listening nights, RSVP, FAQs and newsletter
- `shop.js` — catalogue data, filtering/search/sort, modal, wishlist and crate drawer, commented as study code
- `cart.js` — derived totals, promo, checkout validation and confirmation, commented as study code
- `visit.js` — accordions, newsletter and RSVP logic
- `styles.css` — the Copper Groove design system
- `images/` — real photography downloaded from Pexels under the Pexels free license
- `og-image.png` — 1200x627 social preview image in the project palette

## Photography

All content imagery is real photography sourced from Pexels (free license) and stored locally in `images/` so the live site does not depend on hotlinks. The branded `og-image.png` is a design asset in the project palette.
