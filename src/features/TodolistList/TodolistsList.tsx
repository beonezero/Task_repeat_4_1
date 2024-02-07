import React, { useCallback, useEffect } from "react"
import Grid from "@mui/material/Grid"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import Paper from "@mui/material/Paper"
import { Todolist } from "./Todolist/Todolist"
import {
  createTodolistTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  todolistsActions,
  updateTodolistTC,
} from "features/TodolistList/todolistsSlice"
import { removeTaskTC, tasksThunks } from "features/TodolistList/tasksSlice"
import { Navigate } from "react-router-dom"
import { authSelectors } from "features/auth/auth.selectors"
import { todolistsSelectors } from "features/TodolistList/todolists.selectors"
import { tasksSelectors } from "features/TodolistList/Todolist/tasks.selectors"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { TaskStatuses } from "common/enum/enum"

export const TodolistsList = () => {
  const todolists = todolistsSelectors.useTodolists()
  const tasks = tasksSelectors.useTasks()
  const isLoggedIn = authSelectors.useIsLoggedIn()
  const dispatch = useAppDispatch()

  const removeTask = useCallback(function (id: string, todolistId: string) {
    dispatch(removeTaskTC(todolistId, id))
  }, [])

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(tasksThunks.addTask({ todolistId: todolistId, title: title }))
  }, [])

  const changeStatus = useCallback(function (id: string, isDone: boolean, todolistId: string) {
    dispatch(
      tasksThunks.updateTask({
        todolistId: todolistId,
        taskId: id,
        model: { status: isDone ? TaskStatuses.Completed : TaskStatuses.New },
      })
    )
  }, [])

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    dispatch(tasksThunks.updateTask({ todolistId: todolistId, taskId: id, model: { title: newTitle } }))
  }, [])

  const changeFilter = useCallback(function (filter: FilterValuesType, todolistId: string) {
    dispatch(todolistsActions.changeFilter({ todolistId: todolistId, filter: filter }))
  }, [])

  const removeTodolist = useCallback(function (id: string) {
    dispatch(removeTodolistTC(id))
  }, [])

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    dispatch(updateTodolistTC(id, title))
  }, [])

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(createTodolistTC(title))
    },
    [dispatch]
  )

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    dispatch(fetchTodolistsTC())
  }, [dispatch])
  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }
  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  id={tl.id}
                  entityStatus={tl.entityStatus}
                  title={tl.title}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  filter={tl.filter}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
