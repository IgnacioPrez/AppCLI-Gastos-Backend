import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User, IUser } from '../model/user.model'

export const validateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers["x-token"] as string

    if(!token){
        res.status(401).json({
            message:"No existe un token en la petición"
        })
        return
    }

    try{
        const secretKey = process.env.SECRET_PASSWORD as string
        const payload = jwt.verify(token,secretKey) as JwtPayload
        const {id} = payload
        const userConfirmed : IUser |null = await User.findById({_id:id})
        if(!userConfirmed){
            res.status(401).json({
                message:"Token invalido"
            })
            return
        }

        req.body.userConfirmed = userConfirmed
        next()
    }catch(err){
        console.log(err)
        res.status(401).json({
            message:"Token no válido"
        })
    }
}
