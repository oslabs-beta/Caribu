import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface viewsState {
  routes: object[],
  controllers: object[],
  apis: object[],
}

const initialState: viewsState = {
  routes: [
    {
      routeName: '/character',
      routeMethods: {
        GET: {

        },
        POST: {

        }
      }
    },
    {
      routeName: '/species',
      routeMethods: {
        GET: {

        }
      }
    }
  ],
  controllers: [],
  apis: [],
}

export const viewsSlice = createSlice({
  name: 'views',
  initialState,
  // RTK allows us to write "mutating" logic in reducers; it doesn't actually mutate the state because it uses a library that detects changes to a "draft state" which produces a new immutable state based off those changes
  reducers: {
    // update the routes in the state to render to the page
    update_routes: (state, action: PayloadAction<object[]>) => {
      state.routes.push(action.payload);
    },
  },
})

// Action creators are generated for each case reducer function
export const { update_routes } = viewsSlice.actions;

export default viewsSlice.reducer;