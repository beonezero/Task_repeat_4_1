
const initialState: InitialAppStateType = {
    isInitialized: false,
    status: "idle",
    error: null
}
export const appReducer = (state: InitialAppStateType = initialState, action: AppActionsType): InitialAppStateType => {
    switch (action.type){
        case "APP/SET-STATUS": {
            return {...state, status: action.status}
        }
        case "APP/SET-ERROR": {
            return {...state, error: action.error}
        }
        case "APP/SET-IS_INITIALIZED": {
            return {...state, isInitialized: action.isInitialized}
        }
        default: {
            return state
        }
    }
}

//actions

export const setAppStatus = (status: RequestStatusType) => ({type: "APP/SET-STATUS", status}) as const
export const setAppError = (error: null | string) => ({type: "APP/SET-ERROR", error}) as const
export const setIsInitialized = (isInitialized: boolean) => ({type: "APP/SET-IS_INITIALIZED", isInitialized}) as const

//types

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

type InitialAppStateType = {
    isInitialized: boolean
    status: RequestStatusType,
    error: null | string
}

export type SetAppStatusType = ReturnType<typeof setAppStatus>
export type SetAppErrorType = ReturnType<typeof setAppError>
export type SetAppIsInitialized = ReturnType<typeof setIsInitialized>

export type AppActionsType = SetAppStatusType | SetAppErrorType | SetAppIsInitialized