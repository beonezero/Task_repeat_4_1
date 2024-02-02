import { todolistApi, TodolistType } from "../../api/todolist-api";
import { appActions, RequestStatusType } from "../../app/app-reducer";
import {
  handleNetworkAppError,
  handleServerAppError,
} from "../../utils/error-utils";
import { fetchTaskTC } from "./tasks-reducer";
import { AppThunk } from "../../app/store";

// types

export type FilterValuesType = "all" | "active" | "completed";

export type CreateTodolistType = ReturnType<typeof createTodolist>;

export type SetTodolistsType = ReturnType<typeof setTodolists>;

export type RemoveTodolistType = ReturnType<typeof removeTodolist>;

export type UpdateTodolistType = ReturnType<typeof updateTodolist>;

export type ChangeEntityStatusType = ReturnType<typeof changeEntityStatus>;

export type ClearStateType = ReturnType<typeof clearState>;

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

type ActionsType =
  | CreateTodolistType
  | SetTodolistsType
  | RemoveTodolistType
  | UpdateTodolistType
  | ReturnType<typeof changeFilterAC>
  | ChangeEntityStatusType
  | ClearStateType;

// reducer
const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (
  state: TodolistDomainType[] = initialState,
  action: ActionsType
): TodolistDomainType[] => {
  switch (action.type) {
    case "TODOLIST/SET-TODOLIST": {
      return action.todolists.map((td) => ({
        ...td,
        filter: "all",
        entityStatus: "idle",
      }));
    }
    case "TODOLIST/CREATE-TODOLIST": {
      return [
        { ...action.todolist, filter: "all", entityStatus: "idle" },
        ...state,
      ];
    }
    case "TODOLIST/REMOVE-TODOLIST": {
      return state.filter((td) => td.id !== action.todolistId);
    }
    case "TODOLIST/UPDATE-TODOLIST": {
      return state.map((td) =>
        td.id === action.todolistId ? { ...td, title: action.title } : td
      );
    }
    case "TODOLIST/CHANGE-FILTER": {
      return state.map((td) =>
        td.id === action.todolistId ? { ...td, filter: action.filter } : td
      );
    }
    case "TODOLIST/CHANGE-ENTITY-STATUS": {
      return state.map((td) =>
        td.id === action.todolistId
          ? { ...td, entityStatus: action.status }
          : td
      );
    }
    case "TODOLIST/CLEAR-STATE": {
      return [];
    }
    default:
      return state;
  }
};

//actions
export const createTodolist = (todolist: TodolistType) =>
  ({ type: "TODOLIST/CREATE-TODOLIST", todolist } as const);

export const setTodolists = (todolists: TodolistType[]) =>
  ({ type: "TODOLIST/SET-TODOLIST", todolists } as const);

export const removeTodolist = (todolistId: string) =>
  ({ type: "TODOLIST/REMOVE-TODOLIST", todolistId } as const);

export const updateTodolist = (todolistId: string, title: string) =>
  ({ type: "TODOLIST/UPDATE-TODOLIST", todolistId, title } as const);

export const changeFilterAC = (todolistId: string, filter: FilterValuesType) =>
  ({ type: "TODOLIST/CHANGE-FILTER", todolistId, filter } as const);

export const changeEntityStatus = (
  todolistId: string,
  status: RequestStatusType
) => ({ type: "TODOLIST/CHANGE-ENTITY-STATUS", todolistId, status } as const);

export const clearState = () => ({ type: "TODOLIST/CLEAR-STATE" } as const);

//thunks
export const fetchTodolistsTC = () => (dispatch: any) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  todolistApi
    .getTodolist()
    .then((res) => {
      dispatch(setTodolists(res.data));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return res.data;
    })
    .then((res) => {
      res.forEach((tl) => {
        dispatch(fetchTaskTC(tl.id));
      });
    })
    .catch((e) => {
      handleNetworkAppError(e, dispatch);
    });
};

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
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      const res = await todolistApi.createTodolist(title);
      if (res.data.resultCode === 0) {
        dispatch(createTodolist(res.data.data.item));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError<{ item: TodolistType }>(res.data, dispatch);
      }
    } catch (e) {
      handleNetworkAppError(e, dispatch);
    }
  };

export const removeTodolistTC =
  (todolistId: string): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(changeEntityStatus(todolistId, "loading"));
    try {
      await todolistApi.deleteTodolist(todolistId);
      dispatch(removeTodolist(todolistId));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    } catch (e) {
      dispatch(changeEntityStatus(todolistId, "failed"));
      handleNetworkAppError(e, dispatch);
    }
  };

export const updateTodolistTC =
  (todolistId: string, title: string): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      await todolistApi.updateTodolist(todolistId, title);
      dispatch(updateTodolist(todolistId, title));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    } catch (e) {
      handleNetworkAppError(e, dispatch);
    }
  };
