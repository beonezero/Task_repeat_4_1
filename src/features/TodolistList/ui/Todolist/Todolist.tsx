import React, { useCallback } from "react"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import { EditableSpan } from "common/components/EditableSpan/EditableSpan"
import IconButton from "@mui/material/IconButton"
import { Delete } from "@mui/icons-material"
import { Task } from "features/TodolistList/ui/Todolist/Task/Task"
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
  todolistsThunks,
} from "features/TodolistList/model/todolists/todolistsSlice"
import { RequestStatusType } from "app/app-reducer"
import { TaskStatuses } from "common/enum/enum"
import { TaskType } from "features/TodolistList/api/tasks/tasksApi.types"
import { tasksThunks } from "features/TodolistList/model/tasks/tasksSlice"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { FilterTasksButtons } from "features/TodolistList/ui/Todolist/FilterTasksButtons/FilterTasksButtons"

type Type = {
  todolist: TodolistDomainType
  todolistId: string
  title: string
  tasks: TaskType[]
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

export const Todolist = React.memo(({ todolist, filter, title, todolistId, entityStatus, tasks }: Type) => {
  const dispatch = useAppDispatch()

  const addTaskCallback = useCallback(
    (title: string) => {
      dispatch(tasksThunks.addTask({ todolistId, title: title }))
    },
    [todolistId]
  )

  const removeTodolistHandler = useCallback(function () {
    dispatch(todolistsThunks.removeTodolist(todolistId))
  }, [])

  const changeTodolistTitleCallback = useCallback(function (title: string) {
    dispatch(todolistsThunks.updateTodolist({ todolistId, title }))
  }, [])

  let tasksForTodolist = tasks

  if (filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <div>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitleCallback} />
        <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskCallback} disabled={entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task key={t.id} task={t} todolistId={todolistId} entityStatus={entityStatus} />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todolist={todolist} />
      </div>
    </div>
  )
})
