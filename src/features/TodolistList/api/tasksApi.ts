import { instance } from "common/api"
import { AxiosResponse } from "axios"
import { BaseResponseType } from "common/types"
import { TaskPriorities, TaskStatuses } from "common/enum/enum"

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

//types

export type UpdateTaskType = {
  title: string
  description: string
  completed: boolean
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}

export type TaskType = {
  description: string
  title: string
  completed: boolean
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}

type ResponseTaskType = {
  items: TaskType[]
  totalCount: number
  error: string
}
