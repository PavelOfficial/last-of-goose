import { combineReducers, configureStore } from "@reduxjs/toolkit"

import { appApi } from "query/api/appApi.api"

const rootReducer = combineReducers({
  [appApi.reducerPath]: appApi.reducer,
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

export type AppDispatch = typeof store.dispatch
