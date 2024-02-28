import { TaskPriorities, TaskStatuses } from "common/enum/enum"

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

export type ResponseTaskType = {
  items: TaskType[]
  totalCount: number
  error: string
}
