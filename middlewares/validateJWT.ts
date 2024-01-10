import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User, IUser } from '../model/user.model'

export const validateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authorizationHeader = req.headers['authorization'] as string
  try {
    if (!authorizationHeader) {
      res.status(401).json({
        msj: 'No hay token en la petición',
      })
      return
    }
    const token = authorizationHeader.split(' ')[1]
    const payload = jwt.verify(token, process.env.SECRET_PASSWORD_REFRESH as string) as JwtPayload

    const userConfirmed: IUser | null = await User.findById(payload.id)

    if (!userConfirmed) {
      res.status(401).json({
        msj: 'Token no válido',
      })
      return
    }
    req.body.userConfirmed = userConfirmed

    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({
      msj: 'Token no válido',
    })
  }
}
