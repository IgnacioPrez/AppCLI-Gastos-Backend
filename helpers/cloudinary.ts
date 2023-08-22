import {v2 as cloudinary} from 'cloudinary'


export async function uploadImage (filePath:string,){
  return  await cloudinary.uploader.upload(filePath,{
    folder:'image-nucba',
    format:'jpg'
  })
}

export async function deleteImage (public_id:string){
    return await cloudinary.uploader.destroy(public_id)
}