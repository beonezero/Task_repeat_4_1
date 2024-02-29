import { EditableSpan } from "common/components/EditableSpan/EditableSpan"
import IconButton from "@mui/material/IconButton"
import { Delete } from "@mui/icons-material"
import React, { useCallback } from "react"
import { TodolistDomainType, todolistsThunks } from "features/TodolistList/model/todolists/todolistsSlice"
import { useAppDispatch } from "common/hooks/useAppDispatch"

type Props = {
  todolist: TodolistDomainType
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, entityStatus, title } = todolist
  const dispatch = useAppDispatch()
  const removeTodolistHandler = useCallback(function () {
    dispatch(todolistsThunks.removeTodolist(id))
  }, [])

  const changeTodolistTitleCallback = useCallback(function (title: string) {
    dispatch(todolistsThunks.updateTodolist({ todolistId: id, title }))
  }, [])
  return (
    <h3>
      <EditableSpan value={title} onChange={changeTodolistTitleCallback} />
      <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  )
}
