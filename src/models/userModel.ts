import mongoose, {Schema, Document, Types} from "mongoose"

export interface IUser extends Document {
  _id: Types.ObjectId // Usar Types.ObjectId en lugar de string
  name: string
  email: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true
    },
    image: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    versionKey: false // Elimina el campo __v
  }
)

// Índice para optimizar búsquedas por email
userSchema.index({email: 1})

// Método para transformar el documento a JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.__v
  return user
}

export const User = mongoose.model<IUser>("social-login", userSchema)
