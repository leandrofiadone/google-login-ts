import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt, { JwtPayload as BaseJwtPayload } from "jsonwebtoken"
import { User, IUser } from '../models/userModel';
import { verifyGoogleToken } from '../utils/googleClient';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';
import { AuthResponse, GoogleUserInfo } from '../types';

interface CustomJwtPayload extends BaseJwtPayload {
  _id: string;
  email: string;
}

export const googleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => { // Cambia el tipo de retorno
  const code = req.query.code as string;
  
  if (!code) {
    return next(new AppError('Código de autorización no proporcionado', 400));
  }

  try {
    // Obtener tokens de Google
    const accessToken = await verifyGoogleToken(code);
    
    if (!accessToken) {
      return next(new AppError('Error al obtener tokens de Google', 401));
    }

    // Obtener información del usuario
    const { data } = await axios.get<GoogleUserInfo>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
    );

    const { email, name, picture } = data;

    if (!email) {
      return next(new AppError('No se pudo obtener el email del usuario', 400));
    }

    // Buscar o crear usuario
    let user: IUser | null = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture
      });
    } else {
      // Actualizar datos si necesario
      if (name && name !== user.name || picture && picture !== user.image) {
        user.name = name || user.name;
        user.image = picture || user.image;
        await user.save();
      }
    }

    // Generar JWT
    const token = jwt.sign(
      {
        _id: user._id.toString(),
        email: user.email
      } as CustomJwtPayload,
      config.jwtSecret,
      {
        expiresIn: '43200'
      }
    )

    // Devolver respuesta directamente
    return res.status(200).json({
      message: 'success',
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image || ''
      }
    });

  } catch (error) {
    console.error('Error en autenticación:', error);
    return next(new AppError('Error en el proceso de autenticación', 500));
  }
};

/**
 * Controlador para obtener los pipeline minutes
 */
export const getPipelineMinutesController = (
  req: Request,
  res: Response
): void => {
  const {getPipelineMinutes} = require("../middleware/performanceMonitor")
  res.json({
    pipelineMinutes: getPipelineMinutes().toFixed(2)
  })
}

/**
 * Controlador para la ruta de ping
 */
export const ping = (req: Request, res: Response): void => {
  res.json({message: "Servidor activo", timestamp: new Date().toISOString()})
}
