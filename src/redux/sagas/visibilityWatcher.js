import { eventChannel } from "redux-saga";
import { takeEvery, put, spawn } from "redux-saga/effects";
import { changeVisibility } from "redux/slices/visibility";

function* handleVisibilityChange(nextVisibility) {
  yield put(changeVisibility(nextVisibility));
}

function* windowVisibilityWatcher() {
  const channel = eventChannel((emitter) => {
    const onVisibilityChange = () => void emitter(document.visibilityState);
    const onWindowPageHide = () => void emitter("hidden");
    /**
     * 當document觸發visibilitychange時，重新取得一次當前visibilityState並emit出去
     */
    document.addEventListener("visibilitychange", onVisibilityChange);

    /**
     * 當window觸發 pagehide event時，視為visibilityChange to 'hidden'。
     *
     * Note: 監聽此event的原因是因為MDN文件提到以下資訊
     *
     * Safari doesn't fire visibilitychange as expected when the value of the visibilityState
     * property transitions to hidden; so for that case, you need to also include code to
     * listen for the pagehide event.
     */
    window.addEventListener("pagehide", onWindowPageHide);

    /** cancel effect */
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onWindowPageHide);
    };
  });

  yield takeEvery(channel, handleVisibilityChange);
}

export default function* visibilityWatcher() {
  yield spawn(windowVisibilityWatcher);
}
