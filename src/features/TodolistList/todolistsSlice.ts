import { todolistApi, TodolistType } from "api/todolist-api"
import { appActions, RequestStatusType } from "app/app-reducer"
import { handleServerNetworkError, handleServerAppError } from "utils/handleServerNetworkError"
import { AppThunk } from "app/store"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { tasksThunks } from "features/TodolistList/tasksSlice"

// types

export type FilterValuesType = "all" | "active" | "completed"

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

// reducer
const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
  name: "todolists",
  initialState: initialState,
  reducers: {
    createTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    },
    setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
      action.payload.todolists.forEach((td) => {
        state.push({ ...td, filter: "all", entityStatus: "idle" })
      })
    },
    removeTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
      const index = state.findIndex((td) => td.id === action.payload.todolistId)
      if (index !== -1) {
        state.splice(index, 1)
      }
    },
    updateTodolist: (state, action: PayloadAction<{ todolistId: string; title: string }>) => {
      const index = state.findIndex((td) => td.id === action.payload.todolistId)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    },
    changeFilter: (state, action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((td) => td.id === action.payload.todolistId)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    },
    changeEntityStatus: (state, action: PayloadAction<{ todolistId: string; entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((td) => td.id === action.payload.todolistId)
      if (index !== -1) {
        state[index].entityStatus = action.payload.entityStatus
      }
    },
    clearState: () => {
      return []
    },
  },
})

export const todolistsSlice = slice.reducer
export const todolistsActions = slice.actions

//thunks
export const fetchTodolistsTC = () => (dispatch: any) => {
  dispatch(
    appActions.setAppStatus({
      status: "loading",
    })
  )
  todolistApi
    .getTodolist()
    .then((res) => {
      dispatch(todolistsActions.setTodolists({ todolists: res.data }))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return res.data
    })
    .then((res) => {
      res.forEach((tl) => {
        dispatch(tasksThunks.fetchTasks(tl.id))
      })
    })
    .catch((e) => {
      handleServerNetworkError(e, dispatch)
    })
}

// export const fetchTodolistsTC = () => async (dispatch: TodolistThunkDispatchType) => {
//     dispatch(setAppStatus("loading"))
//     try {
//         const res = await todolistApi.getTodolist()
//         dispatch(setTodolists(res.data))
//         dispatch(setAppStatus("succeeded"))
//         return new Promise ((resolve) => {resolve(res.data)})
//     } catch (e) {
//         handleNetworkAppError(e, dispatch)
//         return new Promise ((reject) => {reject(e)})
//     }
// }

export const createTodolistTC =
  (title: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      const res = await todolistApi.createTodolist(title)
      if (res.data.resultCode === 0) {
        dispatch(todolistsActions.createTodolist({ todolist: res.data.data.item }))
        dispatch(
          appActions.setAppStatus({
            status: "succeeded",
          })
        )
      } else {
        handleServerAppError<{
          item: TodolistType
        }>(res.data, dispatch)
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
    }
  }

export const removeTodolistTC =
  (todolistId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(
        appActions.setAppStatus({
          status: "loading",
        })
      )
      dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "loading" }))
      await todolistApi.deleteTodolist(todolistId)
      dispatch(todolistsActions.removeTodolist({ todolistId: todolistId }))
      dispatch(
        appActions.setAppStatus({
          status: "succeeded",
        })
      )
    } catch (e) {
      dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "failed" }))
      handleServerNetworkError(e, dispatch)
    }
  }

export const updateTodolistTC =
  (todolistId: string, title: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(
        appActions.setAppStatus({
          status: "loading",
        })
      )
      await todolistApi.updateTodolist(todolistId, title)
      dispatch(todolistsActions.updateTodolist({ todolistId: todolistId, title: title }))
      dispatch(
        appActions.setAppStatus({
          status: "succeeded",
        })
      )
    } catch (e) {
      handleServerNetworkError(e, dispatch)
    }
  }
