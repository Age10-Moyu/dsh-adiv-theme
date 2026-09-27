# A\

A warm parchment theme for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

The name reads as "A-div": the backslash and the division sign are the same
stroke drawn two ways.

Paper-toned canvas, burnt-orange accent, ring-based depth, and a serif/sans
typographic split — implemented as a client-half DSH plugin.

## What it does

Redefines the DSH client's semantic colour tokens (`--dsw-alias-*`) plus the
type stacks on `body`, so every surface, border, label, button, and state colour
in the interface follows the palette. It also sets the serif voice on content
headings and on the blank-session hero headline, and rewrites the turn-status
label.

**Installing the bundle is enabling it.** There is no settings row and no
toggle: mounting the row in the profile is the switch, and `disabled: true` in
`cordis.patch.yml` is how you turn it off again.

## Install

From GitHub:

```sh
dsh plugin --profile <name> add github:Age10-Moyu/dsh-adiv-theme
```

From a tarball, if you downloaded a `.tgz` release:

```sh
dsh plugin --profile <name> add ./dsh-adiv-theme-1.0.0.tgz
```

`dsh plugin` forwards to `pnpm` inside the profile directory, then reconciles
`dsh.profile.bundles` against what actually installed — so the bundle joins the
layer stack automatically and you do not edit the list by hand.

**Then restart the profile**: `dsh.profile.bundles` is read once at start.

To disable it again without uninstalling, add to the profile's
`cordis.patch.yml`:

```yaml
- id: dsh-adiv-theme
  disabled: true
```

The patch layer is hot-reloaded on long-lived surfaces, so toggling it this way
should not need a restart. Changing the *bundle list* does.

To remove it entirely:

```sh
dsh plugin --profile <name> remove dsh-adiv-theme
```

## Palette

| Role | Light | Dark |
| --- | --- | --- |
| Page | `#f5f4ed` Parchment | `#141413` near-black |
| Card / surface | `#ffffff` / `#faf9f5` | `#242422` / `#1c1c1a` |
| Border | `rgba(20,20,19,0.07)` | `rgba(250,249,245,0.09)` |
| Brand / CTA | `#c96442` burnt orange | `#d97757` coral |
| Primary text | `#141413` | `#faf9f5` |
| Secondary text | `#5e5d59` | `#b0aea5` |
| Tertiary text | `#87867f` | `#87867f` |
| Error | `#b53333` | `#d97757` |
| Success | `#6b8e6b` | `#8fa88f` |
| Warning | `#b8860b` | `#d4a94a` |

Every neutral in the ramp carries a yellow-brown undertone; there are no cool
blue-greys in the light or dark palette.

## Design decisions worth knowing

**Coral, not burnt orange, in dark mode.** `#c96442` on `#141413` does not reach
a comfortable contrast ratio, so the dark palette uses the lighter coral.

**Warm dark surfaces are deliberately restrained.** A strongly brown dark grey
reads as a dirty yellow smear on many real displays. The dark steps here move
toward neutral as they get darker, keeping the warmth perceptible without the
cast.

**Ring shadows, not drop shadows.** `--dsw-shadow-lv1/2` are rebuilt as
`0 0 0 1px` rings with a whisper-soft offset.

**No fonts are bundled.** The stacks name the branded serif first, so an
installation that legitimately has it uses it, then fall back to Georgia and the
platform UI/monospace faces.

**Typography anchors on semantic elements first, and on a stable class suffix
where no such element exists.** The host's own classes are CSS-Modules hashes
regenerated on every build, so message headings are matched as `h1`–`h6`. The
blank-session hero headline is not a heading element — the host renders it as a
bare `<span>` — so it is matched through the `_headline` suffix that CSS-Modules
preserves. The hash prefix changes per build; the suffix does not. UI chrome
keeps the sans stack.

## Tolerating host drift

Three host implementation details are relied on, and **none of them is a
published contract**:

1. the `--dsw-alias-*` / `--dsw-static-*` token names;
2. the `_headline` and `_turnStatus` CSS-Modules class suffixes;
3. the two source strings of the turn-status label.

If DeepSeek Harness changes any of them, the theme degrades rather than breaks:

* **tokens renamed** → the affected surface falls back to the host colour. The
  rest of the palette still applies.
* **`_headline` renamed** → the hero headline returns to the sans stack. Nothing
  else is affected.
* **`_turnStatus` renamed, or the label reworded** → the status text is left
  exactly as the host ships it. The shimmer colour still follows the palette.

The text pass has no blind-substring fallback on purpose: a global replacement
would mangle unrelated content — paths, escape sequences, and code.

Every pass is wrapped so a failure in the copy rewrite cannot stop the
stylesheet from being applied. Colours are the point of the theme; the copy is a
garnish.

## Scope and limitations

* This plugin styles the **web client only**. It has no host-side behaviour.
* Surfaces that belong to a marketing landing page — hand-drawn illustrations,
  alternating full-bleed light/dark chapters, oversized hero typography — have no
  counterpart in an agent chat interface and are intentionally not imitated.
* A design system is not a layout engine. This theme changes colour, type, and
  depth; it does not restructure the interface.
* The theme rewrites one label in the live DOM. That is the only place it reaches
  beyond styling.

## License

MIT. See `LICENSE`.
