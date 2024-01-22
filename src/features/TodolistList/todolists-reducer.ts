import {todolistApi, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {truncateSync} from "fs";

export type FilterValuesType = 'all' | 'active' | 'completed';

export type CreateTodolistType = ReturnType<typeof createTodolist>

export type SetTodolistsType = ReturnType<typeof setTodolists>

export type RemoveTodolistType = ReturnType<typeof removeTodolist>

export type UpdateTodolistType = ReturnType<typeof updateTodolist>

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

type ActionsType = CreateTodolistType | SetTodolistsType | RemoveTodolistType | UpdateTodolistType

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case "TODOLIST/SET-TODOLIST": {
            return action.todolists.map(td => ({...td, filter: "all"}))
        }
        case "TODOLIST/CREATE-TODOLIST":{
            return [{...action.todolist, filter: "all"}, ...state]
        }
        case "TODOLIST/REMOVE-TODOLIST": {
            return state.filter(td => td.id !== action.todolistId)
        }
        case "TODOLIST/UPDATE-TODOLIST": {
            return state.map(td => td.id === action.todolistId ? {...td, title: action.title}: td)
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

//thunks
export const fetchTodolistsTC = () => async(dispatch: Dispatch) => {
    const res = await todolistApi.getTodolist()
    try {
        dispatch(setTodolists(res.data))
    } catch (e){

    }
}

export const createTodolistTC = (title: string) => (dispatch: Dispatch) => {
    todolistApi.createTodolist(title)
        .then((res) => {
            dispatch(createTodolist(res.data.data.item))
        })
}

export const removeTodolistTC = (todolistId: string) => async (dispatch: Dispatch) => {
    const res = await todolistApi.deleteTodolist(todolistId)
    try {
        dispatch(removeTodolist(todolistId))
    } catch (e){

    }
}

export const updateTodolistTC = (todolistId: string, title: string) => async(dispatch: Dispatch) => {
    const res = await todolistApi.updateTodolist(todolistId, title)
    try {
        dispatch(updateTodolist(todolistId, title))
    } catch (e){

    }
}

