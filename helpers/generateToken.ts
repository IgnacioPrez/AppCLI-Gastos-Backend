import jwt from 'jsonwebtoken'
import bycryptjs from 'bcryptjs'

export const tokenGenerator = (id: string = ''):Promise<string> => {
    return new Promise((resolve,reject)=>{
        const payload = {id}
        jwt.sign(
            payload,
            process.env.SECRET_PASSWORD as string,
            {
                expiresIn:"4h"
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
