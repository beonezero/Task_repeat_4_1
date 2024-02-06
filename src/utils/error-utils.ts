import { Dispatch } from "redux"
import { ResponseType } from "api/todolist-api"
import { appActions } from "app/app-reducer"
import { AppThunkDispatch } from "app/store"
import axios from "axios"

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }))
  } else {
    dispatch(appActions.setAppError({ error: "some error create todolist" }))
  }
  dispatch(appActions.setAppStatus({ status: "failed" }))
}
export const handleServerNetworkError = (err: unknown, dispatch: AppThunkDispatch): void => {
  let errorMessage = "Some error occurred"

  // ❗Проверка на наличие axios ошибки
  if (axios.isAxiosError(err)) {
    // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
    // ⏺️ err?.message - например при создании таски в offline режиме
    errorMessage = err.response?.data?.message || err?.message || errorMessage
    // ❗ Проверка на наличие нативной ошибки
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`
    // ❗Какой-то непонятный кейс
  } else {
    errorMessage = JSON.stringify(err)
  }

  dispatch(appActions.setAppError({ error: errorMessage }))
  dispatch(appActions.setAppStatus({ status: "failed" }))
}
