import { LoginDataType } from "features/auth/Login/Login"
import { AxiosResponse } from "axios"
import { instance } from "common/api/baseApi"
import { ResponseType } from "common/types/types"

export const authAPI = {
  me() {
    return instance.get<ResponseType<UserType>>("auth/me")
  },
  loginIn(data: LoginDataType) {
    return instance.post<null, AxiosResponse<ResponseType<{ userId: number }>>, LoginDataType>("auth/login", data)
  },
  logOut() {
    return instance.delete<ResponseType>("auth/login")
  },
}

//types
export type UserType = {
  id: number
  email: string
  login: string
}
