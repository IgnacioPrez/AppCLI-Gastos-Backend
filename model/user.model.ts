import { model, Schema, Model } from 'mongoose'
import { ROLES } from '../helpers/constants'

export interface IUser {
  fullName: string
  email: string
  password: string
  dni: string
  role?: string
  code?: string
  verified: boolean
}

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: [true, 'El nombre es obligatorio'] },
  email: { type: String, required: [true, 'El email es obligatorio'] },
  password: { type: String, required: [true, 'La contraseña es obligatorio'] },
  dni: { type: String, required: true },
  role: { type: String, default: ROLES.user },
  code: { type: String },
  verified: { type: Boolean },
})

//En esta funcion especificamos que es lo que queremos retornar en formato JSON al momento de que el cliente pida los datos
userSchema.methods.toJSON = function () {
  const { __v, password, _id, code, ...usuario } = this.toObject()
  return usuario
}
export const User: Model<IUser> = model('User', userSchema)
