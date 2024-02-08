import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { appActions } from "app/app-reducer"
import { todolistsActions, todolistsThunks } from "features/TodolistList/todolists-reducer"
import { createSlice } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"
import { TaskStatuses } from "common/enum/enum"
import { handleServerAppError } from "common/utils"
import { tasksApi, TaskType, UpdateTaskType } from "features/TodolistList/Todolist/tasksApi"

//types

export type TasksStateType = {
  [key: string]: TaskType[]
}

export type domainTaskType = {
  title?: string
  description?: string
  completed?: boolean
  status?: TaskStatuses
  priority?: number
  startDate?: string
  deadline?: string
}

//thunks

const fetchTasks = createAppAsyncThunk<{ todolistId: string; tasks: TaskType[] }, string>(
  "tasks/fetchTasks",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      const res = await tasksApi.getTasks(todolistId)
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { todolistId: todolistId, tasks: res.data.items }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  }
)

const addTask = createAppAsyncThunk<{ task: TaskType }, { todolistId: string; title: string }>(
  "tasks/addTask",
  async ({ todolistId, title }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "loading" }))
      const res = await tasksApi.createTask(todolistId, title)
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "succeeded" }))
        return { task: res.data.data.item }
      } else {
        handleServerAppError<{ item: TaskType }>(res.data, dispatch)
        dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "failed" }))
        return rejectWithValue(null)
      }
    } catch (e) {
      dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "failed" }))
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  }
)

const updateTask = createAppAsyncThunk<
  { task: TaskType },
  { todolistId: string; taskId: string; model: domainTaskType }
>("tasks/updateTask", async ({ todolistId, taskId, model }, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    const state = getState()
    const task = state.tasks[todolistId].find((t) => t.id === taskId)
    if (!task) {
      console.warn("task not found in the state")
      return rejectWithValue(null)
    }
    const modelApi: UpdateTaskType = {
      title: task.title,
      description: task.description,
      completed: task.completed,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...model,
    }
    const res = await tasksApi.updateTask(todolistId, taskId, modelApi)
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      const task = res.data.data.item
      return { task }
    } else {
      handleServerAppError<{ item: TaskType }>(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})

const removeTask = createAppAsyncThunk<{ todolistId: string; taskId: string }, { todolistId: string; taskId: string }>(
  "tasks/removeTask",
  async ({ todolistId, taskId }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "loading" }))
      await tasksApi.deleteTask(todolistId, taskId)
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "succeeded" }))
      return { todolistId: todolistId, taskId: taskId }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "failed" }))
      return rejectWithValue(null)
    }
  }
)

// reducers1

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(removeTask.fulfilled, (state, action) => {
        const indexTask = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId)
        if (indexTask !== -1) {
          state[action.payload.todolistId].splice(indexTask, 1)
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const indexTask = state[action.payload.task.todoListId].findIndex((t) => t.id === action.payload.task.id)
        if (indexTask !== -1) {
          state[action.payload.task.todoListId].splice(indexTask, 1, action.payload.task)
        }
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task)
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((td) => {
          state[td.id] = []
        })
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(todolistsActions.clearState, () => {
        return {}
      })
  },
})

export const tasksReducer = slice.reducer
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask }
