import entries from "lodash/entries";
import { all, put, call, select, takeEvery } from "redux-saga/effects";
import { VISIBILITY_CHANGE } from "redux/constants/app";
import { PAUSE_AUDIO, GRANT_PLAYING_PERMISSION } from "redux/constants/sound";
import { _playAudio } from "redux/slices/sound";
import { selectVisibility } from "redux/selectors/global";
import {
  selectAudio,
  selectResumeQueue,
  selectPlayingAudios,
} from "redux/selectors/sound";
import {
  removeAudio,
  recordAudioMarksWithAutoResume,
} from "redux/slices/sound";

/**
 * doPauseAudio
 * @param {HTMLAudioElement} audio
 * @description 移除audio的event listener，並執行audio.pause
 * @private
 */
function* doPauseAudio(audio) {
  const selectedAudio = yield select(selectAudio, audio);

  // 如果這個audio並不存在於map中，啥都不用做
  if (!selectedAudio) return;

  const { onEndedListener } = selectedAudio;

  // remove event listener if necessary
  if (onEndedListener) {
    audio.removeEventListener("ended", onEndedListener);
  }

  // pause the audio
  try {
    yield call([audio, audio.pause]);
  } catch (err) {
    console.log(err);
  }
}

/**
 * pauseSoundWatcher
 * @description 手動停止audio的播放
 */
function* pauseSoundWatcher({ payload }) {
  for (const audio of payload) {
    // pause audio
    yield call(doPauseAudio, audio);

    // delete manually from mapAudios
    yield put(removeAudio(audio));
  }
}

/**
 * playSoundWatcher
 * @description 播放audio的flow
 */
function* playSoundWatcher({ payload }) {
  // 若輸入的audio不是HTMLAudioElement，直接結束
  const { audio, options } = payload;
  if (audio.nodeName.toLowerCase() !== "audio") return;

  /* 若呼叫播放時，當下的visibility是hidden，不播放音頻 */
  const visibility = yield select(selectVisibility);
  if (visibility === "hidden") {
    return;
  }

  audio.loop = !!options?.loop;

  const onEndedListener = function* () {
    yield put(removeAudio(audio));
  };

  try {
    /**
     * 播放前，替audio加上event listener，當播放停止後，自map中刪除此音頻
     */
    audio.addEventListener("ended", onEndedListener);

    /**
     * playing audio
     *
     * [Note]: context must set to `audio` itself; otherwise, audio.play
     * will receive TypeError exception.
     */
    yield call([audio, audio.play]);
  } catch (err) {
    /**
     * 播放出現例外，移除event listener並從AudioMap中移除該HTMLAudioElement
     */
    audio.removeEventListener("ended", onEndedListener);
    yield put(removeAudio(audio));
  }
}

/**
 * visibilityWatcher
 * @description 監控visibility的變動，已達到自動停止、恢復播放
 */
function* visibilityWatcher({ payload }) {
  /**
   * 如果即將hidden, 停止所有audio, 並移除沒有`autoResume` flag的audio
   */
  if (payload === "hidden") {
    const playingMap = yield select(selectPlayingAudios);
    for (const [, value] of entries(playingMap)) {
      // pause the audio
      yield call(doPauseAudio, value.audio);
    }

    yield put(recordAudioMarksWithAutoResume());
  } else {
    /** 當visibility變回visible, 重新播放resumeQueue中的音頻 */
    const resumeQueue = yield select(selectResumeQueue);
    for (const { audio, options } of resumeQueue) {
      yield put(_playAudio({ audio, options }));
    }
  }
}

function* grantPermissionWatcher({ payload }) {
  for (const audio of payload) {
    try {
      // 將audio播放, 並立刻load
      yield all([call([audio, audio.play]), call([audio, audio.load])]);
    } catch (e) {
      // play之後立刻跟著load, 一定會造成例外, 啥都不用做
    }
  }
}

export default function* soundController() {
  // 監聽 visibility的變動，已達到自動停止／繼續播放的功能
  yield takeEvery(VISIBILITY_CHANGE, visibilityWatcher);

  // 播放音效
  yield takeEvery(_playAudio.type, playSoundWatcher);

  // 停止音效
  yield takeEvery(PAUSE_AUDIO, pauseSoundWatcher);

  //
  yield takeEvery(GRANT_PLAYING_PERMISSION, grantPermissionWatcher);
}
