import express, {Express} from "express"
import cors from "cors"
import axios from "axios"
import {config} from "./config"
import {connectDB} from "./models/dbConnect"
import authRoutes from "./routes/authRoutes"
import {performanceMonitor} from "./middleware/performanceMonitor"
import {errorHandler, notFound} from "./middleware/errorHandler"

// Inicializa la aplicación
const app: Express = express()

// Conectar a la base de datos
connectDB()

// Middlewares
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true
  })
)

app.use(express.json())
app.use(performanceMonitor)

// Rutas
app.use("/auth", authRoutes)

// Manejo de rutas no encontradas
app.all("*", notFound)

// Middleware de manejo de errores
app.use(errorHandler)

// Iniciar servidor
const server = app.listen(config.port, () => {
  console.log(`✅ Servidor iniciado en puerto ${config.port}`)
  console.log(`🌍 Entorno: ${config.nodeEnv}`)
})

// Mantener el servidor despierto con ping
const keepAlive = () => {
  setInterval(async () => {
    try {
      await axios.get(`${config.serverUrl}/auth/ping`)
      console.log(
        `🔄 SERVIDOR ACTIVO. Ping enviado: ${new Date().toISOString()}`
      )
    } catch (error) {
      console.error("❌ Error en el ping:", error)
    }
  }, config.pingInterval)
}

// Iniciar ping solo si estamos en producción
if (config.nodeEnv === "production") {
  keepAlive()
}

// Manejo de errores no capturados
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Cerrando servidor...")
  console.error(err.name, err.message)

  server.close(() => {
    process.exit(1)
  })
})
