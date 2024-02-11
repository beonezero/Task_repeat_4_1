import { tasksReducer } from "features/TodolistList/tasks-reducer"
import { todolistsReducer } from "features/TodolistList/todolists-reducer"
import { ThunkAction } from "redux-thunk"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import { appReducer } from "./app-reducer"
import { authReducer } from "features/auth/auth-reducer"
import { configureStore, UnknownAction } from "@reduxjs/toolkit"

// создаём store
export const store = configureStore({
  reducer: {
    app: appReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer,
    auth: authReducer,
  },
})
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

export type AppThunkDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
