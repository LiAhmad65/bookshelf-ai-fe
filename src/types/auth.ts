export interface User {
  /** Backend (Mongo) id; some responses use `id` instead. */
  _id?: string
  id?: string
  name: string
  email: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload extends LoginPayload {
  name: string
}

export interface AuthResponse {
  user: User
  token: string
}
