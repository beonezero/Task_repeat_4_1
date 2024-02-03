import { useAppSelector } from "app/store"

export const todolistsSelectors = {
  useTodolists: () => useAppSelector((state) => state.todolists),
}
