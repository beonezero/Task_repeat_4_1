import React, { useCallback } from "react"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import { TodolistDomainType } from "features/TodolistList/model/todolists/todolistsSlice"
import { TaskType } from "features/TodolistList/api/tasks/tasksApi.types"
import { tasksThunks } from "features/TodolistList/model/tasks/tasksSlice"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { FilterTasksButtons } from "features/TodolistList/ui/Todolist/FilterTasksButtons/FilterTasksButtons"
import { Tasks } from "features/TodolistList/ui/Todolist/Tasks/Tasks"
import { TodolistTitle } from "features/TodolistList/ui/Todolist/TodolistTitle/TodolistTitle"

type Type = {
  todolist: TodolistDomainType
  tasks: TaskType[]
}

export const Todolist = React.memo(({ todolist, tasks }: Type) => {
  const dispatch = useAppDispatch()

  const addTaskCallback = useCallback(
    (title: string) => {
      return dispatch(tasksThunks.addTask({ todolistId: todolist.id, title: title })).unwrap()
    },
    [todolist.id]
  )

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />
      <Tasks tasks={tasks} todolist={todolist} />
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todolist={todolist} />
      </div>
    </div>
  )
})
