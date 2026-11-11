# How to write an `aprovados` brief

`aprovados` is an exam's approved list as a carousel. The title block (an emblem, the call, the
subtitle and the exam's name) is drawn on the first slide only; the approved, grouped by
specialty, are on every slide.

## Slots

| Slot        | Where                          | Rule                                                                                                                                              |
| ----------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `imagem`    | frontmatter                    | Optional. The exam body's emblem: `imagem: ./emblema.png`. Only when the person has the file.                                                     |
| `chamada`   | directive                      | Optional, at most 40 characters: "Resultado provisório" or "Resultado final".                                                                     |
| `subtitulo` | directive                      | Optional, at most 60 characters: a short line under the call.                                                                                     |
| `titulo`    | directive                      | **Required**, at most 30 characters: the exam's name, such as `SELEX`.                                                                            |
| `selo`      | frontmatter                    | Optional, 1080×140, glued to the foot of the **last grid slide**: `selo: ./selo.png`. The page above shrinks by 140. Only when the person has it. |
| `lamina`    | directive, repeated 1–12 times | One slide each.                                                                                                                                   |

`chamada`, `subtitulo`, `titulo` and `imagem` appear on the first slide only. Format:
`formats: [grid]` only.

## Normalisation

Inside each `::lamina`:

- **A line with no `|` opens a specialty**, in CAPITALS: `ENDODONTIA`.
- **Each approved person is a line `placing | name`**: `1º | Lia Martins Prado`.
- **Placing:** only the ordinal (`1º`, `2º`, `10º`). The template adds "Lugar" by itself; do not
  write "1º Lugar". `1°` (degree sign) and `1o` become `1º`.
- **Name:** as it came, only trimmed. The template sets it in capitals; do not convert it.
- Keep the order of the copy. Repeated or skipped placings (5º after 3º) are normal: do not
  "fix" them.
- No call or subtitle in the copy: do not invent them, they are optional. The title is
  required: if the exam's name is missing, ask.

## How to split into slides

Follow the copy's own marks. Without them, the example puts **about 6 approved in 2 specialties
on the first slide** (which also carries the title) and more on the following ones. That comes
from the example, not from a measure: with a long list, propose a split and ask. A specialty
may continue on the next slide by repeating its name at the top.

## Example

Copy (invented):

```
SELEX - Resultado provisório
Mais uma etapa vencida

Endodontia
1° Lia Martins Prado
2° Rui Saldanha Costa
Periodontia
1° Ana Beatriz Fontes
```

Brief:

```brief
---
template: aprovados
formats: [grid]
---
::chamada
  Resultado provisório

::subtitulo
  Mais uma etapa vencida

::titulo
  SELEX

::lamina
  ENDODONTIA
  1º | Lia Martins Prado
  2º | Rui Saldanha Costa
  PERIODONTIA
  1º | Ana Beatriz Fontes
```

## Known traps

- The old slot was `::lista` and no longer exists: always `::lamina`.
- The names are real people's: use them only for this piece, never repeat them elsewhere.
