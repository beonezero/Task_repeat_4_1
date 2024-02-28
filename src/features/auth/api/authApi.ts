import { AxiosResponse } from "axios"
import { instance } from "common/api/baseApi"
import { BaseResponseType } from "common/types/common.types"
import { LoginDataType } from "features/auth/api/auth.type"

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
