import { eventChannel } from "redux-saga";
import { put, call, spawn, takeEvery } from "redux-saga/effects";
import { changeOrientation } from "redux/slices/windowOrientation";
import { PORTRAIT, LANDSCAPE } from "constants/windowOrientation";

export function getOrientationValue(mediaQueryList) {
  return mediaQueryList.matches
    ? PORTRAIT // If there are matches, we're in portrait
    : LANDSCAPE; // otherwise, we are in landscape
}

function* handleWindowOrientationChange(nextOrientation) {
  yield put(changeOrientation(nextOrientation));
}

function* mqlChangeWatcher(mql) {
  const channel = eventChannel((emitter) => {
    function mqlMatcher() {
      emitter(mql.matches ? PORTRAIT : LANDSCAPE);
    }

    /**
     * Add a media query change listener
     */
    if (mql.addEventListener) {
      mql.addEventListener("change", mqlMatcher);

      return () => {
        mql.addEventListener("change", mqlMatcher);
      };
    } else {
      /**
       * ref: https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList#browser_compatibility
       * Prior to Safari 14, MediaQueryList is based on EventTarget,
       * so you must use addListener() and removeListener() to observe media query lists.
       */
      mql.addListener(mqlMatcher);

      return () => {
        mql.removeListener(mqlMatcher);
      };
    }
  });

  yield takeEvery(channel, handleWindowOrientationChange);
}

export default function* windowOrientationWatcher() {
  // create MediaQueryList reference
  const mql = window.matchMedia("(orientation: portrait)");

  // get initial orientation value
  const orientation = getOrientationValue(mql);
  yield call(handleWindowOrientationChange, orientation);

  // spawn mql onChange watcher
  yield spawn(mqlChangeWatcher, mql);
}
