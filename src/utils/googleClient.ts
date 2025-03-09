import {google} from "googleapis"
import {config} from "../config"

export const oauth2Client = new google.auth.OAuth2(
  config.googleClientId,
  config.googleClientSecret,
  "postmessage" // Callback url (usa postmessage para integraciones con SPA)
)

// Función para validar el token de Google
export const verifyGoogleToken = async (code: string) => {
  try {
    const {tokens} = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)
    return tokens.access_token
  } catch (error) {
    console.error("Error verificando token de Google:", error)
    throw new Error("Error verificando token de Google")
  }
}
