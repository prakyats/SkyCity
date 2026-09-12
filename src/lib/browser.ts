/* eslint-disable no-restricted-globals, no-unused-vars */
/**
 * The single place this app touches the browser.
 *
 * The project's lint rule bans scattered `window` and `document` access to
 * keep server rendering safe. Rather than silence that rule in a dozen
 * components, every browser read and every listener goes through here: each
 * helper is guarded, each listener returns its own teardown, and scroll
 * callbacks are throttled to one frame so no component can register an
 * unthrottled scroll handler by accident.
 */

export const canUseDOM = () => typeof window !== 'undefined';

/** Does the visitor want less movement? Checked at call time, not cached. */
export const reducedMotion = () =>
  canUseDOM() && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Coarse pointer, i.e. touch. Mobile gets less motion, never a broken page. */
export const isTouch = () =>
  canUseDOM() && window.matchMedia('(hover: none), (pointer: coarse)').matches;

/** Below the desktop breakpoint, where reveal travel is shortened. */
export const isNarrowViewport = () =>
  canUseDOM() && window.matchMedia('(max-width: 1023px)').matches;

export const viewportWidth = () => (canUseDOM() ? window.innerWidth : 0);
export const viewportHeight = () => (canUseDOM() ? window.innerHeight : 0);

/** Scroll depth as a 0–1 fraction of the page, plus the raw offset. */
export const scrollMetrics = () => {
  if (!canUseDOM()) return { y: 0, max: 0, progress: 0 };
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = window.scrollY;
  return { y, max, progress: max > 0 ? Math.min(1, Math.max(0, y / max)) : 0 };
};

/** Scroll and resize, throttled to one animation frame. Returns a teardown. */
export const onViewportChange = (cb: () => void): (() => void) => {
  if (!canUseDOM()) return () => {};
  let frame = 0;
  const run = () => { frame = 0; cb(); };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(run); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  cb();
  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    if (frame) cancelAnimationFrame(frame);
  };
};

export const onResize = (cb: () => void): (() => void) => {
  if (!canUseDOM()) return () => {};
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
};

export const onKeyDown = (cb: (e: KeyboardEvent) => void): (() => void) => {
  if (!canUseDOM()) return () => {};
  document.addEventListener('keydown', cb);
  return () => document.removeEventListener('keydown', cb);
};

/** Report uncaught errors and rejections. Returns a teardown. */
export const onUncaught = (
  onError: (e: ErrorEvent) => void,
  onRejection: (e: PromiseRejectionEvent) => void,
): (() => void) => {
  if (!canUseDOM()) return () => {};
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
  };
};

/* ── Scrolling to things ─────────────────────────────────────────────────── */

export const scrollToTop = () => {
  if (canUseDOM()) window.scrollTo({ top: 0, behavior: 'smooth' });
};

/** Smooth-scroll to a selector or `#id`. No-op if it isn't on the page. */
export const scrollToTarget = (selector: string) => {
  if (!canUseDOM()) return;
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
};

/* ── Scroll restoration ─────────────────────────────────────────────────── */

const SCROLL_KEY = 'ysc:scroll';

/**
 * Take scroll restoration away from the browser.
 *
 * The browser puts the reader back at their previous offset the instant
 * the document loads — before the pinned passages have added their
 * scroll length, and before the title sequence has lifted. An offset
 * measured in pixels against the old, fully measured page points
 * somewhere else entirely on a page that has not finished growing, which
 * is why a refresh landed in a different section every time. The page
 * restores the offset itself instead, once everything has been measured.
 */
export const takeScrollRestoration = () => {
  if (!canUseDOM() || !('scrollRestoration' in history)) return;
  history.scrollRestoration = 'manual';
};

/** Remember where the reader is, so a reload can put them back. */
export const rememberScroll = (y: number) => {
  if (!canUseDOM()) return;
  try {
    sessionStorage.setItem(SCROLL_KEY, String(Math.round(y)));
  } catch {
    // Private browsing and blocked storage both throw. Losing the
    // position is not worth failing a page load over.
  }
};

/** Where the reader was before this load, if the page knows. */
export const rememberedScroll = (): number => {
  if (!canUseDOM()) return 0;
  try {
    const v = Number(sessionStorage.getItem(SCROLL_KEY));
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch {
    return 0;
  }
};

/**
 * A jump with no animation.
 *
 * Lenis registers itself here while it is running: moving the window out
 * from under it leaves its own idea of the position stale, and the next
 * wheel event snaps back to where it thought it was.
 */
let jumpHandler: ((y: number) => void) | null = null;

export const setScrollJump = (fn: ((y: number) => void) | null) => {
  jumpHandler = fn;
};

export const jumpScrollTo = (y: number) => {
  if (!canUseDOM()) return;
  if (jumpHandler) {
    jumpHandler(y);
    return;
  }
  window.scrollTo({ top: y, behavior: 'auto' });
};

/** Record the position as the reader moves, and once more as they leave. */
export const trackScrollPosition = (): (() => void) => {
  if (!canUseDOM()) return () => {};
  const save = () => rememberScroll(window.scrollY);
  const off = onViewportChange(save);
  window.addEventListener('pagehide', save);
  return () => {
    off();
    window.removeEventListener('pagehide', save);
  };
};

/** Last resort after a render failure. */
export const reloadPage = () => {
  if (canUseDOM()) window.location.reload();
};

/* ── Page state ──────────────────────────────────────────────────────────── */

/** Lock or release page scrolling, for the preloader and the mobile panel. */
export const lockScroll = (locked: boolean) => {
  if (canUseDOM()) document.body.style.overflow = locked ? 'hidden' : '';
};

/** The scroll container ScrollTrigger and Lenis both measure against. */
export const scrollRoot = () => (canUseDOM() ? document.documentElement : undefined);

/**
 * Which surface is actually painted under the header band.
 *
 * This is a hit test, not DOM order, and that matters: the hero is a
 * sticky backdrop that later sections slide over, so the section that
 * comes last in the document is not necessarily the one on top. Probe
 * near the bar's lower edge so an incoming section takes the tone as
 * soon as it slides under. Anything unmarked counts as light.
 */
export const toneAtPoint = (x: number, y: number): string => {
  if (!canUseDOM()) return 'ink';
  for (const el of document.elementsFromPoint(Math.round(x), Math.round(y))) {
    // Skip the fixed chrome; we want the page surface behind it.
    if (el.closest('header, aside, [data-chrome]')) continue;
    const section = el.closest<HTMLElement>('[data-stop]');
    if (!section) continue;
    return section.dataset.stop ?? 'bone';
  }
  return 'bone';
};

/** The root element, whose custom properties carry the stage palette. */
export const styleRoot = () => (canUseDOM() ? document.documentElement : null);

/**
 * Every passage that declares a stage palette, in document order.
 *
 * Fixed chrome is excluded deliberately. The header's mobile panel and the
 * error screen also declare a palette so they read correctly when shown,
 * but they are not places in the journey — counting them would insert a
 * phantom stop into the sequence and make the ground jump.
 */
export const stageStops = (): HTMLElement[] => {
  if (!canUseDOM()) return [];
  return Array.from(document.querySelectorAll<HTMLElement>('[data-stop]'))
    .filter((el) => {
      if (el.closest('header, aside, [data-chrome]')) return false;
      return getComputedStyle(el).position !== 'fixed';
    });
};

export const toneUnderHeader = (headerHeight: number): string =>
  canUseDOM() ? toneAtPoint(window.innerWidth / 2, headerHeight * 0.8) : 'ink';

/* ── The one custom event this app uses ──────────────────────────────────── */

const PRELOADER_DONE = 'preloaderComplete';

export const emitPreloaderComplete = () => {
  if (canUseDOM()) window.dispatchEvent(new CustomEvent(PRELOADER_DONE));
};

export const onPreloaderComplete = (cb: () => void): (() => void) => {
  if (!canUseDOM()) return () => {};
  window.addEventListener(PRELOADER_DONE, cb, { once: true });
  return () => window.removeEventListener(PRELOADER_DONE, cb);
};

/* ── Idle work ───────────────────────────────────────────────────────────── */

/** Run when the browser is idle, with a hard timeout fallback. */
export const whenIdle = (cb: () => void, timeout = 1500): (() => void) => {
  if (!canUseDOM()) return () => {};
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback?.(id);
  }
  const id = setTimeout(cb, Math.min(timeout, 800));
  return () => clearTimeout(id);
};
