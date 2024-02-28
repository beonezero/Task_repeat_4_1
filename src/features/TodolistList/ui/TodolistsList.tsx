import React, { useCallback, useEffect } from "react"
import Grid from "@mui/material/Grid"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import Paper from "@mui/material/Paper"
import { Todolist } from "features/TodolistList/ui/Todolist/Todolist"
import { todolistsThunks } from "features/TodolistList/model/todolists/todolistsSlice"
import { tasksThunks } from "features/TodolistList/model/tasks/tasksSlice"
import { Navigate } from "react-router-dom"
import { authSelectors } from "features/auth/model/auth.selectors"
import { todolistsSelectors } from "features/TodolistList/model/todolists/todolistsSelectors"
import { tasksSelectors } from "features/TodolistList/ui/Todolist/Tasks/Task/tasks.selectors"
import { useAppDispatch } from "common/hooks/useAppDispatch"

export const TodolistsList = () => {
  const todolists = todolistsSelectors.useTodolists()
  const tasks = tasksSelectors.useTasks()
  const isLoggedIn = authSelectors.useIsLoggedIn()
  const dispatch = useAppDispatch()

  const addTodolistCallback = useCallback(
    (title: string) => {
      dispatch(todolistsThunks.addTodolist(title))
    },
    [dispatch]
  )

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    dispatch(todolistsThunks.fetchTodolists())
      .unwrap()
      .then((res) => {
        res.todolists.forEach((tl) => {
          dispatch(tasksThunks.fetchTasks(tl.id))
        })
      })
  }, [dispatch])
  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }
  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist todolist={tl} tasks={allTodolistTasks} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
