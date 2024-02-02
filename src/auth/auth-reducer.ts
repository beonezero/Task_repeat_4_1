//types
import { LoginDataType } from "../features/Login/Login";
import { Dispatch } from "redux";
import { setAppStatus, setIsInitialized } from "../app/app-reducer";
import { authAPI } from "../api/todolist-api";
import {
  handleNetworkAppError,
  handleServerAppError,
} from "../utils/error-utils";
import { clearState } from "../features/TodolistList/todolists-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false as boolean,
};

const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedInStatus: (
      state,
      action: PayloadAction<{ isLoggedIn: boolean }>
    ) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const logOutTC = () => async (dispatch: Dispatch) => {
  setAppStatus("loading");
  try {
    const res = await authAPI.logOut();
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedInStatus({ isLoggedIn: false }));
      dispatch(setAppStatus("succeeded"));
      dispatch(clearState());
    } else handleServerAppError(res.data, dispatch);
  } catch (e) {
    handleNetworkAppError(e, dispatch);
  }
};

export const loginTC = (data: LoginDataType) => async (dispatch: Dispatch) => {
  setAppStatus("loading");
  try {
    const res = await authAPI.loginIn(data);
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedInStatus({ isLoggedIn: true }));
      dispatch(setAppStatus("succeeded"));
    } else handleServerAppError(res.data, dispatch);
  } catch (e) {
    handleNetworkAppError(e, dispatch);
  }
};

export const meTC = () => async (dispatch: Dispatch) => {
  setAppStatus("loading");
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedInStatus({ isLoggedIn: true }));
      dispatch(setAppStatus("succeeded"));
    } else handleServerAppError(res.data, dispatch);
  } catch (e) {
    handleNetworkAppError(e, dispatch);
  } finally {
    dispatch(setIsInitialized(true));
  }
};
