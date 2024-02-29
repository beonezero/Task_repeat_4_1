import { Dispatch } from "redux"
import { appActions } from "app/appSlice"
import { BaseResponseType } from "common/types/common.types"

/**
 * Обработка ошибок, полученных от сервера.
 * @param data - Данные ошибки от сервера.
 * @param dispatch - Функция dispatch для обновления состояния приложения.
 * @param showError - Флаг, определяющий, нужно ли показывать сообщение об ошибке (по умолчанию true).
 */

export const handleServerAppError = <T>(data: BaseResponseType<T>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "some error create todolist" }))
  }
  dispatch(appActions.setAppStatus({ status: "failed" }))
}
