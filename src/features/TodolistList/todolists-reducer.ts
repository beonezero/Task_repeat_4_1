import { appActions, RequestStatusType } from "app/app-reducer"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { AppThunk } from "app/store"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { todolistApi, TodolistType } from "features/TodolistList/todolistsApi"
import { createAppAsyncThunk, handleServerAppError } from "common/utils"
import { RESULT_CODE, TaskPriorities, TaskStatuses } from "common/enum/enum"

// types

export type FilterValuesType = "all" | "active" | "completed"

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

// thunks

const fetchTodolists = createAppAsyncThunk<
  {
    todolists: TodolistType[]
  },
  void
>("todolists/fetchTodolists", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    const res = await todolistApi.getTodolist()
    dispatch(appActions.setAppStatus({ status: "succeeded" }))
    return { todolists: res.data }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "todolists/addTodolist",
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      const res = await todolistApi.createTodolist(title)
      if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { todolist: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  }
)

// reducer

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
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
  extraReducers: (builder) => {
    builder
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
      })
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((td) => {
          state.push({ ...td, filter: "all", entityStatus: "idle" })
        })
      })
  },
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

export const todolistsThunks = { fetchTodolists, addTodolist }

//thunks

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
