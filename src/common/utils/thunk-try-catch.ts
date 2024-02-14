import { AppRootStateType, AppThunkDispatch } from "app/store"
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk"
import { BaseResponseType } from "common/types"
import { appActions } from "app/app-reducer"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"

/**
 * Эта функция является переиспользуемой оберткой для thunk-функций, которая обрабатывает общую логику обработки ошибок и управление состоянием загрузки.
 * Она принимает объект `thunkAPI` и функцию `logic` в качестве аргументов.
 * Объект `thunkAPI` предоставляет доступ к функциям `dispatch` и `rejectWithValue`.
 * Функция `logic` представляет собой фактическую асинхронную логику, которую нужно выполнить.
 * Функция возвращает Promise, который разрешается с результатом выполнения функции `logic`
 * или отклоняется с значением, возвращенным функцией `thunkAPI.rejectWithValue`.
 *
 * @param thunkAPI - Объект, предоставляющий доступ к функциям `dispatch` и `rejectWithValue`.
 * @param logic - Асинхронная логика, которую нужно выполнить.
 * @returns Promise, который разрешается с результатом выполнения функции `logic`
 *           или отклоняется с значением, возвращенным функцией `thunkAPI.rejectWithValue`.
 */
export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppThunkDispatch, null | BaseResponseType>,
  logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI
  dispatch(appActions.setAppStatus({ status: "loading" }))
  try {
    return await logic()
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  } finally {
    dispatch(appActions.setAppStatus({ status: "idle" }))
  }
}
