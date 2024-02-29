import { appActions, RequestStatusType } from "app/appSlice"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { todolistsApi } from "features/TodolistList/api/todolists/todolistsApi"
import { createAppAsyncThunk, handleServerAppError } from "common/utils"
import { RESULT_CODE } from "common/enum/enum"
import { thunkTryCatch } from "common/utils/thunk-try-catch"
import { TodolistType } from "features/TodolistList/api/todolists/todolistsApi.types"

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
  undefined
>("todolists/fetchTodolists", async (_, thunkAPI) => {
  const { dispatch } = thunkAPI
  const res = await todolistsApi.getTodolist()
  dispatch(appActions.setAppStatus({ status: "succeeded" }))
  return { todolists: res.data }
})

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "todolists/addTodolist",
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    const res = await todolistsApi.createTodolist(title)
    if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { todolist: res.data.data.item }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
  "todolists/removeTodolist",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    const res = await todolistsApi.deleteTodolist(todolistId)
    if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
      return { todolistId: todolistId }
    } else {
      dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "failed" }))
      return rejectWithValue(res.data)
    }
  }
)

const updateTodolist = createAppAsyncThunk<
  { todolistId: string; title: string },
  { todolistId: string; title: string }
>("todolists/updateTodolist", async ({ todolistId, title }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistsApi.updateTodolist(todolistId, title)
    if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { todolistId: todolistId, title: title }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  }).catch(() => {
    dispatch(todolistsActions.changeEntityStatus({ todolistId: todolistId, entityStatus: "failed" }))
    return rejectWithValue(null)
  })
})

// reducer

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
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
      .addCase(updateTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((td) => td.id === action.payload.todolistId)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((td) => td.id === action.payload.todolistId)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
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

export const todolistsSlice = slice.reducer
export const todolistsActions = slice.actions

export const todolistsThunks = { fetchTodolists, addTodolist, removeTodolist, updateTodolist }
