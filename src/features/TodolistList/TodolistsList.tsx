import React, { useCallback, useEffect } from "react"
import Grid from "@mui/material/Grid"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import Paper from "@mui/material/Paper"
import { Todolist } from "./Todolist/Todolist"
import { FilterValuesType, todolistsActions, todolistsThunks } from "features/TodolistList/todolists-reducer"
import { tasksThunks } from "features/TodolistList/tasks-reducer"
import { Navigate } from "react-router-dom"
import { authSelectors } from "features/auth/auth.selectors"
import { todolistsSelectors } from "features/TodolistList/todolists-selectors"
import { tasksSelectors } from "features/TodolistList/Todolist/tasks.selectors"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { TaskStatuses } from "common/enum/enum"

export const TodolistsList = () => {
  const todolists = todolistsSelectors.useTodolists()
  const tasks = tasksSelectors.useTasks()
  const isLoggedIn = authSelectors.useIsLoggedIn()
  const dispatch = useAppDispatch()

  const removeTask = useCallback(function (taskId: string, todolistId: string) {
    dispatch(tasksThunks.removeTask({ todolistId: todolistId, taskId: taskId }))
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

  const removeTodolist = useCallback(function (todolistId: string) {
    dispatch(todolistsThunks.removeTodolist(todolistId))
  }, [])

  const changeTodolistTitle = useCallback(function (todolistId: string, title: string) {
    dispatch(todolistsThunks.updateTodolist({ todolistId, title }))
  }, [])

  const addTodolist = useCallback(
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
