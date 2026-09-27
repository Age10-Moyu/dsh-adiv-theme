// A\ browser half.
//
// A warm parchment theme for the DSH web client.
//
// The name reads as "A-div": the backslash and the division sign are the same
// stroke drawn two ways.
//
// Installing the bundle IS enabling it. There is no toggle and no settings row:
// the theme is a static stylesheet plus a body class, so a preference would
// only ever be a way to turn the plugin off -- which is what `disabled: true`
// in the profile patch already does.
//
// Why this is written the way it is:
//
//  * The shipped theme is two layers: `--dsw-static-*` (raw palette) and
//    `--dsw-alias-*` (semantic tokens that reference the palette). The raw
//    palette is entirely cool blue-grey. Rather than override ninety aliases,
//    this theme redefines the aliases on `body` and points them at its own warm
//    ramp -- the same approach the shipped client uses, but scoped to the body
//    class so removing the class restores the host theme exactly.
//
//  * `body.<cls>:not([data-ds-dark-theme])` AND `body.<cls>[data-ds-dark-theme]`
//    are both declared. The second is needed because the host's dark block is
//    also two selectors deep; a bare body-class selector would tie and lose on
//    source order.
//
//  * The serif voice reaches two kinds of target. Message prose uses real
//    `h1`-`h6` elements, which are stable. The blank-session hero headline is a
//    bare `<span>` with a CSS-Modules class, so it is matched through the stable
//    `_headline` suffix of that class name rather than the hash prefix that
//    changes on every build.
//
//  * Tolerating host drift. Three host implementation details are relied on,
//    none of which is a published contract: the `--dsw-*` token names, the
//    `_headline` / `_turnStatus` class suffixes, and the source strings of the
//    turn-status label. If any of them changes, the theme degrades rather than
//    breaks -- see `rewriteStatus` for the failure path. Nothing here throws on
//    a missing element.
//
//  * No brand font files are bundled. "Anthropic Serif" and friends are
//    proprietary and not redistributable; the stacks name them first, then fall
//    back to Georgia and the platform UI/monospace faces.

window.__ModuleLoader__.load({
  id: 'dsh-adiv-theme',
  factory: () => {
    const STYLE_MARK = 'dsh-adiv-theme';
    const BODY_CLASS = 'adiv';

    // ---------------------------------------------------------------------
    // Warm ramp
    //
    // Every neutral carries a yellow-brown undertone. The dark steps avoid the
    // failure mode where a warm grey reads as dirty yellow-brown on a real
    // display: they are nudged toward neutral as they get darker, so the page
    // stays a clean warm charcoal rather than an olive smear.
    // ---------------------------------------------------------------------

    const RAMP = {
      light: {
        page: '#f5f4ed',        // Parchment -- the emotional foundation
        surface0: '#faf9f5',    // Ivory
        surface: '#ffffff',     // Pure White, button surfaces only
        surfaceAlt: '#f0eee6',  // Border Cream / sidebar fill
        sunken: '#ebe9df',
        ink: '#141413',         // Anthropic Near Black
        inkSoft: '#3d3d3a',
        inkMuted: '#5e5d59',    // Olive Gray
        inkFaint: '#87867f',    // Stone Gray
        border: 'rgba(20,20,19,0.07)',
        borderStrong: 'rgba(20,20,19,0.12)',
        borderStronger: 'rgba(20,20,19,0.20)',
        hover: 'rgba(201,100,66,0.055)',
        active: 'rgba(201,100,66,0.095)',
        mask: 'rgba(20,20,19,0.24)',
        toolbar: 'rgba(77,76,72,0.50)',
        toolbarHover: 'rgba(77,76,72,0.60)',
        accent: '#c96442',      // Terracotta Brand
        accentHover: '#a94f31',
        accentSoft: '#f6e3da',
        accentInk: '#faf9f5',
        code: '#f0eee6',
        danger: '#b53333',      // Error Crimson
        dangerSoft: '#f7dedb',
        success: '#6b8e6b',     // Muted green
        successSoft: '#e8efe6',
        warn: '#b8860b',
        warnSoft: '#faf1de',
        ring: '#d1cfc5',        // Ring Warm
        shadowRgb: '20 20 19',
      },
      dark: {
        page: '#141413',        // Anthropic Near Black
        surface0: '#1c1c1a',
        surface: '#242422',
        surfaceAlt: '#30302e',  // Dark Surface
        sunken: '#191918',
        ink: '#faf9f5',         // Ivory
        inkSoft: '#e8e6dc',
        inkMuted: '#b0aea5',    // Warm Silver
        inkFaint: '#87867f',
        border: 'rgba(250,249,245,0.09)',
        borderStrong: 'rgba(250,249,245,0.14)',
        borderStronger: 'rgba(250,249,245,0.22)',
        hover: 'rgba(217,119,87,0.10)',
        active: 'rgba(217,119,87,0.16)',
        mask: 'rgba(0,0,0,0.50)',
        toolbar: 'rgba(77,76,72,0.50)',
        toolbarHover: 'rgba(77,76,72,0.60)',
        accent: '#d97757',      // Coral -- terracotta is too dark on near-black
        accentHover: '#e08b6e',
        accentSoft: '#3a251c',
        accentInk: '#141413',
        code: '#1c1c1a',
        danger: '#d97757',
        dangerSoft: '#3a2020',
        success: '#8fa88f',
        successSoft: '#22301f',
        warn: '#d4a94a',
        warnSoft: '#332a18',
        ring: '#4d4c48',
        shadowRgb: '0 0 0',
      },
    };

    const SANS = 'var(--cl-sans)';
    const SERIF = 'var(--cl-serif)';
    const MONO = 'var(--cl-mono)';

    function paletteVars(p) {
      return [
        `--cl-page: ${p.page};`,
        `--cl-surface-0: ${p.surface0};`,
        `--cl-surface: ${p.surface};`,
        `--cl-surface-alt: ${p.surfaceAlt};`,
        `--cl-sunken: ${p.sunken};`,
        `--cl-ink: ${p.ink};`,
        `--cl-ink-soft: ${p.inkSoft};`,
        `--cl-muted: ${p.inkMuted};`,
        `--cl-faint: ${p.inkFaint};`,
        `--cl-border: ${p.border};`,
        `--cl-border-strong: ${p.borderStrong};`,
        `--cl-border-stronger: ${p.borderStronger};`,
        `--cl-hover: ${p.hover};`,
        `--cl-active: ${p.active};`,
        `--cl-mask: ${p.mask};`,
        `--cl-toolbar: ${p.toolbar};`,
        `--cl-toolbar-hover: ${p.toolbarHover};`,
        `--cl-accent: ${p.accent};`,
        `--cl-accent-hover: ${p.accentHover};`,
        `--cl-accent-soft: ${p.accentSoft};`,
        `--cl-accent-ink: ${p.accentInk};`,
        `--cl-code: ${p.code};`,
        `--cl-danger: ${p.danger};`,
        `--cl-danger-soft: ${p.dangerSoft};`,
        `--cl-success: ${p.success};`,
        `--cl-success-soft: ${p.successSoft};`,
        `--cl-warn: ${p.warn};`,
        `--cl-warn-soft: ${p.warnSoft};`,
        `--cl-ring: ${p.ring};`,
        `--cl-shadow-rgb: ${p.shadowRgb};`,
      ].join('\n  ');
    }

    const SKIN_CSS = `
body.${BODY_CLASS} {
  --cl-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
  --cl-serif: "Anthropic Serif", ui-serif, Georgia, "Iowan Old Style", "Palatino Linotype", Palatino, "Songti SC", STSong, "Times New Roman", serif;
  --cl-mono: "Anthropic Mono", ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  ${paletteVars(RAMP.light)}
}

body.${BODY_CLASS}[data-ds-dark-theme] {
  ${paletteVars(RAMP.dark)}
}

/* Both selectors are declared so the dark block cannot lose a specificity tie
 * against the host's own two-deep dark selector. */
body.${BODY_CLASS}:not([data-ds-dark-theme]),
body.${BODY_CLASS}[data-ds-dark-theme] {
  --dsw-font-family: ${SANS};
  --ds-font-family-code: ${MONO};

  /* --- surfaces --- */
  --dsw-alias-bg-base: var(--cl-page);
  --dsw-alias-bg-layer-1: var(--cl-page);
  --dsw-alias-bg-layer-2: var(--cl-surface);
  --dsw-alias-bg-layer-3: var(--cl-surface-alt);
  --dsw-alias-bg-overlay: var(--cl-surface-alt);
  --dsw-alias-bg-module-platform: var(--cl-surface-0);
  --dsw-alias-bg-multi-select: var(--cl-surface-0);
  --dsw-alias-bg-skeleton: var(--cl-hover);
  --dsw-alias-bg-mask-1: var(--cl-mask);
  --dsw-alias-button-tool-bar-fill: var(--cl-toolbar);
  --dsw-alias-button-tool-bar-hover: var(--cl-toolbar-hover);

  /* --- borders: warm, never cool --- */
  --dsw-alias-border-l1: var(--cl-border);
  --dsw-alias-border-l2: var(--cl-border-strong);
  --dsw-alias-border-l2-darkmode-thin: var(--cl-border-strong);
  --dsw-alias-border-l3: var(--cl-border-stronger);
  --dsw-alias-border-l4: var(--cl-border-stronger);

  /* --- brand: terracotta by day, coral by night --- */
  --dsw-alias-brand-primary: var(--cl-accent);
  --dsw-alias-brand-primary-new-colorprimary-new-color: var(--cl-accent);
  --dsw-alias-brand-text: var(--cl-accent);
  --dsw-alias-brand-primary-invert: var(--cl-ink);
  --dsw-alias-button-primary-fill: var(--cl-accent);
  --dsw-alias-button-primary-hover: var(--cl-accent-hover);
  --dsw-alias-button-primary-dimmed: var(--cl-accent-soft);
  --dsw-alias-button-info-fill: var(--cl-accent);
  --dsw-alias-button-info-hover: var(--cl-accent-hover);
  --dsw-alias-link: var(--cl-accent);
  --dsw-alias-state-business-primary: var(--cl-accent);
  --dsw-alias-state-business-tertiary: var(--cl-accent-soft);

  /* --- labels --- */
  --dsw-alias-label-primary: var(--cl-ink);
  --dsw-alias-label-primary-foreground: var(--cl-surface-0);
  --dsw-alias-label-primary-inverted: var(--cl-surface-0);
  --dsw-alias-label-secondary: var(--cl-muted);
  --dsw-alias-label-tertiary: var(--cl-faint);
  --dsw-alias-label-caption: var(--cl-faint);
  --dsw-alias-label-dimmed: var(--cl-faint);
  --dsw-alias-label-primary-dimmed: var(--cl-ink-soft);
  --dsw-alias-label-primary-bluish: var(--cl-ink);

  /* --- interaction fills: warm-tinted, replacing the host's cool #263148 --- */
  --dsw-alias-interactive-bg-hover: var(--cl-hover);
  --dsw-alias-interactive-bg-active: var(--cl-active);
  --dsw-alias-interactive-bg-hover-accent: var(--cl-active);
  --dsw-alias-interactive-bg-hover-danger: var(--cl-danger-soft);
  --dsw-alias-interactive-bg-hover-solid: var(--cl-surface-alt);

  /* --- buttons --- */
  --dsw-alias-button-contrast-fill: var(--cl-ink);
  --dsw-alias-button-elevated-fill: var(--cl-surface);
  --dsw-alias-button-floating-fill: var(--cl-surface);
  --dsw-alias-button-floating-hover: var(--cl-surface-alt);
  --dsw-alias-button-ghost-active-fill: var(--cl-surface-alt);
  --dsw-alias-button-ghost-active-border: var(--cl-ring);
  --dsw-alias-button-ghost-active-hover: var(--cl-active);

  /* --- markdown --- */
  --dsw-alias-markdown-code-block: var(--cl-code);
  --dsw-alias-markdown-code-block-banner: var(--cl-surface-alt);
  --dsw-alias-markdown-inline-code: var(--cl-code);
  --dsw-alias-markdown-tag: var(--cl-surface-alt);
  --dsw-alias-markdown-citation: var(--cl-surface-alt);
  --dsw-alias-markdown-placeholder: var(--cl-surface-0);
  --dsw-alias-markdown-code-segment-selected: var(--cl-surface);
  --dsw-alias-markdown-code-segment-unselected: var(--cl-surface-alt);

  /* --- overlays --- */
  --dsw-alias-tooltip-bg: var(--cl-surface-alt);
  --dsw-alias-toast-bg: var(--cl-surface-alt);

  /* --- scrollbars --- */
  --dsw-alias-scrollbar-bg-l1: var(--cl-border-strong);
  --dsw-alias-scrollbar-bg-l2: var(--cl-border-strong);
  --dsw-alias-scrollbar-hover-l1: var(--cl-border-stronger);
  --dsw-alias-scrollbar-hover-l2: var(--cl-border-stronger);

  /* --- states --- */
  --dsw-alias-state-error-primary: var(--cl-danger);
  --dsw-alias-state-error-secondary: var(--cl-danger);
  --dsw-alias-state-success-primary: var(--cl-success);
  --dsw-alias-state-success-secondary: var(--cl-success);
  --dsw-alias-state-success-tertiary: var(--cl-success-soft);
  --dsw-alias-state-warn-primary: var(--cl-warn);
  --dsw-alias-state-warn-secondary: var(--cl-warn);
  --dsw-alias-state-warn-label: var(--cl-warn);
  --dsw-alias-state-warn-tertiary: var(--cl-warn-soft);

  /* --- product surfaces --- */
  --dsw-specific-sidebar-fill: var(--cl-surface-alt);
  --dsw-specific-sidebar-nav-item-active: var(--cl-active);
  --dsw-specific-sidebar-nav-item-active-accent: var(--cl-accent-soft);
  --dsw-specific-sidebar-nav-item-hover: var(--cl-hover);
  --dsw-specific-selector: var(--cl-surface-0);
  --dsw-specific-input-major: var(--cl-surface-0);
  --dsw-specific-login-input: var(--cl-surface-0);
  --dsw-specific-tip: var(--cl-surface-0);
  --dsw-specific-menu: var(--cl-surface-alt);
  --dsw-specific-bubble: var(--cl-surface-alt);
  --dsw-specific-bubble-highlight: var(--cl-sunken);

  /* --- depth: ring shadows, not drop shadows --- */
  --dsw-shadow-lv1: 0 0 0 1px rgb(var(--cl-shadow-rgb) / 6%), 0 1px 2px 0 rgb(var(--cl-shadow-rgb) / 4%);
  --dsw-shadow-lv1-blur: 0 0 0 1px rgb(var(--cl-shadow-rgb) / 5%), 0 2px 8px 0 rgb(var(--cl-shadow-rgb) / 4%);
  --dsw-shadow-lv2: 0 0 0 1px rgb(var(--cl-shadow-rgb) / 7%), 0 4px 16px 0 rgb(var(--cl-shadow-rgb) / 5%);

  --dsh-scrollbar-thumb: var(--cl-border-strong);
  --dsh-scrollbar-thumb-hover: var(--cl-border-stronger);
}

/* ---------------------------------------------------------------------------
 * Typography: serif for authority, sans for utility.
 *
 * Target 1 -- message prose. Real h1-h6 elements, stable across builds.
 * ------------------------------------------------------------------------ */

body.${BODY_CLASS} h1,
body.${BODY_CLASS} h2,
body.${BODY_CLASS} h3,
body.${BODY_CLASS} h4,
body.${BODY_CLASS} h5,
body.${BODY_CLASS} h6 {
  font-family: ${SERIF};
  /* Weight 500 is the ceiling for the serif voice -- no bold, no light. */
  font-weight: 500;
  /* Tight but never claustrophobic: large serif needs optical leading. */
  line-height: 1.25;
  letter-spacing: normal;
}

body.${BODY_CLASS} h1 { font-size: 2rem; line-height: 1.15; }
body.${BODY_CLASS} h2 { font-size: 1.6rem; line-height: 1.2; }
body.${BODY_CLASS} h3 { font-size: 1.3rem; line-height: 1.25; }
body.${BODY_CLASS} h4,
body.${BODY_CLASS} h5,
body.${BODY_CLASS} h6 { font-size: 1.06rem; line-height: 1.3; }

/* The serif never goes bold: strong inside a heading keeps the serif voice. */
body.${BODY_CLASS} h1 strong,
body.${BODY_CLASS} h2 strong,
body.${BODY_CLASS} h3 strong,
body.${BODY_CLASS} h4 strong,
body.${BODY_CLASS} h5 strong,
body.${BODY_CLASS} h6 strong {
  font-weight: 500;
}

/* ---------------------------------------------------------------------------
 * Target 2 -- the blank-session hero headline.
 *
 * This is the "Into the Unknown" / "探索未至之境" line. It is NOT a heading
 * element: the client renders it as a bare <span> inside a wrapper whose class
 * is a CSS-Modules hash, e.g. "pXSMma_headline". The hash prefix changes on
 * every build, but CSS-Modules keeps the "_name" suffix, so matching on
 * [class*="_headline"] survives rebuilds while still being specific enough
 * not to catch anything else.
 *
 * The host sets font-size/weight/line-height here but no font-family, so the
 * serif has to be applied explicitly rather than inherited. Metrics follow the
 * design system's "Sub-heading Small" step: 25-26px at weight 500, line-height
 * 1.20 -- which is what the host's own 26px/500 most nearly corresponds to.
 * ------------------------------------------------------------------------ */

body.${BODY_CLASS} [class*="_headline"] {
  font-family: ${SERIF};
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: normal;
}

/* The badge beside the headline stays monospace sans -- it is UI, not prose. */
body.${BODY_CLASS} [class*="_previewBadge"],
body.${BODY_CLASS} [class*="_previewBadge"] * {
  font-family: ${MONO};
}

/* ---------------------------------------------------------------------------
 * Everything else stays sans.
 * ------------------------------------------------------------------------ */

/* Rounded, soft geometry. Sharp corners are outside the identity. */
body.${BODY_CLASS} button,
body.${BODY_CLASS} input,
body.${BODY_CLASS} textarea,
body.${BODY_CLASS} select { border-radius: 12px; }

/* Ring shadow on interactive surfaces instead of a drop shadow. */
body.${BODY_CLASS} button:not(:disabled):focus-visible,
body.${BODY_CLASS} a:focus-visible {
  outline: 2px solid var(--cl-accent);
  outline-offset: 2px;
}

/* Code keeps the monospace face; the serif rule must never reach it. */
body.${BODY_CLASS} code,
body.${BODY_CLASS} pre,
body.${BODY_CLASS} kbd,
body.${BODY_CLASS} samp {
  font-family: ${MONO};
}
`;

    // ---------------------------------------------------------------------
    // Turn-status copy
    //
    // The client hard-codes `chat.deepDiving` ("深度求索中..." / "Deep diving..."),
    // which is DeepSeek brand voice. It is not a configurable string, so the
    // text is rewritten in the live DOM.
    //
    // The shimmer sweep already follows the theme: that rule paints a gradient
    // from --dsw-static-deepseek-500/-200, and this theme remaps those palette
    // steps to the terracotta ramp, so only the words need changing here.
    //
    // Matched through the stable `_turnStatus` class suffix rather than the
    // build hash. Only the direct text of that element is touched -- the elapsed
    // clock is a sibling <span> and is left alone.
    //
    // Tolerating drift: if a future host renames the class or changes the label,
    // `querySelectorAll` returns nothing or no key matches, and the function
    // becomes a no-op. The theme keeps its colours; only the wording reverts to
    // whatever the host ships. There is deliberately no fallback that rewrites
    // arbitrary text -- a blind substring replacement is exactly the kind of
    // thing that mangles unrelated content.
    // ---------------------------------------------------------------------

    const STATUS_SELECTOR = '[class*="_turnStatus"]';
    const STATUS_TEXT = {
      '深度求索中...': '思考中...',
      'Deep diving...': 'Thinking...',
    };

    // The host re-renders this label on a timer, so the same node is revisited
    // repeatedly. Remembering what has already been translated keeps the pass
    // idempotent and cheap without mutating the mapping itself.
    const statusDone = new WeakSet();

    function rewriteStatus() {
      let nodes;
      try {
        nodes = document.querySelectorAll(STATUS_SELECTOR);
      } catch {
        // A malformed selector should never take the whole theme down.
        return;
      }
      for (const node of nodes) {
        if (statusDone.has(node)) continue;
        let translated = false;
        for (const child of node.childNodes) {
          if (child.nodeType !== 3 /* Text */) continue;
          const current = child.nodeValue;
          if (!current) continue;
          const trimmed = current.trim();
          const replacement = STATUS_TEXT[trimmed];
          if (replacement === undefined) continue;
          child.nodeValue = current.replace(trimmed, replacement);
          translated = true;
        }
        if (translated) statusDone.add(node);
      }
    }

    // ---------------------------------------------------------------------
    // Runtime
    // ---------------------------------------------------------------------

    function styleTag() {
      return document.querySelector(`style[data-plugin-css="${STYLE_MARK}"]`);
    }

    function ensureStyle() {
      if (styleTag()) return;
      const style = document.createElement('style');
      style.dataset.pluginCss = STYLE_MARK;
      style.textContent = SKIN_CSS;
      document.head.appendChild(style);
    }

    function applyState() {
      document.body.classList.add(BODY_CLASS);
      ensureStyle();
      rewriteStatus();
    }

    // Rewriting happens after the host renders, so the observer both restores a
    // dropped stylesheet and re-applies the DOM rewrite. Work is scheduled on a
    // microtask-batched flag so a burst of mutations costs one pass.
    let scheduled = false;

    function schedule() {
      if (scheduled) return;
      scheduled = true;
      Promise.resolve().then(() => {
        scheduled = false;
        // Colours are the point of the theme; the copy is a garnish. A failure
        // in the text pass must not stop the stylesheet from being restored.
        try {
          ensureStyle();
        } catch {
          /* head may be unavailable mid-teardown */
        }
        try {
          rewriteStatus();
        } catch {
          /* host drift; colours are unaffected */
        }
      });
    }

    return {
      apply() {
        // The host owns `document`; on an unusual surface (older engine, a
        // non-browser evaluator) any of these may be absent. Bail out quietly
        // rather than throwing into the host's plugin loader.
        if (typeof document === 'undefined' || !document) return;
        if (document.body) {
          applyState();
        } else {
          document.addEventListener('DOMContentLoaded', applyState, { once: true });
        }
        const observer = new MutationObserver(schedule);
        observer.observe(document.documentElement, { childList: true, subtree: true });
      },
    };
  },
});
