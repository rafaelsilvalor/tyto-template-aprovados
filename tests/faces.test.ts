import { readFileSync } from 'node:fs';

import { defineTemplate, formatCatalogue, parseManifest, sceneResources } from '@tyto/core';
import { compileTemplate } from '@tyto/template-kit/testing';
import { describe, expect, it } from 'vitest';

import { build } from '../src/template.js';

/**
 * The faces the manifest declares are the faces the list draws (Tyto ADR 0048).
 *
 * The plugin measures in its own process, and the host hands it only the faces its manifest
 * declares: a weight drawn and not declared is measured as nothing, so a long exam name
 * shrinks where the built-in wrapped it, and the bytes stop matching the built-in's. A weight
 * declared and not drawn is a licensed file sent across for nothing.
 */

const read = (path: string): string => readFileSync(new URL(path, import.meta.url), 'utf8');

const manifest = parseManifest(read('../templates/aprovados/manifest.yaml'), 'manifest.yaml');
if (!manifest.ok) throw new Error(manifest.error.map((item) => item.message).join('\n'));
const template = defineTemplate(manifest.value, build);
const formats = formatCatalogue({ grid: { w: 1080, h: 1350, kind: 'grid' } });

describe('the declared faces', () => {
  it('are every CircularXX weight the example draws, and no other', async () => {
    const result = await compileTemplate({
      brief: read('../templates/aprovados/examples/aprovados.brief'),
      template,
      formats,
    });
    if (!result.ok) throw new Error(result.error.map((item) => item.message).join('\n'));

    const drawn = sceneResources(result.value.scene)
      .faces.filter((face) => face.font.family === 'CircularXX')
      .map((face) => face.weight);
    const declared = (manifest.value.faces ?? [])
      .filter((face) => face.family === 'CircularXX')
      .map((face) => face.weight);

    expect([...new Set(drawn)].sort()).toEqual([...declared].sort());
    expect(declared).toEqual([300, 500, 700]);
  });
});
