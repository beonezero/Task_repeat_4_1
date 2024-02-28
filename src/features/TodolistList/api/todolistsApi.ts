import { AxiosResponse } from "axios"
import { BaseResponseType } from "common/types"
import { instance } from "common/api"

export const todolistsApi = {
  getTodolist() {
    return instance.get<TodolistType[]>("todo-lists")
  },
  createTodolist(title: string) {
    return instance.post<
      null,
      AxiosResponse<BaseResponseType<{ item: TodolistType }>>,
      {
        title: string
      }
    >("todo-lists", { title })
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<BaseResponseType>(`todo-lists/{${todolistId}}`)
  },
  updateTodolist(todolistId: string, title: string) {
    return instance.put<null, AxiosResponse<BaseResponseType>, { title: string }>(`todo-lists/${todolistId}`, { title })
  },
}

//types

export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
