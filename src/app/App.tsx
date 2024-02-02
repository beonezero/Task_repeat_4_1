import React, {useEffect} from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Menu from '@mui/icons-material/Menu';
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import {TodolistsList} from "../features/TodolistList/TodolistsList";
import {useAppDispatch, useAppSelector} from "./store";
import {RequestStatusType} from "./app-reducer";
import {GlobalError} from "./globalError/GlobalError";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";
import {logOutTC, meTC} from "../auth/auth-reducer";

export const App = () => {
    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()
    const handlerLogOut = () => {
        dispatch(logOutTC())
    }

    useEffect(() => {
        dispatch(meTC())
    }, [])

    {
        if (!isInitialized) {
            return <div>
                <CircularProgress/>
            </div>
        }
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button onClick={handlerLogOut} color="inherit">Log out</Button>}
                </Toolbar>
            </AppBar>
            {status === "loading" && <LinearProgress color="secondary"/>}
            <GlobalError/>
            <Container fixed>
                <Routes>
                    <Route path={"/"} element={<TodolistsList/>}/>
                    <Route path={"/login"} element={<Login/>}/>
                    <Route path={"/404"} element={<h1>404: PAGE NOT FOUND :D</h1>}/>
                    <Route path={"*"} element={<Navigate to={"/404"}/>}/>
                </Routes>
            </Container>
        </div>
    );
}
