import nodemailer from 'nodemailer'

//EL correo emisor debe tener la verificacion en 2 pasos
const transporter =nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"ignacio.perez0204@gmail.com",
        pass:"xutjumvrgxobiwrx"
    },
    from:"ignacio.perez0204@gmail.com"
})

//send email function

export const sendEmail = async (to:string,code:string): Promise<void> => {
    try {
        const emailOptions = {
            from:"'N4Z Igncictus' ignacio.perez0204@gmail.com",
            to,
            subject:"Código de verificación para tu cuenta",
            text:`Llegó tu código para éste que tengo colgando,
                El código para verificarte es : ${code}
            ` 
        
        }
        await transporter.sendMail(emailOptions)
        console.log('correo enviado al destinatario')

    }catch(err){
        console.error('Error al enviar el correo electronico: ',err)
    }
}
