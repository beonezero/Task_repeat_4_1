import { toast, ToastContainer } from "react-toastify"
import { useEffect } from "react"
import { useAppDispatch } from "app/store"
import "react-toastify/dist/ReactToastify.css"
import { appActions } from "app/app-reducer"
import { appSelectors } from "app/app.selectors"

export const GlobalError = () => {
  const error = appSelectors.useError()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(appActions.setAppError({ error: null }))
    }
  }, [error])

  return <ToastContainer theme="dark" autoClose={3000} />
}