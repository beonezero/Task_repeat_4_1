import React, { useCallback } from "react"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import { EditableSpan } from "common/components/EditableSpan/EditableSpan"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import { Delete } from "@mui/icons-material"
import { Task } from "features/TodolistList/ui/Todolist/Task/Task"
import { FilterValuesType } from "features/TodolistList/model/todolists/todolistsSlice"
import { RequestStatusType } from "app/app-reducer"
import { TaskStatuses } from "common/enum/enum"
import { TaskType } from "features/TodolistList/api/tasks/tasksApi.types"
import { tasksThunks } from "features/TodolistList/model/tasks/tasksSlice"
import { useAppDispatch } from "common/hooks/useAppDispatch"

type Type = {
  id: string
  title: string
  tasks: TaskType[]
  changeFilter: (value: FilterValuesType, todolistId: string) => void
  removeTodolist: (id: string) => void
  changeTodolistTitle: (id: string, newTitle: string) => void
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

export const Todolist = React.memo(
  ({ removeTodolist, filter, title, id, entityStatus, tasks, changeTodolistTitle, changeFilter }: Type) => {
    const dispatch = useAppDispatch()
    const addTask = useCallback((title: string) => {
      dispatch(tasksThunks.addTask({ todolistId: id, title: title }))
    }, [])

    const removeTodolistHandler = () => {
      removeTodolist(id)
    }
    const changeTodolistTitleHandler = useCallback(
      (title: string) => {
        changeTodolistTitle(id, title)
      },
      [id, changeTodolistTitle]
    )

    const onAllClickHandler = useCallback(() => changeFilter("all", id), [id, changeFilter])
    const onActiveClickHandler = useCallback(() => changeFilter("active", id), [id, changeFilter])
    const onCompletedClickHandler = useCallback(() => changeFilter("completed", id), [id, changeFilter])

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
          <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
          <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
            <Delete />
          </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={entityStatus === "loading"} />
        <div>
          {tasksForTodolist.map((t) => (
            <Task key={t.id} task={t} todolistId={id} entityStatus={entityStatus} />
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
  }
)
