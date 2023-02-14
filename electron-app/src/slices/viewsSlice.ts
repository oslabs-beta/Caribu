import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface viewsState {
  // TBD: flesh out nested types more after talking to backend
  routes: object[],
  controllers: object[],
  apis: object[],
  curMethod: string,
  routeIndex: number,
  curMetric: string,
  curMiddleware: object,
}

const initialState: viewsState = {
  // FOR TESTING ONLY: populate initial state to test if redux state is accessible from components
  routes: [
    {
      routeName: '/character',
      routeMethods: {
        GET: {
          middlewares: [{
            functionInfo: {
              funcName: 'getCharacters',
              funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
              funcPosition: [6, 40],
              funcDef: 'lorem ipsum dolor sit amet',
            },
            deps : {
              totalUpstreamDeps : 1,
              totalDownstreamDeps : 1,
              upstream : [{
                upVarName : 'getCharacters upvarname1',
                upVarFile : 'getCharacters upvar filepath1',
                upVarPosition : [8, 15],
                upVarDef : 'getCharacters upvarvariable def1',
                upVarUseInFunc : 'getCharacters upvaruseinfunction1'
              },
              {
                upVarName : 'getCharacters upvarname2',
                upVarFile : 'getCharacters upvar filepath2',
                upVarPosition : [8, 15],
                upVarDef : 'getCharacters upvarvariable def2',
                upVarUseInFunc : 'getCharacters upvaruseinfunction2'
              },
              {
                upVarName : 'getCharacters upvarname3',
                upVarFile : 'getCharacters upvar filepath3',
                upVarPosition : [8, 15],
                upVarDef : 'getCharacters upvarvariable def3',
                upVarUseInFunc : 'getCharacters upvaruseinfunction3'
              }],
              downstream : {
                dependents: [{
                  dependentFuncName : 'getCharacters dependentfunc1 name',
                  dependentFuncFile : 'getCharacters dependentfunc1 file path',
                  dependentFuncPosition: [1, 25],
                  dependentFuncDef : 'getCharacters dependentfunc1 definition'
                },
                {
                  dependentFuncName : 'getCharacters dependentfunc2 name',
                  dependentFuncFile : 'getCharacters dependentfunc2 file path',
                  dependentFuncPosition: [1, 25],
                  dependentFuncDef : 'getCharacters dependentfunc2 definition'
                }]
              }
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
            },
            deps : {
              totalUpstreamDeps : 1,
              totalDownstreamDeps : 1,
              upstream : [{
                upVarName : 'addCharacters upvarname1',
                upVarFile : 'addCharacters upvar filepath1',
                upVarPosition : [9, 17],
                upVarDef : 'addCharacters upvarvariable def1',
                upVarUseInFunc : 'addCharacters upvaruseinfunction1'
              }],
              downstream : {
                dependents: [{
                  dependentFuncName : 'addCharacters dependentfunc1 name',
                  dependentFile : 'addCharacters dependentfunc1 file path',
                  dependentFuncPosition: [2, 12],
                  dependentFuncDef : 'addCharacters dependentfunc1 definition'
                },
                {
                  dependentFuncName : 'addCharacters dependentfunc2 name',
                  dependentFile : 'addCharacters dependentfunc2 file path',
                  dependentFuncPosition: [2, 12],
                  dependentFuncDef : 'addCharacters dependentfunc2 definition'
                },
                {
                  dependentFuncName : 'addCharacters dependentfunc3 name',
                  dependentFile : 'addCharacters dependentfunc3 file path',
                  dependentFuncPosition: [2, 12],
                  dependentFuncDef : 'addCharacters dependentfunc3 definition'
                },
                {
                  dependentFuncName : 'addCharacters dependentfunc4 name',
                  dependentFile : 'addCharacters dependentfunc4 file path',
                  dependentFuncPosition: [2, 12],
                  dependentFuncDef : 'addCharacters dependentfunc4 definition'
                },
                {
                  dependentFuncName : 'addCharacters dependentfunc5 name',
                  dependentFile : 'addCharacters dependentfunc5 file path',
                  dependentFuncPosition: [2, 12],
                  dependentFuncDef : 'addCharacters dependentfunc5 definition'
                },
                {
                  dependentFuncName : 'addCharacters dependentfunc6 name',
                  dependentFile : 'addCharacters dependentfunc6 file path',
                  dependentFuncPosition: [2, 12],
                  dependentFuncDef : 'addCharacters dependentfunc6 definition'
                },
                {
                  dependentFuncName : 'addCharacters dependentfunc7 name',
                  dependentFile : 'addCharacters dependentfunc7 file path',
                  dependentFuncPosition: [2, 12],
                  dependentFuncDef : 'addCharacters dependentfunc7 definition'
                }]
              }
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
              funcName: 'getSpecies',
              funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
              funcPosition: [6, 40],
            },
            deps : {
              totalUpstreamDeps : 1,
              totalDownstreamDeps : 1,
              upstream : [{
                upVarName : 'getSpecies upvarname1',
                upVarFile : 'getSpecies upvar filepath1',
                upVarPosition : [2, 21],
                upVarDef : 'getSpecies upvarvariable def1',
                upVarUseInFunc : 'getSpecies upvaruseinfunction1'
              }],
              downstream : {
                dependents: [{
                  dependentFuncName : 'getSpecies dependentfunc1 name',
                  dependentFile : 'getSpecies dependentfunc1 file path',
                  dependentFuncPosition: [3, 7],
                  dependentFuncDef : 'getSpecies dependentfunc1 definition'
                }]
              }
            }
          }]
        }
      }
    },
    {
      routeName: '/planets',
      routeMethods: {
        GET: {
          middlewares: [{
            functionInfo: {
              funcName: 'getPlanets',
              funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
              funcPosition: [2, 15],
            },
            deps : {
              totalUpstreamDeps : 1,
              totalDownstreamDeps : 1,
              upstream : [{
                upVarName : 'getPlanets upvarname1',
                upVarFile : 'getPlanets upvar filepath1',
                upVarPosition : [5, 19],
                upVarDef : 'getPlanets upvarvariable def1',
                upVarUseInFunc : 'getPlanets upvaruseinfunction1'
              }],
              downstream : {
                dependents: [{
                  dependentFuncName : 'getPlanets dependentfunc1 name',
                  dependentFuncFile : 'getPlanets dependentfunc1 file path',
                  dependentFuncPosition: [7, 12],
                  dependentFuncDef : 'getPlanets dependentfunc1 definition'
                }]
              }
            }
          }]
        },
        POST: {
          middlewares: [{
            functionInfo: {
              funcName: 'addPlanet',
              funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
              funcPosition: [12, 32],
            },
            deps : {
              totalUpstreamDeps : 1,
              totalDownstreamDeps : 1,
              upstream : [{
                upVarName : 'addPlanet upvarname1',
                upVarFile : 'addPlanet upvar filepath1',
                upVarPosition : [5, 19],
                upVarDef : 'addPlanet upvarvariable def1',
                upVarUseInFunc : 'addPlanet upvaruseinfunction1'
              }],
              downstream : {
                dependents: [{
                  dependentFuncName : 'addPlanet dependentfunc1 name',
                  dependentFuncFile : 'addPlanet dependentfunc1 file path',
                  dependentFuncPosition: [7, 12],
                  dependentFuncDef : 'addPlanet dependentfunc1 definition'
                }]
              }
            }
          }]
        },
        DELETE: {
          middlewares: [{
            functionInfo: {
              funcName: 'deletePlanet',
              funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
              funcPosition: [33, 42],
            },
            deps : {
              totalUpstreamDeps : 1,
              totalDownstreamDeps : 1,
              upstream : [{
                upVarName : 'deletePlanet upvarname1',
                upVarFile : 'deletePlanet upvar filepath1',
                upVarPosition : [5, 19],
                upVarDef : 'deletePlanet upvarvariable def1',
                upVarUseInFunc : 'deletePlanet upvaruseinfunction1'
              }],
              downstream : {
                dependents: [{
                  dependentFuncName : 'deletePlanet dependentfunc1 name',
                  dependentFuncFile : 'deletePlanet dependentfunc1 file path',
                  dependentFuncPosition: [7, 12],
                  dependentFuncDef : 'deletePlanet dependentfunc1 definition'
                }]
              }
            }
          }]
        }
      }
    }
  ],
  controllers: [],
  apis: [],
  curMethod: "",
  routeIndex: 0,
  curMetric: "",
  curMiddleware: {},
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
    update_method: (state, action: PayloadAction<object[]>) => {
      const {method, routeIndex} = action.payload;
      state.curMethod = method;
      state.routeIndex = routeIndex;
    },
    update_dependency: (state, action: PayloadAction<object[]>) => {
      const {middleware} = action.payload;
      state.curMiddleware = middleware;
    }
  },
})

// Action creators are generated for each case reducer function
export const { update_routes, update_method, update_dependency } = viewsSlice.actions;

export default viewsSlice.reducer;