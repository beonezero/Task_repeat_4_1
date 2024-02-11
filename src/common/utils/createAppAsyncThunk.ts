import { createAsyncThunk } from "@reduxjs/toolkit"
import { AppRootStateType, AppThunkDispatch } from "app/store"
import { BaseResponseType } from "common/types"

export const createAppAsyncThunk =
  createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppThunkDispatch
    rejectValue: null | BaseResponseType
  }>()
