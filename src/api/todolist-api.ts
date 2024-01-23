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
        return instance.put<null, ResponseType<ResponseType>, {title: string}>(`todo-lists/${todolistId}`, {title})
    },
    getTasks (todolistId: string) {
        return instance.get<null, AxiosResponse<ResponseTaskType>>(`todo-lists/${todolistId}/tasks`)
    },
    createTask (todolistId: string, title: string) {
       return instance.post<null, AxiosResponse<ResponseType<{item: TaskType}>>, {title: string}>(`todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask (todolistId: string, taskId: string) {
       return instance.delete<null, AxiosResponse<ResponseType>>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskType){
        return instance.put<null, AxiosResponse<ResponseType<{item: TaskType}>>, UpdateTaskType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
}

// types

type ResponseType<T = {}> = {
    resultCode: number
    messages: string[],
    data: T
}

type ResponseTaskType = {
    items: TaskType[]
    totalCount: number
    error: string
}

export type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

export type UpdateTaskType = {
    title: string
    description: string
    completed: boolean
    status: TaskStatuses
    priority: number
    startDate: string
    deadline: string
}

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: TaskStatuses
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}