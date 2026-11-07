import { readFileSync } from 'node:fs';

import { defineTemplate, formatCatalogue, parseManifest } from '@tyto/core';
import { SEAL_HEIGHT } from '@tyto/house-style';
import { BAND } from '@tyto/house-style/azul';
import { compileTemplate } from '@tyto/template-kit/testing';
import { describe, expect, it } from 'vitest';

import { build } from '../src/template.js';

import type { AssetResolver, Frame, SceneNode } from '@tyto/core';

/**
 * The house's seal (TYTO-201), offered the way every house template with a grid offers it
 * (TYTO-480): `selo:` in the frontmatter glues an art 1080 × 140 to the last slide's foot, the
 * page above shrinks by it, and the footer — the signature — stands on the seal.
 *
 * The example brief is compiled twice, as it is and with `selo:` added, so the seal-less half
 * is the snapshot `examples.test.ts` already holds.
 */

const read = (path: string): string => readFileSync(new URL(path, import.meta.url), 'utf8');

const manifest = parseManifest(read('../templates/aprovados/manifest.yaml'), 'manifest.yaml');
if (!manifest.ok) throw new Error(manifest.error.map((item) => item.message).join('\n'));
const template = defineTemplate(manifest.value, build);
const formats = formatCatalogue({ grid: { w: 1080, h: 1350, kind: 'grid' } });
const example = read('../templates/aprovados/examples/aprovados.brief');

/** A seal the brief's `selo:` finds whatever it names; no file is read. */
const assets: AssetResolver = {
  base: '(seal test)',
  resolve: (reference) =>
    Promise.resolve({ id: reference, source: 'file', path: reference, hash: 'selo' }),
};

async function compiled(brief: string) {
  const result = await compileTemplate({ brief, template, formats, assets });
  if (!result.ok) throw new Error(result.error.map((item) => item.message).join('\n'));
  return result.value;
}

const sealed = () =>
  compiled(example.replace('formats: [grid]', 'formats: [grid]\nselo: ./selo.png'));

const frames = (scene: { artworks: readonly { frames: readonly Frame[] }[] }): Frame[] =>
  scene.artworks.flatMap((artwork) => artwork.frames);

const top = (frame: Frame | undefined, name: string): SceneNode | undefined =>
  frame?.children.find((node) => node.name === name);

describe('the seal', () => {
  const sealTop = 1350 - SEAL_HEIGHT;

  it('glues the seal, 1080 × 140, to the last slide’s foot and to no other', async () => {
    const [first, last] = frames((await sealed()).scene);
    const seal = top(last, 'seal');

    expect(top(first, 'seal')).toBeUndefined();
    expect(seal?.transform).toMatchObject({ x: 0, y: sealTop });
    expect(seal !== undefined && 'size' in seal ? seal.size : undefined).toEqual({
      w: 1080,
      h: SEAL_HEIGHT,
    });
  });

  it('stands the footer on the seal: it rises by the band and ends above it', async () => {
    const [, open] = frames((await compiled(example)).scene);
    const [, closed] = frames((await sealed()).scene);
    const footerY = (frame: Frame | undefined) => top(frame, 'footer')?.transform.y ?? Number.NaN;

    expect(footerY(open) - footerY(closed)).toBe(SEAL_HEIGHT);
    expect(footerY(closed) + BAND.footer).toBeLessThanOrEqual(sealTop);
  });

  it('leaves the slides before the last byte for byte as a seal-less brief draws them', async () => {
    const open = (await compiled(example)).frames;
    const closed = (await sealed()).frames;

    expect(closed[0]?.html).toBe(open[0]?.html);
    expect(closed[1]?.html).not.toBe(open[1]?.html);
    expect(closed[1]?.html).toContain('data-name="seal"');
  });
});
