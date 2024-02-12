import { LoginDataType } from "features/auth/Login/Login"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { createSlice } from "@reduxjs/toolkit"
import { appActions } from "app/app-reducer"
import { todolistsActions } from "features/TodolistList/todolists-reducer"
import { authAPI } from "features/auth/authApi"
import { createAppAsyncThunk, handleServerAppError } from "common/utils"
import { thunkTryCatch } from "common/utils/thunk-try-catch"

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginDataType>("auth/login", async (data, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    const res = await authAPI.loginIn(data)
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { isLoggedIn: true }
    } else {
      const isShowAppError = !res.data.fieldsErrors.length
      handleServerAppError(res.data, dispatch, isShowAppError)
      return rejectWithValue(res.data)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})

const logOut = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    const res = await authAPI.logOut()
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      dispatch(todolistsActions.clearState())
      return { isLoggedIn: false }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
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
      .addCase(me.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
  },
})

export const authReducer = slice.reducer
export const authThunks = { login, logOut, me }
