export type ResponseType<T = {}> = {
  resultCode: number
  messages: string[]
  data: T
}
