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
  const dispatch = useAppDispatch()
  const removeTodolistHandler = useCallback(function () {
    dispatch(todolistsThunks.removeTodolist(todolist.id))
  }, [])

  const changeTodolistTitleCallback = useCallback(function (title: string) {
    dispatch(todolistsThunks.updateTodolist({ todolistId: todolist.id, title }))
  }, [])
  return (
    <h3>
      <EditableSpan value={todolist.title} onChange={changeTodolistTitleCallback} />
      <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  )
}
