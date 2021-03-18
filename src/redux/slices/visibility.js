import { createSlice } from "@reduxjs/toolkit";
import { VISIBLE } from "constants/visibility";

const initialState = {
  visibility: VISIBLE
};

const reducers = {
  changeVisibility: (state, { payload }) => {
    state.visibility = payload;
  }
};

const visibilitySlice = createSlice({
  name: "visibility",
  initialState,
  reducers
});

/** public action */
export const { changeVisibility } = visibilitySlice.actions;

/** default export: reducer */
export default visibilitySlice.reducer;
