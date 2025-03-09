import mongoose from "mongoose"
import {config} from "../config"

export const connectDB = async (): Promise<void> => {
  try {
    console.log("Intentando conectar a MongoDB...")
    await mongoose.connect(config.mongodbUri)
    console.log("✅ Conexión a MongoDB establecida")
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error)
    process.exit(1) // Salir con error
  }
}

// Manejar eventos de conexión
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB desconectado")
})

mongoose.connection.on("error", (err) => {
  console.error("⚠️ Error en la conexión de MongoDB:", err)
})

// Manejar señales de cierre de la aplicación
process.on("SIGINT", async () => {
  await mongoose.connection.close()
  console.log("Conexión a MongoDB cerrada por finalización de la aplicación")
  process.exit(0)
})
