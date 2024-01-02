import { Request, Response } from 'express'
import { IUser, User } from '../model/user.model'
import bcryptjs from 'bcryptjs'
import { ROLES } from '../helpers/constants'
import randomstring from 'randomstring'
import { sendEmail } from '../mailer/mailer'
import { generateRefreshToken, tokenGenerator } from '../helpers/generateToken'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const register = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password, role, dni }: IUser = req.body

  try {
    if (await User.findOne({ email })) {
      res.status(401).json({
        message: 'El usuario ya se encuentra en nuestra base de datos',
      })
    }
    const user = new User({ fullName, email, password, role, dni, verified: false })
    const salt = bcryptjs.genSaltSync()
    user.password = bcryptjs.hashSync(password, salt)

    const adminKey = req.headers['admin-key']

    if (adminKey === process.env.KEY_FOR_ADMIN) {
      user.role = ROLES.admin
    }
    const newCode = randomstring.generate(6)
    user.code = newCode

    await user.save()
    await sendEmail(email, newCode)

    res.status(200).json({
      user,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error en el servidor',
    })
    console.log(error)
  }
}

export const verifyUser = async (req: Request, res: Response): Promise<void> => {
  const { email, code }: IUser = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      res.status(400).json({
        message: 'No existe este usuario en la Base de Datos',
      })
      return
    }
    if (user?.verified) {
      res.status(400).json({
        message: 'El usuario está correctamente verificado',
      })
      return
    }

    if (user?.code !== code) {
      res.status(401).json({
        message: 'El codigo ingresado es incorrecto',
      })
      return
    }

    await User.findOneAndUpdate({ email }, { verified: true })
    res.status(200).json({
      message: 'Usuario verificado con éxito',
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error en el servidor',
    })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: IUser = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      res.status(400).json({
        message: 'No se encontró el correo en la Base de Datos.',
      })
      return
    }

    const verifiedPassword = bcryptjs.compareSync(password, user.password)

    if (!verifiedPassword) {
      res.status(400).json({
        message: 'La contraseña es incorrecta',
      })
      return
    }

    await tokenGenerator(user.id)
    await generateRefreshToken(user.id, res)

    res.json({
      user,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error en el servidor',
    })
  }
}

export const profile = async (req: Request, res: Response) => {
  try {
    const { id } = req.body.userConfirmed
    if (!id) throw new Error('No existe el token')
    const token = await tokenGenerator(id)
    return res.status(200).json({ token })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error del servidor' })
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.cookie('refreshToken', '', {
    expires: new Date(0),
  })
  res.sendStatus(200)
  return
}
