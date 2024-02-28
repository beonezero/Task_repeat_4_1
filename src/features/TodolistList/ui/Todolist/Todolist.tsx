import React, { useCallback } from "react"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import { EditableSpan } from "common/components/EditableSpan/EditableSpan"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import { Delete } from "@mui/icons-material"
import { Task } from "features/TodolistList/ui/Todolist/Task/Task"
import {
  FilterValuesType,
  todolistsActions,
  todolistsThunks,
} from "features/TodolistList/model/todolists/todolistsSlice"
import { RequestStatusType } from "app/app-reducer"
import { TaskStatuses } from "common/enum/enum"
import { TaskType } from "features/TodolistList/api/tasks/tasksApi.types"
import { tasksThunks } from "features/TodolistList/model/tasks/tasksSlice"
import { useAppDispatch } from "common/hooks/useAppDispatch"

type Type = {
  todolistId: string
  title: string
  tasks: TaskType[]
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

export const Todolist = React.memo(({ filter, title, todolistId, entityStatus, tasks }: Type) => {
  const dispatch = useAppDispatch()

  const addTaskCallback = useCallback(
    (title: string) => {
      dispatch(tasksThunks.addTask({ todolistId, title: title }))
    },
    [todolistId]
  )

  const changeFilterHandler = useCallback(function (filter: FilterValuesType) {
    dispatch(todolistsActions.changeFilter({ todolistId, filter: filter }))
  }, [])

  const removeTodolistHandler = useCallback(function () {
    dispatch(todolistsThunks.removeTodolist(todolistId))
  }, [])

  const changeTodolistTitleCallback = useCallback(function (title: string) {
    dispatch(todolistsThunks.updateTodolist({ todolistId, title }))
  }, [])

  const onAllClickHandler = useCallback(() => changeFilterHandler("all"), [changeFilterHandler])
  const onActiveClickHandler = useCallback(() => changeFilterHandler("active"), [changeFilterHandler])
  const onCompletedClickHandler = useCallback(() => changeFilterHandler("completed"), [changeFilterHandler])

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
        <Button variant={filter === "all" ? "outlined" : "text"} onClick={onAllClickHandler} color={"inherit"}>
          All
        </Button>
        <Button variant={filter === "active" ? "outlined" : "text"} onClick={onActiveClickHandler} color={"primary"}>
          Active
        </Button>
        <Button
          variant={filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  )
})
