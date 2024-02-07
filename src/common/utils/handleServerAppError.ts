import { Dispatch } from "redux"
import { appActions } from "app/app-reducer"
import { ResponseType } from "common/types/types"

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }))
  } else {
    dispatch(appActions.setAppError({ error: "some error create todolist" }))
  }
  dispatch(appActions.setAppStatus({ status: "failed" }))
}
