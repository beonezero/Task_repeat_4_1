import { Task } from "features/TodolistList/ui/Todolist/Tasks/Task/Task"
import React from "react"
import { TaskStatuses } from "common/enum/enum"
import { TaskType } from "features/TodolistList/api/tasks/tasksApi.types"
import { TodolistDomainType } from "features/TodolistList/model/todolists/todolistsSlice"

type Props = {
  tasks: TaskType[]
  todolist: TodolistDomainType
}

export const Tasks = ({ todolist, tasks }: Props) => {
  let tasksForTodolist = tasks

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }
  return (
    <>
      {tasksForTodolist.map((t) => (
        <Task key={t.id} task={t} todolistId={todolist.id} entityStatus={todolist.entityStatus} />
      ))}
    </>
  )
}
