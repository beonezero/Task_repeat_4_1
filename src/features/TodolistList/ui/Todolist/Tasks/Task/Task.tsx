import React, { ChangeEvent } from "react"
import { EditableSpan } from "common/components/EditableSpan/EditableSpan"
import { Delete } from "@mui/icons-material"
import IconButton from "@mui/material/IconButton"
import Checkbox from "@mui/material/Checkbox"
import { RequestStatusType } from "app/appSlice"
import { TaskStatuses } from "common/enum/enum"
import { TaskType } from "features/TodolistList/api/tasks/tasksApi.types"
import { tasksThunks } from "features/TodolistList/model/tasks/tasksSlice"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import s from "features/TodolistList/ui/Todolist/Tasks/Task/task.module.css"

type Props = {
  task: TaskType
  todolistId: string
  entityStatus: RequestStatusType
}
export const Task = React.memo(({ task, todolistId, entityStatus }: Props) => {
  const dispatch = useAppDispatch()
  const removeTaskHandler = () => {
    dispatch(tasksThunks.removeTask({ todolistId, taskId: task.id }))
  }
  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    dispatch(
      tasksThunks.updateTask({
        todolistId,
        taskId: task.id,
        model: { status },
      })
    )
  }

  const changeTaskTitleHandler = (title: string) => {
    dispatch(
      tasksThunks.updateTask({
        todolistId,
        taskId: task.id,
        model: { title },
      })
    )
  }

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ""}>
      <Checkbox
        checked={task.status === TaskStatuses.Completed}
        color="primary"
        onChange={changeTaskStatusHandler}
        disabled={entityStatus === "loading"}
      />

      <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
      <IconButton onClick={removeTaskHandler} disabled={entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </div>
  )
})
