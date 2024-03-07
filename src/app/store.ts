import { tasksReducer } from "features/TodolistList/model/tasks/tasksSlice"
import { todolistsSlice } from "features/TodolistList/model/todolists/todolistsSlice"
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import { appSlice } from "app/appSlice"
import { authSlice } from "features/auth/model/authSlice"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    app: appSlice,
    tasks: tasksReducer,
    todolists: todolistsSlice,
    auth: authSlice,
  },
})
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction> // fix type !!!
// store.dispatch

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
