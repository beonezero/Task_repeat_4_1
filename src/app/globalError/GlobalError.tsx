import {toast, ToastContainer} from "react-toastify";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../store";
import 'react-toastify/dist/ReactToastify.css';
import {setAppError} from "../app-reducer";

export const GlobalError = () => {
    const error = useAppSelector(state => state.app.error)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(setAppError(null))
        }
    }, [error])

    return <ToastContainer theme="dark" autoClose={3000} />
}