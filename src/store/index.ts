import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import { appApi } from "query/api/appApi.api"
import { appSlice } from "./appSlice"

const rootReducer = combineReducers({
  [appApi.reducerPath]: appApi.reducer,
  [appSlice.name]: appSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

const createStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat([appApi.middleware])
    },
  })
}

export const store = createStore()

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
