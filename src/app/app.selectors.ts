import { useAppSelector } from "app/store"

export const appSelectors = {
  useIsInitialized: () => useAppSelector((state) => state.app.isInitialized),
  useStatus: () => useAppSelector((state) => state.app.status),
  useError: () => useAppSelector((state) => state.app.error),
}
