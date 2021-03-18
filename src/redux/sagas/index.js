import { all } from "redux-saga/effects";
import visibilityWatcher from "./visibilityWatcher";

export default function* root() {
  yield all([visibilityWatcher()]);
}
