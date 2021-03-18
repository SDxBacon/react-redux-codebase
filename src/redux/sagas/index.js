import { all } from "redux-saga/effects";
import visibilityWatcher from "./visibilityWatcher";
import windowOrientationWatcher from "./windowOrientationWatcher";

export default function* root() {
  yield all([visibilityWatcher(), windowOrientationWatcher()]);
}
