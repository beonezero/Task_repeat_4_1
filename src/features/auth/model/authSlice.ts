import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit"
import { appActions } from "app/appSlice"
import { todolistsActions } from "features/TodolistList/model/todolists/todolistsSlice"
import { authAPI } from "features/auth/api/authApi"
import { createAppAsyncThunk, handleServerAppError } from "common/utils"
import { thunkTryCatch } from "common/utils/thunk-try-catch"
import { LoginDataType } from "features/auth/api/auth.type"

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginDataType>("auth/login", async (data, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  return thunkTryCatch(thunkAPI, async () => {
    const res = await authAPI.loginIn(data)
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { isLoggedIn: true }
    } else {
      const isShowAppError = !res.data.fieldsErrors.length
      handleServerAppError(res.data, dispatch, isShowAppError)
      return rejectWithValue(res.data)
    }
  })
})

const logOut = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  return thunkTryCatch(thunkAPI, async () => {
    const res = await authAPI.logOut()
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      dispatch(todolistsActions.clearState())
      return { isLoggedIn: false }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  })
})

const me = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/me", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  return thunkTryCatch(thunkAPI, async () => {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(null)
    }
  }).finally(() => {
    dispatch(appActions.setIsInitialized({ isInitialized: true }))
  })
})

const slice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false as boolean },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // .addCase(me.fulfilled, (state, action) => {
      //   state.isLoggedIn = action.payload.isLoggedIn
      // })
      // .addCase(logOut.fulfilled, (state, action) => {
      //   state.isLoggedIn = action.payload.isLoggedIn
      // })
      // .addCase(login.fulfilled, (state, action) => {
      //   state.isLoggedIn = action.payload.isLoggedIn
      // })
      .addMatcher(
        isAnyOf(authThunks.login.fulfilled, authThunks.logOut.fulfilled, authThunks.me.fulfilled),
        (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
          state.isLoggedIn = action.payload.isLoggedIn
        }
      )
  },
})

export const authSlice = slice.reducer
export const authThunks = { login, logOut, me }
