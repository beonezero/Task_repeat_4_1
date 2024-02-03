import { tasksReducer } from "../features/TodolistList/tasks-reducer"
import { todolistsReducer } from "../features/TodolistList/todolists-reducer"
import { AnyAction, combineReducers } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { appReducer } from "./app-reducer"
import { authReducer } from "../auth/auth-reducer"
import { configureStore, UnknownAction } from "@reduxjs/toolkit"

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  app: appReducer,
  tasks: tasksReducer,
  todolists: todolistsReducer,
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
export const useAppDispatch = () => useDispatch<AppThunkDispatch>()

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
