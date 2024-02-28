import {
  TodolistDomainType,
  todolistsSlice,
  todolistsThunks,
} from "features/TodolistList/model/todolists/todolistsSlice"
import { tasksReducer, TasksStateType } from "features/TodolistList/model/tasks/tasksSlice"
import { TodolistType } from "features/TodolistList/api/todolists/todolistsApi.types"

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: Array<TodolistDomainType> = []

  let todolist: TodolistType = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  }

  const action = todolistsThunks.addTodolist.fulfilled({ todolist: todolist }, "requestId", "new todolist")

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsSlice(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
