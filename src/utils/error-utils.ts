import {Dispatch} from "redux";
import {setAppError, setAppStatus} from "../app/app-reducer";
import {ResponseType} from "../api/todolist-api";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length){
        dispatch(setAppError(data.messages[0]))
    } else {
        dispatch(setAppError("some error create todolist"))
    }
    dispatch(setAppStatus("failed"))
};

export const handleNetworkAppError = (error: unknown, dispatch: Dispatch) => {
    let errorMessage: string
    errorMessage = (error as {message: string}).message
    dispatch(setAppError(errorMessage))
    dispatch(setAppStatus("failed"))
}
