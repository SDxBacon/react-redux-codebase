import visibilityReducer from "./slices/visibility";
import windowOrientationReducer from "./slices/windowOrientation";

const reducers = {
  visibility: visibilityReducer,
  windowOrientation: windowOrientationReducer
};

export default reducers;
