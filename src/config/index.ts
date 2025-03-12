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
  pingInterval: number // En milisegundos
  serverUrl: string
  logLevel: string
}

// Valida que las variables de entorno requeridas estén definidas
const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "DB_URL",
  "JWT_SECRET",
  "JWT_TIMEOUT",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "PING_INTERVAL", // Nuevo
  "SERVER_URL" // Nuevo
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variable de entorno ${envVar} no está definida`)
  }
}

// Función para obtener los CORS origins desde variables de entorno
function getCorsOrigins(): string[] {
  const originsStr = process.env.CORS_ORIGINS || "http://localhost:5173"
  return originsStr.split(",").map((origin) => origin.trim())
}

export const config: Config = {
  port: parseInt(process.env.PORT || "8080", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.DB_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtTimeout: parseInt(process.env.JWT_TIMEOUT!, 10),
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  corsOrigins: getCorsOrigins(),
  pingInterval: parseInt(process.env.PING_INTERVAL || "600000", 10), // Default: 10 minutos
  serverUrl: process.env.SERVER_URL!,
  logLevel: process.env.LOG_LEVEL || "info"
}

// Validaciones adicionales
if (config.pingInterval < 60000 && config.nodeEnv === "production") {
  console.warn(
    "⚠️ ADVERTENCIA: PING_INTERVAL es menor a 1 minuto en producción"
  )
}

if (!config.serverUrl.startsWith("https") && config.nodeEnv === "production") {
  console.warn("⚠️ ADVERTENCIA: SERVER_URL no usa HTTPS en producción")
}

export default config
