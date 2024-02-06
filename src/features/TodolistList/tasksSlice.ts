import { TaskStatuses, TaskType, todolistApi, UpdateTaskType } from "api/todolist-api"
import { AppRootStateType, AppThunk } from "app/store"
import { handleNetworkAppError, handleServerAppError } from "utils/error-utils"
import { appActions } from "app/app-reducer"
import { todolistsActions } from "features/TodolistList/todolistsSlice"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"

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

const fetchTask = createAppAsyncThunk<
  {
    todolistId: string
    tasks: TaskType[]
  },
  string
>("tasks/fetchTasks", async (todolistId: string, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  dispatch(appActions.setAppStatus({ status: "loading" }))
  try {
    const res = await todolistApi.getTasks(todolistId)
    dispatch(appActions.setAppStatus({ status: "succeeded" }))
    return { todolistId: todolistId, tasks: res.data.items }
  } catch (e) {
    handleNetworkAppError(e, dispatch)
    return rejectWithValue(null)
  }
})

export const tasksThunks = {
  fetchTaskTC: fetchTask,
}

// reducer

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    },
    removeTask: (state, action: PayloadAction<{ todolistId: string; taskId: string }>) => {
      const indexTask = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId)
      if (indexTask !== -1) {
        state[action.payload.todolistId].splice(indexTask, 1)
      }
    },
    updateTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      const indexTask = state[action.payload.task.todoListId].findIndex((t) => t.id === action.payload.task.id)
      if (indexTask !== -1) {
        state[action.payload.task.todoListId].splice(indexTask, 1, action.payload.task)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((td) => {
          state[td.id] = []
        })
      })
      .addCase(todolistsActions.createTodolist, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(todolistsActions.clearState, () => {
        return {}
      })
  },
})

export const tasksSlice = slice.reducer
export const tasksActions = slice.actions

export const { fetchTaskTC } = tasksThunks
//thunks

export const addTaskTC =
  (todolistId: string, title: string): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "loading" }))
    try {
      const res = await todolistApi.createTask(todolistId, title)
      if (res.data.resultCode === 0) {
        dispatch(tasksActions.addTask({ task: res.data.data.item }))
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "succeeded" }))
      } else {
        handleServerAppError<{ item: TaskType }>(res.data, dispatch)
        dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "failed" }))
      }
    } catch (e) {
      dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "failed" }))
      handleNetworkAppError(e, dispatch)
    }
  }

export const removeTaskTC =
  (todolistId: string, taskId: string): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "loading" }))
    try {
      await todolistApi.deleteTask(todolistId, taskId)
      dispatch(tasksActions.removeTask({ todolistId: todolistId, taskId: taskId }))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "succeeded" }))
    } catch (e) {
      handleNetworkAppError(e, dispatch)
      dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "failed" }))
    }
  }
export const updateTaskTC =
  (todolistId: string, taskId: string, model: domainTaskType): AppThunk =>
  async (dispatch, getState: () => AppRootStateType) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const state = getState()
      const task = state.tasks[todolistId].find((t) => t.id === taskId)
      if (task) {
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
        const res = await todolistApi.updateTask(todolistId, taskId, modelApi)
        if (res.data.resultCode === 0) {
          dispatch(tasksActions.updateTask({ task: res.data.data.item }))
          dispatch(appActions.setAppStatus({ status: "succeeded" }))
        } else {
          handleServerAppError<{ item: TaskType }>(res.data, dispatch)
        }
      }
    } catch (e) {
      handleNetworkAppError(e, dispatch)
    }
  }
