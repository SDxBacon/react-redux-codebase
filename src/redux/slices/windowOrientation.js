import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orientation: null
};

const reducers = {
  changeOrientation: (state, { payload }) => {
    state.orientation = payload;
  }
};

const windowOrientationSlice = createSlice({
  name: "windowOrientation",
  initialState,
  reducers
});

/** public action */
export const { changeOrientation } = windowOrientationSlice.actions;

/** default export: reducer */
export default windowOrientationSlice.reducer;
