import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '../model/user.model'

export const validateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { refreshToken } = req.cookies
  try {
    if (!refreshToken) {
      res.status(401).json({
        message: 'No existe un token en la petición'
      })
      return
    }
    const payload = jwt.verify(refreshToken, process.env.SECRET_PASSWORD_REFRESH as string) as JwtPayload
    const userConfirmed = await User.findById({ _id: payload.id })

    if (!userConfirmed) {
      res.status(401).json({
        message: 'Token invalido'
      })
      return
    }
    req.body.userConfirmed = userConfirmed
    next()
  } catch (err) {
    console.log(err)
    res.status(401).json({
      message: 'Token no válido'
    })
  }
}
