import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface AppState {
  token: string | null
}

const initialState: AppState = {
  token: null,
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token
    },
  },
})

export const { setToken } = appSlice.actions
