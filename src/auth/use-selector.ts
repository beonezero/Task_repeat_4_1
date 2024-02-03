import { useAppSelector } from "app/store"

export const authSelector = {
  useIsLoggedIn: () => useAppSelector((state) => state.auth.isLoggedIn),
}
