import { TaskStatuses, TaskType, todolistApi, UpdateTaskType } from "api/todolist-api"
import { AppRootStateType, AppThunk } from "app/store"
import { handleNetworkAppError, handleServerAppError } from "utils/error-utils"
import { appActions } from "app/app-reducer"
import { todolistsActions } from "features/TodolistList/todolists-reducer"

//types

export type TasksStateType = {
  [key: string]: Array<TaskType>
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

// reducer

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case "TASK/SET-TASK": {
      return { ...state, [action.todolistId]: action.tasks }
    }
    case "TASK/REMOVE-TASK": {
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter((t) => t.id !== action.taskId),
      }
    }
    case "TASK/ADD-TASK": {
      return {
        ...state,
        [action.task.todoListId]: [action.task, ...state[action.task.todoListId]],
      }
    }
    case "TASK/UPDATE-TASK": {
      return {
        ...state,
        [action.task.todoListId]: state[action.task.todoListId].map((t) =>
          t.id === action.task.id ? { ...action.task } : t
        ),
      }
    }
    case "TODOLIST/SET-TODOLIST": {
      const copyState = { ...state }
      action.todolists.forEach((td) => {
        copyState[td.id] = []
      })
      return copyState
    }
    case "TODOLIST/REMOVE-TODOLIST": {
      const copyState = { ...state }
      delete copyState[action.todolistId]
      return copyState
    }
    case "TODOLIST/CREATE-TODOLIST": {
      return { ...state, [action.todolist.id]: [] }
    }
    case "TODOLIST/CLEAR-STATE": {
      return {}
    }
    default:
      return state
  }
}

//actions

export const setTasks = (todolistId: string, tasks: TaskType[]) =>
  ({ type: "TASK/SET-TASK", todolistId, tasks } as const)
export const addTask = (task: TaskType) => ({ type: "TASK/ADD-TASK", task } as const)
export const removeTask = (todolistId: string, taskId: string) =>
  ({
    type: "TASK/REMOVE-TASK",
    todolistId,
    taskId,
  } as const)
export const updateTask = (task: TaskType) => ({ type: "TASK/UPDATE-TASK", task } as const)

//thunks

export const fetchTaskTC =
  (todolistId: string): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await todolistApi.getTasks(todolistId)
      dispatch(setTasks(todolistId, res.data.items))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
    } catch (e) {
      handleNetworkAppError(e, dispatch)
    }
  }
export const addTaskTC =
  (todolistId: string, title: string): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "loading" }))
    try {
      const res = await todolistApi.createTask(todolistId, title)
      if (res.data.resultCode === 0) {
        dispatch(addTask(res.data.data.item))
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
      dispatch(removeTask(todolistId, taskId))
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
          dispatch(updateTask(res.data.data.item))
          dispatch(appActions.setAppStatus({ status: "succeeded" }))
        } else {
          handleServerAppError<{ item: TaskType }>(res.data, dispatch)
        }
      }
    } catch (e) {
      handleNetworkAppError(e, dispatch)
    }
  }
