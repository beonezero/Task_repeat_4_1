import { TaskType } from './Todolist/Todolist';
import {CreateTodolistType, RemoveTodolistType, SetTodolistsType} from './todolists-reducer';

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

type ActionsType = SetTodolistsType | RemoveTodolistType | CreateTodolistType

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
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
            return  copyState
        }
        case "TODOLIST/CREATE-TODOLIST": {
            return {...state, [action.todolist.id]: []}
        }
        default:
            return state;
    }
}

