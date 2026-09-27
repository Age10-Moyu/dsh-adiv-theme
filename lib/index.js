/**
 * A\ has no host-side behavior.
 *
 * Every part of the theme runs in the web client: the palette is applied as CSS
 * custom-property overrides on `body`. Keeping this entry point inert means the
 * theme needs no filesystem, network, process, or web-server access, so it can
 * never affect anything outside the browser render tree.
 */
export const name = 'dsh-adiv-theme';

export function apply() {}
