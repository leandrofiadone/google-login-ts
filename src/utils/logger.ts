import { createLogger, format, transports } from 'winston';
import { config } from '../config';

const { combine, timestamp, printf, colorize } = format;

// Formato personalizado
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Configuración según el entorno
const logger = createLogger({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    myFormat
  ),
  transports: [
    // Consola para desarrollo
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        myFormat
      )
    }),
    // Archivo para producción (opcional)
    ...(config.nodeEnv === 'production'
      ? [
          new transports.File({ filename: 'logs/error.log', level: 'error' }),
          new transports.File({ filename: 'logs/combined.log' })
        ]
      : [])
  ]
});

export default logger;