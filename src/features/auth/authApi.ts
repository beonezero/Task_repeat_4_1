import { LoginDataType } from "features/auth/Login/Login"
import { AxiosResponse } from "axios"
import { instance } from "common/api/baseApi"
import { BaseResponseType } from "common/types/common.types"

export const authAPI = {
  me() {
    return instance.get<BaseResponseType<UserType>>("auth/me")
  },
  loginIn(data: LoginDataType) {
    return instance.post<null, AxiosResponse<BaseResponseType<{ userId: number }>>, LoginDataType>("auth/login", data)
  },
  logOut() {
    return instance.delete<BaseResponseType>("auth/login")
  },
}

//types
export type UserType = {
  id: number
  email: string
  login: string
}
