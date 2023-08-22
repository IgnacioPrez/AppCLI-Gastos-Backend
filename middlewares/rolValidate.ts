 import { NextFunction,Request,Response } from "express";
import { ROLES } from "../helpers/constants";
import { IUser } from "../model/user.model";

export const isAdmin = async (req:Request,res:Response,next:NextFunction) => {
    const {role}:IUser = req.body.userConfirmed

    if(role !== ROLES.admin){
        res.status(401).json({
            message:'El usuario no es administrador'
        })
        return
    }
    next()
}