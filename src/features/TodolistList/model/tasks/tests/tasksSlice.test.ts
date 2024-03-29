import { tasksReducer, TasksStateType, tasksThunks } from "features/TodolistList/model/tasks/tasksSlice"
import { todolistsThunks } from "features/TodolistList/model/todolists/todolistsSlice"
import { TaskPriorities, TaskStatuses } from "common/enum/enum"

let startState: TasksStateType = {}
beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        completed: false,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        completed: false,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        completed: false,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        completed: false,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        completed: false,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        completed: false,
      },
    ],
  }
})

test("correct task should be deleted from correct array", () => {
  const action = tasksThunks.removeTask.fulfilled({ todolistId: "todolistId2", taskId: "2" }, "requestId", {
    todolistId: "todolistId2",
    taskId: "2",
  })

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(2)
  expect(endState["todolistId2"].every((t) => t.id != "2")).toBeTruthy()
})
test("correct task should be added to correct array", () => {
  const task = {
    todoListId: "todolistId2",
    title: "juce",
    status: TaskStatuses.New,
    addedDate: "",
    deadline: "",
    description: "",
    order: 0,
    priority: TaskPriorities.Low,
    startDate: "",
    id: "id exists",
    completed: false,
  }
  const action = tasksThunks.addTask.fulfilled({ task }, "requestId", {
    todolistId: task.todoListId,
    title: task.title,
  })

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(4)
  expect(endState["todolistId2"][0].id).toBeDefined()
  expect(endState["todolistId2"][0].title).toBe("juce")
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New)
})
test("status of specified task should be changed", () => {
  const task = {
    todoListId: "todolistId2",
    title: "juce",
    status: TaskStatuses.New,
    addedDate: "",
    deadline: "",
    description: "",
    order: 0,
    priority: TaskPriorities.Low,
    startDate: "",
    id: "2",
    completed: false,
  }
  const action = tasksThunks.updateTask.fulfilled(
    {
      task,
    },
    "requestId",
    { todolistId: task.todoListId, taskId: task.id, model: task }
  )

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed)
  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New)
})
test("title of specified task should be changed", () => {
  const task = {
    todoListId: "todolistId2",
    title: "jucek",
    status: TaskStatuses.New,
    addedDate: "",
    deadline: "",
    description: "",
    order: 0,
    priority: TaskPriorities.Low,
    startDate: "",
    id: "2",
    completed: false,
  }
  const action = tasksThunks.updateTask.fulfilled({ task }, "requestId", {
    todolistId: task.todoListId,
    taskId: task.id,
    model: task,
  })

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"][1].title).toBe("JS")
  expect(endState["todolistId2"][1].title).toBe("jucek")
  expect(endState["todolistId2"][0].title).toBe("bread")
})
test("new array should be added when new todolist is added", () => {
  const todolist = {
    id: "blabla",
    title: "new todolist",
    order: 0,
    addedDate: "",
  }
  const action = todolistsThunks.addTodolist.fulfilled(
    {
      todolist,
    },
    "requestId",
    "new todolist"
  )

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2")
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})
test("propertry with todolistId should be deleted", () => {
  const action = todolistsThunks.removeTodolist.fulfilled({ todolistId: "todolistId2" }, "requestId", "todolistId2")

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
})

test("empty arrays should be added when we set todolists", () => {
  const action = todolistsThunks.fetchTodolists.fulfilled(
    {
      todolists: [
        { id: "1", title: "title 1", order: 0, addedDate: "" },
        { id: "2", title: "title 2", order: 0, addedDate: "" },
      ],
    },
    "requestId",
    undefined
  )

  const endState = tasksReducer({}, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(2)
  expect(endState["1"]).toBeDefined()
  expect(endState["2"]).toBeDefined()
})
test("tasks should be added for todolist", () => {
  const action = tasksThunks.fetchTasks.fulfilled(
    { todolistId: "todolistId1", tasks: startState["todolistId1"] },
    "requestId",
    "todolist1"
  )

  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action
  )

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(0)
})
