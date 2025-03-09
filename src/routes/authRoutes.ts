import express from "express"
import {
  googleAuth,
  getPipelineMinutesController,
  ping
} from "../controllers/authController"

const router = express.Router()

// Rutas de autenticación
router.get("/google", googleAuth)

// Rutas de utilidad
router.get("/pipeline-minutes", getPipelineMinutesController)
router.get("/ping", ping)

export default router
