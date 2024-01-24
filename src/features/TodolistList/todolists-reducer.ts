import {todolistApi, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, SetAppErrorType, setAppStatus, SetAppStatusType} from "../../app/app-reducer";
import {handleNetworkAppError, handleServerAppError} from "../../utils/error-utils";

// types

export type FilterValuesType = 'all' | 'active' | 'completed';

export type CreateTodolistType = ReturnType<typeof createTodolist>

export type SetTodolistsType = ReturnType<typeof setTodolists>

export type RemoveTodolistType = ReturnType<typeof removeTodolist>

export type UpdateTodolistType = ReturnType<typeof updateTodolist>

export type ChangeEntityStatusType = ReturnType<typeof changeEntityStatus>

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

type ActionsType = CreateTodolistType | SetTodolistsType | RemoveTodolistType | UpdateTodolistType
    | ReturnType<typeof changeFilterAC> | ChangeEntityStatusType

type TodolistThunkDispatchType = Dispatch<SetAppStatusType | SetAppErrorType | ActionsType>

// reducer
const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case "TODOLIST/SET-TODOLIST": {
            return action.todolists.map(td => ({...td, filter: "all", entityStatus: "idle"}))
        }
        case "TODOLIST/CREATE-TODOLIST": {
            return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
        }
        case "TODOLIST/REMOVE-TODOLIST": {
            return state.filter(td => td.id !== action.todolistId)
        }
        case "TODOLIST/UPDATE-TODOLIST": {
            return state.map(td => td.id === action.todolistId ? {...td, title: action.title} : td)
        }
        case "TODOLIST/CHANGE-FILTER": {
            return state.map(td => td.id === action.todolistId ? {...td, filter: action.filter} : td)
        }
        case "TODOLIST/CHANGE-ENTITY-STATUS": {
            return state.map(td => td.id === action.todolistId ? {...td, entityStatus: action.status} : td)
        }
        default:
            return state;
    }
}

//actions
export const createTodolist = (todolist: TodolistType) => (
    {type: 'TODOLIST/CREATE-TODOLIST', todolist}) as const

export const setTodolists = (todolists: TodolistType[]) => (
    {type: "TODOLIST/SET-TODOLIST", todolists}) as const

export const removeTodolist = (todolistId: string) => (
    {type: "TODOLIST/REMOVE-TODOLIST", todolistId}) as const

export const updateTodolist = (todolistId: string, title: string) => (
    {type: "TODOLIST/UPDATE-TODOLIST", todolistId, title}) as const

export const changeFilterAC = (todolistId: string, filter: FilterValuesType) =>
    ({type: "TODOLIST/CHANGE-FILTER", todolistId, filter}) as const

export const changeEntityStatus = (todolistId: string, status: RequestStatusType) =>
    ({type: "TODOLIST/CHANGE-ENTITY-STATUS", todolistId, status}) as const

//thunks
export const fetchTodolistsTC = () => async (dispatch: TodolistThunkDispatchType) => {
    dispatch(setAppStatus("loading"))
    try {
        const res = await todolistApi.getTodolist()
        dispatch(setTodolists(res.data))
        dispatch(setAppStatus("succeeded"))
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    }
}

export const createTodolistTC = (title: string) => async (dispatch: TodolistThunkDispatchType) => {
    dispatch(setAppStatus("loading"))
    try {
        const res = await todolistApi.createTodolist(title)
                if (res.data.resultCode === 0) {
                    dispatch(createTodolist(res.data.data.item))
                    dispatch(setAppStatus("succeeded"))
                } else {
                    handleServerAppError<{item: TodolistType}>(res.data, dispatch)
                }
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    }
}

export const removeTodolistTC = (todolistId: string) => async (dispatch: TodolistThunkDispatchType) => {
    dispatch(setAppStatus("loading"))
    dispatch(changeEntityStatus(todolistId, "loading"))
    try {
        await todolistApi.deleteTodolist(todolistId)
        dispatch(removeTodolist(todolistId))
        dispatch(setAppStatus("succeeded"))
    } catch (e) {
        dispatch(changeEntityStatus(todolistId, "failed"))
        handleNetworkAppError(e, dispatch)
    }
}

export const updateTodolistTC = (todolistId: string, title: string) => async (dispatch: TodolistThunkDispatchType) => {
    dispatch(setAppStatus("loading"))
    try {
        await todolistApi.updateTodolist(todolistId, title)
        dispatch(updateTodolist(todolistId, title))
        dispatch(setAppStatus("succeeded"))
    } catch (e) {
        handleNetworkAppError(e, dispatch)
    }
}

