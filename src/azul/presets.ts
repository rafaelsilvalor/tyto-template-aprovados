/**
 * The azul brand's configurations of the kit's components (Tyto ADR 0047), for the approved
 * list.
 *
 * A preset is a component in this brand's look: which columns, which pills, which colours.
 * It holds no number of its own — every size is a token — so changing the look of the list is
 * a change to `tokens.ts`, and changing what the list *is* is a change here.
 *
 * Copied from Tyto's `packages/templates/templates/_azul/presets.ts` (TYTO-435), trimmed to
 * the approved list: the agenda's session table and cover stay with `agenda-semana`.
 */

import {
  APPROVED,
  BOLD,
  COVER_INK,
  FACE,
  LIGHT,
  MEDIUM,
  ON_INK,
  PILL,
  PILL_INK,
} from './tokens.js';

import type { Inline, RichText } from '@tyto/core';
import type { LabelColumn, PillTableStyle, TextStyle, TitleBlockStyle } from '@tyto/template-kit';

const style = (size: number, weight: number, color: string): TextStyle => ({
  font: FACE,
  size,
  weight,
  color,
});

/** The blue pill on the left of a row, holding one field centred on the row. */
function badge(options: {
  readonly accent: string;
  readonly name: string;
  readonly text: string;
  readonly width: number;
  readonly radius: number;
  readonly style: TextStyle;
  readonly rewrite?: LabelColumn['text']['rewrite'];
}): LabelColumn {
  return {
    kind: 'label',
    name: options.name,
    width: options.width,
    shape: { fill: options.accent, radius: options.radius },
    text: {
      name: options.text,
      style: options.style,
      align: 'center',
      valign: 'middle',
      ...(options.rewrite === undefined ? {} : { rewrite: options.rewrite }),
    },
  };
}

/** The words after a rank in its badge: `1º` is drawn `1º Lugar`. */
const PLACE = ' Lugar';

/**
 * A field with words appended, as a text inline at the field's end.
 *
 * The range is the empty one at the end of the field, so a warning about the cell still
 * points inside the directive the author wrote.
 */
function followedBy(words: string): (value: RichText) => RichText {
  return (value) => {
    const end = value[value.length - 1]?.range.end ?? 0;
    const tail: Inline = { kind: 'text', value: words, range: { start: end, end } };
    return [...value, tail];
  };
}

/** A field in capitals, as the published list sets every name, whatever the brief typed. */
function capitals(value: RichText): RichText {
  return value.map((inline) =>
    inline.kind === 'text' ? { ...inline, value: inline.value.toLocaleUpperCase('pt-BR') } : inline,
  );
}

/**
 * The approved list: `rank | name`, grouped under specialty headings.
 *
 * Measured on the maintainer's reference of 2026-09-27: a 92 × 39 badge laid over the left end
 * of a grey pill, one shape. Each specialty's rows are as wide as its longest name, up to 800
 * (`fit`). The brief writes `1º`; the badge draws `1º Lugar`.
 */
export function approvedTable(accent: string): PillTableStyle {
  return {
    layering: 'overlap',
    rowGap: APPROVED.gap.rows,
    minRowHeight: APPROVED.badge.h,
    fit: { max: APPROVED.table.max },
    columns: [
      badge({
        accent,
        name: 'rank-pill',
        text: 'rank',
        width: APPROVED.badge.w,
        radius: APPROVED.badge.radius,
        style: style(APPROVED.type.rank, BOLD, ON_INK),
        rewrite: followedBy(PLACE),
      }),
      {
        kind: 'lines',
        name: 'name-pill',
        width: 'fill',
        shape: { fill: PILL, radius: APPROVED.badge.radius },
        padding: APPROVED.padding,
        lineGap: 0,
        lines: [
          {
            name: 'name',
            style: style(APPROVED.type.name, BOLD, PILL_INK),
            minHeight: APPROVED.line,
            rewrite: capitals,
          },
        ],
      },
    ],
    groups: {
      heading: {
        name: 'specialty',
        height: APPROVED.box.specialty,
        style: style(APPROVED.type.specialty, BOLD, accent),
        align: 'center',
        overflow: 'shrink',
      },
      headingGap: APPROVED.gap.heading,
      gap: APPROVED.gap.groups,
    },
    names: {
      table: 'approved-table',
      group: 'specialty-group',
      rows: 'approved',
      row: 'approved-row',
    },
  };
}

/** The approved list's title: emblem, kicker, subtitle, rule, and the exam's name. */
export function resultTitle(accent: string): TitleBlockStyle {
  return {
    name: 'result-title',
    parts: [
      { kind: 'image', field: 'imagem', name: 'emblem', size: APPROVED.emblem },
      {
        kind: 'text',
        field: 'chamada',
        name: 'kicker',
        style: style(APPROVED.type.kicker, MEDIUM, COVER_INK),
        height: APPROVED.box.kicker,
        gapAbove: APPROVED.gap.kicker,
      },
      {
        kind: 'text',
        field: 'subtitulo',
        name: 'subtitle',
        style: style(APPROVED.type.subtitle, LIGHT, COVER_INK),
        height: APPROVED.box.subtitle,
        gapAbove: APPROVED.gap.subtitle,
      },
      {
        kind: 'rule',
        name: 'rule',
        width: APPROVED.rule.w,
        thickness: APPROVED.rule.h,
        color: COVER_INK,
        gapAbove: APPROVED.gap.rule,
      },
      {
        kind: 'text',
        field: 'titulo',
        name: 'exam',
        style: style(APPROVED.type.exam, BOLD, accent),
        height: APPROVED.box.exam,
        lineHeight: 1,
        overflow: 'shrink',
        gapAbove: APPROVED.gap.exam,
      },
    ],
  };
}
