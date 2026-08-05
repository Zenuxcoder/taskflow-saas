const multer = require("multer");
const path = require ("path");

const storage = multer.diskStorage({
    
    destination: (req,file, cb)=>{
        
        cb(null, "./uploads")
    },

    filename: (req,file,cb)=>{

        const uniqueName = 
        Date.now() + "-"+
        Math.round(Math.random()*1e9)+
        path.extname(file.originalname)
        
        cb(null, uniqueName)

    }

})

   const upload = multer({
     storage: storage,

    fileFilter : (req,file,cb) => {

     const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
    ]

   if(allowedMimeTypes.includes(file.mimetype)){
       cb(null,true)
   }

   else{
    cb(new Error("only image files are allowed"))
   }

},
   limits:{
    fileSize : 5 * 1024 * 1024
   }

 })

 module.exports = upload;