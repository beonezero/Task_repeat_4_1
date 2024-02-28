import React, { ChangeEvent, useCallback } from "react"
import { EditableSpan } from "common/components/EditableSpan/EditableSpan"
import { Delete } from "@mui/icons-material"
import IconButton from "@mui/material/IconButton"
import Checkbox from "@mui/material/Checkbox"
import { RequestStatusType } from "app/app-reducer"
import { TaskStatuses } from "common/enum/enum"
import { TaskType } from "features/TodolistList/api/tasks/tasksApi"

type TaskPropsType = {
  task: TaskType
  todolistId: string
  entityStatus: RequestStatusType
  changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  removeTask: (taskId: string, todolistId: string) => void
}
export const Task = React.memo((props: TaskPropsType) => {
  const onClickHandler = useCallback(
    () => props.removeTask(props.task.id, props.todolistId),
    [props.task.id, props.todolistId]
  )

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked
      props.changeTaskStatus(props.task.id, newIsDoneValue, props.todolistId)
    },
    [props.task.id, props.todolistId]
  )

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      props.changeTaskTitle(props.task.id, newValue, props.todolistId)
    },
    [props.task.id, props.todolistId]
  )

  return (
    <div key={props.task.id}>
      <Checkbox
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={onChangeHandler}
        disabled={props.entityStatus === "loading"}
      />

      <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
      <IconButton onClick={onClickHandler} disabled={props.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </div>
  )
})
