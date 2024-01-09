import nodemailer from 'nodemailer'
import { config } from 'dotenv'

config()

const transporter =nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"ignacio.perez0204@gmail.com",
        pass:process.env.MY_PASS_EMAIL
    },
    from:"ignacio.perez0204@gmail.com"
})


export const sendEmail = async (to:string,code:string): Promise<void> => {
    try {
        const emailOptions = {
            from:"'N4Z Igncictus' ignacio.perez0204@gmail.com",
            to,
            subject:"Código de verificación para tu cuenta",
            text:`Este es tu código de verificación para tu cuenta: 
            ${code}
            ` 
        
        }
        await transporter.sendMail(emailOptions)
        console.log('correo enviado al destinatario')

    }catch(err){
        console.error('Error al enviar el correo electronico: ',err)
    }
}
