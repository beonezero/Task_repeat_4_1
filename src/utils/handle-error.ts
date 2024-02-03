import { isAxiosError } from "axios"
import { Dispatch } from "redux"
import { appActions } from "app/app-reducer"

export const handleError = (e: unknown, dispatch: Dispatch) => {
  let errorMessage: string
  if (isAxiosError<ServerError>(e)) {
    errorMessage = e.response ? e.response.data.errorMessages[0].message : e.message
  } else {
    errorMessage = (e as Error).message
  }
  dispatch(appActions.setAppError({ error: errorMessage }))
}

interface ServerError {
  errorMessages: Array<{ field: string; message: string }>
}
