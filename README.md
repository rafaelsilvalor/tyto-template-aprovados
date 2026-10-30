# tyto-template-aprovados

`aprovados`, a [Tyto](https://github.com/rafaelsilvalor/tyto) code template in its own
repository: an exam's approved list as a 1080×1350 carousel — an emblem and the exam's name on
the first slide, and the approved grouped by specialty on every slide. It moved here from Tyto's
built-in pack (TYTO-435) and draws the same bytes the built-in did.

**This repository holds the composition only.** The logo and the signature are not here: Tyto
hands them to the template from the brand kit installed on the machine, under the manifest's
brand `azul`, and without one it draws placeholders (Tyto ADR 0063, ADR 0065). The kit's accent
colours the badges, the headings and the exam's name, and azul's blue stands in without one
(Tyto ADR 0155). The example brief's names and subtitle are invented copy.

## Install into Tyto

A plugin file pins the template to a release (Tyto ADR 0151). Save this as
`TYTO_HOME/plugin-files/aprovados.yaml` (`~/.tyto` by default), or as
`.tyto/plugin-files/aprovados.yaml` beside a project's briefs:

```yaml
version: 1
templates:
  aprovados:
    source:
      git: https://github.com/rafaelsilvalor/tyto-template-aprovados.git
      ref: v1.1.0
```

Tyto fetches the tag the next time it loads templates, or now with `tyto plugin sync`, and asks
once for the permission below (`--yes` approves it). To move to a later release, change `ref`.

Or install the default branch, as it is:

```
tyto plugin install git+https://github.com/rafaelsilvalor/tyto-template-aprovados.git
```

Tyto never builds what it fetches, so `dist/index.js` is committed on `main` and every release is
a tag of it. To take a change pushed here, run the same command again: installing a name that is
already installed replaces it.

**A Tyto that still ships its built-in `aprovados` draws that one.** The built-in pack loads
before installed plugins, so it wins the name and the render says `W_TEMPLATE_SHADOWED`
(Tyto ADR 0151). The two draw the same bytes; Tyto's TYTO-436 removes the built-in copy.

A pack brings templates and no formats. Copy `templates/formats.yaml` into the project that
renders `aprovados`, or merge its `grid` line into the project's own. One `::lamina` is one
slide; a line with no `|` starts a specialty, and every `rank | name` line under it is one of its
approved:

```
---
template: aprovados
formats: [grid]
---

::chamada
  Resultado provisório

::titulo
  EXAME

::lamina
  ENDODONTIA
  1º | Ana Souza
  2º | Bruno Lima
```

The badge draws `1º Lugar`, and the name is set in capitals whatever the brief typed. The title
block — `imagem` (the emblem, optional), `chamada`, `subtitulo` and `titulo` — is drawn on the
first slide only, and the arrow on every slide but the last. `selo: ./selo.png` glues the seal,
140 px tall, to the foot of the last slide.

## What it may reach

| Permission        | Why                                                                         |
| ----------------- | --------------------------------------------------------------------------- |
| `font:CircularXX` | The list is sized by measuring CircularXX, a licensed face (Tyto ADR 0048). |

**The install asks for it once.** Faces Tyto ships cross to a plugin freely; a face installed
on the machine crosses only under this permission. On a machine without CircularXX, Tyto
measures and draws its bundled substitute and needs no permission.

## What a configuration may change

Nothing yet: the manifest declares no `values` (Tyto ADR 0153). The move kept the built-in's
constants as constants, in `@tyto/house-style/azul`.

## Development

`pnpm check` runs Prettier, the type checker, ESLint and the tests; `pnpm build` writes
`dist/index.js`, one ES module with every `@tyto` import inlined, which is committed and which
CI rebuilds and compares.

The brand's tokens, the logo header and signed footer, and the list's presets are
`@tyto/house-style/azul`, shared with `tyto-template-agenda-semana` (Tyto TYTO-476): a change
to the azul look lands once, in Tyto.

The template depends on Tyto's published contract, held by GitHub Packages under the owner's
scope (Tyto ADR 0149) and aliased in `package.json`: `@tyto/house-style` draws the logo, the
signature and the seal, `@tyto/template-kit` and `@tyto/core` are what it is drawn with, and
`@tyto/plugin-api` is what loads it. The committed `.npmrc` names the scope only. GitHub asks
for a token with `read:packages` even for public packages, and it goes in your user-level
`~/.npmrc`:

```sh
gh auth refresh -s read:packages
echo '//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}' >> ~/.npmrc
NODE_AUTH_TOKEN=$(gh auth token) pnpm install
```

Or, writing nothing to `~/.npmrc`, hand pnpm the token for that one command:

```sh
pnpm install "--//npm.pkg.github.com/:_authToken=$(gh auth token)"
```

The tests, all without Tyto:

- `src/template.test.ts`: the composition — the title block over the list on the first slide
  only, the list read into specialties and places, each specialty as wide as its longest name
  up to the maximum, the emblem only when supplied, the arrow on every slide but the last.
- `tests/examples.test.ts`: the example brief compiled as Tyto compiles it, through
  `@tyto/template-kit/testing` (Tyto ADR 0152), against the HTML of each slide in
  `tests/__snapshots__/`. Nothing is measured and faces are placeholders, so the snapshot moves
  when the composition does and not when a machine has another font.
- `tests/faces.test.ts`: the manifest's `faces` are exactly the CircularXX weights the example
  draws. The plugin measures only what it declares, so a missing weight would shrink a long
  exam name where the built-in wrapped it.
- `tests/plugin.test.ts`: the built `dist/index.js`, loaded through
  `@tyto/plugin-api/testing` (Tyto ADR 0150), drawing a slide across the isolation protocol.

The `contract` workflow runs every day against the newest published contract, past the ranges
`package.json` asks for, so a Tyto release that breaks this template turns it red before
somebody installs it.
