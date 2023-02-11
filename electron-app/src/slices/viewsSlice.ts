import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface viewsState {
  // TBD: flesh out nested types more after talking to backend
  routes: object[],
  controllers: object[],
  apis: object[],
}

const initialState: viewsState = {
  // FOR TESTING ONLY: populate initial state to test if redux state is accessible from components
  routes: [ 
 /*    {
      routeName: '/character',
      routeMethods: {
        GET: {
          middlewares: [{
            functionInfo: {
              funcName: 'getCharacters',
              funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
              funcPosition: [6, 40],
              funcDef: 'lorem ipsum dolor sit amet',
            }
          }]
        },
        POST: {
          middlewares: [{
            functionInfo: {
              funcName: 'addCharacter',
              funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
              funcPosition: [102, 119],
              funcDef: 'tbh i dont know hehe',
            }
          }]
        }
      }
    },
    {
      routeName: '/species',
      routeMethods: {
        GET: {
          middlewares: [{
            functionInfo: {
              funcName: 'getCharacters',
              funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
              funcPosition: [6, 40]
            }
          }]
        }
      }
    } */
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