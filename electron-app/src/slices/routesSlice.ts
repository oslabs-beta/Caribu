import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface routesState {
  results: object[],
}

const initialState: routesState = {
  results: [],
}

export const routesSlice = createSlice({
  name: 'routes',
  initialState,
  // RTK allows us to write "mutating" logic in reducers; it doesn't actually mutate the state because it uses a library that detects changes to a "draft state" which produces a new immutable state based off those changes
  reducers: {
    // update the routes in the state to render to the page
    update_results: (state, action: PayloadAction<object[]>) => {
      state.results.push(action.payload);
    },
  },
})

// Action creators are generated for each case reducer function
export const { update_results } = routesSlice.actions;

export default routesSlice.reducer;