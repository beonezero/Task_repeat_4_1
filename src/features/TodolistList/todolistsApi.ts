import { AxiosResponse } from "axios"
import { ResponseType } from "common/types/types"
import { instance } from "common/api"

export const todolistsApi = {
  getTodolist() {
    return instance.get<TodolistType[]>("todo-lists")
  },
  createTodolist(title: string) {
    return instance.post<
      null,
      AxiosResponse<ResponseType<{ item: TodolistType }>>,
      {
        title: string
      }
    >("todo-lists", { title })
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`todo-lists/{${todolistId}}`)
  },
  updateTodolist(todolistId: string, title: string) {
    return instance.put<null, AxiosResponse<ResponseType>, { title: string }>(`todo-lists/${todolistId}`, { title })
  },
}

//types

export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
