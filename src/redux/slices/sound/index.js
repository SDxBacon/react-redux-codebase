import filter from 'lodash/filter';
import flattenDeep from 'lodash/flattenDeep';
import { createAction } from 'redux-actions';
import { createSlice } from '@reduxjs/toolkit';
import { PAUSE_AUDIO, GRANT_PLAYING_PERMISSION } from 'redux/constants/sound';
import { getKeyByHTMLMediaElement } from './utils';

const initialState = {
  /**
   * 紀錄目前正在播放的HTMLAudioElement
   * - property的key為音檔的url
   * - property的value為:
   * ```
   * {
   *   audio: HTMLAudioElement
   *   options: {
   *     autoResume: boolean,
   *     loop: boolean
   *   }
   * }
   * ```
   */
  playingAudios: {},

  /**
   * 等待自動resume播放的佇列, element為:
   * ```
   * {
   *    audio: HTMLAudioElement,
   *    options: {
   *      autoResume: boolean,
   *      loop: boolean
   *    }
   * }
   * ```
   */
  resumeQueue: [],
};

const reducers = {
  // playAudio
  playAudio: (state, { payload }) => {
    const { audio, options } = payload;
    const key = getKeyByHTMLMediaElement(payload.audio);
    state.playingAudios[key] = {
      audio,
      options: {
        autoResume: !!options?.autoResume,
        loop: !!options?.loop,
      },
    };
  },

  // remove from map
  removeAudio: (state, { payload }) => {
    const key = getKeyByHTMLMediaElement(payload);
    if (key) {
      delete state.playingAudios[key];
    }
  },

  recordAudioMarksWithAutoResume: (state) => {
    // 過濾出被標記為需要自動接續播放的音檔
    state.resumeQueue = filter(state.playingAudios, (el) => {
      return el?.options?.autoResume;
    });

    // empty playingAudios
    state.playingAudios = {};
  },
};

const soundSlice = createSlice({
  name: 'sound',
  initialState,
  reducers,
});

/** private actions, for redux-saga use only */
export const _playAudio = soundSlice.actions.playAudio;

/**
 * public actions
 */
export const {
  removeAudio,
  recordAudioMarksWithAutoResume,
} = soundSlice.actions;

/* 播放audio action */
export const playAudio = (audio, options) => {
  return soundSlice.actions.playAudio({ audio, options });
};

/**
 * 暫停audio action
 *
 * 可以接受Audio array或是將Audio作為arguments帶入，範例：
 *  1. pauseAudio([audio1, audio2, audio3, ...audioN ])
 *  2. pauseAudio(audio1, audio2, audio3, ..., audioN)
 */
export const pauseAudio = createAction(PAUSE_AUDIO, (...args) =>
  flattenDeep(args)
);

/**
 * 先行取得播放權限action
 * - 原因: Android/iOS的WebView或WKWebView有屬性用來設定「是否限制播放音效必須要跟隨在手勢互動」之後。
 *        這裡是一個workaround, 先行將無法預期播放時機的音效元件先行取得播放權限。
 * - 使用對象: HTMLAudioElement會在無法預期播放、無法預期播放前使用者一定會與畫面互動的元素
 * - 使用時機: 使用者會與畫面互動的callback
 * - 使用方法: 可以接受Audio array或是將Audio作為arguments帶入，範例:
 *  1. grantPlayingPermission([audio1, audio2, audio3, ...audioN ])
 *  2. grantPlayingPermission(audio1, audio2, audio3, ..., audioN)
 */
export const grantPlayingPermission = createAction(
  GRANT_PLAYING_PERMISSION,
  (...args) => flattenDeep(args)
);

/** default export: reducer */
export default soundSlice.reducer;
