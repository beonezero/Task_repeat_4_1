import { AxiosResponse } from "axios"
import { BaseResponseType } from "common/types"
import { instance } from "common/api"
import { TodolistType } from "features/TodolistList/api/todolists/todolistsApi.types"

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
    return instance.delete<null, AxiosResponse<BaseResponseType>>(`todo-lists/{${todolistId}}`)
  },
  updateTodolist(todolistId: string, title: string) {
    return instance.put<null, AxiosResponse<BaseResponseType>, { title: string }>(`todo-lists/${todolistId}`, { title })
  },
}
