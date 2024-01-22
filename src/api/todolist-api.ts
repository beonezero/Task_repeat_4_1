import axios, {AxiosResponse} from "axios";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true
})

export const todolistApi = {
    getTodolist () {
        return instance.get<TodolistType[]>("todo-lists")
    },
    createTodolist(title: string){
        return instance.post<null, AxiosResponse<ResponseType<{item: TodolistType}>>, {title: string}>("todo-lists", {title})
    },
    deleteTodolist (todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/{${todolistId}}`)
    },
    updateTodolist (todolistId: string, title: string){
        return instance.put<null, ResponseType<ResponseType>, {title: string}>(`todo-lists/{${todolistId}}`, {title})
    }
}

// types

type ResponseType<T = {}> = {
    resultCode: number
    messages: string[],
    data: T
}

export type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}