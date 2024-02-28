import React, { useCallback } from "react"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import { EditableSpan } from "common/components/EditableSpan/EditableSpan"
import IconButton from "@mui/material/IconButton"
import { Delete } from "@mui/icons-material"
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsThunks,
} from "features/TodolistList/model/todolists/todolistsSlice"
import { RequestStatusType } from "app/app-reducer"
import { TaskType } from "features/TodolistList/api/tasks/tasksApi.types"
import { tasksThunks } from "features/TodolistList/model/tasks/tasksSlice"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { FilterTasksButtons } from "features/TodolistList/ui/Todolist/FilterTasksButtons/FilterTasksButtons"
import { Tasks } from "features/TodolistList/ui/Todolist/Tasks/Tasks"

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

  return (
    <div>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitleCallback} />
        <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskCallback} disabled={entityStatus === "loading"} />
      <Tasks tasks={tasks} todolist={todolist} />
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todolist={todolist} />
      </div>
    </div>
  )
})
