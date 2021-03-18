/**
 * tab visibility definition, equals to Document.visibilityState
 * reference: [Document.visibilityState](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)
 */

/**
 * The page content may be at least partially visible.
 * In practice this means that the page is the foreground tab of a non-minimized window.
 */
export const VISIBLE = "visible";

/**
 * The page content is not visible to the user.
 * In practice this means that the document is either a background tab or part of a minimized window,
 * or the OS screen lock is active.
 */
export const HIDDEN = "hidden";
