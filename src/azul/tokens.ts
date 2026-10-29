/**
 * The azul brand's tokens: values, no logic.
 *
 * Everything here is a constant a designer changes without reading the rest of a template.
 * Colours, the type scale, the slide's frame, the chrome's sizes and the arrow's geometry.
 *
 * Copied from Tyto's `packages/templates/templates/_azul/tokens.ts` (TYTO-435), trimmed to what
 * `aprovados` reads: the agenda's tokens stay with `agenda-semana`, which carries its own copy.
 * Every value kept is the built-in's, so the template draws the same bytes it drew in Tyto.
 *
 * ## Geometry in, colour out
 *
 * `ARROW` holds a `d` and the box it was drawn in, and no colour. The fill is decided where
 * the mark is placed, which is what lets the same mark be blue on paper and white on a dark
 * panel without a second copy of the geometry. The logo is not here: the brand kit supplies
 * it (Tyto ADR 0063), and `@tyto/house-style` holds the placeholder drawn without one (Tyto ADR
 * 0065).
 */

import { systemFont } from '@tyto/core/template';

import type { FontRef } from '@tyto/core';
import type { Mark } from '@tyto/template-kit';

/* ------------------------------------------------------------------------- colour -- */

// Read by eye off the reference slide of 2026-09-22, not off a brand file, which is not in
// this repository.

/** The paper. White, as the published slide is. */
export const PAPER = '#ffffff';

/** The brand blue, drawn when the brand kit has no accent (Tyto ADR 0155). */
export const INK = '#009fe3';

/** The kicker, the subtitle and the rule. A dark grey, so the blue is kept for the exam. */
export const COVER_INK = '#4a4a4a';

/** The grey pill that holds a name. */
export const PILL = '#dddddd';

/** Type on the grey pill. */
export const PILL_INK = '#3c3c3c';

/** Type on a blue field — the rank badge. */
export const ON_INK = '#ffffff';

/* --------------------------------------------------------------------------- type -- */

/**
 * The brand's face, CircularXX, in the three weights the list sets.
 *
 * A commercial face: the house holds the licence and the repository is public, so it is
 * read from the rendering machine (Tyto ADR 0037) and never committed. A machine without it
 * draws Tyto's bundled Source Sans 3 at the nearest weight and says so with
 * `W_FONT_SUBSTITUTED` — which is what CI, having no CircularXX, always does.
 */
export const FACE: FontRef = systemFont('CircularXX');

/** The subtitle and the signature. */
export const LIGHT = 300;
/** The kicker. */
export const MEDIUM = 500;
/** The ranks, the names, the specialty headings and the exam's name. */
export const BOLD = 700;

/** Sizes, named by what they are rather than by how big they are. */
export const TYPE = {
  signature: 26,
} as const;

/* ------------------------------------------------------------------------- spacing -- */

// The spacing below was read off the maintainer's annotated reference of 2026-09-23, in
// pixels of a 1089-wide export, so each is good to a few pixels rather than exact.

/** The side gutter, left and right. */
export const MARGIN = 70;

/** Paper above the header band and below the footer band. */
export const EDGE = { top: 60, bottom: 26 } as const;

/** The two chrome bands: the logo sits in the header, the signature and arrow in the footer. */
export const BAND = { header: 74, footer: 92 } as const;

/** The chrome every slide carries: the logo on top, the signature and the arrow at the foot. */
export const CHROME = {
  /** How tall the logo is drawn. */
  logo: 64,
  /** How tall the footer arrow is drawn. */
  arrow: 26,
  /** The signature is tracked out, so it reads quieter than the list above it. */
  signatureTracking: 4,
} as const;

/**
 * The approved list, measured on the maintainer's reference of 2026-09-27 in pixels of a
 * 1080 × 1350 export. Font sizes are read from glyph heights, so they are good to a point or
 * two; the boxes are good to a pixel or two.
 */
export const APPROVED = {
  /** The emblem over the words: 205 × 147 as published; `contain` keeps any other ratio. */
  emblem: { w: 205, h: 147 },
  type: { kicker: 23.5, subtitle: 23.5, exam: 76, specialty: 46, rank: 17, name: 16 },
  /** Boxes: one line of each piece and its leading. */
  box: { kicker: 30, subtitle: 30, exam: 84, specialty: 58 },
  /** The rule between the subtitle and the exam's name. */
  rule: { w: 531, h: 3 },
  gap: {
    /** Emblem → kicker, kicker → subtitle, subtitle → rule, rule → exam, to the glyphs. */
    kicker: 12,
    subtitle: 17,
    rule: 15,
    exam: 19,
    /** The exam's name → the first specialty heading. */
    table: 28,
    /** A specialty heading's box → its first row. */
    heading: 23,
    /** One specialty's last row → the next heading's box. */
    groups: 44,
    /** Between two rows. */
    rows: 5,
  },
  /**
   * The rows: as wide as each list's longest name, and no wider than `max` — past it a name
   * wraps (the maintainer, 2026-09-27). Each list is centred on its own.
   */
  table: { max: 800 },
  badge: { w: 92, h: 39, radius: 19.5 },
  /** The name's line inside the grey pill, and the room before it. */
  line: 20,
  // More room above than below: the names are capitals, which sit high in their line box.
  // 30 after the longest name, measured on the maintainer's mockup of 2026-09-27.
  padding: { top: 8, bottom: 0, left: 15, right: 30 },
} as const;

/* ------------------------------------------------------------------------ geometry -- */

/**
 * The footer arrow, from the brand file `seta.svg` (supplied 2026-09-23), colour dropped.
 *
 * The head is the file's; the shaft is longer. The published slide draws the same head on
 * a tail about six times the arrow's height, and the file's tail is barely more than one.
 * The shaft is the `H0` run, so lengthening it moves the head right by the same amount and
 * leaves every other coordinate as the file has it.
 */
const ARROW_SHAFT = 2130;
const ARROW_HEAD = 230.92;

export const ARROW: Mark = {
  box: { w: ARROW_SHAFT + ARROW_HEAD, h: 377.81 },
  d:
    `M${ARROW_SHAFT},377.81v-134.18H0v-108.75h${ARROW_SHAFT}` +
    `V0l${ARROW_HEAD},189.26-${ARROW_HEAD},188.55Z`,
  fillRule: 'nonzero',
};
