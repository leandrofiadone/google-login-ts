import {Request, Response, NextFunction} from "express"
import logger from "../utils/logger"

/**
 * Variables para almacenar estadísticas de rendimiento
 */
let totalPipelineMinutes = 0
let requestCount = 0
let totalResponseTime = 0
let slowestResponse = 0

/**
 * Middleware para monitorear el rendimiento de las peticiones
 * Calcula y acumula el tiempo de ejecución para cada petición
 *
 * @param req Request - Petición HTTP
 * @param res Response - Respuesta HTTP
 * @param next NextFunction - Función para pasar al siguiente middleware
 */
export const performanceMonitor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Marca el tiempo de inicio
  const start = process.hrtime()
  const requestPath = `${req.method} ${req.originalUrl}`

  // Incrementa contador de peticiones
  requestCount++

  // Captura el momento en que la respuesta es enviada
  res.on("finish", () => {
    // Calcula tiempo transcurrido
    const elapsed = process.hrtime(start)
    const elapsedMs = elapsed[0] * 1000 + elapsed[1] / 1e6
    const elapsedSec = elapsedMs / 1000

    // Acumula estadísticas
    totalPipelineMinutes += elapsedMs / 60000
    totalResponseTime += elapsedMs

    if (elapsedMs > slowestResponse) {
      slowestResponse = elapsedMs
    }

    // Registra información detallada para respuestas lentas (más de 1 segundo)
    if (elapsedSec > 1) {
      logger.warn(
        `⚠️ Respuesta lenta (${elapsedSec.toFixed(2)}s) para: ${requestPath}`
      )
    }

    // Log de tiempo de ejecución
    logger.debug(
      `⏳ ${requestPath} - Tiempo: ${elapsedSec.toFixed(2)}s - Status: ${
        res.statusCode
      }`
    )

    // Log periódico de estadísticas acumuladas (cada 100 peticiones)
    if (requestCount % 100 === 0) {
      const avgResponseTime = totalResponseTime / requestCount
      logger.info(
        `📊 Estadísticas - Peticiones: ${requestCount}, Tiempo promedio: ${(
          avgResponseTime / 1000
        ).toFixed(2)}s, Pipeline Minutes: ${totalPipelineMinutes.toFixed(2)}`
      )
    }
  })

  next()
}

/**
 * Obtiene el total de pipeline minutes acumulados
 * @returns {number} Total de pipeline minutes
 */
export const getPipelineMinutes = (): number => {
  return totalPipelineMinutes
}

/**
 * Obtiene estadísticas detalladas del rendimiento
 * @returns {Object} Estadísticas de rendimiento
 */
export const getPerformanceStats = () => {
  return {
    requestCount,
    totalPipelineMinutes: totalPipelineMinutes.toFixed(2),
    averageResponseTime: requestCount
      ? (totalResponseTime / requestCount).toFixed(2)
      : 0,
    slowestResponse: slowestResponse.toFixed(2)
  }
}
