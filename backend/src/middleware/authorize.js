const User = require("../models/User")

const authorize = (...roles) => {

    return async(req,res,next) =>{
        
        try{
        
            const user = await User.findById(req.user.id)
       
            if(!user){
                return res.status(401).json({
                    success:false,
                    message:"Unauthorized"
                })
            }

            if(!roles.includes(user.role)){
                return res.status(403).json({
                    success:false,
                    message:"forbidden"
                })
            }
            next()
        }
       
        catch(error){
              console.log(error)

              return res.status(500).json({
                message:false,
                message: "internet server error"
              })
       }
    }

}

module.exports = authorize;