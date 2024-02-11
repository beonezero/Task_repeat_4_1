import { tasksReducer } from "features/TodolistList/tasks-reducer"
import { todolistsReducer } from "features/TodolistList/todolists-reducer"
import { AnyAction, combineReducers } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import { appReducer } from "./app-reducer"
import { authReducer } from "features/auth/auth-reducer"
import { configureStore } from "@reduxjs/toolkit"

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
// непосредственно создаём store
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

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction> // fix type !!!
// store.dispatch

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
