//types
import { LoginDataType } from "features/auth/Login/Login"
import { Dispatch } from "redux"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { appActions } from "app/app-reducer"
import { todolistsActions } from "features/TodolistList/todolists-reducer"
import { authAPI } from "features/auth/authApi"
import { handleServerAppError } from "common/utils"

const slice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false as boolean },
  reducers: {
    setIsLoggedInStatus: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = {}
export const logOut = () => async (dispatch: Dispatch) => {
  appActions.setAppStatus({ status: "loading" })
  try {
    const res = await authAPI.logOut()
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedInStatus({ isLoggedIn: false }))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      dispatch(todolistsActions.clearState())
    } else handleServerAppError(res.data, dispatch)
  } catch (e) {
    handleServerNetworkError(e, dispatch)
  }
}

export const login = (data: LoginDataType) => async (dispatch: Dispatch) => {
  appActions.setAppStatus({ status: "loading" })
  try {
    const res = await authAPI.loginIn(data)
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedInStatus({ isLoggedIn: true }))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
    } else handleServerAppError(res.data, dispatch)
  } catch (e) {
    handleServerNetworkError(e, dispatch)
  }
}

export const me = () => async (dispatch: Dispatch) => {
  appActions.setAppStatus({ status: "loading" })
  try {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedInStatus({ isLoggedIn: true }))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
    } else handleServerAppError(res.data, dispatch)
  } catch (e) {
    handleServerNetworkError(e, dispatch)
  } finally {
    dispatch(appActions.setIsInitialized({ isInitialized: true }))
  }
}
