import {
    changeEntityStatus,
    CreateTodolistType,
    FilterValuesType,
    RemoveTodolistType,
    SetTodolistsType
} from './todolists-reducer';
import {Dispatch} from "redux";
import {TaskStatuses, TaskType, todolistApi, UpdateTaskType} from "../../api/todolist-api";
import {AppRootStateType} from "../../app/store";
import {setAppError, setAppStatus} from "../../app/app-reducer";
import {handleError} from "../../utils/handle-error";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

//types

type ActionsType = SetTodolistsType | RemoveTodolistType | CreateTodolistType | ReturnType<typeof setTasks>
    | ReturnType<typeof addTask> | ReturnType<typeof removeTask> | ReturnType<typeof updateTask>

const initialState: TasksStateType = {}

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

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "TASK/SET-TASK": {
            return {...state, [action.todolistId]: action.tasks}
        }
        case "TASK/REMOVE-TASK": {
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        }
        case "TASK/ADD-TASK": {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
        case "TASK/UPDATE-TASK": {
            return {
                ...state, [action.task.todoListId]: state[action.task.todoListId]
                    .map(t => t.id === action.task.id ? {...action.task} : t)
            }
        }
        case "TODOLIST/SET-TODOLIST": {
            const copyState = {...state}
            action.todolists.forEach((td) => {
                copyState[td.id] = []
            })
            return copyState
        }
        case "TODOLIST/REMOVE-TODOLIST": {
            const copyState = {...state}
            delete copyState[action.todolistId]
            return copyState
        }
        case "TODOLIST/CREATE-TODOLIST": {
            return {...state, [action.todolist.id]: []}
        }
        default:
            return state;
    }
}

//actions

export const setTasks = (todolistId: string, tasks: TaskType[]) => ({type: "TASK/SET-TASK", todolistId, tasks}) as const
export const addTask = (task: TaskType) => ({type: "TASK/ADD-TASK", task}) as const
export const removeTask = (todolistId: string, taskId: string) => ({
    type: "TASK/REMOVE-TASK", todolistId, taskId
}) as const
export const updateTask = (task: TaskType) => ({type: "TASK/UPDATE-TASK", task}) as const

//thunks

export const fetchTaskTC = (todolistId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    try {
        const res = await todolistApi.getTasks(todolistId)
        dispatch(setTasks(todolistId, res.data.items))
        dispatch(setAppStatus("succeeded"))
    } catch (e) {

    }
}
export const addTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    try {
        const res = await todolistApi.createTask(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(addTask(res.data.data.item))
            dispatch(setAppStatus("succeeded"))
        } else {
            if (res.data.messages.length) {
                dispatch(setAppError(res.data.messages[0]))
            } else {
                dispatch(setAppError("Some error"))
            }
            dispatch(changeEntityStatus(todolistId, "failed"))
            dispatch(setAppStatus("failed"))
        }
        console.log("try")
    } catch (e: any) {
        dispatch(changeEntityStatus(todolistId, "failed"))
        dispatch(setAppStatus("failed"))
        dispatch(setAppError(e.message))
        console.log("catch")
    }
}

export const removeTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatus("loading"))
    try {
        await todolistApi.deleteTask(todolistId, taskId)
        dispatch(removeTask(todolistId, taskId))
        dispatch(setAppStatus("succeeded"))
    } catch (e) {

    }
}
export const updateTaskTC = (todolistId: string, taskId: string, model: domainTaskType) =>
    async (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatus("loading"))
        try {
            const state = getState()
            const task = state.tasks[todolistId].find(t => t.id === taskId)
            if (task) {
                const modelApi: UpdateTaskType = {
                    title: task.title,
                    description: task.description,
                    completed: task.completed,
                    status: task.status,
                    priority: task.priority,
                    startDate: task.startDate,
                    deadline: task.deadline,
                    ...model
                }
                const res = await todolistApi.updateTask(todolistId, taskId, modelApi)
                dispatch(updateTask(res.data.data.item))
                dispatch(setAppStatus("succeeded"))
            }
        } catch (e) {
        }
    }


