import React, { useEffect } from "react"
import "./App.css"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Menu from "@mui/icons-material/Menu"
import LinearProgress from "@mui/material/LinearProgress"
import CircularProgress from "@mui/material/CircularProgress"
import { TodolistsList } from "features/TodolistList/TodolistsList"
import { GlobalError } from "common/components/globalError/GlobalError"
import { Navigate, Route, Routes } from "react-router-dom"
import { Login } from "features/auth/Login/Login"
import { authSelectors } from "features/auth/auth.selectors"
import { appSelectors } from "app/app.selectors"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { authThunks } from "features/auth/auth-reducer"
import { useActions } from "common/hooks/useActions"
import { appReducer } from "app/app-reducer"

export const App = () => {
  const status = appSelectors.useStatus()
  const isInitialized = appSelectors.useIsInitialized()
  const isLoggedIn = authSelectors.useIsLoggedIn()

  const { me, logOut } = useActions(authThunks)
  const handlerLogOut = () => {
    logOut()
  }

  useEffect(() => {
    me()
  }, [])

  {
    if (!isInitialized) {
      return (
        <div>
          <CircularProgress />
        </div>
      )
    }
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {isLoggedIn && (
            <Button onClick={handlerLogOut} color="inherit">
              Log out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {status === "loading" && <LinearProgress color="secondary" />}
      <GlobalError />
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/404"} element={<h1>404: PAGE NOT FOUND :D</h1>} />
          <Route path={"*"} element={<Navigate to={"/404"} />} />
        </Routes>
      </Container>
    </div>
  )
}
