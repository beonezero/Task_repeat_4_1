//types
import { LoginDataType } from "features/auth/Login/Login"
import { Dispatch } from "redux"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { appActions } from "app/app-reducer"
import { todolistsActions } from "features/TodolistList/todolistsSlice"
import { authAPI } from "features/auth/authApi"
import { handleServerAppError } from "common/utils"

const initialState = {
  isLoggedIn: false as boolean,
}

const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedInStatus: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const logOutTC = () => async (dispatch: Dispatch) => {
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

export const loginTC = (data: LoginDataType) => async (dispatch: Dispatch) => {
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

export const meTC = () => async (dispatch: Dispatch) => {
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
