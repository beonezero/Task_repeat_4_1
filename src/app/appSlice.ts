import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit"
import { AnyAction } from "redux"

const initialState = {
  isInitialized: false as boolean,
  status: "idle" as RequestStatusType,
  error: null as null | string,
}

const slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.status = "loading"
      })
      .addMatcher(isRejected, (state, action: AnyAction) => {
        state.error = action.error.message
        state.status = "failed"
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = "succeeded"
      })
  },
})
export const appSlice = slice.reducer
export const appActions = slice.actions

//types

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
