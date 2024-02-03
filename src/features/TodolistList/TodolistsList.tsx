import React, { useCallback, useEffect } from "react"
import Grid from "@mui/material/Grid"
import { AddItemForm } from "components/AddItemForm/AddItemForm"
import Paper from "@mui/material/Paper"
import { Todolist } from "./Todolist/Todolist"
import { useAppDispatch, useAppSelector } from "app/store"
import {
  createTodolistTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType,
  todolistsActions,
  updateTodolistTC,
} from "./todolists-reducer"
import { addTaskTC, removeTaskTC, TasksStateType, updateTaskTC } from "./tasks-reducer"
import { TaskStatuses } from "api/todolist-api"
import { Navigate } from "react-router-dom"
import { authSelectors } from "auth/auth.selectors"

export const TodolistsList = () => {
  const todolists = useAppSelector<Array<TodolistDomainType>>((state) => state.todolists)
  const tasks = useAppSelector<TasksStateType>((state) => state.tasks)
  const isLoggedIn = authSelectors.useIsLoggedIn()
  const dispatch = useAppDispatch()

  const removeTask = useCallback(function (id: string, todolistId: string) {
    dispatch(removeTaskTC(todolistId, id))
  }, [])

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(addTaskTC(todolistId, title))
  }, [])

  const changeStatus = useCallback(function (id: string, isDone: boolean, todolistId: string) {
    dispatch(updateTaskTC(todolistId, id, { status: isDone ? TaskStatuses.Completed : TaskStatuses.New }))
  }, [])

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    dispatch(updateTaskTC(todolistId, id, { title: newTitle }))
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
