import jwt from 'jsonwebtoken'
import bycryptjs from 'bcryptjs'
import {Response} from 'express'
import { config } from 'dotenv'

config()

export const tokenGenerator = (id: string ):Promise<string> => {
    return new Promise((resolve,reject)=>{
        const payload = {id}
        jwt.sign(
            payload,
            process.env.SECRET_PASSWORD as string,
            {
                expiresIn:"15m"
            },
            (err:Error|null,token:string|undefined)=>{
                if(err){
                    console.log(err)
                    reject("Error al generar el token")
                }
                else{
                    resolve(token as string)
                }
            }
        )
    })
}



export const generateRefreshToken = (id:string = '') => {
    const expiresIn = 60 * 60 * 24 * 30
    return new Promise((resolve,reject)=>{
      const payload = {id}
      jwt.sign(
          payload,
          process.env.SECRET_PASSWORD_REFRESH as string,
          {
              expiresIn
          },
          (err:Error|null,token:string|undefined)=>{
              if(err){
                  console.log(err)
                  reject("Error al generar el token")
              }
              else{
                  resolve(token as string)
              }
          }
      )
  })
}
