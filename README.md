# an1me5h.github.io

Personal website of Animesh Hedaoo. Plain HTML, CSS and JavaScript with no build step. It's hosted on GitHub Pages at <https://an1me5h.github.io>.

## How it works

The site opens on an intro screen: a slowly drifting grid with lines that fly toward the cursor and ring at 432 Hz. Clicking the name morphs it into the title of the profile page, which has tiles (work, education, projects, skills, contact) and a timeline from 2000 at the bottom.

## Files

- `index.html`: page structure, and the fixed tiles (About, Skills & tools, Contact)
- `data.js`: the timeline (eras, their parts, milestones) and every logo/project tile with its story
- `intro.js`: the intro screen animation and sound
- `script.js`: intro-to-profile morph, tiles and story sheets, the timeline
- `styles.css`: layout, light and dark themes
- `images/`: photo (`me.jpg`) and company/university logos (`logos/`)

## Edit and publish

1. To change a tile or its story, edit its entry in `window.TILES` in `data.js`. A tile can show `logos` (image files), a `mono` text badge, or an `icon`.
2. To change the timeline, edit `window.TIMELINE` in `data.js`. Each era's `parts` appear when that section of the line is clicked.
3. Preview locally by opening `index.html` in a browser.
4. Commit and push to `main`. GitHub Pages updates within a minute or two.

Logos of Mahindra, TH Ingolstadt and Maha Metro come from Wikimedia Commons (public domain; trademarks of their owners).
