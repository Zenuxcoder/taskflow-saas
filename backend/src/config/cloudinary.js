const {v2 : cloudinary} = require("cloudinary")
const fs = require("fs");

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})

const uploadOnCloudinary = async (localFilepath) => {
     if(!localFilepath){
        return null;
     }

      try{
        const result = await cloudinary.uploader.upload(localFilepath)
        try{
            await fs.promises.unlink(localFilepath)
           } 

        catch{}
        
        return {
            url : result.secure_url,
            public_id: result.public_id
        }
      }
       
      catch(error){
        await fs.promise.unlink(localFilepath)
        return null

      }
}

module.exports = uploadOnCloudinary