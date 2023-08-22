import mongoose from "mongoose"

export const connectDB = async () : Promise<void> => {
    try{
        const dbUrl = process.env.MY_MONGOOSE_URL
        if(!dbUrl) throw new Error('No se encontro la url de la base de datos')
        await mongoose.connect(dbUrl)
        console.log('Se conecto correctamente')
    }
    catch(err){
        console.log(err)
        throw new Error('Error al conectarse a la base de datos')
    }
}