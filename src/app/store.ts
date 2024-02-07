import { tasksSlice } from "features/TodolistList/tasksSlice"
import { todolistsSlice } from "features/TodolistList/todolistsSlice"
import { AnyAction, combineReducers } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import { appReducer } from "./app-reducer"
import { authReducer } from "features/auth/auth-reducer"
import { configureStore, UnknownAction } from "@reduxjs/toolkit"

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  app: appReducer,
  tasks: tasksSlice,
  todolists: todolistsSlice,
  auth: authReducer,
})
// непосредственно создаём store
export const store = configureStore({
  reducer: rootReducer,
})
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
