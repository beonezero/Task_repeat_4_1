import { instance } from "common/api"
import { AxiosResponse } from "axios"
import { BaseResponseType } from "common/types"
import { ResponseTaskType, TaskType, UpdateTaskType } from "features/TodolistList/api/tasks/tasksApi.types"

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<null, AxiosResponse<ResponseTaskType>>(`todo-lists/${todolistId}/tasks`)
  },
  createTask(todolistId: string, title: string) {
    return instance.post<
      null,
      AxiosResponse<BaseResponseType<{ item: TaskType }>>,
      {
        title: string
      }
    >(`todo-lists/${todolistId}/tasks`, { title })
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<null, AxiosResponse<BaseResponseType>>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskType) {
    return instance.put<
      null,
      AxiosResponse<
        BaseResponseType<{
          item: TaskType
        }>
      >,
      UpdateTaskType
    >(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}
