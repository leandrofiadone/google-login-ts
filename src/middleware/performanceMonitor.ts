import {Request, Response, NextFunction} from "express"

let totalPipelineMinutes = 0

export const performanceMonitor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = process.hrtime()

  res.on("finish", () => {
    const elapsed = process.hrtime(start)
    const elapsedMs = elapsed[0] * 1000 + elapsed[1] / 1e6
    totalPipelineMinutes += elapsedMs / 60000

    console.log(`⏳ Tiempo de ejecución: ${(elapsedMs / 1000).toFixed(2)}s`)
    console.log(
      `⏳ Pipeline Minutes Acumulados: ${totalPipelineMinutes.toFixed(2)} min`
    )
  })

  next()
}

export const getPipelineMinutes = (): number => {
  return totalPipelineMinutes
}
