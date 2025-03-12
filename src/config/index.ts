import dotenv from "dotenv"

// Carga las variables de entorno
dotenv.config()

interface Config {
  port: number
  nodeEnv: string
  mongodbUri: string
  jwtSecret: string
  jwtTimeout: number
  googleClientId: string
  googleClientSecret: string
  corsOrigins: string[]
  pingInterval: number
  serverUrl: string
}

// Valida que las variables de entorno requeridas estén definidas
const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "DB_URL",
  "JWT_SECRET",
  "JWT_TIMEOUT",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET"
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variable de entorno ${envVar} no está definida`)
  }
}

export const config: Config = {
  port: parseInt(process.env.PORT || "8080", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.DB_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtTimeout: parseInt(process.env.JWT_TIMEOUT!, 10),
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  corsOrigins: [
    "https://googleloginboilerplate.vercel.app",
    "http://localhost:5173"
  ],
  pingInterval: 600000, // 10 minutos
  serverUrl: "https://google-login-ts.onrender.com"
}
