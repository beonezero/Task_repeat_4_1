import { Dispatch } from "redux"
import { ResponseType } from "api/todolist-api"
import { appActions } from "app/app-reducer"

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }))
  } else {
    dispatch(appActions.setAppError({ error: "some error create todolist" }))
  }
  dispatch(appActions.setAppStatus({ status: "failed" }))
}

export const handleNetworkAppError = (error: unknown, dispatch: Dispatch) => {
  let errorMessage: string
  errorMessage = (error as { message: string }).message
  dispatch(appActions.setAppError({ error: errorMessage }))
  dispatch(appActions.setAppStatus({ status: "failed" }))
}
