//types
import {LoginDataType} from "../features/Login/Login";
import {Dispatch} from "redux";
import {setAppStatus} from "../app/app-reducer";
import {authAPI} from "../api/todolist-api";
import {handleNetworkAppError, handleServerAppError} from "../utils/error-utils";

type InitialAuthStateType = {
    isLoggedIn: boolean
}

export type SetIsLoggedInStatusType = ReturnType<typeof setIsLoggedInStatus>

type ActionAuthType = SetIsLoggedInStatusType

const initialState: InitialAuthStateType = {
    isLoggedIn: false
}
export const authReducer = (state: InitialAuthStateType = initialState, action: ActionAuthType): InitialAuthStateType => {
    switch (action.type) {
        case "AUTH/SET-ISLOGGEDIN-STATUS": {
            return {...state, isLoggedIn: action.status}
        }
        default:
            return state
    }
}
export const setIsLoggedInStatus = (status: boolean) => ({type: "AUTH/SET-ISLOGGEDIN-STATUS", status}) as const

export const loginTC = (data: LoginDataType) => async (dispatch: Dispatch) => {
    setAppStatus("loading")
    try {
        const res = await authAPI.loginIn(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInStatus(true))
            dispatch(setAppStatus("succeeded"))
        } else handleServerAppError(res.data, dispatch)
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    }

}