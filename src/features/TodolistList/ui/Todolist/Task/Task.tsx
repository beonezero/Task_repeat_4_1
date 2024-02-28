import React, { ChangeEvent } from "react"
import { EditableSpan } from "common/components/EditableSpan/EditableSpan"
import { Delete } from "@mui/icons-material"
import IconButton from "@mui/material/IconButton"
import Checkbox from "@mui/material/Checkbox"
import { RequestStatusType } from "app/app-reducer"
import { TaskStatuses } from "common/enum/enum"
import { TaskType } from "features/TodolistList/api/tasks/tasksApi.types"
import { tasksThunks } from "features/TodolistList/model/tasks/tasksSlice"
import { useAppDispatch } from "common/hooks/useAppDispatch"

type TaskPropsType = {
  task: TaskType
  todolistId: string
  entityStatus: RequestStatusType
}
export const Task = React.memo((props: TaskPropsType) => {
  const dispatch = useAppDispatch()
  const removeTaskHandler = () => {
    dispatch(tasksThunks.removeTask({ todolistId: props.todolistId, taskId: props.task.id }))
  }
  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    dispatch(
      tasksThunks.updateTask({
        todolistId: props.todolistId,
        taskId: props.task.id,
        model: { status },
      })
    )
  }

  const changeTaskTitleHandler = (newValue: string) => {
    dispatch(
      tasksThunks.updateTask({
        todolistId: props.todolistId,
        taskId: props.task.id,
        model: { title: newValue },
      })
    )
  }

  return (
    <div key={props.task.id}>
      <Checkbox
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={changeTaskStatusHandler}
        disabled={props.entityStatus === "loading"}
      />

      <EditableSpan value={props.task.title} onChange={changeTaskTitleHandler} />
      <IconButton onClick={removeTaskHandler} disabled={props.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </div>
  )
})
