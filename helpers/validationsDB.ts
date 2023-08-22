import { sendEmail } from '../mailer/mailer'
import { IUser, User } from '../model/user.model'

export const existEmail = async (email: string): Promise<void> => {
  const thisEmailInDB: IUser | null = await User.findOne({ email })

  if (thisEmailInDB && thisEmailInDB.verified) {
    throw new Error(`El correo ${email} ya esta registrado`)
  }
  
  if (thisEmailInDB && !thisEmailInDB.verified) {
    await sendEmail(email, thisEmailInDB.code as string)
    throw new Error(`El usuario ya está registrado. Se envió nuevamente el código de verificación a ${email}`)
  }
}
