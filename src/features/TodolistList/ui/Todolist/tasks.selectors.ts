import { useAppSelector } from "app/store"

export const tasksSelectors = {
  useTasks: () => useAppSelector((state) => state.tasks),
}
