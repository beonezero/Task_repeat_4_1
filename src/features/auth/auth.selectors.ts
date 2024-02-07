import { useAppSelector } from "app/store"

export const authSelectors = {
  useIsLoggedIn: () => useAppSelector((state) => state.auth.isLoggedIn),
}
