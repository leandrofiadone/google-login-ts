export interface UserDocument {
  _id: string
  name: string
  email: string
  image?: string
}

export interface AuthResponse {
  message: string
  token?: string // Hazlo opcional
  user?: UserDocument
}

export interface GoogleUserInfo {
  email: string
  name: string
  picture?: string
}

export interface RequestWithUser extends Request {
  user?: UserDocument
}

export interface JwtPayload {
  _id: string
  email: string
}

export interface PipelineMinutesResponse {
  pipelineMinutes: string
}
