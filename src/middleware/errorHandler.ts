import {Request, Response, NextFunction} from "express"

export class AppError extends Error {
  statusCode: number
  status: string
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const appError = err as AppError
  appError.statusCode = appError.statusCode || 500
  appError.status = appError.status || "error"

  // Desarrollo vs producción
  if (process.env.NODE_ENV === "development") {
    res.status(appError.statusCode).json({
      status: appError.status,
      message: appError.message,
      error: err,
      stack: err.stack
    })
  } else {
    // En producción solo mostramos errores operacionales
    if (appError.isOperational) {
      res.status(appError.statusCode).json({
        status: appError.status,
        message: appError.message
      })
    } else {
      // Error de programación: no muestra detalles específicos
      console.error("ERROR 💥", err)
      res.status(500).json({
        status: "error",
        message: "Ha ocurrido un error inesperado"
      })
    }
  }
}

// Middleware para capturar rutas no definidas
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`No se encuentra ${req.originalUrl}`, 404))
}
